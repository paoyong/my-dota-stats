function drawData(dotaJSON) {
    var width = 500,
        height = 100,
        cellSize = 20,
        cellMarginRight = 3,
        maxOpacityTippingPoint = 6,    // For example, if this value is 10, 10 would be represented with the strongest color in the chart.
        minOpacity = 0.0;

    var dotaHistogram = d3.select('#dota-histogram');

    var opacityScale = d3.scale.linear()
        .domain([0, maxOpacityTippingPoint])
        .range([minOpacity, 1]);

    console.log(opacityScale(5));

    // Draw SVG canvas on #dota-histogram
    var svg = dotaHistogram.append('svg')
        .attr('width', width)
        .attr('height', height);

    // For each data point, draw a square
    svg.selectAll('rect').data(Object.keys(dotaJSON)).enter()
        .append('rect')
        .attr('width', cellSize)
        .attr('height', cellSize)
        .attr('x', function(d) {
            return d * (cellSize + cellMarginRight);
        })
        .attr('fill', 'rgb(256, 0, 0')
        .attr('fill-opacity', function(d) {
            return opacityScale(dotaJSON[d]);
        })
        .attr('stroke', 'black')
        .attr('stroke-opacity', 0.5);
}
// Grab data
$.get('/hours-played', function(response) {
    $('#hours-ago').text(response);
});

// Grab match counts and draw it out
$.get('/dota-match-counts', function(response) {
    drawData(response);
});
