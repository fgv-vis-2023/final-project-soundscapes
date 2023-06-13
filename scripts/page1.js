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
      description = "With the rise of digital music platforms and streaming services, there has been a shift in how people consume music. Shorter songs tend to have a higher chance of being played repeatedly, leading to more streams and potentially higher chart positions. Additionally, in an age of information overload and shorter attention spans, listeners prefer concise and easily digestible content. By keeping songs shorter, artists can capture and maintain the attention of their audience throughout the track.";
      break;
    case "danceability":
      description = "The average danceability over the past 20 years has reflected the shifting trends and preferences in the music industry. There was a slight increase from 1998 to 2000, followed by a gradual decline until around 2009. This decline may be due to a shift in musical styles and genres prioritizing other aspects. From 2011 to 2020, danceability experienced a moderate increase, reaching a peak of 0.79 in 2020. This suggests a renewed focus on creating energetic and engaging tracks, potentially influenced by popular dance-oriented genres.";
      break;
    case "energy":
      description = "The average energy of popular music has fluctuated over the years, reflecting pop culture and musical trends. The rise from 1998 to 2007 can be attributed to energetic genres like pop-punk and the rise of high-energy performances in the mainstream. The subsequent decline from 2008 to 2015 may reflect a shift towards more introspective and mellow music, influenced by the rise of indie and alternative genres. Followed by a resurgence from 2016 to 2020, reaching its highest point. These variations in energy capture the dynamic nature of music industry, shaping the sound of popular music.";
      break;
    case "speechiness":
      description = "The late 1990s and early 2000s witnessed a rise in speechiness, possibly influenced by the emergence of rap and hip-hop genres. The subsequent decline from 2004 to 2010 could be attributed to the dominance of instrumental-driven pop and electronic music during that period. However, the increase from 2012 to 2019 aligns with the popularity of spoken-word genres like spoken-word poetry and the incorporation of rap elements into mainstream music.";
      break;
    case "valence":
      description = "The variation in valence, representing the musical positiveness conveyed by a track, reflects the connection of music to cultural influences. The late 1990s and early 2000s saw an increase in upbeat songs, while the mid-2000s marked a decline, indicating a desire for diverse emotional experiences. Fluctuations in valence over the years are influenced by changing trends and the cultural landscape. The lower valence scores in the 2010s may reflect a greater exploration of complex emotions, while the slight increase in 2020 suggests a desire for uplifting music during challenging times.";
      break;
    case "tempo":
      description = "The tempo (BPM) of popular music has fluctuated over the years, reflecting musical and cultural influences. The late 90s and early 2000s saw high tempos, coinciding with the rise of energetic genres like Eurodance and pop. In 2008, there was a peak in tempo due to the popularity of electronic dance music (EDM). Subsequently, there was a moderate decrease in tempo, reflecting a shift towards diverse genres and musical elements.";
      break;
  }
  return description;
}