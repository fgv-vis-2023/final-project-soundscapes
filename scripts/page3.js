// https://raw.githubusercontent.com/fgv-vis-2023/final-project-soundscapes/main/data/songs.csv

// search bar
const resultBox = document.querySelector(".result-box");
const inputBox = document.querySelector(".search-input input");
const clearButton = document.querySelector(".search-input .clear-button");

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
                clearButton.classList.add("visible");
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
}

clearButton.onclick = function() {
    inputBox.value = "";
    resultBox.innerHTML = "";
    clearButton.classList.remove("visible");
  };

// music features bubble chart
// create svg element and append to body of the page
const svg = d3.select("#features-chart")
    .append("svg")
    .attr("width", 500)
    .attr("height", 500);