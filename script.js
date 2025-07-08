let currentSong=new Audio()
let songs;
async function getSongs(){
    let a = await fetch("http://127.0.0.1:3000/songs/")
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }

}
return songs
}
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
const playMusic=(track,pause=false)=>{  
    // plays one audio at a time
    currentSong.src="/songs/"+track
    if(!pause){
        currentSong.play()
        play.src="play.svg"
    }
    document.querySelector(".songinfo").innerHTML=track

}

async function main(){
    //get list of songs
    songs=await getSongs()
    playMusic(songs[0],true)
    play.src="pause.svg"
    //show all songs in playlist
    let songUL=document.querySelector(".songList").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML=songUL.innerHTML+`<li>
                            <img class="invert" src="music.svg" alt="">
                            <div class="info">
                                <div>${song}</div>
                                <div>Harry</div>
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
        let index=songs.indexOf(currentSong.src.split('/songs/')[1])
        if ((index-1)>=0) {
            playMusic(songs[index-1])
        }
        
    })
    //add event listener to next
    next.addEventListener("click",()=>{
        let index=songs.indexOf(currentSong.src.split('/songs/')[1])
        if ((index+1)<=songs.length-1) {
            playMusic(songs[index+1])
        }
        
    })

} 
main()