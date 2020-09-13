var act;

function setup() {
    createCanvas(windowWidth, windowHeight); //Setting canvas size to cover the entire window
    frameRate(60);


    let canvas = document.getElementById('defaultCanvas0'); //Capturing p5js canvas from the document
    canvas.style.display = 'block'; //To avoid displaying scroll bars

    
    act = new CurveForming(0, 0, width, height);
}

function draw() {
    background(50);
    act.update();
}

function mousePressed(){
}

function keyPressed(){
}