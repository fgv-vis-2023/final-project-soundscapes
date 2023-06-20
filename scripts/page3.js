// ----------- variables ------------
const resultBox = document.querySelector(".result-box");
const inputBox = document.querySelector(".search-input input");
const clearButton = document.querySelector(".clear-button");

// ---------- svg elements -----------
const svg3 = d3.select("#features-chart")
    .append("svg")
    .attr("width", 1100)
    .attr("height", 500);

const textGroup = svg3.append("g")
    .attr("transform", "translate(" + (svg3.attr("width") / 2) + ",45)");

const textGroup2 = svg3.append("g")
    .attr("transform", "translate(50,100)");

const g = svg3.append("g")
    .attr("transform", "translate(830,280)");

// --------- data variables ----------
let musicData = [];

d3.csv("https://raw.githubusercontent.com/fgv-vis-2023/final-project-soundscapes/main/data/songs.csv")
    .then(data => {
        musicData = data;
    })
    .catch(error => {
        console.log("Erro ao carregar o arquivo CSV:", error);
    });

let debounceTimeout; // avoid multiple calls to filterData

inputBox.onkeyup = function(){
    clearTimeout(debounceTimeout); // cancel previous timeout
    debounceTimeout = setTimeout(filterData, 300); // set new timeout
}

clearButton.onclick = () => {
    inputBox.value = "";
    resultBox.innerHTML = "";
    clearButton.classList.remove("visible");
    updateDonutChart(null, null, null, null, null);
    g.selectAll("*").remove();
}

var arcGenerator = d3.arc()
  .innerRadius((d, idx) => 60 + 25 * idx)
  .outerRadius((d, idx) => 80 + 25 * idx)
  .startAngle(d => 0)
  .endAngle(d => d.value * 2 * Math.PI)
  .padAngle(0.005) 
  .padRadius(80)
  .cornerRadius(4);

var color = d3.scaleOrdinal()
    .domain([0, 1, 2, 3, 4])
    .range(["#0782C7", "#17D1B9", "#1DB954", "#3ED117", "#ADC716"]);

// ------------ functions ------------
function filterData() {
    let userInput = inputBox.value;
    if (userInput.length > 0) {
      const result = musicData.filter(
        (music) => music.song.toLowerCase().startsWith(userInput.toLowerCase())
      );
      showSuggestions(result);
  
      if (!result.length) {
        resultBox.innerHTML = "";
        clearButton.classList.remove("visible");
      } else {
        clearButton.classList.add("visible");
      }
    } else {
      resultBox.innerHTML = "";
      clearButton.classList.remove("visible");
    }
}

function showSuggestions(result){
    const content = result.map((list)=>{
        return "<li onclick=selectInput(this) >" + list.song + "</li>";
    });
    resultBox.innerHTML = "<ul>" + content.join("") + "</ul>";
}

function selectInput(list){
    inputBox.value = list.innerHTML;
    resultBox.innerHTML = "";
    clearButton.classList.add("visible");

    // get song data
    const selectedMusic = list.innerHTML;
    retrieveMusicData(selectedMusic).then((selectedData) => {
        const selectedMusicTitle = list.innerHTML;
        const popularityValue = selectedData.popularity;
        const selectedMusicArtist = selectedData.artist;
        const year = selectedData.year;
        updateDonutChart(selectedData, selectedMusicTitle, selectedMusicArtist, popularityValue, year);
    }).catch((error) => {
        console.log(error);
    });
}

function retrieveMusicData(selectedMusic){
    return new Promise((resolve, reject) => {
        d3.csv("https://raw.githubusercontent.com/fgv-vis-2023/final-project-soundscapes/main/data/songs.csv")
            .then(function (data) {
                // filter data
                const result = data.find((music) =>music.song.toLowerCase() === selectedMusic.toLowerCase());
                if (result) {
                    // get features
                    const features = {
                        speechiness: parseFloat(result.speechiness),
                        acousticness: parseFloat(result.acousticness),
                        danceability: parseFloat(result.danceability),
                        valence: parseFloat(result.valence),
                        energy: parseFloat(result.energy),
                        artist: result.artist,
                        popularity: parseFloat(result.popularity),
                        year: parseFloat(result.year),
                        explicit: result.explicit
                    };
                    resolve(features);
                    console.log(features)
                } else {
                    reject("Música não encontrada");
                }
            }) 
            .catch(function (error) {
                console.log("Erro ao recuperar dados da música:", error);
                reject(error);
            });
    });
}

function getNumberOfSongsInTopCharts(artist) {
    // null or undefined
    if (!artist) {
        return 0;
    }
    const filteredSongs = musicData.filter(music => music.artist === artist);
    const uniqueSongs = new Set(filteredSongs.map(music => music.song));
    return uniqueSongs.size;
}

function getMeanAcousticness(artist) {
    if (!artist) {
        return 0;
    }
    const filteredSongs = musicData.filter(music => music.artist === artist);
    const getMeanAcousticness = d3.mean(filteredSongs, music => parseFloat(music.acousticness));
    return getMeanAcousticness.toFixed(2);
}

function getMeanEnergy(artist) {
    if (!artist) {
        return 0;
    }
    const filteredSongs = musicData.filter(music => music.artist === artist);
    const meanEnergy = d3.mean(filteredSongs, music => parseFloat(music.energy));
    return meanEnergy.toFixed(2);
}

function getMeanValence(artist) {
    if (!artist) {
        return 0;
    }
    const filteredSongs = musicData.filter(music => music.artist === artist);
    const meanValence = d3.mean(filteredSongs, music => parseFloat(music.valence));
    return meanValence.toFixed(2);
}

function getMeanDanceability(artist) {
    if (!artist) {
        return 0;
    }
    const filteredSongs = musicData.filter(music => music.artist === artist);
    const meanDanceability = d3.mean(filteredSongs, music => parseFloat(music.danceability));
    return meanDanceability.toFixed(2);
}

function getMeanSpeechiness(artist) {
    if (!artist) {
        return 0;
    }
    const filteredSongs = musicData.filter(music => music.artist === artist);
    const meanSpeechiness = d3.mean(filteredSongs, music => parseFloat(music.speechiness));
    return meanSpeechiness.toFixed(2);
}

function updateDonutChart(data, selectedMusicTitle, selectedMusicArtist, popularityValue, year) {
    if (!data) {
        data = {
            speechiness: 0,
            acousticness: 0,
            danceability: 0,
            valence: 0,
            energy: 0
        };
        g.selectAll("*").remove();
        selectedMusicTitle = "";
        selectedMusicArtist = "";
        popularityValue = "";
        year = 0;        
    }

    var arcData = [
        { value: data.speechiness, label: "Speechiness" },
        { value: data.acousticness, label: "Acousticness" },
        { value: data.danceability, label: "Danceability" },
        { value: data.valence, label: "Valence" },
        { value: data.energy, label: "Energy" }
    ];

    var gPaths = g.selectAll("g.arc")
        .data(arcData);

    gPaths.exit().remove();

    var gEnter = gPaths.enter().append("g")
        .attr("class", "arc");

    gEnter.append("path")
        .attr("fill", function (d) {
        return color(d.value);
        })
        .attr("stroke", "#fff")
        .merge(gPaths.select("path")) // merge existing and enter elements
        .transition().duration(500)
        .attrTween("d", arcTween);

    gEnter.append("title")
        .merge(gPaths.select("title")) // merge existing and enter elements
        .text(function (d) {
            return d.label + ": " + d.value;
    });

    // Clear previous text elements
    textGroup.selectAll("text").remove(); 
    textGroup2.selectAll("text").remove();

    textGroup.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("font-size", "19px")
        .attr("font-weight", "bold")
        .attr("fill", "#fff")
        .attr("text-anchor", "middle")
        .text(selectedMusicTitle);

    textGroup.append("text")
        .attr("x", 0)
        .attr("y", 22)
        .attr("font-size", "15px")
        .attr("fill", "#fff")
        .attr("text-anchor", "middle")
        .text(selectedMusicArtist ? "by " + selectedMusicArtist + " | Release Year: " + year : "");

    textGroup.append("text")
        .attr("x", 0)
        .attr("y", 50)
        .attr("font-size", "14px")
        .attr("font-style", "italic")
        .attr("fill", "red")
        .attr("text-anchor", "middle")
        .text(data.explicit === "True" ? "This song is explicit!" : "");

    textGroup2.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("font-size", "16px")
        .attr("font-weight", "bold")
        .attr("fill", "#fff")
        .attr("text-anchor", "left")
        .text(selectedMusicArtist ? selectedMusicArtist + " Information" : "Select a song!");

    textGroup2.append("text")
        .attr("x", 0)
        .attr("y", 26)
        .attr("font-size", "14px")
        .attr("fill", "#fff")
        .attr("text-anchor", "left")
        .text("• Number of Songs in Top Charts: " + getNumberOfSongsInTopCharts(selectedMusicArtist));

    textGroup2.append("text")
        .attr("x", 0)
        .attr("y", 55)
        .attr("font-size", "14px")
        .attr("fill", "#fff")
        .attr("text-anchor", "left")
        .text("• Mean Energy: " + getMeanEnergy(selectedMusicArtist));

    textGroup2.append("text")
        .attr("x", 0)
        .attr("y", 85)
        .attr("font-size", "14px")
        .attr("fill", "#fff")
        .attr("text-anchor", "left")
        .text("• Mean Valence: " + getMeanValence(selectedMusicArtist));

    textGroup2.append("text")
        .attr("x", 0)
        .attr("y", 115)
        .attr("font-size", "14px")
        .attr("fill", "#fff")
        .attr("text-anchor", "left")
        .text("• Mean Danceability: " + getMeanDanceability(selectedMusicArtist));

    textGroup2.append("text")
        .attr("x", 0)
        .attr("y", 145)
        .attr("font-size", "14px")
        .attr("fill", "#fff")
        .attr("text-anchor", "left")
        .text("• Mean Acousticness: " + getMeanAcousticness(selectedMusicArtist));

    textGroup2.append("text")
        .attr("x", 0)
        .attr("y", 175)
        .attr("font-size", "14px")
        .attr("fill", "#fff")
        .attr("text-anchor", "left")
        .text("• Mean Speechiness: " + getMeanSpeechiness(selectedMusicArtist));

    textGroup2.append("text")
        .attr("x", 0)
        .attr("y", 212)
        .attr("font-size", "15px")
        .attr("font-weight", "bold")
        .attr("fill", "#ADC716")
        .attr("text-anchor", "left")
        .text(selectedMusicArtist ? (data.energy > getMeanEnergy(selectedMusicArtist) || data.energy > 0.5 ? "This is an energetic song for " + selectedMusicArtist + "!" : "For " + selectedMusicArtist + ", this is a calm song.") : "");

    textGroup2.append("text")
        .attr("x", 0)
        .attr("y", 242)
        .attr("font-size", "15px")
        .attr("font-weight", "bold")
        .attr("fill", "#3ED117")
        .attr("text-anchor", "left")
        .text(selectedMusicArtist ? (data.valence < getMeanValence(selectedMusicArtist) || data.valence < 0.33 ? "Oops! Based on this artist's songs, this is kind of a downer..." : "Yay! This is one of the most cheerful songs from this artist!") : "");

    textGroup2.append("text")
        .attr("x", 0)
        .attr("y", 272)
        .attr("font-size", "15px")
        .attr("font-weight", "bold")
        .attr("fill", "#1EBA55")
        .attr("text-anchor", "left")
        .text(selectedMusicArtist ? (data.danceability > getMeanDanceability(selectedMusicArtist) ? "Like dancing? This is a good song for you!" : "If you want to dance, there are better songs from this artist.") : "");

    textGroup2.append("text")
        .attr("x", 0)
        .attr("y", 302)
        .attr("font-size", "15px")
        .attr("font-weight", "bold")
        .attr("fill", "#17D1B9")
        .attr("text-anchor", "left")
        .text(selectedMusicArtist ? (data.acousticness > getMeanAcousticness(selectedMusicArtist) ? "This is a very acoustic song for " + selectedMusicArtist + "!" : "This song is not very acoustic for " + selectedMusicArtist + ".") : "");

    textGroup2.append("text")
        .attr("x", 0)
        .attr("y", 332)
        .attr("font-size", "15px")
        .attr("font-weight", "bold")
        .attr("fill", "#0782C7")
        .attr("text-anchor", "left")
        .text(selectedMusicArtist ? (data.speechiness > getMeanSpeechiness(selectedMusicArtist) ? "This song has a lot of words for " + selectedMusicArtist + "!" : selectedMusicArtist + " is more about the music here than the words.") : "");

    textGroup2.append("text")
        .attr("x", 0)
        .attr("y", 372)
        .attr("font-size", "14px")
        .attr("fill", "#fff")
        .attr("text-anchor", "left")
        .text("*Popularity (0-100): The higher the value the more popular the song is.");

    function arcTween(d, i) {
        var interpolate = d3.interpolate(0, d.value);
        return function (t) {
            d.value = interpolate(t);
            return arcGenerator(d, i);
        };
    }

    // write popularity value in the center of the donut chart
    g.selectAll("text").remove(); // Clear previous text elements

    g.append("text")
        .attr("x", -34)
        .attr("y", 5)
        .attr("font-size", "50px")
        .attr("font-weight", "bold")
        .attr("fill", "#fff")
        .text(popularityValue);

    g.append("text")
        .attr("x", -48)
        .attr("y", 40)
        .attr("font-size", "20px")
        .attr("fill", "#fff")
        .text("popularity");
}