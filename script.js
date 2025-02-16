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
let swordScore = 100; //allowing for gains with upgrades (also yes more items coming)
let score = killScore = totalHit = 0;
let wave = 1;
let movementIncrement = 3;
let bugMovement = 2;
let playerSize = 16;
let playerX = playerY = hitsTaken = 0;
let goingUp = goingDown = goingLeft = goingRight = false;
let tutorialText = "Move your character with WASD.  Attack with your L key.  Go!"
const setWaves = ["0200", "0001", "11011", "11121", "12001001" , "112112121" , "211211111"]; //will make a text parser for this soon, what a win for mutable arrays lol
let waves = setWaves;
let paused = endScreen = endCool = false;
let webArray = [];

if (!localStorage.getItem("highscore")) localStorage.setItem("highscore", "0")

animateHero();

document.getElementById("darklight").addEventListener("click", () => {
    if (safetySwitch) return;
    let currentSwitchHit = Date.now();
    let audio = new Audio('audio/switchsound.mp3');
    audio.volume = .7;
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

    if (key === "escape" && paused) unPause();
    if (key === "escape" && gameStarted && !paused) displayPauseScreen();
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
    if(keyArray.join('') === code && !gameStarted){ //will add some goofy cheat code i think, current here as testing tool
        createGame();
    }

    if(endScreen && endCool) unPause();

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
        document.getElementById("heropic").style.imageRendering = "pixelated"
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
    document.documentElement.style.transition = ".75s"
    let scrollbarWidth = 17; //default on windows chrome
    if (navigator.userAgent.indexOf("Mac") != -1) scrollbarWidth = 16; //default on mac. this 1 pixel matters to ME.
    document.documentElement.style.marginRight = "-" + scrollbarWidth + "px"
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
    document.documentElement.style.transition = "0s"
    document.documentElement.style.marginRight = "0px"
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
    skiptext.classList.add("blinking")
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
            if(!gameStarted) swingSword();
        }, 8000);
        let pauseCount = 0;
        for(let i = 0; i < tutorialText.length; i++) {
            setTimeout(() => {
                jigglePlayer(i)
            }, 3300 + i*500);
            if (tutorialText.charAt(i) === (" ") && tutorialText.charAt(i + 1) === (" ")) pauseCount++;
            setTimeout(() => {
                if (gameStarted) return;
                if(!document.getElementById("splashtext")) return;
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
                elem2.style.top = (screen.availHeight / 4 - 60) +"px"
                break;
            case 1:
                elem2.style.left = (spriteSize/1.5 + 60) + "px"
                break;
            case 2:
                elem2.style.top = (screen.availHeight / 4 + 60) +"px"
                break;
            case 3:
                elem2.style.left = (spriteSize/1.5 - 60) + "px"
                break;  
            case 4:
                elem2.style.top = (screen.availHeight / 4) +"px"
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
        if (!gameStarted) drySplash();
    }, 12000);

    function drySplash(){
        if(gameStarted){
            setTimeout(() => { //attempt to stop bug with not removing text 
                elem.remove();
                elem2.remove();
                splashtext.remove();
            }, 50)
            return;
        }  //potential failure to remove keypress, investigate
        document.removeEventListener("keypress", e => {
            if (e.code == "Space") {
                e.preventDefault();
                drySplash();
            }
        });
        splash.style.opacity = "0.7"
        elem.style.transition = ".5s";
        elem2.style.transition = ".5s";
        splashtext.style.transition = ".5s";
        elem.style.opacity = "0";
        elem2.style.opacity = "0";
        splashtext.style.opacity = "0";
        skiptext.remove();
        setTimeout(() => {
            elem.remove();
            elem2.remove();
            splashtext.remove();
        }, 500)
        clearTimeout(autoPlay);
        createGame();
        
    }
        
    document.addEventListener("keypress", e => {
        if(gameStarted) return;
        if (e.code == "Space") {
            e.preventDefault();
            drySplash();
        }
    })
}

function createGame(){
    window.scrollTo({top: 0, behavior: "instant"})
    gameStarted = true;
    let elem = document.createElement("img");
    elem.style.imageRendering = "pixelated";
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

    let splashlist = document.getElementsByClassName("splashelem") //redundancies to patch old text bug
    for(let i = 0; i < splashlist.length; i++){
        splashlist[i].remove();
    }
    let skip = document.getElementById("skiptext");
    if (skip) skip.remove();

    displayHealth();
    displayScore();
    displayWave();

    processWave(3);

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
    paused = endScreen = endCool = false;
    score = 0;
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
    bugSpray("spider");
    bugSpray("armorbug");
    bugSpray("web");
    document.getElementById("score").remove();
    if(document.getElementById("heart")) document.getElementById("heart").remove();
    document.getElementById("wave").remove();
    document.getElementById("sword").remove();
    goingUp = goingDown = goingLeft = goingRight = false;
    setTimeout(() => {
        hitsTaken = 0;
    }, 1000)
    resetWaves();
} 

function displayPauseScreen(){ //handles end as well
    if(paused) return;
    document.getElementById("splash").style.zIndex = "2000"
    document.getElementById("splash").style.opacity = ".9"
    document.getElementById("score").style.zIndex = "2001"
    let elem = document.createElement("p");
    elem.id = "pausetext";
    elem.style.fontSize = playerSize * 2 + "px"
    elem.textContent = "Your game is paused. Press esc again to unpause."
    document.body.append(elem);
    if(endScreen) {
        if(Number(localStorage.getItem("highscore")) < score) localStorage.setItem("highscore", score.toString())
        console.log("highscore is " + localStorage.getItem("highscore"));
        elem.textContent = "GAME OVER."
        let elem2 = document.createElement("p");
        elem2.textContent = "HIGHSCORE: " + localStorage.getItem("highscore");
        elem.appendChild(elem2)
        elem2.style.position = "relative";
        elem2.style.marginTop = playerSize + "px";
        let elem3 = document.createElement("p")
        elem3.textContent = "press any key to exit"
        elem3.classList.add("blinking")
        elem3.style.position = "fixed"
        elem3.style.bottom = "50px"
        setTimeout(()=> {
            endCool = true;
            elem.appendChild(elem3)
            elem3.style.left = (window.innerWidth / 2) - (elem3.offsetWidth / 2) + "px";
        }, 1000) //need to be dead for 1 sec to restart
    }
    elem.style.left = (window.innerWidth / 2) - (elem.offsetWidth / 2) + "px";
    paused = true;
}

function unPause(){
    document.getElementById("splash").style.zIndex = "999"
    document.getElementById("score").style.zIndex = "1000"
    document.getElementById("splash").style.opacity = ".7"
    document.getElementById("pausetext").remove();
    setTimeout(() => {
        paused = false;
    }, 600)
    if(endScreen) endGame();
}

function resetWaves(){
    waves = setWaves;
    wave = 1;
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
            if (paused) return;
            moveBugs()
            if (goingUp) movePlayer(0, -movementIncrement);
            if (goingDown) movePlayer(0, movementIncrement);
            if (goingLeft) movePlayer(-movementIncrement, 0);
            if (goingRight) movePlayer(movementIncrement, 0);
            updateSwordPos();
            checkPlayerCollision();
            if (!gameStarted) clearInterval(gameTicks);
        }
}

function moveBugs(){
    let smallList = document.querySelectorAll(".bug");
    if(smallList){
        for (i = 0; i < smallList.length; i++) {
            moveBug(smallList[i])
        }
    }
    smallList = document.querySelectorAll(".armorbug");
    if(smallList){
        for (i = 0; i < smallList.length; i++) { //could use return to make some odd freezing enemies
            if(smallList[i].classList.contains("bug")) continue; //no double speed if so. interesting bug to use later?
            moveBug(smallList[i])
        }
    }
    smallList = document.querySelectorAll(".spider");
    if(smallList){
        for (i = 0; i < smallList.length; i++) { //then check range 
            if(smallList[i].classList.contains("inrange")) {
                rangeAcquired(elem);
                return;
            }
            lookAtPlayer(smallList[i])
            moveSpider(smallList[i])
        };
    }
    smallList = webArray;
    if(smallList.length > 0){
        for (i = smallList.length - 1; i >= 0; i--){ 
            smallList[i][1] = smallList[i][1] - 1;
            let web = smallList[i][0];
            if(smallList[i][1] < 1){
                    if (smallList[i][1] < -92) {
                        web.remove();
                        webArray.splice(i, 1);
                    }
                continue;
            }
            let angle = smallList[i][2];
            let speed = smallList[i][1] * bugMovement;
            web.style.top = Number(web.style.top.substring(0, web.style.top.length-2)) + speed * Math.sin(angle) + "px";
            web.style.left = Number(web.style.left.substring(0, web.style.left.length-2)) + speed * Math.cos(angle) + "px";
        }
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
    totalHit = 0;
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
        killScore = totalHit * 100;
        if(totalHit > 1){
            killScore *= (1.25 ** totalHit)
            displayCombo(totalHit, "Sword")
        }
        if(totalHit > 0 && Math.random() * 100 * ((1.25 ** totalHit)) > 90) spawnHeart();
        score += Math.floor(killScore);
        if (gameStarted) displayScore();
    }, frameTime*4)


    lastSwingTime = currentSwingTime;
}

function randomAudioPitch(audioName){
    let audio = new Audio(audioName);
    let pitchShift = (Math.random() * .2 - .1); //avoids non-finite bugs when defined first
    audio.playbackRate = 1 + pitchShift;
    audio.preservesPitch = false;
    audio.play();
}

function checkSwordCollision(){
    let bugList = document.getElementsByClassName("bug");
    let sword = document.getElementById("sword");
    for(let i = 0; i < bugList.length; i++) {
        if (doElsCollide(bugList[i], sword)) {
            totalHit++;
            bugList[i].remove();
            processWave(1);
            let audio = new Audio('audio/swordhit.mp3');
            audio.play();
        }
    } //add diff sounds for combo kills, detach from individual hits?
    bugList = document.getElementsByClassName("armorbug");
    for(let i = 0; i < bugList.length; i++) {
        if (doElsCollide(bugList[i], sword)) { //dont up hit because no kill, refactor?
            let tempRef = bugList[i];
            setTimeout(()=> { //need invuln through rest of sword swing
                tempRef.classList.add("bug"); //dont remove from armorbug, might use for tracking data
            }, 200)
            bugList[i].src = ("images/enemies/bug.png"); 
            let audio = new Audio('audio/armorhit.mp3');
            audio.play();
        }
    }
    bugList = document.getElementsByClassName("spider");
    for(let i = 0; i < bugList.length; i++) {
        if (doElsCollide(bugList[i], sword)) {
            totalHit++;
            bugList[i].remove();
            processWave(1);
            let audio = new Audio('audio/swordhit.mp3');
            audio.play();
        }
    }
}

function spawnNewBug(type){
    let bugType = matchBug(type);
    elem = document.createElement("img");
    elem.style.position = "absolute";
    elem.style.imageRendering = "pixelated";
    elem.style.zIndex = "1001"; 
    elem.setAttribute("src", "images/enemies/" + bugType + ".png");   
    elem.classList.add(bugType);
    elem.classList.add("enemy")
    if(Math.random() < .5) { //top or bottom
        elem.style.left = (window.innerWidth/10)*(Math.random() * 10) + "px";
        if (Math.random() < .5) elem.style.top = "0px";
        else elem.style.top = window.innerHeight + "px";
    } else { //left or right
        elem.style.top = (window.innerHeight/10)*(Math.random() * 10) + "px";
        if (Math.random() < .5) elem.style.left = "0px";
        else elem.style.right = "0px";
    }
    let bugSize = playerSize + Math.trunc(Math.random() * (playerSize/2))
    elem.setAttribute("width", bugSize);
    if (bugType === "spider") elem.setAttribute("width", 2*bugSize);
    document.getElementById("body").prepend(elem.cloneNode(true))
}

function matchBug(type){
    switch(type) {
        case 0:
            return "bug"
        case 1: 
            return "armorbug"
        case 2: 
            return "spider"
    }
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
    elem.style.position = "fixed"
    if (currentX > playerX) elem.style.left = currentX - bugMovement + "px";
    else if (currentX < playerX) elem.style.left = currentX + bugMovement + "px";
    if (currentY > playerY) elem.style.top = currentY - bugMovement + "px";
    else if (currentY < playerY) elem.style.top = currentY + bugMovement + "px";
}

function moveSpider(elem){ 
    let currentX = elem.offsetLeft;
    let currentY = elem.offsetTop;
    if (Math.abs(currentX - playerX) < bugMovement * 40 && Math.abs(currentY - playerY) < bugMovement * 40){
        rangeAcquired(elem);
        return;
    } 

    elem.style.position = "fixed"
    if (currentX > playerX) elem.style.left = currentX - bugMovement + "px";
    else if (currentX < playerX) elem.style.left = currentX + bugMovement + "px";
    if (currentY > playerY) elem.style.top = currentY - bugMovement + "px";
    else if (currentY < playerY) elem.style.top = currentY + bugMovement + "px";
}

function lookAtPlayer(elem){
    let position = elem.getBoundingClientRect();
    let currentX = position.left;
    let currentY = position.top;
    let angle = Math.atan2(playerX - currentX, - (playerY - currentY) )*(180 / Math.PI);      
    elem.style.transform = "rotate(" + angle + "deg)";  
}

function rangeAcquired(elem){
    if(elem.classList.contains("spidercooldown")) return;
    elem.classList.add("inrange");
    elem.classList.add("spidercooldown");
    let position = elem.getBoundingClientRect();
    let currentX = position.left;
    let currentY = position.top;
    let angle = Math.atan2(playerX - currentX, - (playerY - currentY)) * (180 / Math.PI);      
    elem.style.transition = "1s"
    elem.style.transform = "rotate(" + angle + "deg) scale(4, 0.4)";  
    fireWeb(angle, elem)
    elem.classList.remove("inrange")
    setTimeout(() => {
        elem.style.transition = ".5s"
        elem.style.transform = "rotate(" + angle + "deg) scale(4, 0.4)"
        setTimeout(() => {
            elem.style.transition = "0s"
        }, 500)
    }, 1000);  
    setTimeout(() => {
        elem.classList.remove("spidercooldown")
    }, 3000);
}

function fireWeb(angle, spiderElem){ //make the web go in some array. basically it'll be the elem and then a value that lets the movement method know speed (maybe like 8 starting, then we use same speed calc. we also save angle for same purpose. once 0 & neg, no move. once 90x frametime, kill it. :) 
    let startingX = spiderElem.offsetLeft;
    let startingY = spiderElem.offsetTop;
    let elem = document.createElement("img")
    elem.src = "images/spiderweb.png"
    elem.style.zIndex = "1000"
    elem.style.height =  playerSize*1.5 + "px"
    elem.style.position = "fixed";
    elem.style.top = startingY + "px";
    elem.style.left = startingX + "px";
    elem.style.imageRendering = "pixelated";
    elem.classList.add("web")
    document.body.append(elem);

    webArray.push([elem, 9, angle]);
}

function checkPlayerCollision(){
    let bugList = document.getElementsByClassName("bug");
    let player = document.getElementById("player");
        for(let i = 0; i < bugList.length; i++) {
            if (doElsCollide(bugList[i], player)) {
                processDamage();
            }
        }
        bugList = document.getElementsByClassName("armorbug");
        for(let i = 0; i < bugList.length; i++) {
            if (bugList[i].classList.contains("bug")) break;
            if (doElsCollide(bugList[i], player)) {
                processDamage();
            }
        }
        bugList = document.getElementsByClassName("web");
        for(let i = 0; i < bugList.length; i++) {
            if (doElsCollide(bugList[i], player)) {
                processWeb();
                bugList[i].remove();
            }
        }
        if(document.getElementById("heart") && doElsCollide(player, document.getElementById("heart"))) processHeart();
}

function displayHealth(){
    bugSpray("heart")

    let fullHearts = maxLives - hitsTaken;
    let emptyHearts = hitsTaken;
    let elem = document.createElement("img")
    elem.classList.add("heart")
    elem.setAttribute("src", "images/fullheart.png")
    elem.style.height = playerSize*2 + "px";
    elem.style.imageRendering = "pixelated";
    for(let i = 0; i < fullHearts; i++){
        elem.style.left = 50 + i*(playerSize*2 + 10) + "px";
        document.body.append(elem.cloneNode(true));
    }
    for(let i = 0; i < emptyHearts; i++){
        elem.style.left = 50 + (fullHearts)*(playerSize*2 + 10) +  i*(playerSize*2 + 10) + "px";
        elem.setAttribute("src", "images/emptyheart.png")
        document.body.append(elem.cloneNode(true));
    }
    
}
//future refactor for this to not call create more than one
function createScore(){
    let elem = document.createElement("p");
    elem.id = "score"
    elem.classList.add("scoreelem")
    elem.style.fontSize = playerSize*2 + "px";
    document.body.prepend(elem.cloneNode(true))
}

function displayScore(){
    let scoreElem = document.getElementById("score");
    if(!scoreElem) {
        createScore();
        scoreElem = document.getElementById("score");
    }
    scoreElem.textContent = score;
}

function createWave(){
    let elem = document.createElement("p");
    elem.id = "wave"
    elem.classList.add("scoreelem")
    elem.style.fontSize = playerSize + "px";
    elem.style.marginTop = "30px";
    document.body.prepend(elem.cloneNode(true))
}

function displayScore(){
    let scoreElem = document.getElementById("score");
    if(!scoreElem) {
        createScore();
        scoreElem = document.getElementById("score");
    }
    scoreElem.textContent = score;
}

function displayWave(){
    let waveElem = document.getElementById("wave");
    if(!waveElem) {
        createWave();
        waveElem = document.getElementById("wave");
    }
    waveElem.textContent = "Wave " + wave; //debating have wave 0/1 be "tutorial"
}

function displayCombo(combo, weapon){ //need to handle multiple combos, fade old, scroll? cap at ~3 combos shown?
    let elem = document.createElement("p");
    elem.style.fontSize = playerSize*2 + "px";
    elem.style.marginTop = "130px"; //temp
    elem.style.opacity = "1"
    elem.textContent = "+" + combo + "x " + weapon + " Combo!"
    if(weapon === "heart") elem.textContent = "Extra Heart Bonus!"
    if(weapon === "gameover") elem.textContent = "LAST WAVE CLEARED"
    if(document.getElementsByClassName("scoreElem") && document.getElementsByClassName("scoreElem").length > 0 ){
        let scoreElems = document.getElementsByClassName("scoreElem");
        if (scoreElems.length > 2) {
            elem.style.marginTop = "230px"
            scoreElems[1].style.marginTop = "130px"
            scoreElems[2].style.marginTop = "180px"
            scoreElems[0].remove(); //always first in, because we use append and its doc order
        } else if (scoreElems.length == 2) {
            elem.style.marginTop = "230px"
        } else {
            elem.style.marginTop = "180px"
        }
    } 
    elem.classList.add("scoreelem")
    document.body.append(elem)
    elem.style.transition = "3s"
    // elem.style.opacity = "0"
    setTimeout(() => {
        elem.remove();
    }, 3000) 
}

function spawnHeart(){
    if(document.getElementById("heart")) return; //stopping weird dupe spawns
    let elem = document.createElement("img");
    elem.style.imageRendering = "pixelated";
    elem.src = "images/addheart.png"
    elem.style.height = playerSize + "px";
    elem.style.position = "fixed";
    elem.id = "heart"
    elem.style.zIndex = 1000;
    elem.style.left = (window.innerWidth/5)*(Math.random() * 3) + (window.innerWidth/5) + "px";
    elem.style.top = (window.innerHeight/5)*(Math.random() * 3) + (window.innerHeight/5) + "px";
    document.body.append(elem);
}

function processHeart() {
    document.getElementById("heart").remove();
    if(hitsTaken > 0) {
        hitsTaken = 0;
        displayHealth();
        return;
    }
    if(maxLives < 5){
        maxLives++;
        displayHealth();
        return;
    }
    displayCombo(0, "heart");
    score += 3000; //hardcode for now lol
    displayScore();
}

function processWave(num){
    if(waves[wave-1].length == 0 && waves.length == wave) {
        displayCombo(1, "gameover")
        return;
    }
    if (waves[wave - 1].length == 0 && document.getElementsByClassName("enemy").length == 0) {
        wave++;
        processWave(3);
    };
    for(let i = 0; i < num; i++){
        if(waves[wave - 1].length == 0) break; //designed to not allow overflow across waves. 
        let char = waves[wave - 1].charAt(0);
        setTimeout(spawnNewBug(Number(char)))
        waves[wave - 1] = waves[wave - 1].substring(1);
    } 
    displayWave();
}

function processDamage(){
    let currentHurtTime = Date.now();
    if (currentHurtTime - lastHurtTime < frameTime * 10) return;
    hitsTaken++;
    displayHealth();
    if (hitsTaken >= maxLives) {
        let audio = new Audio('audio/gameover.mp3'); 
        audio.play();
        endScreen = true;
        displayPauseScreen();
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

function processWeb(){
    if(document.getElementById("player").classList.contains("slowed")) return;
    document.getElementById("player").classList.add("slowed")
    
    movementIncrement = Math.trunc(window.innerWidth * .003); 

    setTimeout(() => {
        document.getElementById("player").classList.remove("slowed")
        movementIncrement = Math.trunc(window.innerWidth * .006); 
    }, 3000)
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
