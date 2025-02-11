var isLight = false; 
let safetySwitch = false;
let spamHits = 0;
let lastKeyTime = lastSwingTime = lastHurtTime = lastSwitchHit = 0;
let keyArray = [];
let gameStarted = computerClicked = splashed =  false;
const code = "8045"
const swingCooldown = 500;
const frameTime = 100;
const blinkTime = 1000;
let maxLives = 3; //now can gain?
let movementIncrement = 3;
let bugMovement = 2;
let playerSize = 16;
let playerX = playerY = hitsTaken = 0;
let goingUp = goingDown = goingLeft = goingRight = false;
let tutorialText = "Move your character with WASD.  Attack with your L key.  Go!"

animateHero();

document.getElementById("darklight").addEventListener("click", () => {
    if (safetySwitch) return;
    let currentSwitchHit = Date.now();
    let audio = new Audio('audio/switchsound.mp3');
    audio.play();
    if(!isLight) {
        isLight = true;
        document.getElementById("body").classList.add("light");
    } else {
        isLight = false;
        document.getElementById("body").classList.remove("light");
    }
    if(currentSwitchHit - lastSwitchHit < 400) spamHits++;
    else spamHits = 0;
    lastSwitchHit = currentSwitchHit;

    if(spamHits >= 3) {
        safetySwitch = true;
        setTimeout(()=> {
            safetySwitch = false;
        }, 1000);
    }
})

document.getElementById("heropic").addEventListener("click", () => {
    if (computerClicked) return;
    computerClicked = true;
    heroTransition();
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
    if(keyArray.join('') === code && !gameStarted){ //will add some goofy cheat code i think
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

function animateHero(){
    let blink = false;
    let animation = setInterval(heroBlink, blinkTime)
        function heroBlink(){
            if (computerClicked) {
                clearInterval(animation);
                return;
            }
            if(blink) {
                document.getElementById("heropic").src = "images/computer/basecursor.png"
                blink = false;
            }
            else {
                document.getElementById("heropic").src = "images/computer/base.png"
                blink = true;
            }
        }
}

function heroTransition(){
    document.getElementById("heropic").classList.remove("default");
    document.getElementById("heropic").classList.add("yellow");
    let typeframes = 150
    let picFrames = ["sblink", "stblink", "stablink", "starblink", "startblink", "start"]
    for(let i = 0; i < 6; i++) { //less chunky code
        setTimeout(() => {
            document.getElementById("heropic").src = "images/computer/bc" + picFrames[i] + ".png"
        }, typeframes * (i + 1))
    }
    setTimeout(() => {
        document.getElementById("heropic").src = "images/computer/basecursor.png"
        document.getElementById("heropic").classList.remove("yellow");
        tutorialSplash();
    }, typeframes * 7)
}

function tutorialSplash(){
    if(splashed) return;
    splashed = true;
    document.documentElement.scrollTop = 0; 
    document.documentElement.style.overflowY = "hidden"
    elem = document.createElement("img");
    elem2 = document.createElement("img");
    let splash = document.createElement("div");
    let splashtext = document.createElement("p");
    let skiptext = document.createElement("img");
    document.body.append(splash);
    splash.id = "splash";
    
    const spriteSize = (screen.availWidth/6)

    elem.setAttribute("src", "images/swordbase.png");
    elem.id = "sword"
    elem.setAttribute("width", spriteSize.toString() + "px");
    elem2.setAttribute("src", "images/computer.png");
    elem2.setAttribute("width", spriteSize.toString() + "px");
    skiptext.setAttribute("src", "images/skiptext.png");
    skiptext.setAttribute("width", screen.availWidth*.44 + "px");
    elem.classList.add("splashelem")
    elem2.classList.add("splashelem")
    skiptext.classList.add("splashelem")
    splashtext.classList.add("splashelem")
    elem.style.right = (spriteSize/1.5) + "px";
    elem2.style.left = (spriteSize/1.5  ) + "px";
    splashtext.style.left = (spriteSize/1.5  ) + "px";
    skiptext.style.marginLeft = "auto";
    elem.style.top = screen.availHeight/4 + "px";
    elem2.style.top = screen.availHeight/4 + "px";
    skiptext.style.bottom = "50px";
    
    document.body.prepend(elem);
    document.body.prepend(elem2);
    document.body.prepend(skiptext);

    splashtext.setAttribute("maxwidth", (screen.availWidth - spriteSize) + "px")
    splashtext.setAttribute("id", "splashtext")
    splashtext.setAttribute("bottom", "100px")

    function runSplashText(){
        if(document.getElementById("splashtext")) return;
        document.body.prepend(splashtext);
        setTimeout(() => {
            swingSword();
        }, 8000);
        let pauseCount = 0;
        for(let i = 0; i < tutorialText.length; i++) {
            setTimeout(() => {
                jigglePlayer(i)
            }, 3300 + i*500);
            if (tutorialText.charAt(i) === (" ") && tutorialText.charAt(i + 1) === (" ")) pauseCount++;
            setTimeout(() => {
                if (gameStarted) return;
                splashtext.textContent = tutorialText.substring(0, i + 1);
                randomAudioPitch("audio/bloop.mp3")
            }, i*100 + pauseCount *2000)
        }
    }
    runSplashText();

    function resetPlayer(){
        elem2.style.left = (spriteSize/1.5 + 100) + "px"; //variables will soon be made
        elem2.style.top = (screen.availHeight / 4) + "px";
    }

    function jigglePlayer(dirnum){
        switch (dirnum) {
            case 0:
                elem2.style.top = (screen.availHeight / 4 - 20) +"px"
                break;
            case 1:
                elem2.style.left = (spriteSize/1.5 + 20) + "px"
                break;
            case 2:
                elem2.style.top = (screen.availHeight / 4 + 20) +"px"
                break;
            case 3:
                elem2.style.left = (spriteSize/1.5 - 20) + "px"
                break;  
        }
        // setTimeout(resetPlayer(), 250)
    }
    
    skiptext.id = "skiptext";
    
    setTimeout(() => {
        splash.style.opacity = "0.8";
        elem.style.opacity = "1";
        skiptext.style.opacity = ".3";
        elem2.style.opacity = "1";
        document.getElementById("scrollicon").style.animation = "5s infinite alternate bounce"
        document.getElementById("scrollicon").style.opacity = "0"
    }, 50); //trying to avoid lag killing transitions

    let autoPlay = setTimeout(() => {
        // if (!gameStarted) drySplash();
    }, 10000);

    function drySplash(){
        if(gameStarted) return; //potential failure to remove keypress, investigate
        document.removeEventListener("keypress", e => {
            if (e.code == "Space") {
                e.preventDefault();
                drySplash();
            }
        });
        splash.style.opacity = "0.6"
        elem.remove();
        elem2.remove();
        skiptext.remove();
        splashtext.remove();
        clearTimeout(autoPlay);
        createGame();
        
    }
        
    document.addEventListener("keypress", e => {
        if(gameStarted) return;
        if (e.code == "Space") {
            console.log();
            e.preventDefault();
            drySplash();
        }
    })
}

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
    elem.style.zIndex = "1001";
    document.getElementById("body").prepend(elem);

    displayHealth();

    elem = document.createElement("img");
    elem.style.position = "absolute";
    elem.setAttribute("src", "images/bug.png");
    for (i = 0; i < 5; i++) {      
        elem.classList.add("bug");
        elem.style.left = 100*i + "px";
        elem.style.top = "200px";
        elem.style.zIndex = "1001"; 
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
    elem.style.zIndex = "1001";
    document.getElementById("body").prepend(elem);

    runGame();
}

function endGame() {
    gameStarted = computerClicked = splashed = false;
    splash = document.getElementById("splash")
    setTimeout(() => {
        splash.remove();
    }, 600);
    splash.style.opacity = "0"
    document.getElementById("scrollicon").style.opacity = "1"
    document.getElementById("scrollicon").style.animation = "1s infinite alternate bounce"
    document.documentElement.style.overflowY = "scroll"
    document.getElementById("heropic").classList.add("default");
    animateHero(); //hero pic, not in-game hero :)
    let elem = document.getElementById("player");
    elem.remove();
    bugSpray("bug");
    bugSpray("heart");
    elem = document.getElementById("sword");
    elem.remove();
    goingUp = goingDown = goingLeft = goingRight = false;
    setTimeout(() => {
        hitsTaken = 0;
    }, 1000)
} 

function bugSpray(className) { //needed more iterations, potential bug with movement interfering w/deletion
    let bugList = document.getElementsByClassName(className);
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
    
    randomAudioPitch("audio/swordswing.mp3")

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

function randomAudioPitch(audioName){
    let audio = new Audio(audioName);
    let pitchShift = (Math.random() * .2 - .1); //avoids non-finite bugs
    audio.playbackRate = 1 + pitchShift;
    audio.preservesPitch = false;
    audio.play();
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
    elem.style.zIndex = "1001"; 
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

function displayHealth(){
    let bugList = document.getElementsByClassName("heart");
    for(let i = 0; i < 5; i++){
        for(let j = 0; j < bugList.length; j++) {
            bugList[j].remove();
        }
    }

    let fullHearts = maxLives - hitsTaken;
    let emptyHearts = hitsTaken;
    let elem = document.createElement("img")
    elem.classList.add("heart")
    elem.setAttribute("src", "images/fullheart.png")
    elem.style.position = "fixed";
    elem.style.zIndex = "1000";
    elem.style.bottom = "50px";
    elem.style.height = playerSize*2 + "px";
    for(let i = 0; i < fullHearts; i++){
        elem.style.left = 50 + i*(playerSize*2 + 10) + "px";
        document.body.append(elem.cloneNode(true));
    }
    for(let i = 0; i < emptyHearts; i++){
        elem.style.left = 50 + (fullHearts)*(playerSize*2) +  i*(playerSize*2) + "px";
        elem.setAttribute("src", "images/emptyheart.png")
        document.body.append(elem.cloneNode(true));
    }
    
}

function processDamage(){
    let currentHurtTime = Date.now();
    if (currentHurtTime - lastHurtTime < frameTime * 10) return;
    hitsTaken++;
    displayHealth();
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
