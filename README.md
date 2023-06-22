# 🎶 SoundScapes: A Deep Dive into Spotify's Tracks

Projeto final desenvolvido para a disciplina de Data Visualization pelos alunos [Bernardo Vargas](https://github.com/bernardovma), [Cristiano Lárrea](https://github.com/cristianolarrea) e [Paloma Borges](https://github.com/palomavb).

Project Page: https://fgv-vis-2023.github.io/final-project-soundscapes/

## 📜 Abstract
This project showcases an interactive web application called SoundScapes: A deep dive into Spotify's tracks, which combines data visualization and scrollytelling, allowing users to explore the characteristics of the most popular songs on Spotify from 2000 to 2019, providing insights into the audio features utilized by the platform. It also enables users to better understand the musical landscape during this period.

[Link to Paper](https://github.com/fgv-vis-2023/final-project-soundscapes/blob/main/FinalPaper.pdf) | [Link to Demo Video](https://drive.google.com/file/d/131wB04ATMsV-sAOeV-2DpVAl2c4R-j5c/view?usp=sharing)

## ⚙️ Project's Process

To decide what topic would be approached and therefore get the project starting, the group decided together what subject would be of not only the members' interest, but would appeal to the users as well, and nothing sounded more universal than music. Looking through options, the dataset that showed some of the top tracks on Spotify over the last two decades was chosen, since it would be a great way to build good, interesting, and interactive storytelling for the consumer.

The initial goals were simple, creating a pleasant-looking and user-friendly page where the user could learn more about the bigger picture of the music scene in the last two decades (according to Spotify's biggest tracks). Further discussions landed on providing a way the consumers could have a historical view of these last decades (for the different metrics available), analyze how the genres have been doing and even being able to search songs of their interest and see how they were ranked through the metrics, adding the interactiveness and personalization needed for a good project. 

Then the group decided it would be a good distribution if each of the members focused on one visualization, so the work would be more balanced and the members could focus on their visualization, making it the best they could. Obviously, that didn't mean that the members wouldn't help each other, fixing bugs for each other and giving tips on what could be improved for the better of the project. With that, the group decided that the first visualization would be a general overview of the top tracks, with the second one being a more historical view of the top tracks, and the third one being a more personal view, where the user could search for a specific track and see how it ranked on the different metrics.

## 🖌️ Project's Design

In summary, the connection between sound waves and music inspired the idea of making the project resemble a dive in the ocean, starting with a shallow part, a superficial one, and adding depth as you swim out to sea, so, starting with a more generic visualization, adding complexity and interactiveness as you scroll down the page. With that in mind, we used elements reminiscent of waves and the color palette from Spotify (black, green, and white). 

![Spotify Palette](https://github.com/fgv-vis-2023/final-project-soundscapes/blob/main/assets/spotify-palette.png)

Using Adobe Color’s Color Wheel tool, the following analogous color palette was chosen for the last visualization, centered on Spotify’s main color, but setting different colors for each feature:

![Color Palette](https://github.com/fgv-vis-2023/final-project-soundscapes/tree/main/assets/paleta.png)

## 🗣️ Peer Critique Feedbacks

After presenting the MVP, we received feedback from our classmates, which helped us to improve our project. The main points were:
- The most recurrent feedback was the lack of an explanation of the metrics at the very beginning of the experience, so that the user would not be lost and could clearly understand all the visualizations. To solve this, we added an info-button right before the first graphics with the definition of all metrics used throughout the project.
- In the first visualization, we added more features and a tooltip to make it more interactive and to make it possible to see the specific value in each point, and we fixed the scale of the y-axis so that it starts at 0. Another feedback received was the possibility of being able to see all features at the same time. However, some measures range from 0 to 1, and others have very different values (such as duration, measured in minutes, and BPM, with values over 100). This large difference in the range of variables did not allow us to create a compatible multi-line chart that allowed a fair comparison between the features.
- The second visualization, previously presented as a bubble chart, was remade as a bar chart that later is transformed into a scatterplot, to solve several of the problems pointed out in the feedback, such as lack of clarity, choice of colors, and so on. 
- Finally, in the arc chart, some changes were made following the feedback received: the text explaining the metrics (now available in the initial part of the project) was replaced by information from the artist of the selected song, in addition to comparisons of the features of the selected song with the average values of that artist. Some suggestions like adding the functionality of a music player and a search by artist instead of by tracks are being eval for future work.

![Arc Features Chart](https://github.com/fgv-vis-2023/final-project-soundscapes/blob/main/assets/features-chart.png)

## 🛈 Sources and References
- Data set: [Top Hits Spotify from 2000-2019 | Kaggle](https://www.kaggle.com/datasets/paradisejoy/top-hits-spotify-from-20002019)
- [Donut Chart](https://d3-graph-gallery.com/donut.html)
- [Search Bar](https://dev.to/am20dipi/how-to-build-a-simple-search-bar-in-javascript-4onf)
- [D3.js](https://d3js.org/)
- [Adobe Color's Color Wheel](https://color.adobe.com/pt/create/color-wheel)
- [Background Image by Freepik](https://www.freepik.com/free-vector/green-background-with-sound-wave_1106707.htm#query=sound%20background&position=0&from_view=search&track=ais)
- [Spotify Animation Logo by Dribbble](https://dribbble.com/shots/15988331-Spotify-Animation)
