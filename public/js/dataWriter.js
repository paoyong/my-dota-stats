function drawData(dotaJSON) {
    var width = 0,
        height = 0,
        cellSize = 25,
        cellMarginRight = 3,
        maxOpacityTippingPoint = 6,    // For example, if this value is 10, 10 would be represented with the strongest color in the chart.
        minOpacity = 0.0,
        dotaJSONKeyArray = Object.keys(dotaJSON),
        colors = ['#EFEFEF',
                  '#D5D59D',
                  '#FF9F65',
                  '#FF7347',
                  '#FF422D'];

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
        .attr('fill', function(d){ 
            var matches_played = dotaJSON[d],
                color = '';

            if (matches_played > 6) {
                color = colors[4];
            } else if (matches_played > 3) {
                color = colors[3];
            } else if (matches_played > 2) {
                color = colors[2];
            } else if (matches_played > 0) {
                color = colors[1];
            } else {
                color = colors[0];
            }

            return color;
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

$.get('/hours-ago', function(response) {
    $('#hours-ago').text(response);
});

// Grab match counts and draw it out
$.get('/dota-match-counts', function(response) {
    drawData(response);
    drawTooltips();
});

