import shap
import joblib
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import io
import base64

model = joblib.load("model/model.pkl")
feature_cols = joblib.load("model/feature_columns.pkl")

explainer = shap.TreeExplainer(model)

def explain_prediction(features):

    X = pd.DataFrame([features], columns=feature_cols)

    shap_values = explainer.shap_values(X)

    # Handle classifier outputs
    if isinstance(shap_values, list):
        values = shap_values[1][0]
        base_value = explainer.expected_value[1]
    else:
        values = shap_values[0]
        base_value = explainer.expected_value

    # Ensure correct shapes
    values = np.array(values).flatten()
    base_value = np.array(base_value).flatten()[0]
    data_values = X.iloc[0].values.flatten()

    # Make sure lengths match
    min_len = min(len(values), len(data_values), len(feature_cols))

    values = values[:min_len]
    data_values = data_values[:min_len]
    feature_names = feature_cols[:min_len]

    # Top features
    contributions = dict(zip(feature_names, values))

    sorted_features = sorted(
        contributions.items(),
        key=lambda x: abs(float(x[1])),
        reverse=True
    )[:5]

    # Create explanation
    explanation = shap.Explanation(
        values=values,
        base_values=base_value,
        data=data_values,
        feature_names=feature_names
    )

    shap.plots.waterfall(explanation, show=False)

    buf = io.BytesIO()
    plt.savefig(buf, format="png", bbox_inches="tight")
    plt.close()

    buf.seek(0)
    plot_base64 = base64.b64encode(buf.read()).decode("utf-8")

    return {
    "explanation": sorted_features,
    "plot": plot_base64
}