const header = document.getElementById("blackjackheader");
const playarea = document.getElementById("playarea");
const optionBar = document.getElementById("boptions");
const bottomBar = document.getElementById("bbottom");
const playHand = document.getElementById("phand");

function updatePosition() {
    const height3 = header.offsetHeight;
    playarea.style.height = window.innerHeight - height3 +"px"
    optionBar.style.bottom = bottomBar.offsetHeight + 10 + "px"
    playHand.style.bottom = bottomBar.offsetHeight + optionBar.offsetHeight + "px"
}

new ResizeObserver(updatePosition).observe(header);
updatePosition();