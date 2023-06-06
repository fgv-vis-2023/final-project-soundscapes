const margin = { top: 20, right: 20, bottom: 30, left: 30 };

const svg = d3.select("#temporal-chart")
  .append("svg")
  .attr("width", 1000)
  .attr("height", 600);

function cleanData(data, column) {
  data.forEach(d => {
    d.year = +d.year;
    d[column] = +d[column];
  });
  return data;
}

let chartData;

d3.csv("https://raw.githubusercontent.com/fgv-vis-2023/final-project-soundscapes/main/data/songs.csv").then(data => {
  chartData = data;
  createChart(chartData, "duration"); // Pode definir a coluna inicial aqui
});

function createChart(chartData, column) {
  chartData = cleanData(chartData, column);
  svg.selectAll("*").remove(); // remove all elements before creating the chart

  const columnByYear = d3.group(chartData, d => d.year);
  const aggregatedData = Array.from(columnByYear, ([year, values]) => {
    let value;
    if (column === "duration") {
      value = d3.mean(values, d => d.duration_ms / 60000);
    } else {
      value = d3.mean(values, d => d[column]);
    }
    return {
      year: +year,
      value: value
    };
  });  
  aggregatedData.sort((a, b) => a.year - b.year); // sort by year

  const xScale = d3.scaleLinear()
    .domain(d3.extent(aggregatedData, d => d.year))
    .range([margin.left, 900 - margin.right]);
  
  const yScale = d3.scaleLinear()
    .domain(d3.extent(aggregatedData, d => d.value))
    .range([500 - margin.bottom, margin.top]);

  const line = d3.line()
    .x(d => xScale(d.year))
    .y(d => yScale(d.value));

  svg.append("g")
    .attr("transform", `translate(0, ${500 - margin.bottom})`)
    .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));

  svg.append("g")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(d3.axisLeft(yScale));

  svg.append("text")
    .attr("x", 50)
    .attr("y", margin.top-10)
    .attr("text-anchor", "left")
    .attr("fill", "white")
    .attr("font-weight", "bold")
    .attr("font-size", "14px")
    .text("Average " + column);

  svg.append("text")
    .attr("x", 920)
    .attr("y", 475)
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .attr("font-weight", "bold")
    .attr("font-size", "14px")
    .text("Year");

  const path = svg.append("path")
    .datum(aggregatedData)
    .attr("fill", "none")
    .attr("stroke", "#1DB954")
    .attr("stroke-width", 3)
    .attr("d", line);

  const totalLength = path.node().getTotalLength();

  path.attr("stroke-dasharray", totalLength + " " + totalLength)
    .attr("stroke-dashoffset", totalLength)
    .transition()
    .duration(2000)
    .attr("stroke-dashoffset", 0);
}

const columnRadios = document.querySelectorAll('input[name="column"]');
columnRadios.forEach(radio => {
  radio.addEventListener("change", function() {
    const selectedColumn = this.value;
    createChart(chartData, selectedColumn);
  });
});

