let main = document.querySelector(".main"); 
const scoreElem = document.getElementById('score')
const levelElem = document.getElementById('level')
const nextTetroElem = document.getElementById('next-tetro')
const startBtn = document.getElementById('start')
const pauseBtn = document.getElementById('pause')
const gameOver = document.getElementById('game-over')

//let playfield = Array(20).fill(Array(10).fill(0)); // авто-создание массива 20х10
let playfield = [
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
];

// let gameSpeed = 400;
isPaused = true; //по умолчанию игра на паузе
let score = 0; // кол-во очков при старте
let currentLevel = 1; // уровень при старте игры
let gameTimerID; // переменная хранящая таймер игры


let possibleLevels = {
    1:{
        scorePerLine: 10,
        speed: 400,
        nextLevelScore: 300,
    },
    2:{
        scorePerLine: 15,
        speed: 200,
        nextLevelScore: 600,
    },
    3:{
        scorePerLine: 10,
        speed: 100,
        nextLevelScore: Infinity,
    }
};

let figures = {
    O:[
        [1,1,0,],
        [1,1,0,],
        [0,0,0,],
    ],
    I:[
        [0,0,0,0,],
        [1,1,1,1,],
        [0,0,0,0,],
        [0,0,0,0,],
    ],
    Z:[
        [1,1,0,],
        [0,1,1,],
        [0,0,0,],
    ],
    S:[
      [0,1,1,],
      [1,1,0,],
      [0,0,0,],
    ],
    T:[
        [1,1,1,],
        [0,1,0,],
        [0,0,0,],
    ],
    L:[
        [0,1,0,],
        [0,1,0,],
        [0,1,1,],
    ],
    J:[
        [0,1,0,],
        [0,1,0,],
        [1,1,0 ,],
    ],
}

let activeTetro = getNewTetro();
let nextTetro = getNewTetro();

function draw(){
    let mainInnerHTML = "";
    for (let y = 0; y < playfield.length; y++){
        for(let x = 0; x < playfield[y].length; x++){
            if(playfield[y][x] === 1){
                mainInnerHTML += '<div class="cell movingCell"></div>';
            }else if(playfield[y][x] === 2){
                mainInnerHTML += '<div class="cell fixedCell"></div>';
            }else{
                mainInnerHTML += '<div class="cell"></div>';
            }
        }
    }
// console.log(mainInnerHTML);
 main.innerHTML = mainInnerHTML;
}

function drawNextTetro() {  //предсказание след.фигуры
    let nextTetroInnerHTML = "";
    for (let y = 0; y < nextTetro.shape.length; y++) {
        for (let x = 0; x < nextTetro.shape[y].length; x++) {
            if (nextTetro.shape[y][x]) {
                nextTetroInnerHTML += '<div class="cell movingCell"></div>';
            }else{
                nextTetroInnerHTML  += '<div class="cell"></div>';
            }
        }
        nextTetroInnerHTML  += '</br>'; 
    }
    nextTetroElem.innerHTML = nextTetroInnerHTML;
}

function removePrevActiveTetro() {
    for (let y = 0; y < playfield.length; y++){
        for(let x = 0; x < playfield[y].length; x++){
            if(playfield [y][x] === 1){
                playfield[y][x] = 0;
            }
        }
    }
}

// 
function addActiveTetro() {
    removePrevActiveTetro();
    for (let y = 0; y < activeTetro.shape.length; y++){
        for(let x = 0; x < activeTetro.shape[y].length; x++){
            if (activeTetro.shape[y][x] === 1){
                playfield[activeTetro.y + y][activeTetro.x + x] = 
                activeTetro.shape[y][x];
            }
        }
    }
}

 function removeActiveTetro() {
    for (let y = 0; y < playfield.length; y++){
        for(let x = 0; x < playfield[y].length; x++){
            if(playfield[y][x] === 1) {
                playfield[y][x] = 0;
            }
        }
    }
}


function rotateTetro() {
    const prevTetroState = activeTetro.shape;
    
    activeTetro.shape = activeTetro.shape[0].map((val, index) => 
        activeTetro.shape.map((row) => row[index]).reverse());                     //вращаем фигуры вокруг центра по часовой

    if(hasCollision()){
        activeTetro.shape = prevTetroState;
    }             
}

function hasCollisions() {
    for (let y = 0; y < activeTetro.shape.length; y++){
        for(let x = 0; x < activeTetro.shape[y].length; x++){
            if (
                activeTetro.shape[y][x] &&
                (playfield[activeTetro.y + y] === undefined || 
                playfield[activeTetro.y + y][activeTetro.x + x] === undefined || 
                playfield[activeTetro.y + y][activeTetro.x + x] === 2)
            ) {
                return true;
            }
        }
    }
    return false;
}

// function canTetroMoveDown(){
//     for (let y = 0; y < playfield.length; y++){
//         for(let x = 0; x < playfield[y].length; x++){
//             if(playfield[y][x] === 1) {
//                 if(y === playfield.length - 1 || playfield[y + 1][x] === 2){
//                     return false;
//                 }
//             }
//         }
//     } 
//     return true;        
// }

// function moveTetroDown() {
//     if (canTetroMoveDown()){
//         for (let y = playfield.length - 1; y >= 0; y--){
//             for(let x = 0; x < playfield[y].length; x++){
//                 if(playfield[y][x] === 1){
//                     // console.log(playfield[y+1]);
//                 playfield[y+1][x] = 1; 
//                 playfield[y][x] = 0;
//                 }
//             }
//         } 
//     }else{
//         fixTetro();
//     }
// }

// // move block left
// function canTetroMoveLeft(){
//     for (let y = 0; y < playfield.length; y++){
//         for(let x = 0; x < playfield[y].length; x++){
//             if(playfield[y][x] === 1) {
//                 if(x === 0 || playfield[y][x - 1] === 2){
//                     return false;
//                 }
//             }
//         }
//     } 
//     return true;        
// }

// function moveTetroLeft() {
//     if (canTetroMoveLeft()){
//         for (let y = playfield.length - 1; y >= 0; y--){
//             for(let x = 0; x < playfield[y].length; x++){
//                 if(playfield[y][x] === 1){
//                 playfield[y][x - 1] = 1; 
//                 playfield[y][x] = 0;
//                 }
//             }
//         } 
//     }
// }

// // move block right
// function canTetroMoveRight(){
//     for (let y = 0; y < playfield.length; y++){
//         for(let x = 0; x < playfield[y].length; x++){
//             if(playfield[y][x] === 1) {
//                 if(x === 9 || playfield[y][x + 1] === 2){               // playfield[0].length - 1 === 9
//                     return false;
//                 }
//             }
//         }
//     } 
//     return true;        
// }

// function moveTetroRight() {
//     if (canTetroMoveRight()){
//         for (let y = playfield.length - 1; y >= 0; y--){
//             for(let x = 9; x >= 0; x--){
//                 if(playfield[y][x] === 1){
//                 playfield[y][x + 1] = 1; 
//                 playfield[y][x] = 0;
//                 }
//             }
//         } 
//     }
// }

function removeFullLines() {
    let canRemoveLine = true, filedLines = 0;
    for (let y = 0; y < playfield.length; y++) {    
        for (let x = 0; x < playfield[y].length; x++) {
            if (playfield[y][x] !== 2) {
                canRemoveLine = false;
                break;
            }
        }
        if (canRemoveLine) {
            playfield.splice(y, 1); //удаляем заполненую линию
            playfield.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]) //add new array-row
            filedLines += 1;
        }
        canRemoveLine= true;
    }
    switch (filedLines){ // добавляем очки за убранные линии
        case 1:
            score += possibleLevels[currentLevel].scorePerLine; 
            break;
        case 2:
            score += possibleLevels[currentLevel].scorePerLine * 3; 
            break;
        case 3:
            score += possibleLevels[currentLevel].scorePerLine * 6;
            break;
        case 4:
            score += possibleLevels[currentLevel].scorePerLine * 12;
            break;
        default:
            break;
    }
    scoreElem.innerHTML = score; 
    if(score >= possibleLevels[currentLevel].nextLevelScore) {
        currentLevel++;
        levelElem.innerHTML = currentLevel;
    }
}

function getNewTetro() {
    const possibleFigures = 'OISZLJT';
    const rand = Math.floor(Math.random()*7);
    const newTetro = figures[possibleFigures[rand]];

    return {
        x : Math.floor((10 - newTetro[0].length)/2),
        y : 0, 
    shape: newTetro,

    } 
}

function fixTetro() {
    for (let y = 0; y < playfield.length; y++){
        for(let x = 0; x < playfield[y].length; x++){
            if(playfield[y][x] === 1){
                playfield[y][x] = 2;
            }
        }
    }
    // removeFullLines();
}

function moveTetroDown() { //движение вниз
    activeTetro.y +=1; //   перемещает на 1 вниз
    if(hasCollisions()){
        activeTetro.y -=1;
        fixTetro();
        removeFullLines();
        activeTetro = nextTetro;
        if (hasCollisions()) {
            reset();
        }
        nextTetro = getNewTetro();    
    }
}
function dropTetro(){
     for (let y = activeTetro.y; y < playfield.length; y++) {
        activeTetro.y += 1;
        if (hasCollisions()) {
            activeTetro.y -= 1;
            break;
        }
         
     }
}

function reset() {
     //alert('Game Over'); 
     isPaused = true; //cначала ставит на паузу
     clearTimeout(gameTimerID); // останавливаем таймер 
     playfield = [              // отрисовываем поле
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
    ];
    draw();
    gameOver.style.display = "block";  // с помощью свойства стайл отображаем в блоке
}


//draw();
// отрабатываем нажатие клавиш, тут происходят все действия
document.onkeydown = function (e) {
    if (!isPaused) { //блокируем нажатие клавиш при паузе
        // console.log(e); //команда для просмотра в консоле кода клавиш
        if (e.keyCode === 37){ // двигаем фигуру в лево
            activeTetro.x -=1; 
            if(hasCollisions()){ // проверка на ошибку и выход за границы поля
                activeTetro.x +=1; //возвращаем на место если ошибка есть 
            }
        }else if (e.keyCode === 39){ // двигаем фигуру в право
            activeTetro.x +=1;
            if(hasCollisions()){
                activeTetro.x -=1;
            }
        }else if (e.keyCode === 40){ //ускоряем фигуру стрелкой вниз
            moveTetroDown();
        }else if (e.keyCode === 38){ //  вращаем фигуру нажатием стрелки вверх
            rotateTetro();
        }else if (e.keyCode === 32){ // фигурка адает при надатии пробела
            dropTetro();
        }
        updateGameState();
    }
};
function updateGameState() { // если игра не на паузе обновляем поле
    if (!isPaused) {
        addActiveTetro();
        draw();
        drawNextTetro();
    }
}

pauseBtn.addEventListener('click',(e) => { //нажатие кнопки пауза
   if (e.target.innerHTML === "Pause") { //изменяем текст при нажатии на кнопку
        e.target.innerHTML = "Play"  
        clearTimeout(gameTimerID); // останавливаем таймер во время паузы
   } else {
        e.target.innerHTML = "Pause"
        gameTimerID = setTimeout(startGame, possibleLevels[currentLevel].speed); //запусаем таймер как и при старте игры
   }
   isPaused = !isPaused; //меняем значение при каждом нажатии на противоположное
});

startBtn.addEventListener('click',(e) => { //при клике на старт запускаем таймер
    e.target.innerHTML = 'New Game'; // при следующих стартах надпись меняем на ...
    isPaused = false; //при старте игры меняет значение на "не пауза"
    gameTimerID = setTimeout(startGame, possibleLevels[currentLevel].speed); //работа таймера при нажатии кнопки старт
    gameOver.style.display = "none"; //прячем
});

scoreElem.innerHTML =  score;
levelElem.innerHTML = currentLevel;

draw(); // рисуем поле при загрузке страницы

function startGame() {
    moveTetroDown();
    if (!isPaused){ // запускаем таймер если не на паузе 
        updateGameState();
        gameTimerID = setTimeout(startGame, possibleLevels[currentLevel].speed); //скорость движения фигур
    }
}   
//setTimeout(startGame, possibleLevels[currentLevel].speed); //старт игры сразу после загрузки страницы 
