const startYear = 1990;
const endYear = new Date().getFullYear();
const dropdown = d3.select("#year-dropdown");

// Load the CSV file
d3.csv("https://raw.githubusercontent.com/fgv-vis-2023/final-project-soundscapes/main/data/songs.csv").then(function(data) {
  const yearsData = d3.group(data, d => +d.year);

  dropdown.selectAll("option")
    .data(d3.range(startYear, endYear + 1))
    .enter()
    .append("option")
    .attr("value", year => year)
    .text(year => year);

  dropdown.on("change", function() {
    const selectedYear = +this.value;
    updatePopularArtists(selectedYear);
  });

  function updatePopularArtists(year) {
    svg.html("");
  
    const yearData = yearsData.get(year);
  
    if (yearData) {
      const artistsData = d3.group(yearData, d => d.artist);
  
      const artistsPopularity = [];
      const maxSongs = d3.max(artistsData, artists => artists.length);
  
      artistsData.forEach(function(artists, artist) {
        const popularitySum = d3.sum(artists, d => +d.popularity);
        const popularityAvg = popularitySum / artists.length;
        const circleRadius = d3.scaleLinear()
          .domain([0, maxSongs])
          .range([5, 20]);
  
        artistsPopularity.push({
          artist: artist,
          popularity: popularityAvg,
          songs: artists.length,
          radius: circleRadius(artists.length),
          songsData: artists
        });
      });
  
      const sortedArtists = artistsPopularity.sort((a, b) => b.popularity - a.popularity);
      const top10Artists = sortedArtists.slice(0, 10);
  
      const margin = { top: 20, right: 20, bottom: 60, left: 60 };
      const width = 600 - margin.left - margin.right;
      const height = 400 - margin.top - margin.bottom;
  
      svg.attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);
  
      const chart = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
      const yScale = d3.scaleLinear()
        .domain([d3.min(top10Artists, d => d.popularity) - 5, d3.max(top10Artists, d => d.popularity) + 5])
        .range([height, 0]);
  
      const yAxis = d3.axisLeft(yScale);
  
      chart.append("g")
        .call(yAxis);
  
      const xScale = d3.scaleBand()
        .domain(top10Artists.map(d => d.artist))
        .range([0, width])
        .padding(0.2);
  
      const artistCircles = chart.selectAll(".artist-circle")
        .data(top10Artists, d => d.artist); // <-- Use data update and key function
  
      artistCircles.enter() // <-- Enter selection for new elements
        .append("circle")
        .attr("class", "artist-circle")
        .merge(artistCircles) // <-- Merge enter and existing elements
        .attr("cx", d => xScale(d.artist) + xScale.bandwidth() / 2)
        .attr("cy", d => yScale(d.popularity))
        .attr("r", d => d.radius)
        .attr("fill", "steelblue")
        .on("click", function(event, d) {
          showArtistSongs(d.songsData);
        })
        .on("mouseover", function(event, d) {
          d3.select(this)
            .attr("fill", "orange");
  
          tooltip.transition()
            .duration(200)
            .style("opacity", .9);
  
          tooltip.html(`<strong>Artist:</strong> ${d.artist}<br>
                        <strong>Songs:</strong> ${d.songs}<br>
                        <strong>Popularity:</strong> ${d.popularity}`)
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
          d3.select(this)
            .attr("fill", "steelblue");
  
          tooltip.transition()
            .duration(500)
            .style("opacity", 0);
        });
  
      artistCircles.exit().remove(); // <-- Remove exit selection
    }
  }

  // Initialize with the current year
  const currentYear = new Date().getFullYear();
  dropdown.property("value", currentYear);
  updatePopularArtists(currentYear);
}).catch(function(error) {
  console.log("Error loading the CSV file:", error);
});

const tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);
