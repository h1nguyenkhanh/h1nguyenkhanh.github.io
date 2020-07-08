//Get canvas
const canvas = document.getElementById('game-screen');
const context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let translateX = 0;
//Get element
let startScreen = document.querySelector('.start-screen');
let startButton = document.querySelector('.start-button');
let overScreen = document.querySelector('.over-screen');
let againButton = document.querySelector('.again-button')
let pointScreen = document.querySelector('.point-screen');
let totalPoint = document.querySelector('.total-point');
//Game state
let gameState = 1;
let hardLevel = 0;
let maxLevel = 10;
let point = 0;
//BG
let lastUpdateBg = 0;
let timeUpdateBg = 1000 / 300;
//Bird
let timeUpdateBird = 1000 / 15;
let lastUpdateBird = 0;
let birdIndex = 0;
let birdX = canvas.width / 5;
let birdY = canvas.height / 2.1;
let speedFly = 7;
//Meteorites
let lastUpdateMeteorite = 0;
let timeUpdateMeteorite = 1000 / 7;
let spaceBeetwen = 300;
let countSpecialMeteo = 0;
let Meteorites = [];
let maxMeteorites = 25;
//Img
const background = new Image();
background.src = './PNG/game_background_2/game_background_2.png';
const birdImg = new Image();
birdImg.src = './PNG/bird.png';
const MeteoriteImg = new Image();
MeteoriteImg.src = './PNG/tt.png';

const birdCells = [
    {
        x: 38,
        y: 82,
        w: 293,
        h: 246
    },
    {
        x: 393,
        y: 80,
        w: 281,
        h: 249
    },
    {
        x: 747,
        y: 98,
        w: 296,
        h: 212
    },
    {
        x: 26,
        y: 491,
        w: 321,
        h: 104
    },
    {
        x: 375,
        y: 479,
        w: 319,
        h: 145
    },
    {
        x: 735,
        y: 464,
        w: 319,
        h: 178
    },
    {
        x: 43,
        y: 812,
        w: 288,
        h: 169
    },
    {
        x: 394,
        y: 815,
        w: 280,
        h: 144
    },
    {
        x: 751,
        y: 800,
        w: 283,
        h: 174
    }
]

const MeteoriteCells = [
    {
        x: 35,
        y: 41,
        w: 68,
        h: 63
    },
    {
        x: 151,
        y: 45,
        w: 82,
        h: 64
    },
    {
        x: 268,
        y: 37,
        w: 73,
        h: 72
    },
    {
        x: 388,
        y: 45,
        w: 68,
        h: 63
    },
    {
        x: 477,
        y: 29,
        w: 78,
        h: 77
    },
    {
        x: 56,
        y: 142,
        w: 73,
        h: 72
    },
    {
        x: 139,
        y: 138,
        w: 101,
        h: 74
    },
    {
        x: 246,
        y: 151,
        w: 82,
        h: 63
    },
    {
        x: 359,
        y: 136,
        w: 78,
        h: 77
    },
    {
        x: 442,
        y: 134,
        w: 78,
        h: 77
    },
    {
        x: 130,
        y: 253,
        w: 100,
        h: 74
    },
    {
        x: 230,
        y: 270,
        w: 82,
        h: 63
    },
    {
        x: 344,
        y: 271,
        w: 68,
        h: 62
    },
]

//Loaded
background.onload = function () {
    gameLoop();
}

//Add meteo
setInterval(() => {
    if (gameState === 2) {
        addRandomMeteorite();
    }
}, 100);

//Plus point
setInterval(() => {
    if (gameState === 2) {
        point++;
        pointScreen.innerHTML = point;
    }
}, 200);

//Click 
startButton.addEventListener('click', () => {
    gameState = 2;
    startScreen.style.display = 'none';
})
againButton.addEventListener('click', () => {
    gameState = 2;
    Meteorites = [];
    point = 0;
    hardLevel = 0;
    overScreen.style.display = 'none';
})

//Game loop
function gameLoop() {
    if (gameState === 1) {
        animationBackground();
        animationBird();
        updatePositionBird();
    }
    if (gameState === 2) {
        pointScreen.style.display = 'block';
        checkOver();
        animationBackground();
        animationBird();
        updatePositionBird();
        drawMeteorite();
        updateMeteorite();
    }
    if (gameState === 3) {
        pointScreen.style.display = 'none';
        if (point != 0) {
            totalPoint.innerHTML = point;
        }
        point = 0;
        countSpecialMeteo = 0;
        pointScreen.innerHTML = 0;
        overScreen.style.display = 'block';

    }
    requestAnimationFrame(gameLoop)


}
//Background
function animationBackground() {
    context.save();
    updateBackground();
    drawBackground()
    context.restore();
    // requestAnimationFrame(animationBackground);
}
function drawBackground() {
    context.translate(translateX, 0);
    context.drawImage(background, 0, 0, canvas.width, canvas.height);
    context.drawImage(background, canvas.width, 0, canvas.width, canvas.height);
}
function updateBackground() {
    let countTime = Date.now() - lastUpdateBg;    
    if (countTime >= timeUpdateBg) {
        translateX += -2;
        if (translateX <= -canvas.width) {
            translateX = 0;
        }
        lastUpdateBg = Date.now();
    }
}

//Bird
function animationBird() {
    updateBird();
    drawBird(birdCells[birdIndex]);
    // requestAnimationFrame(animationBird);
}
function drawBird(cell) {
    context.drawImage(birdImg, cell.x, cell.y, cell.w, cell.h, birdX, birdY, 320 / 3, 250 / 3);
}
function updateBird() {
    let countTime = Date.now() - lastUpdateBird;
    if (countTime >= timeUpdateBird) {
        birdIndex++;
        if (birdIndex === birdCells.length) {
            birdIndex = 0;
        }
        lastUpdateBird = Date.now();
    }
}

//Meteorite
function drawMeteorite() {
    Meteorites.forEach((e) => {
        context.drawImage(MeteoriteImg, MeteoriteCells[e.MeteoriteIndex].x, MeteoriteCells[e.MeteoriteIndex].y, MeteoriteCells[e.MeteoriteIndex].w, MeteoriteCells[e.MeteoriteIndex].h, e.xScreen, e.yScreen, MeteoriteCells[e.MeteoriteIndex].w , MeteoriteCells[e.MeteoriteIndex].h);
    });
}
function updateMeteorite() {
    if (hardLevel < maxLevel) {
        hardLevel += 0.0009;
    }
    Meteorites = Meteorites.filter((e) => {
        if (e.yScreen >= canvas.height + 50 || e.xScreen <= -50) {
            return false;
        }
        return true;
    });

    Meteorites.forEach((e) => {
        e.xScreen -= e.xSpeed + 2;
        e.yScreen += e.ySpeed + 3;
        let countTime = Date.now() - e.lastUpdateMeteorite;
        if (countTime >= e.timeUpdateMeteorite) {
            e.MeteoriteIndex++;
            if (e.MeteoriteIndex === MeteoriteCells.length) {
                e.MeteoriteIndex = 0;
            }
            e.lastUpdateMeteorite = Date.now();
        }
    });
}
function addRandomMeteorite() {
    let MeteoriteIndex = Math.floor((Math.random() * MeteoriteCells.length) + 0);
    let xScreen = (Math.random() * canvas.width * 2) - canvas.width / 2;
    let yScreen = -200;
    let xSpeed = 2 + hardLevel; 
    let ySpeed = 2 + hardLevel;
    countSpecialMeteo += 1;
    if (countSpecialMeteo === 3) {
        xSpeed = 7;
        ySpeed = 7;
    }
    if (countSpecialMeteo === 10) {
        xSpeed = 10;
        ySpeed = 10;
        countSpecialMeteo = 0;
    }
    if (Meteorites.length < maxMeteorites) {
        Meteorites.push(
            {
                lastUpdateMeteorite: lastUpdateMeteorite,
                timeUpdateMeteorite: timeUpdateMeteorite,
                MeteoriteIndex: MeteoriteIndex,
                xScreen: xScreen,
                yScreen: yScreen,
                xSpeed: xSpeed,
                ySpeed: ySpeed
            }
        );
    }
}

//Check game over 
function checkOver() {
    Meteorites.forEach((e) => {
        if (
            //Right
            birdX + birdCells[birdIndex].w / 2 >= e.xScreen + MeteoriteCells[e.MeteoriteIndex].w / 2 + 30
            &&
            //Left
            birdX - birdCells[birdIndex].w / 2 <= e.xScreen - MeteoriteCells[e.MeteoriteIndex].w - 40
            &&
            //Down
            birdY + birdCells[birdIndex].h / 2 >= e.yScreen + MeteoriteCells[e.MeteoriteIndex].h / 2 + 25
            &&
            //Top
            birdY - birdCells[birdIndex].h / 2 <= e.yScreen - MeteoriteCells[e.MeteoriteIndex].h
            
            //Right
            // birdX +  320 / 3 >= e.xScreen + MeteoriteCells[e.MeteoriteIndex].w / 2 
            // &&
            // //Left
            // birdX -  320 / 3 <= e.xScreen - MeteoriteCells[e.MeteoriteIndex].w 
            // &&
            // //Down
            // birdY +  250 / 3 >= e.yScreen + MeteoriteCells[e.MeteoriteIndex].h / 2
            // &&
            // //Top
            // birdY - 250 / 3  <= e.yScreen - MeteoriteCells[e.MeteoriteIndex].h
        ) {
            gameState = 3;
        }
    })
}

//Control
var right = false;
var left = false;
var up = false;
var down = false;
document.addEventListener('keydown', keyDown, false);
document.addEventListener('keyup', keyUp, false);
function keyDown(e) {    
    if (e.keyCode == 32 && gameState == 1) {
        gameState = 2;
        startScreen.style.display = 'none';
    }

    if (e.keyCode == 32 && gameState == 3) {
        gameState = 2;
        Meteorites = [];
        point = 0;
        hardLevel = 0;
        overScreen.style.display = 'none';
    }

    if (e.keyCode == 39 || e.keyCode == 68) {
        right = true;
    }
    else if (e.keyCode == 37 || e.keyCode == 65) {
        left = true;
    }
    if (e.keyCode == 40 || e.keyCode == 83) {
        down = true;
    }
    else if (e.keyCode == 38 || e.keyCode == 87) {
        up = true;
    }
}
function updatePositionBird() {
    if (right && birdX <= canvas.width - 111) {
        birdX += speedFly;
        if (timeUpdateBird >= 1000 / 15) {
            timeUpdateBird -= 30;
        }
    }
    else if (left && birdX >= 5) {
        birdX -= speedFly;
        if (timeUpdateBird >= 1000 / 15) {
            timeUpdateBird -= 30;
        }
    }
    if (down && birdY <= canvas.height - 90) {
        birdY += speedFly;
        if (timeUpdateBird <= 1000 / 15) {
            timeUpdateBird += 15;
        }
    }
    else if (up && birdY >= 5) {
        birdY -= speedFly;
        if (timeUpdateBird >= 1000 / 15) {
            timeUpdateBird -= 30;
        }
    }
}

function keyUp(e) {
    timeUpdateBird = 1000 / 15;
    if (e.keyCode == 39 || e.keyCode == 68) {
        right = false;
    }
    else if (e.keyCode == 37 || e.keyCode == 65) {
        left = false;
    }
    if (e.keyCode == 40 || e.keyCode == 83) {
        down = false;
    }
    else if (e.keyCode == 38 || e.keyCode == 87) {
        up = false;
    }
}


