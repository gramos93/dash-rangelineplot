% Auto-generated: do not edit by hand
\name{rangelineplot}

\alias{rangelineplot}

\title{Rangelineplot component}

\description{

}

\usage{
rangelineplot(id=NULL, axisType=NULL, boundaryStyle=NULL, className=NULL,
data=NULL, grayZoneStyle=NULL, lineStyle=NULL, range=NULL,
style=NULL)
}

\arguments{
\item{id}{Character. The component's id}

\item{axisType}{A value equal to: 'x', 'y'. Which axis this range is for: 'x' or 'y'.}

\item{boundaryStyle}{Named list. Plotly line style for the draggable boundaries.}

\item{className}{Character. Additional CSS classes for the container <div>.}

\item{data}{Lists containing elements 'x', 'y'.
those elements have the following types:
  - x (list of numerics; required)
  - y (list of numerics; required). Data object containing parallel arrays `x` and `y`.}

\item{grayZoneStyle}{Named list. Plotly fill style for gray zones outside the selected range.}

\item{lineStyle}{Named list. Plotly line style for the main data trace.}

\item{range}{List of numerics. The selected range, [start, end], for whichever axisType is chosen.
If axisType='x', it refers to x-values. If 'y', it refers to y-values.}

\item{style}{Named list. CSS style to apply to the container <div>.}
}

\value{named list of JSON elements corresponding to React.js properties and their values}

