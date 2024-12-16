var isLight = false; 
let lastKeyTime = lastSwingTime = lastHurtTime = 0;
let keyArray = [];
let gameStarted = false;
const code = "8045"
const swingCooldown = 500;
const frameTime = 100;
const maxLives = 3;
let movementIncrement = 3;
let bugMovement = 2;
let playerSize = 16;
let playerX = playerY = hitsTaken = 0;
let goingUp = goingDown = goingLeft = goingRight = false;

document.getElementById("darklight").addEventListener("click", () => {
    let audio = new Audio('audio/switchsound.mp3');
    audio.play();
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

    if (key === "escape" && gameStarted) endGame();
    if (gameStarted) {
        switch (key) {
            case "w":
                goingUp = false;
                break;
            case "s":
                goingDown = false;
                break;
            case "a":
                goingLeft = false;
                break;
            case "d":
                goingRight = false;
                break;
        }
    }
    if (gameStarted && key === "l") {
        e.preventDefault();
        swingSword();
    };

    if(lastKeyTime != 0 && currentKeyTime - lastKeyTime > 1500){
        keyArray = [];
    }

    keyArray.push(key);

    if(keyArray.length > 4) keyArray = keyArray.slice(keyArray.length - 4);
    if(keyArray.join('') === code && !gameStarted){
        createGame();
    }

    lastKeyTime = currentKeyTime;
})

window.addEventListener("keydown", e =>{
    let key = e.key.toLowerCase();
    if (gameStarted) {
        switch (key) {
            case "w":
                goingUp = true;
                goingDown = false;
                break;
            case "s":
                goingDown = true;
                goingUp = false;
                break;
            case "a":
                goingLeft = true;
                goingRight = false;
                break;
            case "d":
                goingRight = true;
                goingLeft = false;
                break;
        }
    }
})

function createGame(){
    gameStarted = true;
    let elem = document.createElement("img");
    adjustSpriteSize();
    elem.setAttribute("src", "images/computer.png");
    elem.setAttribute("id", "player");
    elem.setAttribute("height", playerSize.toString());
    elem.setAttribute("width", playerSize.toString());
    elem.style.position = "absolute";
    let startingLeft = window.innerWidth / 2;
    elem.style.left = startingLeft + "px";
    elem.style.top = "300px";
    elem.style.zIndex = "2";
    document.getElementById("body").prepend(elem);

    elem = document.createElement("img");
    elem.style.position = "absolute";
    elem.setAttribute("src", "images/bug.png");
    for (i = 0; i < 5; i++) {      
        elem.classList.add("bug");
        elem.style.left = 100*i + "px";
        elem.style.top = "200px";
        let bugSize = playerSize + Math.trunc(Math.random() * (playerSize/2))
        elem.setAttribute("height", bugSize);
        elem.setAttribute("width", bugSize);
        document.getElementById("body").prepend(elem.cloneNode(true))
    }

    elem = document.createElement("img");
    elem.setAttribute("src", "images/swordbase.png");
    elem.setAttribute("id", "sword");
    elem.setAttribute("height", playerSize.toString());
    elem.setAttribute("width", playerSize.toString());
    elem.style.position = "absolute";
    elem.style.left = startingLeft + playerSize + "px";
    elem.style.top = "300px";
    elem.style.zIndex = "2";
    document.getElementById("body").prepend(elem);

    runGame();
}

function endGame() {
    gameStarted = false;
    hitsTaken = 0;
    let elem = document.getElementById("player");
    elem.remove();
    bugSpray();
    elem = document.getElementById("sword");
    elem.remove();
} 

function bugSpray() { //needed more iterations, potential bug with movement interfering w/deletion
    let bugList = document.getElementsByClassName("bug");
    for(let i = 0; i < 5; i++){
        for(let j = 0; j < bugList.length; j++) {
            bugList[j].remove();
        }
    }
}

function runGame(){
    adjustPlayerPos();
    let gameTicks = setInterval(gameLogic, frameTime);
        function gameLogic() {
            let smallList = document.querySelectorAll(".bug");
            for (i = 0; i < smallList.length; i++) {
                moveBug(smallList[i])
            }
            if (goingUp) movePlayer(0, -movementIncrement);
            if (goingDown) movePlayer(0, movementIncrement);
            if (goingLeft) movePlayer(-movementIncrement, 0);
            if (goingRight) movePlayer(movementIncrement, 0);
            updateSwordPos();
            checkPlayerCollision();
            if (!gameStarted) clearInterval(gameTicks);
        }
}

function adjustSpriteSize(){
    playerSize = Math.trunc(window.innerWidth * .016); 
    movementIncrement = Math.trunc(window.innerWidth * .006); 
    bugMovement = Math.trunc(movementIncrement * .65); 
}

function adjustPlayerPos(){
    let elem = document.getElementById("player");
    let position = elem.getBoundingClientRect();
    playerX = position.left;
    playerY = position.top;
}

function updateSwordPos(){
    let elem = document.getElementById("sword");
    if(goingRight){
        elem.classList.remove(...elem.classList);
        elem.classList.add("swordright");
        elem.style.left = playerX+ playerSize + "px";
        elem.style.top = playerY + "px";
    } else if(goingLeft){
        elem.classList.remove(...elem.classList);
        elem.classList.add("swordleft");
        elem.style.left = playerX - playerSize + "px";
        elem.style.top = playerY + "px";
    } else if(goingUp){
        elem.classList.remove(...elem.classList);
        elem.classList.add("swordup");
        elem.style.left = playerX + "px";
        elem.style.top = playerY - playerSize + "px";
    } else if (goingDown){
        elem.classList.remove(...elem.classList);
        elem.classList.add("sworddown");
        elem.style.left = playerX + "px";
        elem.style.top = playerY + playerSize + "px";
    } 

}

function swingSword(){
    let currentSwingTime = Date.now();
    if (currentSwingTime - lastSwingTime < swingCooldown) return;
    let elem = document.getElementById("sword")
    
    let audio = new Audio('audio/swordswing.mp3');
    audio.play();
    
    elem.setAttribute("src", "images/swingframes/1.png")
    setTimeout(() => {
        elem.setAttribute("src", "images/swingframes/2.png")
    }, frameTime)
    setTimeout(() => {
        elem.setAttribute("src", "images/swingframes/3.png")
        checkSwordCollision();
    }, frameTime*2)
    setTimeout(() => {
        elem.setAttribute("src", "images/swingframes/4.png")
        checkSwordCollision();
    }, frameTime*3)
    setTimeout(() => {
        elem.setAttribute("src", "images/swordbase.png")
        checkSwordCollision();
    }, frameTime*4)

    lastSwingTime = currentSwingTime;
}

function checkSwordCollision(){
    let bugList = document.getElementsByClassName("bug");
    let sword = document.getElementById("sword");
        for(let i = 0; i < bugList.length; i++) {
            if (doElsCollide(bugList[i], sword)) {
                bugList[i].remove();
                spawnNewBug();
                let audio = new Audio('audio/swordhit.mp3');
                audio.play();
            }
        }
}

function spawnNewBug(){
    elem = document.createElement("img");
    elem.style.position = "absolute";
    elem.setAttribute("src", "images/bug.png");   
    elem.classList.add("bug");
    if(Math.random() < .5) { //top or bottom
        elem.style.left = (window.innerWidth/10)*(Math.random() * 10) + "px";
        if (Math.random() < .5) elem.style.top = "0px";
        else elem.style.top = window.innerHeight + "px";
    } else { //left or right
        elem.style.top = (window.innerHeight/10)*(Math.random() * 10) + "px";
        if (Math.random() < .5) elem.style.left = "0px";
        else elem.style.left = window.innerWidth + "px";
    }
    let bugSize = playerSize + Math.trunc(Math.random() * (playerSize/2))
    elem.setAttribute("height", bugSize);
    elem.setAttribute("width", bugSize);
    document.getElementById("body").prepend(elem.cloneNode(true))
}

function movePlayer(x, y){  
    adjustPlayerPos();
    let elem = document.getElementById("player");  
    if (x != 0 && playerX + x >= 0 && playerX + x + playerSize*2.5 <= window.innerWidth + playerSize) {
        elem.style.left = playerX + x + "px";
        elem.style.top = playerY + "px";
    }
    else if (y != 0 && playerY + y >= 0 && playerY + y <= window.innerHeight + playerSize) {
        elem.style.left = playerX + "px";
        elem.style.top = playerY + y + "px";
    }
}

function moveBug(elem){    
    let position = elem.getBoundingClientRect();
    let bugSize = position.bottom - position.top; // unused atm, keeping for potential logic
    let currentX = position.left;
    let currentY = position.top;
    elem.style.position = "absolute"
    if (currentX > playerX) elem.style.left = currentX - bugMovement + "px";
    else if (currentX < playerX) elem.style.left = currentX + bugMovement + "px";
    if (currentY > playerY) elem.style.top = currentY - bugMovement + "px";
    else if (currentY < playerY) elem.style.top = currentY + bugMovement + "px";
}

function checkPlayerCollision(){
    let bugList = document.getElementsByClassName("bug");
    let player = document.getElementById("player");
        for(let i = 0; i < bugList.length; i++) {
            if (doElsCollide(bugList[i], player)) {
                processDamage();
            }
        }
}

function processDamage(){
    let currentHurtTime = Date.now();
    if (currentHurtTime - lastHurtTime < frameTime * 10) return;
    hitsTaken++;
    if (hitsTaken >= maxLives) {
        let audio = new Audio('audio/gameover.mp3'); 
        audio.play();
        endGame();
        return;
    }
    let player = document.getElementById("player");
    let audio = new Audio('audio/hurt.mp3'); 
    audio.volume = .3;
    audio.play();
    function hurtAnimation(){
        if (Date.now() - currentHurtTime > frameTime * 10) return;
        setTimeout(() => {
            player.setAttribute("src", "images/computerhurt.png")
        }, frameTime*2)
        setTimeout(() => {
            player.setAttribute("src", "images/computer.png")
            hurtAnimation()
        }, frameTime*4)
    }
    hurtAnimation()
    lastHurtTime = currentHurtTime;
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
