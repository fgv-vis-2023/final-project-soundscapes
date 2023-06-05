const startYear = 1990;
const endYear = new Date().getFullYear();
const dropdown = d3.select("#year-dropdown");
const popularArtistsContainer = d3.select("#popular-artists");

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
    popularArtistsContainer.html("");

    const yearData = yearsData.get(year);

    if (yearData) {
      const artistsData = d3.group(yearData, d => d.artist);
      const artistsPopularity = [];

      artistsData.forEach(function(artists, artist) {
        const popularitySum = d3.sum(artists, d => +d.popularity);
        const popularityAvg = popularitySum / artists.length;

        artistsPopularity.push({
          artist: artist,
          popularity: popularityAvg
        });
      });

      const sortedArtists = artistsPopularity.sort((a, b) => b.popularity - a.popularity);
      const top10Artists = sortedArtists.slice(0, 10).map(d => d.artist);

      popularArtistsContainer.append("h3")
        .text(`Top 10 Artists in ${year}`);

      const artistsList = popularArtistsContainer.append("ul");

      top10Artists.forEach(function(artist) {
        artistsList.append("li")
          .text(artist);
      });
    }
  }

  // Initialize with the current year
  const currentYear = new Date().getFullYear();
  dropdown.property("value", currentYear);
  updatePopularArtists(currentYear);
}).catch(function(error) {
  console.log("Error loading the CSV file:", error);
});
