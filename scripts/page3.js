// https://raw.githubusercontent.com/fgv-vis-2023/final-project-soundscapes/main/data/songs.csv

// search bar
const resultBox = document.querySelector(".result-box");
const inputBox = document.querySelector(".search-input input");
const clearButton = document.querySelector(".clear-button");

inputBox.onkeyup = function(){
    let userInput = inputBox.value;
    if(userInput.length > 0){
        d3.csv("https://raw.githubusercontent.com/fgv-vis-2023/final-project-soundscapes/main/data/songs.csv").then(function(data){
            result = data.filter(music => music.song.toLocaleLowerCase().startsWith(userInput.toLocaleLowerCase()));
            showSuggestions(result);

            if(!result.length){
                resultBox.innerHTML = "";
                clearButton.classList.remove("visible");
            } else {
                clearButton.classList.add("visible"); // Adicionar a classe "visible"
            }
        });
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
        updateDonutChart(selectedData);
    }).catch((error) => {
        console.log(error);
    });
}

function retrieveMusicData(selectedMusic){
    return new Promise((resolve, reject) => {
        d3.csv("https://raw.githubusercontent.com/fgv-vis-2023/final-project-soundscapes/main/data/songs.csv").then(function (data) {
          // filter data
          const result = data.find((music) =>music.song.toLowerCase() === selectedMusic.toLowerCase());
          if (result) {
            // get features
            const features = {
              speechiness: parseFloat(result.speechiness),
              danceability: parseFloat(result.danceability),
              valence: parseFloat(result.valence),
              energy: parseFloat(result.energy),
            };
            resolve(features);
          } else {
            reject("Música não encontrada");
          }
        });
    });
}

// clear button
clearButton.onclick = () => {
    inputBox.value = "";
    resultBox.innerHTML = "";
    clearButton.classList.remove("visible");
    updateDonutChart(null);
}

// svg canvas for music features text beside the radial chart
/* const svgText = d3.select("#features-chart")
    .append("svg")
    .attr("width", 400)
    .attr("height", 500);

const featurestext = "Music Features (0-1)";

const textSpeechiness = svgText.append("text")
    .attr("x", 0)
    .attr("y", 0)
    .attr("dy", "2.5em")
    .attr("font-size", "1em")
    .attr("font-weight", "bold")
    .attr("fill", "#fff")
    .text(featurestext); */

// music features radial chart
const svg = d3.select("#features-chart")
    .append("svg")
    .attr("width", 600)
    .attr("height", 500);

const g = svg.append("g")
    .attr("transform", "translate(" + (svg.attr("width") / 2) + "," + (svg.attr("height") / 2) + ")");

var arcGenerator = d3.arc()
  .innerRadius(function (d, idx) {
    return 100 + 25 * idx; 
  })
  .outerRadius(function (d, idx) {
    return 120 + 25 * idx;
  })
  .startAngle(function (d) {
    return 0;
  })
  .endAngle(function (d) {
    return d.value * 2 * Math.PI;
  })
  .padAngle(0.005) 
  .padRadius(80)
  .cornerRadius(4);

var color = d3.scaleOrdinal()
    .domain([0, 1, 2, 3])
    .range(["#42FFEF", "#17B5AC", "#1EBA55", "#83D117"]);

function updateDonutChart(data) {
    if (!data) {
        g.selectAll("path").remove();
        return;
    }

    var arcData = [
        { value: data.speechiness, label: "Speechiness" },
        { value: data.danceability, label: "Danceability" },
        { value: data.valence, label: "Valence" },
        { value: data.energy, label: "Energy" }
    ];

    var gPaths = g.selectAll("path")
        .data(arcData);

    gPaths.enter()
        .append("path")
        .merge(gPaths)
        .transition().duration(500)
        .attrTween("d", arcTween)
        .attr("fill", function (d, i) {
        return color(d.value);
        })
        .attr("stroke", "#fff");

    gPaths.exit().remove();

    gPaths.append("title")
        .text(d => d.label + ": " + d.value);

    function arcTween(d, i) {
        var interpolate = d3.interpolate(0, d.value);
        return function (t) {
        d.value = interpolate(t);
        return arcGenerator(d, i);
        };
    }
}