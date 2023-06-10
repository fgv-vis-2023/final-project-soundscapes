// TODO: add comments
// TODO: add Tooltip to donut chart, with the feature name and value and color

// ----------- variables ------------
const resultBox = document.querySelector(".result-box");
const inputBox = document.querySelector(".search-input input");
const clearButton = document.querySelector(".clear-button");

// ---------- svg elements -----------
const svg3 = d3.select("#features-chart")
    .append("svg")
    .attr("width", 1100)
    .attr("height", 600);

const textGroup = svg3.append("g")
    .attr("transform", "translate(0,60)");

const textGroup2 = svg3.append("g")
    .attr("transform", "translate(0,140)");

const g = svg3.append("g")
    .attr("transform", "translate(850," + (svg3.attr("height") / 2) + ")");

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
    textGroup.selectAll("text").remove();
    g.selectAll("text").remove();    
}

var arcGenerator = d3.arc()
  .innerRadius((d, idx) => 120 + 25 * idx)
  .outerRadius((d, idx) => 140 + 25 * idx)
  .startAngle(d => 0)
  .endAngle(d => d.value * 2 * Math.PI)
  .padAngle(0.005) 
  .padRadius(80)
  .cornerRadius(4);

var color = d3.scaleOrdinal()
    .domain([0, 1, 2, 3])
    .range(["#42FFEF", "#17B5AC", "#1EBA55", "#83D117"]);

// add features text
textGroup2.append("text")
    .attr("x", 0)
    .attr("y", 5)
    .attr("font-size", "20px")
    .attr("font-weight", "bold")
    .attr("fill", "#fff")
    .text("Music Features (0 - 1)");

var textContent = [
    "",
    "Energy: It measures the intensity and activity level of a track.",
    "Higher values indicate more energetic and lively music.",
    "",
    "Valence: It describes the musical positiveness conveyed by a track.",
    "Higher valence values indicate more positive and uplifting music,",
    "while lower values indicate more negative or melancholic music.",
    "",
    "Danceability: It assesses how suitable a track is for dancing based",
    "on a combination of musical elements including tempo, rhythm",
    "stability, beat strength, and overall regularity.",
    "",
    "Speechiness: It indicates the presence of spoken words in a track.",
    "A value close to 1.0 suggests that the track primarily consists of",
    "spoken words, such as talk shows or poetry. Values between",
    "0.33 and 0.66 represent tracks that may contain both music and",
    "speech, including genres like rap. Values below 0.33 mostly",
    "represent music without significant speech-like elements."
];

textGroup2.selectAll("text")
    .data(textContent)
    .enter()
    .append("text")
    .attr("x", 0)
    .attr("y", (d, i) => 30 + i * 20)
    .attr("font-size", "16px")
    .attr("fill", "#fff")
    .text(d => d);

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
                        danceability: parseFloat(result.danceability),
                        valence: parseFloat(result.valence),
                        energy: parseFloat(result.energy),
                        artist: result.artist,
                        popularity: parseFloat(result.popularity),
                        year: parseFloat(result.year)
                    };
                    resolve(features);
                    console.log("Dados da música recuperados com sucesso:", features);
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

function updateDonutChart(data, selectedMusicTitle, selectedMusicArtist, popularityValue, year) {
    if (!data) {
        data = {
            speechiness: 0,
            danceability: 0,
            valence: 0,
            energy: 0
        };
        selectedMusicTitle = "";
        selectedMusicArtist = "";
        popularityValue = 0;
        year = 0;
    }

    var arcData = [
        { value: data.speechiness, label: "Speechiness" },
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
        .attr("fill", function (d, i) {
        return color(d.value);
        })
        .attr("stroke", "#fff")
        .merge(gPaths.select("path")) // merge existing and enter elements
        .transition().duration(500)
        .attrTween("d", arcTween);

    gEnter.append("title")
    .text(function (d) {
        return d.label + ": " + d.value;
    });

    //gPaths.exit().remove();

    textGroup.selectAll("*").remove(); // Clear previous text elements

    textGroup.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("font-size", "22px")
        .attr("font-weight", "bold")
        .attr("fill", "#fff")
        .text(selectedMusicTitle);

    textGroup.append("text")
        .attr("x", 0)
        .attr("y", 28)
        .attr("font-size", "18px")
        .attr("fill", "#fff")
        .text("by " + selectedMusicArtist + " | Year: " + year);

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
        .attr("x", -50)
        .attr("y", 5)
        .attr("font-size", "50px")
        .attr("font-weight", "bold")
        .attr("fill", "#fff")
        .text(popularityValue + "%");

    g.append("text")
        .attr("x", -48)
        .attr("y", 40)
        .attr("font-size", "20px")
        .attr("fill", "#fff")
        .text("popularity");
}