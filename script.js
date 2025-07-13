let currentSong=new Audio()
let songs
let currFolder

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


async function getSongs(folder){
    currFolder=folder
    // let a = await fetch(`http://127.0.0.1:3000/${folder}/`)
    let a = await fetch(`/${folder}/`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${currFolder}/`)[1])
        }

    }
        //show all songs in playlist
    let songUL=document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML=""
    for (const song of songs) {
        songUL.innerHTML=songUL.innerHTML+`<li>
                            <img class="invert" src="music.svg" alt="">
                            <div class="info">
                                <div> ${song.replaceAll("%20", " ")}</div>
                            </div>
                            <div class="playnow">
                                <span>play now</span>
                                <img class="invert"  src="play.svg" alt="">
                            </div>
                        </li>`
        
    }
    //attach eventListener
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click",()=>{
            playMusic(e.querySelector(".info").firstElementChild.innerHTML)
        })
    })

    return songs
}
const playMusic=(track,pause=false)=>{  
    // plays one audio at a time
    currentSong.src=`/${currFolder}/`+track
    if(!pause){
        currentSong.play()
        play.src="play.svg"
    }
    document.querySelector(".songinfo").innerHTML=decodeURI(track)

    
}
async function displayAlbums() {
    let a = await fetch(`/songs/`)
    // let a = await fetch(`http://127.0.0.1:3000/songs/`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors=div.getElementsByTagName("a")
    let cardContainer=document.querySelector(".cardContainer")
    let array=Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if(e.href.includes("/songs")){
            let folder=e.href.split(`/`).slice(-2)[0]
            // get metadata of folder
            let a = await fetch(`/songs/${folder}/info.json`)
            // let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`)
            let response = await a.json()
            cardContainer.innerHTML=cardContainer.innerHTML+`<div data-folder="${folder}" class="card">
                        <div class="play">
                            <img src="gplay.png" alt="">
                        </div>
                        <img src="/songs/${folder}/cover.jpg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`
        }
        
    }
    //add event listener to card for dynamic opening of files
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0], true)
            play.src = "pause.svg"
        })
    })

    

    
}
async function main(){
    //display all albums on page
    await displayAlbums()
    // //get list of songs
    // await getSongs("songs/ncm")

    //attach event listener to play,next and previous
    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src="play.svg"
        }
                else{
            currentSong.pause()
            play.src="pause.svg"
        }
    })
    //listen for time update event
    currentSong.addEventListener("timeupdate",()=>{
        document.querySelector(".songtime").innerHTML=`
        ${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration)*100+"%"
    })

    //add event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100
        document.querySelector(".circle").style.left=percent+"%"
        currentSong.currentTime=((currentSong.duration)*percent)/100
    })

    //add event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left="0"
    })

    //add event listener for close button
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left="-120%"
    })

    //add event listener to previous
    previous.addEventListener("click",()=>{
        let index=songs.indexOf(currentSong.src.split(`/${currFolder}/`)[1])
        if ((index-1)>=0) {
            playMusic(songs[index-1])
        }
        
    })
    //add event listener to next
    next.addEventListener("click",()=>{
        let index=songs.indexOf(currentSong.src.split(`/${currFolder}/`)[1])
        if ((index+1)<=songs.length-1) {
            playMusic(songs[index+1])
        }
        
    })

    //add an event listener to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        currentSong.volume=parseInt(e.target.value)/100
    })

    //add event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click",e=>{
        if(e.target.src.includes("volume.svg")){
            e.target.src=e.target.src.replace("volume.svg","mute.svg")
            currentSong.volume=0
            document.querySelector(".range").getElementsByTagName("input")[0].value=0
        }
        else{
           e.target.src=e.target.src.replace("mute.svg","volume.svg") 
           currentSong.volume=.10
           document.querySelector(".range").getElementsByTagName("input")[0].value=10
        }
    })
} 
main()