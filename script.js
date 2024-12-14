var isLight = false; 
let lastKeyTime = 0;
let keyArray = [];
let gameStarted = false;
const code = "8045"

document.getElementById("darklight").addEventListener("click", () => {
    if(!isLight) {
        isLight = true;
        document.getElementById("body").classList.add("light");
        document.getElementById("mypic").src="images/mesomeedit.png";
    } else {
        isLight = false;
        document.getElementById("body").classList.remove("light");
        document.getElementById("mypic").src="images/menoedit.jpg";
    }
})

window.addEventListener("keyup", e => {
    let key = e.key.toLowerCase();
    let currentKeyTime = Date.now();

    if (key === "Escape" && gameStarted) endGame();

    if(lastKeyTime != 0 && currentKeyTime - lastKeyTime > 1500){
        keyArray = [];
    }

    keyArray.push(key);

    if(keyArray.join('') === code){
        createGame();
    }

    lastKeyTime = currentKeyTime;
})

function createGame(){

    gameStarted = true;
    let elem = document.createElement("img");
    elem.setAttribute("src", "images/computer.png");
    elem.setAttribute("height", "16");
    elem.setAttribute("width", "16");
    document.getElementById("nav").appendChild(elem);

    elem = document.createElement("img");
    elem.classList.add("bug");
    elem.setAttribute("src", "images/bug.png");
    elem.setAttribute("height", "16");
    elem.setAttribute("width", "16");
    let bigList = document.querySelectorAll("nav h3");
    for (i = 0; i < bigList.length; i++) {
        bigList[i].appendChild(elem.cloneNode(true))
    }
    runGame();
}

function endGame() {
    gameStarted = false;
    let smallList = document.querySelectorAll(".bug");
} 

function runGame(){
    while(gameStarted){
        let smallList = document.querySelectorAll(".bug");
        for (i = 0; i < smallList.length; i++) {
            //make them chase
        }
    }
}

function doElsCollide (el1, el2) {
    el1.offsetBottom = el1.offsetTop + el1.offsetHeight;
    el1.offsetRight = el1.offsetLeft + el1.offsetWidth;
    el2.offsetBottom = el2.offsetTop + el2.offsetHeight;
    el2.offsetRight = el2.offsetLeft + el2.offsetWidth;

    return !((el1.offsetBottom < el2.offsetTop) ||
             (el1.offsetTop > el2.offsetBottom) ||
             (el1.offsetRight < el2.offsetLeft) ||
             (el1.offsetLeft > el2.offsetRight))
};
