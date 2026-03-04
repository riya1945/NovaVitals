import pandas as pd
import os
import numpy as np
import joblib

from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import (
    GroupKFold,
    GroupShuffleSplit,
    RandomizedSearchCV
)
from sklearn.metrics import classification_report, f1_score


# =========================
# LOAD DATA
# =========================
df = pd.read_csv("data/processed/telemetry_labeled.csv")

# Remove dataset prefix
df.columns = df.columns.str.replace(
    "OPS-SAT_Channel_Dataset_", "", regex=False
)
df.columns = df.columns.str.strip()

print("Total rows:", len(df))
print("Unique segments:", df["segment"].nunique())


# =========================
# FEATURE SELECTION
# =========================
selected_features = [
    "duration", "len", "mean", "var", "std",
    "kurtosis", "skew", "n_peaks", "smooth10_n_peaks",
    "smooth20_n_peaks", "diff_peaks", "diff2_peaks",
    "diff_var", "diff2_var", "gaps_squared",
    "len_weighted", "var_div_duration", "var_div_len"
]

df = df[["segment"] + selected_features + ["status"]]

X = df[selected_features]
y = df["status"]
groups = df["segment"]

print("\nClass distribution:")
print(y.value_counts(normalize=True))


# =========================
# HYPERPARAMETER TUNING
# =========================
param_dist = {
    "n_estimators": [200, 300, 400],
    "max_depth": [None, 10, 20, 30],
    "min_samples_split": [2, 5, 10],
    "min_samples_leaf": [1, 2, 4],
    "max_features": ["sqrt", "log2"]
}

base_model = RandomForestClassifier(
    random_state=42,
    class_weight="balanced",
    n_jobs=-1
)

gkf = GroupKFold(n_splits=5)

random_search = RandomizedSearchCV(
    base_model,
    param_distributions=param_dist,
    n_iter=20,
    scoring="f1_macro",
    cv=gkf.split(X, y, groups=groups),
    verbose=1,
    n_jobs=-1,
    random_state=42
)

random_search.fit(X, y)

print("\nBest Parameters:", random_search.best_params_)
print("Best Group CV F1:", random_search.best_score_)

clf = random_search.best_estimator_


# =========================
# GROUP-BASED TRAIN/TEST SPLIT
# =========================
gss = GroupShuffleSplit(n_splits=1, test_size=0.2, random_state=42)

for train_idx, test_idx in gss.split(X, y, groups=groups):
    X_train, X_test = X.iloc[train_idx], X.iloc[test_idx]
    y_train, y_test = y.iloc[train_idx], y.iloc[test_idx]
    train_segments = groups.iloc[train_idx]
    test_segments = groups.iloc[test_idx]

print("Train segments:", train_segments.nunique())
print("Test segments:", test_segments.nunique())
print("Segment overlap:", set(train_segments) & set(test_segments))


# =========================
# TRAIN FINAL MODEL
# =========================
clf.fit(X_train, y_train)

y_probs = clf.predict_proba(X_test)


# =========================
# THRESHOLD TUNING
# =========================
critical_index = list(clf.classes_).index("Critical")

thresholds = np.arange(0.1, 0.9, 0.05)
best_threshold = 0.5
best_f1 = 0

for t in thresholds:
    y_pred_custom = np.where(
        y_probs[:, critical_index] >= t,
        "Critical",
        "Healthy"
    )

    score = f1_score(y_test, y_pred_custom, average="macro")

    if score > best_f1:
        best_f1 = score
        best_threshold = t

print("\nBest Threshold:", best_threshold)
print("Best Threshold Macro F1:", best_f1)


# =========================
# FINAL EVALUATION
# =========================
y_pred_final = np.where(
    y_probs[:, critical_index] >= best_threshold,
    "Critical",
    "Healthy"
)

print("\nFinal Classification Report (Threshold Tuned):")
print(classification_report(y_test, y_pred_final))

macro_f1 = f1_score(y_test, y_pred_final, average="macro")
print("Final Macro F1 Score:", macro_f1)


# =========================
# FEATURE IMPORTANCE
# =========================
importances = pd.Series(
    clf.feature_importances_,
    index=selected_features
).sort_values(ascending=False)

print("\nTop 10 Important Features:")
print(importances.head(10))


# =========================
# SAVE MODEL + METADATA
# =========================
os.makedirs("model", exist_ok=True)

joblib.dump(clf, "model/model.pkl")
joblib.dump(selected_features, "model/feature_columns.pkl")
joblib.dump(best_threshold, "model/threshold.pkl")

print("\n✅ Model, feature columns, and threshold saved successfully.")