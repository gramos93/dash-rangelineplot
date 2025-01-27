# AUTO GENERATED FILE - DO NOT EDIT

export rangelineplot

"""
    rangelineplot(;kwargs...)

A Rangelineplot component.

Keyword arguments:
- `id` (String; optional): The component's id
- `axisType` (a value equal to: 'x', 'y'; optional): Which axis this range is for: 'x' or 'y'.
- `boundaryStyle` (Dict; optional): Plotly line style for the draggable boundaries.
- `className` (String; optional): Additional CSS classes for the container <div>.
- `data` (required): Data object containing parallel arrays `x` and `y`.. data has the following type: lists containing elements 'x', 'y'.
Those elements have the following types:
  - `x` (Array of Reals; required)
  - `y` (Array of Reals; required)
- `grayZoneStyle` (Dict; optional): Plotly fill style for gray zones outside the selected range.
- `lineStyle` (Dict; optional): Plotly line style for the main data trace.
- `range` (Array of Reals; optional): The selected range, [start, end], for whichever axisType is chosen.
If axisType='x', it refers to x-values. If 'y', it refers to y-values.
- `style` (Dict; optional): CSS style to apply to the container <div>.
"""
function rangelineplot(; kwargs...)
        available_props = Symbol[:id, :axisType, :boundaryStyle, :className, :data, :grayZoneStyle, :lineStyle, :range, :style]
        wild_props = Symbol[]
        return Component("rangelineplot", "Rangelineplot", "dash_rangelineplot", available_props, wild_props; kwargs...)
end

