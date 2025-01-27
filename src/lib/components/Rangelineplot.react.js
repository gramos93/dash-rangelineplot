// src/lib/components/Rangelineplot.react.js
import React, {useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import Plotly from 'plotly.js-dist';

const Rangelineplot = (props) => {
    const {
        id,
        data,
        style,
        className,
        range, // Merged range for x or y
        axisType, // 'x' or 'y'
        setProps,
        lineStyle: userLineStyle,
        grayZoneStyle: userGrayZoneStyle,
        boundaryStyle: userBoundaryStyle,
    } = props;

    const plotContainer = useRef(null);
    const isInitialRender = useRef(true);

    // Merge styles with defaults
    const mergedLineStyle = {
        ...Rangelineplot.defaultProps.lineStyle,
        ...userLineStyle,
    };
    const mergedGrayZoneStyle = {
        ...Rangelineplot.defaultProps.grayZoneStyle,
        ...userGrayZoneStyle,
    };
    const mergedBoundaryStyle = {
        ...Rangelineplot.defaultProps.boundaryStyle,
        ...userBoundaryStyle,
    };

    useEffect(() => {
        if (!plotContainer.current || !data) return;

        // Validate data structure
        if (!Array.isArray(data.x) || !Array.isArray(data.y)) {
            console.error(
                'Rangelineplot: Invalid data format - x and y must be arrays'
            );
            return;
        }

        if (data.x.length === 0 || data.y.length === 0) {
            console.error('Rangelineplot: Data arrays cannot be empty');
            return;
        }

        if (data.x.length !== data.y.length) {
            console.error(
                'Rangelineplot: x and y arrays must have equal length'
            );
            return;
        }

        // Calculate data ranges
        const xData = [...data.x].sort((a, b) => a - b);
        const yData = [...data.y].sort((a, b) => a - b);
        const xMin = xData[0];
        const xMax = xData[xData.length - 1];
        const yMin = yData[0];
        const yMax = yData[yData.length - 1];

        // Determine active range from single `range` prop
        let currentRange;
        if (range && Array.isArray(range) && range.length === 2) {
            currentRange = range;
        } else {
            // No valid range specified => pick default based on axisType
            if (axisType === 'x') {
                currentRange = [
                    xData[Math.floor(xData.length * 0.25)],
                    xData[Math.floor(xData.length * 0.75)],
                ];
            } else {
                currentRange = [
                    yData[Math.floor(yData.length * 0.25)],
                    yData[Math.floor(yData.length * 0.75)],
                ];
            }
        }

        // Order range values
        const orderedRange = [
            Math.min(currentRange[0], currentRange[1]),
            Math.max(currentRange[0], currentRange[1]),
        ];

        // Calculate axis ranges with padding
        const getPaddedRange = (minVal, maxVal, paddingFactor = 0.1) => {
            const rangeSize = maxVal - minVal;
            return [
                minVal - rangeSize * paddingFactor,
                maxVal + rangeSize * paddingFactor,
            ];
        };

        // If axisType === 'x', we want no extra padding on x, but do on y
        const xAxisRange =
            axisType === 'x' ? [xMin, xMax] : getPaddedRange(xMin, xMax);
        const yAxisRange =
            axisType === 'y' ? [yMin, yMax] : getPaddedRange(yMin, yMax);

        // Create main line trace
        const plotData = [
            {
                type: 'scatter',
                mode: 'lines',
                x: data.x,
                y: data.y,
                line: mergedLineStyle,
                name: 'Data',
            },
        ];

        // Add two "gray zone" polygons: left/bottom, and right/top
        if (axisType === 'x') {
            plotData.push(
                // 1) from xMin to orderedRange[0]
                {
                    type: 'scatter',
                    x: [xMin, orderedRange[0], orderedRange[0], xMin],
                    y: [
                        yAxisRange[0],
                        yAxisRange[0],
                        yAxisRange[1],
                        yAxisRange[1],
                    ],
                    fill: 'toself',
                    fillcolor: mergedGrayZoneStyle.fillcolor,
                    line: {width: 0},
                    hoverinfo: 'none',
                    showlegend: false,
                },
                // 2) from orderedRange[1] to xMax
                {
                    type: 'scatter',
                    x: [orderedRange[1], xMax, xMax, orderedRange[1]],
                    y: [
                        yAxisRange[0],
                        yAxisRange[0],
                        yAxisRange[1],
                        yAxisRange[1],
                    ],
                    fill: 'toself',
                    fillcolor: mergedGrayZoneStyle.fillcolor,
                    line: {width: 0},
                    hoverinfo: 'none',
                    showlegend: false,
                }
            );
        } else {
            // axisType === 'y'
            plotData.push(
                // 1) from yMin to orderedRange[0]
                {
                    type: 'scatter',
                    x: [
                        xAxisRange[0],
                        xAxisRange[0],
                        xAxisRange[1],
                        xAxisRange[1],
                    ],
                    y: [yMin, orderedRange[0], orderedRange[0], yMin],
                    fill: 'toself',
                    fillcolor: mergedGrayZoneStyle.fillcolor,
                    line: {width: 0},
                    hoverinfo: 'none',
                    showlegend: false,
                },
                // 2) from orderedRange[1] to yMax
                {
                    type: 'scatter',
                    x: [
                        xAxisRange[0],
                        xAxisRange[0],
                        xAxisRange[1],
                        xAxisRange[1],
                    ],
                    y: [orderedRange[1], yMax, yMax, orderedRange[1]],
                    fill: 'toself',
                    fillcolor: mergedGrayZoneStyle.fillcolor,
                    line: {width: 0},
                    hoverinfo: 'none',
                    showlegend: false,
                }
            );
        }

        // Create draggable boundaries
        const layout = {
            dragmode: 'zoom',
            showlegend: false,
            margin: {t: 20, r: 20, b: 40, l: 40},
            xaxis: {range: xAxisRange, showgrid: true, zeroline: false},
            yaxis: {range: yAxisRange, showgrid: true, zeroline: false},
            shapes: [
                {
                    type: 'line',
                    [axisType === 'x' ? 'x0' : 'y0']: orderedRange[0],
                    [axisType === 'x' ? 'x1' : 'y1']: orderedRange[0],
                    [axisType === 'x' ? 'yref' : 'xref']: 'paper',
                    [axisType === 'x' ? 'y0' : 'x0']: 0,
                    [axisType === 'x' ? 'y1' : 'x1']: 1,
                    line: mergedBoundaryStyle,
                    draggable: true,
                    edittype: 'dragaxis',
                },
                {
                    type: 'line',
                    [axisType === 'x' ? 'x0' : 'y0']: orderedRange[1],
                    [axisType === 'x' ? 'x1' : 'y1']: orderedRange[1],
                    [axisType === 'x' ? 'yref' : 'xref']: 'paper',
                    [axisType === 'x' ? 'y0' : 'x0']: 0,
                    [axisType === 'x' ? 'y1' : 'x1']: 1,
                    line: mergedBoundaryStyle,
                    draggable: true,
                    edittype: 'dragaxis',
                },
            ],
        };

        // Initialize or update plot
        const plotFunction = isInitialRender.current
            ? Plotly.newPlot
            : Plotly.react;

        plotFunction(plotContainer.current, plotData, layout, {
            displayModeBar: false,
            responsive: true,
            edits: {shapePosition: true},
        });

        isInitialRender.current = false;

        // Handle range updates via shape dragging
        const handleRelayout = (eventData) => {
            // 'x' => shape keys are shapes[*].x0, shapes[*].x1
            // 'y' => shape keys are shapes[*].y0, shapes[*].y1
            const axisKey = axisType[0]; // 'x' or 'y'
            const shapeKeys = Object.keys(eventData).filter((key) =>
                key.match(new RegExp(`shapes\\[\\d+\\]\\.${axisKey}[01]`))
            );

            if (shapeKeys.length > 0) {
                // Start with old range, update boundary positions
                const newRange = [...orderedRange];
                shapeKeys.forEach((key) => {
                    const match = key.match(/shapes\[(\d+)\]/);
                    if (match) {
                        const index = parseInt(match[1]);
                        newRange[index] = eventData[key];
                    }
                });

                // Re-order new boundaries
                const updatedRange = [
                    Math.min(newRange[0], newRange[1]),
                    Math.max(newRange[0], newRange[1]),
                ];

                // Update the polygons
                if (axisType === 'x') {
                    Plotly.restyle(
                        plotContainer.current,
                        {
                            x: [
                                [xMin, updatedRange[0], updatedRange[0], xMin],
                                [updatedRange[1], xMax, xMax, updatedRange[1]],
                            ],
                        },
                        [1, 2] // indices of the two gray zone traces
                    );
                } else {
                    Plotly.restyle(
                        plotContainer.current,
                        {
                            y: [
                                [yMin, updatedRange[0], updatedRange[0], yMin],
                                [updatedRange[1], yMax, yMax, updatedRange[1]],
                            ],
                        },
                        [1, 2]
                    );
                }

                // Notify Dash that the range changed
                setProps({range: updatedRange});
            }
        };

        plotContainer.current.on('plotly_relayout', handleRelayout);
        return () => {
            plotContainer.current?.removeAllListeners('plotly_relayout');
        };
    }, [
        data,
        range,
        axisType,
        mergedLineStyle,
        mergedGrayZoneStyle,
        mergedBoundaryStyle,
    ]);

    return (
        <div
            id={id}
            ref={plotContainer}
            style={{...style, position: 'relative'}}
            className={className}
        />
    );
};

Rangelineplot.defaultProps = {
    range: null,
    axisType: 'x',
    style: {},
    className: '',
    lineStyle: {color: '#1f77b4', width: 2},
    grayZoneStyle: {fillcolor: 'rgba(200,200,200,0.5)'},
    boundaryStyle: {color: 'transparent', width: 20},
};

Rangelineplot.propTypes = {
    /**
     * The component's id
     */
    id: PropTypes.string,

    /**
     * Data object containing parallel arrays `x` and `y`.
     */
    data: PropTypes.shape({
        x: PropTypes.arrayOf(PropTypes.number).isRequired,
        y: PropTypes.arrayOf(PropTypes.number).isRequired,
    }).isRequired,

    /**
     * The selected range, [start, end], for whichever axisType is chosen.
     * If axisType='x', it refers to x-values. If 'y', it refers to y-values.
     */
    range: PropTypes.arrayOf(PropTypes.number),

    /**
     * Which axis this range is for: 'x' or 'y'.
     */
    axisType: PropTypes.oneOf(['x', 'y']),

    /**
     * A callback used to fire Dash events to update props
     */
    setProps: PropTypes.func,

    /**
     * CSS style to apply to the container <div>.
     */
    style: PropTypes.object,

    /**
     * Additional CSS classes for the container <div>.
     */
    className: PropTypes.string,

    /**
     * Plotly line style for the main data trace.
     */
    lineStyle: PropTypes.object,

    /**
     * Plotly fill style for gray zones outside the selected range.
     */
    grayZoneStyle: PropTypes.object,

    /**
     * Plotly line style for the draggable boundaries.
     */
    boundaryStyle: PropTypes.object,
};

export default Rangelineplot;
