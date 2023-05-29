var width = (document.body.offsetWidth)*0.8;
var height = 400;
var MARGIN_LEFT = 50;
var MARGIN_RIGHT = 30;
var MARGIN_TOP = 0;
var MARGIN_DOWN = 40;


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
            .domain(d3.extent(data, d=>d.popularity))
            .range([50, width-200])
            .nice();

    var yScale = d3.scaleLinear()
        .domain(d3.extent(d3.group(data, d=> d.genre), element=> element[1].length))
        .range([300, 30]);

    var colorScale = d3.scaleOrdinal()
        .domain(new Set(data.map(d=>d.genre)))
        .range(d3.schemeTableau10);

    var sizeScale = d3.scaleSqrt()
        .domain(d3.extent(d3.group(data, d => d.genre), element=>element[1].length))
        .range([4,30])
        .nice();

    //Beginning visualization
    var svg = d3.select('#section4')
        .append("svg")
        .attr('width', width*0.8)
        .attr('height', height);

    // Creating color legend
    function colorLegend(container) {
        var titlePadding = 14;
        var entrySpacing = 16;
        var entryRadius = 5;
        var labelOffset = 4;
        var baselioneOffset = 4;

        var title = container.append('text')
            .attr('x', 0)
            .attr('y', 0)
            .attr('fill', 'white')
            .attr('font-family', 'Helvetica Neue, Arial')
            .attr('font-weight', 'bold')
            .attr('font-size', '12px')
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
            .attr('font-size', '11px')
            .text(d => d);
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
        .attr('width', 200)
        .attr('height', height);

    var legend = sidebar.append('g')
        .attr('transform', `translate(0, 20)`)
        .call(colorLegend);

    //TODO: legend of size on the right side

    var genres = svg
        .selectAll("circle")
        .data(d3.group(data, d => d.genre))
        .join("circle")
            .sort((a,b) => b[1].length - a[1].length)
           .attr('fill', d => colorScale(d[0]))
           .attr('cx', function(element){
               return xScale(d3.rollup(element[1], v => d3.mean(v, c=> c.popularity)));
           })
           .attr('cy', d => yScale(d[1].length))
           .attr('r', function(element) {
           return sizeScale(element[1].length);
           })

    genres
      .append('title')
      .text(d => `Gender: ${d[0].toUpperCase()} \nAverage Popularity: ${d3.rollup(d[1], v => d3.mean(v, c => c.popularity)).toFixed(2)}`)
});