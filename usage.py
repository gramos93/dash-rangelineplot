# app.py
import dash
from dash import html
from dash.dependencies import Input, Output
import numpy as np
from dash_rangelineplot import Rangelineplot

app = dash.Dash(__name__)

# Generate sample data
x = np.linspace(0, 10, 500)
y = np.sin(x) * np.cos(x * 2) + np.random.normal(0, 0.1, 500)

app.layout = html.Div(
    [
        html.H1("Range Line Plot", style={"textAlign": "center"}),
        Rangelineplot(
            id="range-plot",
            data={"x": x.tolist(), "y": y.tolist()},
            axisType="x",  # Try changing to 'x'
            # range=[-1.5, 1.5],  # Initial Y-axis range
            style={"height": "600px", "width": "90%", "margin": "0 auto"},
            lineStyle={"color": "purple", "width": 1.5, "dash": "dot"},
            grayZoneStyle={"fillcolor": "rgba(150, 150, 150, 0.2)"},
            boundaryStyle={"color": "rgba(255, 50, 50, 0.3)", "width": 2},
        ),
        html.Div(
            id="range-display",
            style={
                "padding": "20px",
                "margin": "20px auto",
                "width": "80%",
                "border": "2px solid #eee",
                "borderRadius": "8px",
                "textAlign": "center",
            },
        ),
    ]
)


@app.callback(
    Output("range-display", "children"),
    [Input("range-plot", "range")],  # Change to xRange for X-axis
)
def update_display(current_range):
    if current_range:
        return f"Selected Range: {current_range[0]:.2f} - {current_range[1]:.2f}"
    return "Drag the boundary lines to select a range"


if __name__ == "__main__":
    app.run_server(debug=True)
