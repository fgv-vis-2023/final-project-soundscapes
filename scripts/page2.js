const width = (document.body.offsetWidth)*0.8;
const height = 400;
const MARGIN_LEFT = 50;
const MARGIN_RIGHT = 30;
const MARGIN_TOP = 0;
const MARGIN_DOWN = 40;

//This function split the registers by genre in the "genre" column
function cleanData(data) {
    var myData = [];
    data.forEach(function (d) {
        if (d.genre.includes(",")) {
            var genres = d.genre.split(", ");
            genres.forEach(function(g) {
                var newData = Object.assign({}, d);
                newData.genre = g
                myData.push(newData);
            })
        } else {
            myData.push(d);
        }
    })
    return myData;
}

var data = d3.csv("https://raw.githubusercontent.com/fgv-vis-2023/final-project-soundscapes/main/data/songs.csv").then(data => {
    //Prepare data spliting string in "genre" columns
    data = cleanData(data);

    //Defining scales
    var xScale = d3.scaleLinear()
            .domain([40, d3.max(data, d => d.popularity)])
            .range([50, width-200])
            .nice();

    var yScale = d3.scaleLinear()
        .domain(d3.extent(d3.group(data, d=> d.genre), element=> element[1].length)) 
        .range([300, 35]); 

    var colorScale = d3.scaleOrdinal()
        .domain(new Set(data.map(d=>d.genre)))
        .range(d3.schemeTableau10);

    var sizeScale = d3.scaleSqrt()
        .domain(d3.extent(d3.group(data, d => d.genre), element=>element[1].length))
        .range([6,35])
        .nice();

    //Beginning visualization
    var svg = d3.select('#section4')
        .append("svg")
        .attr('width', width*0.8)
        .attr('height', height)
        .style('margin', '40 0 0 150px');

    // Creating color legend
    function colorLegend(container) {
        var titlePadding = 18;
        var entrySpacing = 18;
        var entryRadius = 6;
        var labelOffset = 5;
        var baselioneOffset = 5;

        var title = container.append('text')
            .attr('x', 0)
            .attr('y', 0)
            .attr('fill', 'white')
            .attr('font-family', 'Helvetica Neue, Arial')
            .attr('font-weight', 'bold')
            .attr('font-size', '16px')
            .text('Genre');

        var genres = [...new Set(data.map(d=>d.genre))];

        var entries = container.selectAll('g')
            .data(genres)
            .join('g')
                .attr('transform', d => `translate(0, ${titlePadding + genres.indexOf(d) * entrySpacing})`);

        var symbols = entries.append('circle')
            .attr('cx', entryRadius)
            .attr('r', entryRadius)
            .attr('fill', d => colorScale(d));

        var labels = entries.append('text')
            .attr('x', 2 * entryRadius + labelOffset)
            .attr('y', baselioneOffset)
            .attr('fill', 'white')
            .attr('font-family', 'Helvetica Neue, Arial')
            .attr('font-size', '13px')
            .text(d => d);
    }

    // Creating size legend
    function sizeLegend(container) {
        var valuesToShow = sizeScale.ticks(3);
        var xCircle = width - 120;
        var xLabel = width - 100;
        var yCircle = 350;

        container.append("text")
            .attr('x', xCircle - 55)
            .attr('y', yCircle - sizeScale.range()[1] - 10)
            .text("Size")
            .attr('alignment-baseline', 'middle');

        // Legend circles
        container.selectAll("legend")
            .data(valuesToShow)
            .enter()
            .append("circle")
            .attr("class", "legend")
            .attr('fill', 'none')
            .attr("cx", xCircle)
            .attr("cy", function(d) { return yCircle - sizeScale(d); })
            .attr("r", function(d) { return sizeScale(d); });

        // Legend line
        container.selectAll("legend")
        .data(valuesToShow)
        .enter()
        .append("line")
            .attr("class", "legend")
            .attr('stroke', 'white')
            .attr('x1', function(d) { return xCircle + sizeScale(d); })
            .attr('x2', xLabel)
            .attr('y1', function(d) { return yCircle - sizeScale(d); })
            .attr('y2', function(d) { return yCircle - sizeScale(d); })
            .style('stroke-dasharray', ('2,2'));

        // Legend labels
        container.selectAll("legend")
        .data(valuesToShow)
        .enter()
        .append("text")
            .attr("id", "legend-text")
            .attr('x', xLabel + 13)
            .attr('y', function(d) { return yCircle - sizeScale(d); })
            .text(function(d) { return d; })
            .attr('alignment-baseline', 'middle');
    }

    //Adding axis
    var xAxis = svg.append('g')
        .attr('transform', `translate(0, ${height-MARGIN_DOWN})`)
        .call(d3.axisBottom(xScale))
        .selectAll("path")
        .attr("stroke", "white");

    var yAxis = svg.append('g')
        .attr('transform', `translate(${MARGIN_LEFT}, ${MARGIN_TOP})`)
        .call(d3.axisLeft(yScale));

    var sidebar = d3.select('#section4')
        .append("svg")
        .attr('width', 180)
        .attr('height', height);

    var colorLegendGroup = sidebar.append('g')
        .attr('transform', `translate(20, 20)`)
        .call(colorLegend);
    
    var sizeLegendGroup = sidebar.append('g')
        .attr('transform', `translate(20, 280)`)
        .call(sizeLegend);

    //TODO: legend of size on the right side

    var genres = svg
        .selectAll("circle")
        .data(d3.group(data, d => d.genre))
        .join("circle")
            .sort((a,b) => b[1].length - a[1].length)
            .attr('fill', d => colorScale(d[0]))
            .attr('stroke', 'white')
            .attr('cx', function(element){
               return xScale(d3.rollup(element[1], v => d3.mean(v, c=> c.popularity)));
            })
            .attr('cy', d => yScale(d[1].length))
            .attr('r', function(element) {
                return sizeScale(element[1].length);
            })
            .on("mouseover", function(event) {
                d3.select(this)
                  .classed("highlight", true);
            })
            .on("mouseout", function(event) {
                d3.select(this)
                    .classed("highlight", false);
            });

    genres
      .append('title')
      .text(d => `Gender: ${d[0].toUpperCase()} \nAverage Popularity: ${d3.rollup(d[1], v => d3.mean(v, c => c.popularity)).toFixed(2)}`)
});