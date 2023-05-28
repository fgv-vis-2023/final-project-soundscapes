var width = document.body.offsetWidth;
var height = 400;

//This function split the registers by genre in the "genre" column
function cleanData(data) {
    var myData = [];
    data.forEach(function (d) {
        if (d.genre.includes(",")) {
            var genres = d.genre.split(", ");
            genres.forEach(function(g) {
                d.genre=g;
                myData.push(d);
            })
        } else {
            myData.push(d);
        }
    })
    return myData;
}

var data = d3.csv("./data/songs.csv").then(data => {
    //Prepare data spliting string in "genre" columns
    data = cleanData(data);

    //Defining scales
    var xScale = d3.scaleLinear()
            .domain(d3.extent(data, d=>d.popularity))
            .range([50, width-200])
            .nice();

    var yScale = d3.scalePoint()
        .domain(new Set(data.map(d=>d.genre)))
        .range([100,300]);

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
        .attr('width', width)
        .attr('height', height);

    //Adding axis
    var xAxis = svg.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(xScale))
        .selectAll("path")
        .attr("stroke", "white")
        .attr("stroke-width", "2");

    //TODO: set ticks and text for white

    //TODO: legend of size on the right side

    //TODO: change color pallete to sequential from less popular to more popular and plot legend

    var genres = svg
        .selectAll("circle")
        .data(d3.group(data, d => d.genre))
        .join("circle")
            .sort((a,b) => b[1].length - a[1].length)
           .attr('fill', d => colorScale(d[0]))
           .attr('cx', function(element){
               return xScale(d3.rollup(element[1], v => d3.mean(v, c=> c.popularity)));
           })
           .attr('cy', d => yScale(d[0]))
           .attr('r', function(element) {
           return sizeScale(element[1].length);
           })

    genres
      .append('title')
      .text(d => `Gender: ${d[0].toUpperCase()} \nAverage Popularity: ${d3.rollup(d[1], v => d3.mean(v, c => c.popularity)).toFixed(2)}`)
});