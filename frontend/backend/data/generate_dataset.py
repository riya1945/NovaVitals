import pandas as pd
import os
from functools import reduce

# Set path to your raw data folder
data_dir = "backend/data"
channels = [f for f in os.listdir(data_dir) if f.startswith("OPS-SAT_Channel")]

dfs = []

for file in channels:
    ch_df = pd.read_csv(os.path.join(data_dir, file))
    ch_name = file.replace(".csv", "")
    
    # Add prefix to avoid column name collisions
    ch_df = ch_df.add_prefix(f"{ch_name}_")  # e.g., OPS-SAT_Channel_1_avg → prefixed

    # Rename segment + anomaly columns for alignment
    ch_df.rename(columns={
        f"{ch_name}_segment": "segment",
        f"{ch_name}_anomaly": "anomaly"
    }, inplace=True)
    
    dfs.append(ch_df)

# Merge all channel data on the 'segment' column
merged_df = reduce(lambda left, right: pd.merge(left, right, on="segment"), dfs)

# Select any one anomaly column (they're all the same)
anomaly_col = [col for col in merged_df.columns if "anomaly" in col][0]

# Map anomaly to status label
merged_df["status"] = merged_df[anomaly_col].apply(lambda x: "Critical" if x == 1 else "Healthy")

# Drop all anomaly columns now
merged_df.drop(columns=[col for col in merged_df.columns if "anomaly" in col], inplace=True)

# Make sure output folder exists
os.makedirs("backend/data/processed", exist_ok=True)

# Save the final labeled dataset
merged_df.to_csv("backend/data/processed/telemetry_labeled.csv", index=False)

print("✅ telemetry_labeled.csv created successfully!")
