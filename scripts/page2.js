const width = (document.body.offsetWidth) * 0.8;
const height = 520;
const MARGIN_LEFT = 100;
const MARGIN_RIGHT = 30;
const MARGIN_TOP = 10;
const MARGIN_DOWN = 40;

// This function splits the records by genre in the "genre" column
function cleanData(data) {
    var myData = [];
    data.forEach(function (d) {
        if (d.genre.includes(",")) {
            var genres = d.genre.split(", ");
            genres.forEach(function (g) {
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

d3.csv("https://raw.githubusercontent.com/fgv-vis-2023/final-project-soundscapes/main/data/songs.csv").then(data => {
    // Prepare data by splitting the string in the "genre" column
    data = cleanData(data).filter(d => d.genre !== "set()");

    var genreCount = d3.rollup(data, v => v.length, d => d.genre);
    var sortedData = Array.from(genreCount.entries()).sort((a, b) => d3.descending(b[1], a[1]));

    // Define scales
    var xScale = d3.scaleLinear()
        .domain([0, d3.max(genreCount.values())])
        .range([50, width - 200])
        .nice();

    var yScale = d3.scaleBand()
        .domain(sortedData.map(d => d[0]))
        .range([420, 20])
        .padding(0.2);

    var svg = d3.select('#section4')
        .append("svg")
        .attr('width', width)
        .attr('height', height);

    svg.append('g')
        .attr('transform', `translate(50, ${height - MARGIN_DOWN-50})`)
        .call(d3.axisBottom(xScale));

    svg.append('g')
        .attr('transform', `translate(${MARGIN_LEFT}, 0)`)
        .call(d3.axisLeft(yScale))
        .selectAll("text")
            .attr("font-size", "12px");

    var bars = svg
        .selectAll("rect")
        .data(d3.group(data, d => d.genre))
        .join("rect")
        .attr("x", xScale(0)+50)
        .attr("y", d => yScale(d[0]))
        .attr("width", d => xScale(genreCount.get(d[0])) - xScale(0))
        .attr("height", yScale.bandwidth())
        .attr("fill", "#1DB954")
        .attr("stroke", "white")
        .attr("stroke-width", 0)
        .on("mouseover", function (d) {
            d3.select(this)
                .attr("stroke-width", 2);
        })
        .on("mouseout", function (d) {
            d3.select(this)
                .attr("stroke-width", 0);
        });

    svg.append("text")
        .attr("x", MARGIN_LEFT)
        .attr("y", MARGIN_TOP)
        .attr("text-anchor", "left")
        .attr("fill", "white")
        .attr("font-weight", "bold")
        .attr("font-size", "14px")
        .text("Genres");

    svg.append("text")
        .attr("x", 1125)
        .attr("y", height - MARGIN_DOWN - 50)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .attr("font-weight", "bold")
        .attr("font-size", "14px")
        .text("Average Popularity");

    bars
        .append('title')
        .text(d => `Average Popularity: ${genreCount.get(d[0])}`);
});