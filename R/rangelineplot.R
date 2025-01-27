# AUTO GENERATED FILE - DO NOT EDIT

#' @export
rangelineplot <- function(id=NULL, axisType=NULL, boundaryStyle=NULL, className=NULL, data=NULL, grayZoneStyle=NULL, lineStyle=NULL, range=NULL, style=NULL) {
    
    props <- list(id=id, axisType=axisType, boundaryStyle=boundaryStyle, className=className, data=data, grayZoneStyle=grayZoneStyle, lineStyle=lineStyle, range=range, style=style)
    if (length(props) > 0) {
        props <- props[!vapply(props, is.null, logical(1))]
    }
    component <- list(
        props = props,
        type = 'Rangelineplot',
        namespace = 'rangelineplot',
        propNames = c('id', 'axisType', 'boundaryStyle', 'className', 'data', 'grayZoneStyle', 'lineStyle', 'range', 'style'),
        package = 'rangelineplot'
        )

    structure(component, class = c('dash_component', 'list'))
}
