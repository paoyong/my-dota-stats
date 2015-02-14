function drawData(dotaJSON) {
    var width = 0,
        height = 0,
        cellSize = 25,
        cellMarginRight = 3,
        maxOpacityTippingPoint = 6,    // For example, if this value is 10, 10 would be represented with the strongest color in the chart.
        minOpacity = 0.0,
        dotaJSONKeyArray = Object.keys(dotaJSON);

    width = ((cellSize + cellMarginRight) * dotaJSONKeyArray.length) - cellMarginRight;
    height = cellSize;

    var dotaHistogram = d3.select('#dota-histogram');

    var opacityScale = d3.scale.linear()
        .domain([0, maxOpacityTippingPoint])
        .range([minOpacity, 1]);

    console.log(opacityScale(5));

    // Draw SVG canvas on #dota-histogram
    var svg = dotaHistogram.append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('id', 'dota-histogram-canvas');

    // For each data point, draw a square
    svg.selectAll('rect').data(dotaJSONKeyArray).enter()
        .append('rect')
        .attr('width', cellSize)
        .attr('height', cellSize)
        .attr('x', function(d) {
            return d * (cellSize + cellMarginRight);
        })
        .attr('fill', 'rgb(256, 30, 20)')
        .attr('fill-opacity', function(d) {
            return opacityScale(dotaJSON[d]);
        })
        .attr('days-ago', function(d) {
            return d;
        })
        .attr('matches-played', function(d) {
            return dotaJSON[d];
        });
}

function drawTooltips() {
    $('rect').each(function() {
        var daysAgo = parseInt($(this).attr('days-ago'), 10),
            matchesPlayed = parseInt($(this).attr('matches-played'), 10),
            tooltipText = '';

        if (matchesPlayed === 0){
            tooltipText = 'No matches played ';
        } else {
            tooltipText = matchesPlayed + ' matches played ';
        }

        if (daysAgo === 0) {
            tooltipText += 'today!';
        }
        else if (daysAgo === 1) {
            tooltipText += 'yesterday!';
        } else {
            tooltipText += daysAgo + ' days ago!';
        }

        $(this).qtip({
            content: {
                text: tooltipText
            },
            position: {
                my: 'bottom center',
                at: 'top center', 
                target: $(this)
            },
            style: {
                classes: 'qtip-tipsy'
            },
            show: {
                delay: 20
            }
        });
    });
}

// Grab data
$.get('/hours-played', function(response) {
    $('#hours-ago').text(response);
});

// Grab match counts and draw it out
$.get('/dota-match-counts', function(response) {
    drawData(response);
    drawTooltips();
});

