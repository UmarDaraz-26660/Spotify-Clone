

console.log("lets start the java script");
alert("Spotify Clone | By Dev Umar Daraz");
let currentsong = new Audio()
let songs
let currentfolder

//function to convert song time 
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currentfolder = folder
    const res = await fetch(`http://127.0.0.1:5500/${currentfolder}/`);
    const html = await res.text();

    // Temporary container to parse HTML
    const tmp = document.createElement("div");
    tmp.innerHTML = html;

    const links = tmp.getElementsByTagName("a");
    songs = [];

    for (let i = 0; i < links.length; i++) {
        const link = links[i];
        if (link.href.endsWith(".mp3")) {
            const songName = decodeURIComponent(link.href.split(`/${currentfolder}/`)[1]);
            songs.push(songName);
        }
    }

    // Add songs to the list
    const songUl = document.querySelector(".songlist ul");
    songUl.innerHTML = ""
    for (const song of songs) {
        const cleanName = song.replace(".mp3", " "); // remove file extension
        songUl.innerHTML += `<li data-filename="${song}">
                            <img class="invert" src="assets/images/music.svg" alt="">
                            <div class="info">
                                <div>${cleanName}</div>
                                <div>song artist </div>
                            </div>
                            <div class="playnow flex align-items">
                                <span>playnow</span>
                                <img class="invert" src="assets/images/play.svg" alt="">
                            </div>
                             </li>`;
    }


    // attatch an event listner to the song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            const filename = e.getAttribute("data-filename");
            console.log("Playing:", filename);
            playMusic(filename);
        });
    });


    return songs


}
const playMusic = (track, pause = false) => {
    // let audio =new Audio('/songs/' + track)
    currentsong.src = `/${currentfolder}/` + encodeURIComponent(track)
    if (!pause) {
        currentsong.play()
        play.src = 'assets/images/pause.svg'

    }


    document.querySelector('.songinfo').innerHTML = decodeURI(track)
    document.querySelector('.songtime').innerHTML = "00:00/00:00"





}



async function main() {

    // get songs 
    songs = await getSongs("songs/cs1");
    // play first song forever in seekbar
    playMusic(songs[0], true)











    // attatch event listner to play
    play.addEventListener('click', () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = 'assets/images/pause.svg'

        } else {
            currentsong.pause()
            play.src = 'assets/images/play.svg'


        }
    })
    // eventlistner for Song information update
    currentsong.addEventListener('timeupdate', () => {
        console.log(currentsong.currentTime, currentsong.duration)
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)}/${secondsToMinutesSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%"
    })

    // event listner to seekbar
    // document.querySelector(".seekbar").addEventListener("click ",e=>{
    //     console.log(e)

    //       let percent= (e.offsetX/e.target.getBoundingClientRect().width)*100;
    //        document.querySelector(".circle").style.left=percent + "%"



    // })
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration) * percent) / 100
    })

    // eventlistner to hamburger 
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = '0'
    })
    // eventlistner to close icon
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%"
    })



    // Add an event listener to previous
    previous.addEventListener("click", () => {
        currentsong.pause()
        console.log("Previous clicked")
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    // Add an event listener to next
    next.addEventListener("click", () => {
        currentsong.pause()
        console.log("Next clicked")

        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    // event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log(e.target, e.target.value)
        currentsong.volume = parseInt(e.target.value) / 100
    })


     // Add event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click", e=>{ 
        if(e.target.src.includes("assets/images/volume.svg")){
            e.target.src = e.target.src.replace("assets/images/volume.svg", "assets/images/mute.svg")
            currentsong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("assets/images/mute.svg", "assets/images/volume.svg")
            currentsong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }

    })

    // load the playlist whenever click on card
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        console.log(e)
        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);

        })
    })



}
main();






















