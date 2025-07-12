import pandas as pd
import os
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
import joblib

df = pd.read_csv("backend/data/processed/telemetry_labeled.csv")
df.columns = df.columns.str.strip()  # 🧽 Remove extra spaces

print("✅ Columns:", df.columns.tolist())

drop_cols = ["segment"]
for col in df.columns:
    if df[col].dtype == "object" and col != "status":
        drop_cols.append(col)

X = df.drop(columns=drop_cols + ["status"])
y = df["status"]
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, 
)
clf = RandomForestClassifier(n_estimators=100, random_state=42)
clf.fit(X_train, y_train)

y_pred = clf.predict(X_test)
print("✅ Classification Report:")
print(classification_report(y_test, y_pred))
os.makedirs("backend/model", exist_ok=True)
joblib.dump(clf, "backend/model/model.pkl")
