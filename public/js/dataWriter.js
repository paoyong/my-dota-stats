// Media Queries
var smartphoneQuery = window.matchMedia("(min-device-width: 320px) and (max-device-width: 480px)");

// D3 variables */
var width = 0,
    height = 0,
    cellSize = 28,
    // Margin only applies to right and bottom!
    cellMargin = 4,
    // Where to start drawing cells, relative
    // to the SVG canvas.
    cellStartX = cellMargin,
    cellStartY = cellMargin,
    maxCellsPerRow = 10,
    colors = ['#DFDEDE',
              '#C7E595',
              '#79BD8F',
              '#00A388',
              '#FF6138'];

if (smartphoneQuery.matches) {
    maxCellsPerRow = 5;
    cellSize = 45;
    $('#matches-description').text('Matches I\'ve played in the past month (tap on a box to see details):');
}
function drawData(dotaJSON) {

var dotaJSONKeyArray = Object.keys(dotaJSON),
    dataCount = dotaJSONKeyArray.length,
    // Calculate SVG canvas dimensions
    width = ((cellSize + cellMargin) * maxCellsPerRow) + cellMargin;
    height = (cellSize + cellMargin) * Math.ceil(dataCount / maxCellsPerRow) + cellMargin;

    var dotaHistogram = d3.select('#dota-histogram');

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
            return (d % maxCellsPerRow) * (cellSize + cellMargin) + cellStartX;
        })
        .attr('y', function(d) {
            return (cellSize + cellMargin) * Math.floor(d / maxCellsPerRow) + cellStartY;
        })
        .attr('fill', function(d){ 
            var matches_played = dotaJSON[d],
                color = '';

            if (matches_played > 6) {
                color = colors[4];
            } else if (matches_played > 4) {
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
        } 
        else if (matchesPlayed === 1) {
            tooltipText = 'One match played ';
        } else {
            tooltipText = matchesPlayed + ' matches played ';
        }
        if (smartphoneQuery.matches){
            tooltipText += '<br>';
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

