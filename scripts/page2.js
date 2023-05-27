d3.csv("https://raw.githubusercontent.com/fgv-vis-2023/final-project-soundscapes/main/data/songs.csv", function(data) {
    for (var i = 0; i < 5; i++) {
        console.log(data[i]);
    }
});