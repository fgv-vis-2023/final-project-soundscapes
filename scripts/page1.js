const margin = { top: 20, right: 20, bottom: 30, left: 30 };

const svg1 = d3.select("#temporal-chart")
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
  const columnRadios = document.querySelectorAll('input[name="column"]');
  columnRadios.forEach(radio => {
    radio.addEventListener("change", function() {
      const selectedColumn = this.value;
      const textbox = document.getElementById("description-text");
      textbox.innerHTML = getFeatureDescription(selectedColumn);
      createChart(chartData, selectedColumn);
    });
  });
  // default chart
  createChart(chartData, "duration");
  const textbox = document.getElementById("description-text");
  textbox.innerHTML = getFeatureDescription("duration");
});

function createChart(chartData, column) {
  chartData = cleanData(chartData, column);
  svg1.selectAll("*").remove(); // remove all elements before creating the chart

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
    .domain([0, d3.max(aggregatedData, d => d.value) * 1.1])
    .range([500 - margin.bottom, margin.top]);

  const line = d3.line()
    .x(d => xScale(d.year))
    .y(d => yScale(d.value));

  svg1.append("g")
    .attr("transform", `translate(0, ${500 - margin.bottom})`)
    .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));

  svg1.append("g")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(d3.axisLeft(yScale));

  svg1.append("text")
    .attr("x", 30)
    .attr("y", margin.top-10)
    .attr("text-anchor", "left")
    .attr("fill", "white")
    .attr("font-weight", "bold")
    .attr("font-size", "14px")
    .text("Average " + column);

  svg1.append("text")
    .attr("x", 905)
    .attr("y", 475)
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .attr("font-weight", "bold")
    .attr("font-size", "14px")
    .text("Year");

  const path = svg1.append("path")
    .datum(aggregatedData)
    .attr("fill", "none")
    .attr("stroke", "#1DB954")
    .attr("stroke-width", 3)
    .attr("d", line);

  const circles = svg1.selectAll("circle")
    .data(aggregatedData)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.year))
    .attr("cy", d => yScale(d.value))
    .attr("r", 0)
    .attr("fill", "#1DB954")
    .on("mouseover", (event, d) => {
      d3.select(event.currentTarget)
        .attr("fill", "#FFFFFF")
        .attr("r", 6);

      svg1.append("text")
        .attr("id", "tooltip")
        .attr("x", xScale(d.year))
        .attr("y", yScale(d.value) - 12)
        .attr("text-anchor", "left")
        .attr("fill", "#FFFFFF")
        .attr("font-size", "14px")
        .attr("font-weight", "bold")
        .text(d.year + ": " + d.value.toFixed(2));
    })
    .on("mouseout", (event, d) => {
      d3.select(event.currentTarget)
        .attr("fill", "#1DB954")
        .attr("r", 2);

      d3.select("#tooltip").remove();
    });

  circles.transition()
    .delay((d, i) => i * 25) // delay for each circle to appear gradually 
    .duration(2000)
    .attr("r", 2);


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

function getFeatureDescription(column) {
  let description = "";
  switch (column) {
    case "duration":
      description = "With the rise of digital music platforms and streaming services, there has been a shift in how people consume music. Shorter songs tend to have a higher chance of being played repeatedly, leading to more streams and potentially higher chart positions. Additionally, in an age of information overload and shorter attention spans, listeners prefer concise and easily digestible content.";
      break;
    case "danceability":
      description = "The average danceability over the past 20 years has reflected the shifting trends and preferences in the music industry. From 2009 to 2020, danceability experienced a moderate increase, reaching a peak of 0.79 in 2020. This suggests a renewed focus on creating energetic and engaging tracks, potentially influenced by popular dance-oriented genres.";
      break;
    case "energy":
      description = "The average energy of popular music has fluctuated over the years, reflecting pop culture and musical trends. The average rise from 1998 to 2012 can be related to the rise of high-energy performances in the mainstream. The subsequent decline may reflect a shift towards more introspective music, influenced by the rise of indie and alternative genres.";
      break;
    case "speechiness":
      description = "Many aspects cause the fluctuation in the total average speechiness, especially because it changes a lot for each genre. However, the increase from 2014 to 2019 aligns with the popularity of spoken-word genres and the incorporation of rap elements into mainstream music.";
      break;
    case "valence":
      description = "The variation in valence reflects the connection of music to cultural influences. Fluctuations in valence over the years are influenced by changing trends and the cultural landscape. The lower valence scores in the 2010s may reflect a greater exploration of complex emotions and the rise of indie and alternative genres.";
      break;
    case "tempo":
      description = "The tempo (BPM) of the most listened to music has fluctuated over the years but has generally been increasing. The late 90s and early 2000s saw high tempos followed by a decrease. In 2008, there was a peak in tempo due to the popularity of electronic dance music (EDM). Subsequently, there was a moderate decrease in tempo, reflecting a shift towards diverse genres and musical elements.";
      break;
  }
  return description;
}