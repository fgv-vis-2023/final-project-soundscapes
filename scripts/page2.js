const width = 1000;
const height = 520;
const MARGIN_LEFT = 100;
const MARGIN_RIGHT = 30;
const MARGIN_TOP = 10;
const MARGIN_DOWN = 40;
let data;

var svg = d3.select('#genresGraph')
    .append("svg")
    .attr('width', width)
    .attr('height', height);

// Define scales
var xScale = d3.scaleLinear()
    .range([50, width - 200])
    .nice();

var yScale = d3.scaleBand()
    .range([420, 20])
    .padding(0.2);

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

d3.csv("https://raw.githubusercontent.com/fgv-vis-2023/final-project-soundscapes/main/data/songs.csv").then(csvData => {
    // Prepare data by splitting the string in the "genre" column
    data = cleanData(csvData).filter(d => d.genre !== "set()");
    drawBarChart(data);
});

function drawBarChart(data) {
    var genreCount = d3.rollup(data, v => v.length, d => d.genre);
    var sortedData = Array.from(genreCount.entries()).sort((a, b) => d3.descending(b[1], a[1]));

    // Update scales' domains
    xScale.domain([0, d3.max(genreCount.values())]);
    yScale.domain(sortedData.map(d => d[0]));

    svg.append('g')
        .attr('transform', `translate(50, ${height - MARGIN_DOWN-60})`)
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
        .attr("width", 0)
        .attr("height", yScale.bandwidth())
        .attr("fill", "#1DB954")
        .attr("stroke", "white")
        .attr("stroke-width", 0)
        .on("mouseover", function (d) {
            d3.select(this)
                .attr("stroke-width", 2)
                .attr("fill", "darkgreen")
                .attr("cursor", "pointer");
        })
        .on("mouseout", function (d) {
            d3.select(this)
                .attr("stroke-width", 0)
                .attr("fill", "#1DB954");
        })
        .on("click", function (event, d) {
            handleClick(d);
        });

    bars.transition()
        .duration(1000)
        .attr("width", d => xScale(genreCount.get(d[0])) - xScale(0));

    svg.append("text")
        .attr("x", MARGIN_LEFT)
        .attr("y", MARGIN_TOP)
        .attr("text-anchor", "left")
        .attr("fill", "white")
        .attr("font-weight", "bold")
        .attr("font-size", "14px")
        .text("Genres");

    svg.append("text")
        .attr("x", 870)
        .attr("y", height - MARGIN_DOWN - 70)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .attr("font-weight", "bold")
        .attr("font-size", "14px")
        .text("Number of Songs");

    bars
        .append('title')
        .text(d => `Number of Songs: ${genreCount.get(d[0])}`);
};

// This function updates the scatter plot with the selected genre
function handleClick(d) {
    var selectedGenre = d[0];
    var selectedData = data.filter(item => item.genre === selectedGenre);
    
    // Call a function to update the chart with the selected data
    updateScatterPlot(selectedData);
}

// Function to update the scatter plot
function updateScatterPlot(selectedData) {
    d3.select('#genresGraph svg').selectAll("*").remove(); // Remove the previous svg
    svg.selectAll("circle").remove(); // Remove previous circles

    var backButton = svg.append("text")
    .attr("x", 850)
    .attr("y", 30)
    .attr("text-anchor", "left")
    .attr("fill", "#1DB954")
    .attr("font-weight", "bold")
    .attr("font-size", "15px")
    .attr("background-color", "white")
    .attr("font-size", "12px")
    .attr("cursor", "pointer")
    .text("Back to Bar Chart")
    .on("click", function() {
        d3.select('#genresGraph svg').selectAll("*").remove();
        drawBarChart(data);
    });

    // Update scales' domains
    yScale = d3.scaleLinear()
        .range([height - MARGIN_DOWN - 60, MARGIN_TOP+10])
        .nice();
    xScale.domain([0, 100]);
    yScale.domain([0, 1]);

    svg.append('g')
        .attr('transform', `translate(50, ${height - MARGIN_DOWN-60})`)
        .call(d3.axisBottom(xScale));

    svg.append('g')
        .attr('transform', `translate(${MARGIN_LEFT}, 0)`)
        .call(d3.axisLeft(yScale));

    var circles = svg.selectAll("circle")
        .data(selectedData)
        .join("circle")
        .attr("cx", d => xScale(d.popularity)+50)
        .attr("cy", d => yScale(d.energy))
        .attr("r", 5)
        .attr("fill", "#1DB954")
        .attr("stroke", "white")
        .attr("stroke-width", 1)
        .on("mouseover", function (d) {
            d3.select(this)
                .attr("stroke-width", 2)
                .attr("fill", "darkgreen")
                .attr("r", 7)
                // bring to front
                .raise();
        }
        )
        .on("mouseout", function (d) {
            d3.select(this)
                .attr("stroke-width", 1)
                .attr("fill", "#1DB954")
                .attr("r", 5);
        }
        );

    svg.append("text")
        .attr("x", MARGIN_LEFT+5)
        .attr("y", MARGIN_TOP)
        .attr("text-anchor", "left")
        .attr("fill", "white")
        .attr("font-weight", "bold")
        .attr("font-size", "14px")
        .text("Energy");

    svg.append("text")
        .attr("x", 890)
        .attr("y", height - MARGIN_DOWN - 55)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .attr("font-weight", "bold")
        .attr("font-size", "14px")
        .text("Popularity");

    circles
        .append('title')
        .text(d => `${d.song}\nby ${d.artist} \nPopularity: ${d.popularity} \nEnergy: ${d.energy}`);
}