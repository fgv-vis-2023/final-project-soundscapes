// Load the dataset from a local CSV file
d3.csv("https://raw.githubusercontent.com/fgv-vis-2023/final-project-soundscapes/main/data/songs.csv").then(function(dataset) {
    // Parse the year and popularity properties as numbers
    dataset.forEach(d => {
      d.year = parseInt(d.year);
      d.popularity = parseFloat(d.popularity);
    });
  
    // Group the dataset by artist
    const groupedData = Array.from(d3.group(dataset, d => d.artist), ([key, value]) => ({
      artist: key,
      popularity: d3.mean(value, d => d.popularity)
    }));
  
    // Filter the dataset based on the selected year
    function filterDataByYear(year) {
      return dataset.filter(d => d.year === year);
    }
  
    // Update the visualization based on the filtered data
    function updateVisualization(year) {
      const filteredData = filterDataByYear(year);
  
      // Filter the artist popularity data based on the filtered data
      const filteredArtistPopularity = groupedData.filter(d =>
        filteredData.some(song => song.artist === d.artist)
      );
  
      // Sort the artist popularity data by popularity in descending order
      filteredArtistPopularity.sort((a, b) => b.popularity - a.popularity);
  
      // Take the top 10 artists
      const topArtists = filteredArtistPopularity.slice(0, 10).map(d => d.artist);
  
      // Clear the previous content
      d3.select("#top-artists").html("");
  
      // Display the top artists
      d3.select("#top-artists")
        .selectAll("p")
        .data(topArtists)
        .enter()
        .append("p")
        .text(d => d);
    }
  
    // Get the current value of the year slider and update the visualization
    function onSliderChange() {
      const year = parseInt(this.value);
      updateVisualization(year);
    }
  
    // Attach the slider change event listener
    document.getElementById("year-slider").addEventListener("input", onSliderChange);
  
    // Initialize the visualization
    updateVisualization(parseInt(document.getElementById("year-slider").value));
  });  