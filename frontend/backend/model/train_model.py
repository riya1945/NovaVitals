import pandas as pd
import os
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
import joblib

df = pd.read_csv("backend/data/processed/telemetry_labeled.csv")
df.columns = df.columns.str.strip()

selected_features = [
    "duration",
    "length",
    "mean",
    "variance",
    "std",
    "kurtosis",
    "skew",
    "n_peaks",
    "smooth10_n_peaks",
    "smooth20_n_peaks",
    "diff_peaks",
    "diff2_peaks",
    "diff_var",
    "diff2_var",
    "gaps_squared",
    "len_weighted",
    "var_div_duration",
    "var_div_len"
]
df = df[selected_features + ["status"]]  
X = df[selected_features]
y = df["status"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)
clf = RandomForestClassifier(n_estimators=100, random_state=42)
clf.fit(X_train, y_train)

y_pred = clf.predict(X_test)
print("✅ Classification Report:")
print(classification_report(y_test, y_pred))

os.makedirs("backend/model", exist_ok=True)
joblib.dump(clf, "backend/model/model.pkl")
joblib.dump(selected_features, "backend/model/feature_columns.pkl")

print("✅ Model and feature columns saved.")
