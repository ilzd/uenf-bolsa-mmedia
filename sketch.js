//Variável que guarda referência da atividade sendo executada
var act;
var speedSelected = 2;

var speedOptions = [0.25, 0.5, 1, 2, 4];
var frameBuffer = 0;
var paused = false;

//Primeira função executada
//Serve para realizar configurações inicais
function setup() {
    createCanvas(windowWidth, windowHeight); //Setting canvas size to cover the entire window

    frameRate(60);

    //Capturando referência ao Canvas
    let canvas = document.getElementById('defaultCanvas0');

    //Para evitar barras de rolagem na página
    canvas.style.display = 'block';

    act = new MenuActivity(0, 0, width, height, false);
}

//Função que executada repetidamente
//É aqui que o código responsável pela animação deve estar
function draw() {
    if (!paused) {
        frameBuffer += speedOptions[speedSelected];
        while (frameBuffer > 1) {
            background(50);
            frameBuffer--;
            act.update();
        }
    }
}

//Função da P5.js que escuta por eventos de mouse
function mousePressed() {
    act.onMousePressed(mouseButton, mouseX, mouseY);
}

//Função da P5.js que escuta por eventos de teclado
function keyPressed() {
    act.onKeyPressed(key);
}

function changeSpeed(index) {
    speedSelected = index;
}