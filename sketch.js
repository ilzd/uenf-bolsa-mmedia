//Variável que guarda referência da atividade sendo executada
var act;

//Primeira função executada
//Serve para realizar configurações inicais
function setup() {
    createCanvas(windowWidth, windowHeight); //Setting canvas size to cover the entire window
    frameRate(60);


    //Capturando referência ao Canvas
    let canvas = document.getElementById('defaultCanvas0');

    //Para evitar barras de rolagem na página
    canvas.style.display = 'block';

    
    act = new MenuActivity(0, 0, width, height);
}

//Função que executada repetidamente
//É aqui que o código responsável pela animação deve estar
function draw() {
    background(50);
    act.update();
}

//Função da P5.js que escuta por eventos de mouse
function mousePressed(){
    act.onMousePressed(mouseButton, mouseX, mouseY);
}

//Função da P5.js que escuta por eventos de teclado
function keyPressed(){
    act.onKeyPressed(key);
}