const INF = 999999;
const OPTION_SIZE = 35;

class Activity {

    constructor(px, py, w, h, hasControls) {
        this.px = px;
        this.py = py;
        this.w = w;
        this.h = h;
        this.hasControls = hasControls;
        this.graphics = createGraphics(w, h);
        changeSpeed(2);
    }

    //Metodo que atualiza o estado do OA
    update() {
        if(this.hasControls){
            this.drawControls();
        }
     }

    //Método que captura os eventos de teclado enviados pelo P5.js
    onKeyPressed(key) { }

    //Método que captura os eventos de mouse enviados pelo P5.js
    onMousePressed(button, mx, my) {
        if(this.hasControls){
            if(my < OPTION_SIZE * 1){
                if(mx < speedOptions.length * OPTION_SIZE){
                    changeSpeed((int)(mx / OPTION_SIZE));
                }
            }
        }
    }

    //Desenha os controles de exibição
    drawControls(){
        let g = this.graphics;

        g.textAlign(CENTER, CENTER);
        g.textSize(12);
        for(let i = 0; i < speedOptions.length; i++){
            if(i == speedSelected){
                g.fill(200, 127);
            } else {
                g.fill(63, 127);
            }
            g.stroke(255);
            g.strokeWeight(1);
            g.rect(i * OPTION_SIZE, 0, OPTION_SIZE, OPTION_SIZE);
            g.fill(255);
            g.noStroke();
            g.text("" + speedOptions[i] + "x", i * OPTION_SIZE + OPTION_SIZE / 2, OPTION_SIZE / 2);
        }
        
    }
}

class MenuActivity extends Activity {
    constructor(px, py, w, h, hasControls) {
        super(px, py, w, h, hasControls);
        this.options = [
            {
                pos: [w / 2, 300],
                title: "Curvas de funções",
                act: new SimpleGraphDisplay(px, py, w, h, true),
            },
            {
                pos: [w / 2, 340],
                title: "Formação da curva de funções",
                act: new FunctionCurveForming(px, py, w, h, true),
            },
            {
                pos: [w / 2, 380],
                title: "Função seno pelo círculo trigonométrico",
                act: new SinForming(px, py, w, h, true),
            },
            {
                pos: [w / 2, 420],
                title: "Função cosseno pelo círculo trigonométrico",
                act: new CosForming(px, py, w, h, true),
            },
            {
                pos: [w / 2, 460],
                title: "Reta tangente",
                act: new TanLine(px, py, w, h, true),
            },
            {
                pos: [w / 2, 500],
                title: "Formação da função derivada",
                act: new DerivativeForming(px, py, w, h, true),
            },
        ]
    }

    update() {
        let g = this.graphics;

        g.background(0);

        g.fill(255);
        g.noStroke();
        g.textAlign(CENTER, CENTER);
        g.textSize(38);

        g.text("Objetos de aprendizagem\nCálculo diferencial e integral", this.w / 2, 100);

        g.textSize(28);
        g.text("Pressione o número da opção desejada:", this.w / 2, 250);

        g.textSize(24);
        for (let i = 0; i < this.options.length; i++) {
            let op = this.options[i];
            g.text((i + 1) + ". " + op.title, op.pos[0], op.pos[1]);
        }

        super.update();
        image(g, this.px, this.py);        
    }

    onKeyPressed(key) {
        for (let i = 0; i < this.options.length; i++) {
            if (key == "" + (i + 1)) {
                act = this.options[i].act;
                break;
            }
        }
        super.onKeyPressed(key);
    }

    onMousePressed(button, mx, my) {
        super.onMousePressed(button, mx, my);
    }
}

class SimpleGraphDisplay extends Activity {
    constructor(px, py, w, h, hasControls) {
        super(px, py, w, h, hasControls);

        this.options = [
            {
                fun: new LinFunc(1, 0),
                rangeX: [-10, 10],
                rangeY: [-10, 10],
                label: "x",
            },
            {
                fun: new QuadFunc(1, 0, 0),
                rangeX: [-5, 5],
                rangeY: [-10, 10],
                label: "x²",
            },
            {
                fun: new PolyFunc([[1, 3]]),
                rangeX: [-3, 3],
                rangeY: [-10, 10],
                label: "x³",
            },
            {
                fun: new SinFunc(1),
                rangeX: [-10, 10],
                rangeY: [-2, 2],
                label: "sen(x)",
            },
            {
                fun: new CosFunc(1),
                rangeX: [-10, 10],
                rangeY: [-2, 2],
                label: "cos(x)",
            },
        ];

        this.opH = 100;

        let op = this.options[0];
        this.board = new Board(op.fun, 0, 0, w * 0.9, h);
        this.board.rangeX = op.rangeX;
        this.board.rangeY = op.rangeX;
        this.board.showRanges = false;
    }

    update() {
        let g = this.graphics;
        let b = this.board;

        g.background(0);
        b.display();
        g.image(b.graphics, b.px, b.py);

        let opW = this.w * 0.95;
        g.textSize(24);
        g.fill(255);
        g.noStroke();
        g.textAlign(CENTER, CENTER);
        for (let i = 0; i < this.options.length; i++) {
            let op = this.options[i];
            g.text(op.label, opW, this.opH * i + this.opH / 2);
        }

        super.update();
        image(g, this.px, this.py);       
    }

    onKeyPressed(key) {
        super.onKeyPressed(key);
    }

    onMousePressed(button, mx, my) {
        for (let i = 0; i < this.options.length; i++) {
            if (mx > this.w * 0.9) {
                if (my < (i + 1) * this.opH) {
                    this.selectOption(this.options[i]);
                    break;
                }
            }
        }
        super.onMousePressed(button, mx, my);
    }

    selectOption(op) {
        this.board.fun = op.fun;
        this.board.rangeX = op.rangeX;
        this.board.rangeY = op.rangeY;
    }
}

class FunctionCurveForming extends Activity {
    constructor(px, py, w, h, hasControls) {
        super(px, py, w, h, hasControls);
        this.fun = new LinFunc(1, 0);

        this.labelParam = 'x';
        this.labelY = 'y';
        this.labelTextSize = 48;
        this.funcLabelText;
        this.labelPos = [this.w / 2, this.h / 6];
        this.funcLabelWidth;
        this.labelXPos;
        this.labelYPos;
        this.calculateLabel();

        this.maxWaitDuration = 70;
        this.waitDuration = this.maxWaitDuration;
        this.waitTimer = this.waitDuration;
        this.animationStage = 0;
        this.animationPosition = 0;
        this.minAnimationSpeed = 0.015;
        this.animationSpeed = this.minAnimationSpeed;

        this.newPoint;
        this.newPointPosition;
        this.maxPointsCount = 20;
        this.pointsCount = this.maxPointsCount;
        this.pointIndex = 1;

        this.maxSpaceRatio = 0.02;
        this.spaceRatio = this.maxSpaceRatio;

        this.isFaster = false;
        this.justRestarted = false;

        this.options = [
            {
                fun: new LinFunc(1, 0),
                rangeX: [-10, 10],
                rangeY: [-10, 10],
                label: "x",
            },
            {
                fun: new QuadFunc(1, 0, 0),
                rangeX: [-5, 5],
                rangeY: [0, 20],
                label: "x²",
            },
            {
                fun: new PolyFunc([[1, 3]]),
                rangeX: [-2.3, 2.3],
                rangeY: [-10, 10],
                label: "x³",
            },
            {
                fun: new SinFunc(1),
                rangeX: [-7, 7],
                rangeY: [-2, 2],
                label: "sen(x)",
            },
            {
                fun: new CosFunc(1),
                rangeX: [-7, 7],
                rangeY: [-2, 2],
                label: "cos(x)",
            },
        ];

        this.opH = 100;

        let op = this.options[0];
        this.board = new Board(op.fun, 0, 0, w * 0.9, h);
        this.board.rangeX = op.rangeX;
        this.board.rangeY = op.rangeX;
        this.board.showFunction = false;
    }

    update() {
        let g = this.graphics;
        let b = this.board;

        g.background(0);
        b.display();
        g.image(b.graphics, b.px, b.py);

        g.fill(255);
        g.noStroke();
        g.textSize(this.labelTextSize);
        g.textAlign(CENTER, CENTER);
        g.text(this.funcLabelText, this.labelPos[0], this.labelPos[1]);

        let posX, posY;
        if (this.waitTimer > 0) {
            this.waitTimer--;
        } else {
            switch (this.animationStage) {
                case 0:
                    if (this.justRestarted) {
                        b.markedPoints = [];
                        b.markedXLines = [];
                        b.markedYLines = [];
                        b.showFunction = false;
                        this.justRestarted = false;
                    }

                    // let newX = b.rangeX[0] + Math.random() * (b.rangeX[1] - b.rangeX[0]);
                    let space = (b.rangeX[1] - b.rangeX[0]) * this.spaceRatio;
                    let newX = b.rangeX[0] + space + this.pointIndex * (b.rangeX[1] - b.rangeX[0] - space * 2) / this.pointsCount;
                    this.pointIndex++;
                    b.markedXLines.push(newX);
                    this.newPoint = [newX, b.fun.valAt(newX)];
                    this.newPointPosition = [map(this.newPoint[0], b.rangeX[0], b.rangeX[1], b.px, b.px + b.w), map(this.newPoint[1], b.rangeY[1], b.rangeY[0], b.py, b.py + b.h)];
                    this.animationStage += (this.isFaster) ? 3 : 1;
                    this.animationPosition = 0;
                    this.waitTimer = this.waitDuration;
                    break;
                case 1:
                    g.noStroke();
                    g.fill(255);
                    g.textSize(24);
                    posX = map(Math.sqrt(this.animationPosition), 0, 1, this.newPointPosition[0], this.labelXPos[0]);
                    posY = map(Math.sqrt(this.animationPosition), 0, 1, b.py + b.h / 2, this.labelXPos[1]);
                    g.text(Math.round(this.newPoint[0] * 10) / 10, posX, posY);
                    this.animationPosition += this.animationSpeed;
                    if (this.animationPosition >= 1) {
                        this.labelParam = Math.round(this.newPoint[0] * 10) / 10;
                        this.labelY = Math.round(this.newPoint[1] * 10) / 10;
                        this.calculateLabel();
                        this.animationStage++;
                        this.animationPosition = 0;
                        this.waitTimer = this.waitDuration;
                    }
                    break;
                case 2:
                    g.noStroke();
                    g.fill(255);
                    g.textSize(24);
                    posX = map(Math.sqrt(this.animationPosition), 0, 1, this.labelYPos[0], b.px + b.w / 2);
                    posY = map(Math.sqrt(this.animationPosition), 0, 1, this.labelYPos[1], this.newPointPosition[1]);
                    g.text(Math.round(this.newPoint[1] * 10) / 10, posX, posY);
                    this.animationPosition += this.animationSpeed;
                    if (this.animationPosition >= 1) {
                        this.labelParam = Math.round(this.newPoint[0] * 10) / 10;
                        this.calculateLabel();
                        this.animationStage++;
                        this.animationPosition = 0;
                    }
                    break;
                case 3:
                    b.markedYLines.push(this.newPoint[1]);
                    this.animationStage++;
                    this.waitTimer = this.waitDuration;
                    break;
                case 4:
                    g.stroke(255, 0, 0);
                    g.strokeWeight(map(Math.pow(this.animationPosition, 2), 0, 1, 40, 10));
                    g.point(this.newPointPosition[0], this.newPointPosition[1]);
                    this.animationPosition += this.animationSpeed;
                    if (this.animationPosition >= 1) {
                        this.animationStage++;
                        this.animationPosition = 0;
                    }
                    break;
                case 5:
                    b.markedPoints.push(this.newPoint);
                    this.animationStage++;
                    this.waitTimer = this.waitDuration;
                    break;
                case 6:
                    b.markedPoints.push(this.newPoint);
                    this.animationStage++;
                    this.waitTimer = this.waitDuration;
                    break;
                case 7:
                    b.markedXLines = [];
                    b.markedYLines = [];
                    this.labelParam = 'x';
                    this.labelY = 'y';
                    this.calculateLabel();
                    this.animationStage = 0;
                    this.waitTimer = this.waitDuration;
                    this.waitDuration -= 10;
                    this.animationSpeed += 0.005;

                    if (this.pointIndex == this.pointsCount - 1) {
                        if (!this.isFaster) {
                            this.pointIndex = 0;
                            this.pointsCount *= 5;
                            this.spaceRatio = 0;
                            this.isFaster = true;
                        } else {
                            this.isFaster = false;
                            this.pointIndex = 0;
                            this.pointsCount = this.maxPointsCount;
                            this.spaceRatio = this.maxSpaceRatio;
                            this.animationSpeed = this.minAnimationSpeed;
                            this.waitDuration = this.maxWaitDuration;
                            this.waitTimer = this.maxWaitDuration * 5;
                            b.showFunction = true;
                            this.justRestarted = true;
                        }
                    }
                    break;
                default:
                    break;
            }
        }

        let opW = this.w * 0.95;
        g.textSize(24);
        g.fill(255);
        g.noStroke();
        g.textAlign(CENTER, CENTER);
        for (let i = 0; i < this.options.length; i++) {
            let op = this.options[i];
            g.text(op.label, opW, this.opH * i + this.opH / 2);
        }

        super.update();
        image(g, this.px, this.py);       
    }

    calculateLabel() {
        this.funcLabelText = "f(" + this.labelParam + ") = " + this.fun.label(this.labelParam) + " = " + this.labelY;
        this.graphics.textSize(this.labelTextSize);
        this.funcLabelWidth = this.graphics.textWidth(this.funcLabelText);
        this.labelXPos = [this.labelPos[0] - this.funcLabelWidth / 2 + 40, this.labelPos[1]];
        this.labelYPos = [this.labelPos[0] + this.funcLabelWidth / 2 - 16, this.labelPos[1]];
    }

    onKeyPressed(key) {
        super.onKeyPressed(key);
    }

    onMousePressed(button, mx, my) {
        for (let i = 0; i < this.options.length; i++) {
            if (mx > this.w * 0.9) {
                if (my < (i + 1) * this.opH) {
                    this.selectOption(this.options[i]);
                    break;
                }
            }
        }
        super.onMousePressed(button, mx, my);
    }


    selectOption(op) {
        let ac = new FunctionCurveForming(this.px, this.py, this.w, this.h, true);
        ac.board.fun = op.fun;
        ac.fun = op.fun;
        ac.board.rangeX = op.rangeX;
        ac.board.rangeY = op.rangeY;
        ac.calculateLabel();
        act = ac;
    }


}

class SinForming extends Activity {
    constructor(px, py, w, h, hasControls) {
        super(px, py, w, h, hasControls);
        this.sinBoardW = w / 2.1;
        this.sinBoardH = h / 2.1;
        this.board = new Board(new SinFunc(1), 3 * (w / 4) - this.sinBoardW / 2, h / 2 - this.sinBoardH / 2, this.sinBoardW, this.sinBoardH);
        this.board.rangeY = [-1, 1];
        this.board.rangeX = [0, Math.PI * 4];
        this.board.showFunction = false;
        this.xPos = this.board.rangeX[0];
        this.circlePx = w / 4;
        this.circlePy = h / 2;
    }

    update() {
        let g = this.graphics;
        let b = this.board;

        g.background(0);
        b.display();
        g.image(b.graphics, b.px, b.py);

        g.stroke(127);
        g.strokeWeight(2);
        g.noFill();
        g.ellipse(this.circlePx, this.circlePy, this.sinBoardH, this.sinBoardH);
        g.line(this.circlePx - this.sinBoardH / 1.7, this.circlePy, this.circlePx + this.sinBoardH / 1.7, this.circlePy);
        g.line(this.circlePx, this.circlePy - this.sinBoardH / 1.7, this.circlePx, this.circlePy + this.sinBoardH / 1.7);

        g.fill(255);
        g.textSize(22);
        g.noStroke();
        g.textAlign(CENTER, CENTER);
        g.text("-1", this.circlePx - this.sinBoardH / 1.5 + 10, this.circlePy);
        g.text("1", this.circlePx + this.sinBoardH / 1.5 - 10, this.circlePy);
        g.text("-1", this.circlePx, this.circlePy + this.sinBoardH / 1.5 - 10);
        g.text("1", this.circlePx, this.circlePy - this.sinBoardH / 1.5 + 10);
        g.textSize(18);
        g.text("0", this.circlePx + this.sinBoardH / 1.5 - 45, this.circlePy - 10);
        g.text("π/2", this.circlePx + 20, this.circlePy - this.sinBoardH / 1.5 + 42);
        g.text("π", this.circlePx - this.sinBoardH / 1.5 + 42, this.circlePy + 13);
        g.text("3π/2", this.circlePx + 22, this.circlePy + this.sinBoardH / 1.5 - 40);
        g.text("2π", this.circlePx + this.sinBoardH / 1.5 - 38, this.circlePy + 13);

        g.textSize(22);
        g.fill(20, 120, 255);
        g.text(round(this.xPos * 10) / 10, this.circlePx + Math.cos(this.xPos) * this.sinBoardH / 2.4, this.circlePy - Math.sin(this.xPos) * this.sinBoardH / 2.4);
        g.strokeWeight(15);
        g.stroke(20, 120, 255);
        g.point(this.circlePx + Math.cos(this.xPos) * this.sinBoardH / 2, this.circlePy - Math.sin(this.xPos) * this.sinBoardH / 2);

        g.strokeWeight(5);
        g.stroke(255, 40, 40);
        g.line(this.circlePx, this.circlePy, this.circlePx, this.circlePy - Math.sin(this.xPos) * this.sinBoardH / 2);
        g.strokeWeight(15);
        g.point(this.circlePx, this.circlePy - Math.sin(this.xPos) * this.sinBoardH / 2);
        g.noStroke();
        g.fill(255, 40, 40);
        g.text(Math.round(Math.sin(this.xPos) * 10) / 10, this.circlePx + 30, this.circlePy - Math.sin(this.xPos) * this.sinBoardH / 2);

        let boardPx = b.px + map(this.xPos, b.rangeX[0], b.rangeX[1], 0, b.w);
        g.strokeWeight(15);
        g.stroke(20, 120, 255);
        g.textSize(18);
        g.fill(20, 120, 255);
        g.point(boardPx, b.py + b.h / 2);
        g.noStroke();
        g.text(round(this.xPos * 10) / 10, boardPx, b.py + b.h / 2 + 20);

        b.markedPoints.push([this.xPos, b.fun.valAt(this.xPos)]);

        this.xPos += 0.01;

        if (this.xPos > b.rangeX[1]) {
            this.xPos = b.rangeX[0];
            b.markedPoints = [];
        }

        super.update();
        image(g, this.px, this.py);       
    }

    onKeyPressed(key) {
        super.onKeyPressed(key);
    }

    onMousePressed(button, mx, my) {
        super.onMousePressed(button, mx, my);
    }
}

class CosForming extends Activity {
    constructor(px, py, w, h, hasControls) {
        super(px, py, w, h, hasControls);
        this.sinBoardW = w / 2.1;
        this.sinBoardH = h / 2.1;
        this.board = new Board(new CosFunc(1), 3 * (w / 4) - this.sinBoardW / 2, h / 2 - this.sinBoardH / 2, this.sinBoardW, this.sinBoardH);
        this.board.rangeY = [-1, 1];
        this.board.rangeX = [0, Math.PI * 4];
        this.board.showFunction = false;
        this.xPos = this.board.rangeX[0];
        this.circlePx = w / 4;
        this.circlePy = h / 2;
    }

    update() {
        let g = this.graphics;
        let b = this.board;

        g.background(0);
        b.display();
        g.image(b.graphics, b.px, b.py);

        g.stroke(127);
        g.strokeWeight(2);
        g.noFill();
        g.ellipse(this.circlePx, this.circlePy, this.sinBoardH, this.sinBoardH);
        g.line(this.circlePx - this.sinBoardH / 1.7, this.circlePy, this.circlePx + this.sinBoardH / 1.7, this.circlePy);
        g.line(this.circlePx, this.circlePy - this.sinBoardH / 1.7, this.circlePx, this.circlePy + this.sinBoardH / 1.7);

        g.fill(255);
        g.textSize(22);
        g.noStroke();
        g.textAlign(CENTER, CENTER);
        g.text("-1", this.circlePx - this.sinBoardH / 1.5 + 10, this.circlePy);
        g.text("1", this.circlePx + this.sinBoardH / 1.5 - 10, this.circlePy);
        g.text("-1", this.circlePx, this.circlePy + this.sinBoardH / 1.5 - 10);
        g.text("1", this.circlePx, this.circlePy - this.sinBoardH / 1.5 + 10);
        g.textSize(18);
        g.text("0", this.circlePx + this.sinBoardH / 1.5 - 45, this.circlePy - 10);
        g.text("π/2", this.circlePx + 20, this.circlePy - this.sinBoardH / 1.5 + 42);
        g.text("π", this.circlePx - this.sinBoardH / 1.5 + 42, this.circlePy + 13);
        g.text("3π/2", this.circlePx + 22, this.circlePy + this.sinBoardH / 1.5 - 40);
        g.text("2π", this.circlePx + this.sinBoardH / 1.5 - 38, this.circlePy + 13);

        g.textSize(22);
        g.fill(20, 120, 255);
        g.text(round(this.xPos * 10) / 10, this.circlePx + Math.cos(this.xPos) * this.sinBoardH / 2.4, this.circlePy - Math.sin(this.xPos) * this.sinBoardH / 2.4);
        g.strokeWeight(15);
        g.stroke(20, 120, 255);
        g.point(this.circlePx + Math.cos(this.xPos) * this.sinBoardH / 2, this.circlePy - Math.sin(this.xPos) * this.sinBoardH / 2);

        g.strokeWeight(5);
        g.stroke(255, 40, 40);
        g.line(this.circlePx, this.circlePy, this.circlePx + Math.cos(this.xPos) * this.sinBoardH / 2, this.circlePy);
        g.strokeWeight(15);
        g.point(this.circlePx + Math.cos(this.xPos) * this.sinBoardH / 2, this.circlePy);
        g.noStroke();
        g.fill(255, 40, 40);
        g.text(Math.round(Math.sin(this.xPos) * 10) / 10, this.circlePx + Math.cos(this.xPos) * this.sinBoardH / 2, this.circlePy - 25);

        let boardPx = b.px + map(this.xPos, b.rangeX[0], b.rangeX[1], 0, b.w);
        g.strokeWeight(15);
        g.stroke(20, 120, 255);
        g.textSize(18);
        g.fill(20, 120, 255);
        g.point(boardPx, b.py + b.h / 2);
        g.noStroke();
        g.text(round(this.xPos * 10) / 10, boardPx, b.py + b.h / 2 + 20);

        b.markedPoints.push([this.xPos, b.fun.valAt(this.xPos)]);

        this.xPos += 0.01;

        if (this.xPos > b.rangeX[1]) {
            this.xPos = b.rangeX[0];
            b.markedPoints = [];
        }


        super.update();
        image(g, this.px, this.py);       
    }

    onKeyPressed(key) {
        super.onKeyPressed(key);
    }

    onMousePressed(button, mx, my) {
        super.onMousePressed(button, mx, my);
    }
}

class TanLine extends Activity {
    constructor(px, py, w, h, hasControls) {
        super(px, py, w, h, hasControls);

        this.options = [
            {
                fun: new LinFunc(1, 0),
                rangeX: [-10, 10],
                rangeY: [-10, 10],
                label: "x",
            },
            {
                fun: new QuadFunc(1, 0, 0),
                rangeX: [-3.5, 3.5],
                rangeY: [-0.5, 10],
                label: "x²",
            },
            {
                fun: new PolyFunc([[1, 3]]),
                rangeX: [-3, 3],
                rangeY: [-10, 10],
                label: "x³",
            },
            {
                fun: new SinFunc(1),
                rangeX: [-10, 10],
                rangeY: [-2, 2],
                label: "sen(x)",
            },
            {
                fun: new CosFunc(1),
                rangeX: [-10, 10],
                rangeY: [-2, 2],
                label: "cos(x)",
            },
        ];

        this.opH = 100;

        let op = this.options[0];
        this.board = new Board(op.fun, 0, 0, w * 0.9, h);
        this.board.rangeX = op.rangeX;
        this.board.rangeY = op.rangeX;
        this.xPos = this.board.rangeX[0];
    }

    update() {
        let g = this.graphics;
        let b = this.board;

        this.xPos += 0.01;
        b.markedTanLines.push(this.xPos);
        b.markedPoints.push([this.xPos, b.fun.valAt(this.xPos)]);

        g.background(0);
        b.display();

        g.image(b.graphics, b.px, b.py);

        let opW = this.w * 0.95;
        g.textSize(24);
        g.fill(255);
        g.noStroke();
        g.textAlign(CENTER, CENTER);
        for (let i = 0; i < this.options.length; i++) {
            let op = this.options[i];
            g.text(op.label, opW, this.opH * i + this.opH / 2);
        }

        super.update();
        image(g, this.px, this.py);

        b.markedTanLines = [];
        b.markedPoints = [];

        if (this.xPos > b.rangeX[1]) this.xPos = b.rangeX[0];
    }

    onKeyPressed(key) {
        super.onKeyPressed(key);
    }

    onMousePressed(button, mx, my) {
        for (let i = 0; i < this.options.length; i++) {
            if (mx > this.w * 0.9) {
                if (my < (i + 1) * this.opH) {
                    this.selectOption(this.options[i]);
                    break;
                }
            }
        }
        super.onMousePressed(button, mx, my);
    }

    selectOption(op) {
        let ac = new TanLine(this.px, this.py, this.w, this.h, true);
        ac.board.fun = op.fun;
        ac.board.rangeX = op.rangeX;
        ac.board.rangeY = op.rangeY;
        ac.xPos = ac.board.rangeX[0];
        act = ac;
    }
}

class DerivativeForming extends Activity {
    constructor(px, py, w, h, hasControls) {
        super(px, py, w, h, hasControls);
        //let fun = new SinFunc(0.4);
        let boardW = w / 2.5;
        let boardH = h / 1.3;

        this.derMarkedPoints = [];

        this.options = [
            {
                fun: new LinFunc(1, 0),
                rangeX: [-10, 10],
                rangeY: [-10, 10],
                label: "x",
            },
            {
                fun: new QuadFunc(1, 0, 0),
                rangeX: [-3.5, 3.5],
                rangeY: [-10, 10],
                label: "x²",
            },
            {
                fun: new PolyFunc([[1, 3]]),
                rangeX: [-3, 3],
                rangeY: [-10, 10],
                label: "x³",
            },
            {
                fun: new SinFunc(1),
                rangeX: [-7, 7],
                rangeY: [-2, 2],
                label: "sen(x)",
            },
            {
                fun: new CosFunc(1),
                rangeX: [-7, 7],
                rangeY: [-2, 2],
                label: "cos(x)",
            },
        ];

        this.opH = 100;

        let op = this.options[1];
        this.board1 = new Board(op.fun, w / 4 - boardW / 2, h / 2 - boardH / 2, boardW, boardH);
        this.board1.rangeX = op.rangeX;
        this.board1.rangeY = op.rangeY;
        this.board1.markedTanLinesWeight = 5;
        this.board1.markedPointsColor = color(0, 255, 0);
        this.board1.markedPointsWeight = 10;

        this.board2 = new Board(op.fun.der(), 3 * (w / 4) - boardW / 2 - this.w * 0.05, h / 2 - boardH / 2, boardW, boardH);
        this.board2.rangeX = op.rangeX;
        this.board2.rangeY = op.rangeY;
        this.board2.showFunction = false;

        this.xPos = this.board1.rangeX[0];
    }

    update() {
        let g = this.graphics;
        let b1 = this.board1;
        let b2 = this.board2;

        this.xPos += 0.005;
        b1.markedTanLines.push(this.xPos);
        b1.markedPoints.push([this.xPos, b1.fun.valAt(this.xPos)]);

        g.background(0);

        let derColor = color(map(b1.fun.derAt(this.xPos), -1, 1, 255, 0), map(b1.fun.derAt(this.xPos), -1, 1, 0, 255), map(b1.fun.derAt(this.xPos), -1, 1, 0, 255));
        b1.markedTanLinesColor = derColor;

        let derX = map(this.xPos, b2.rangeX[0], b2.rangeX[1], b2.px, b2.px + b2.w);
        let derY = map(b2.fun.valAt(this.xPos), b2.rangeY[1], b2.rangeY[0], b2.py, b2.py + b2.h);
        this.derMarkedPoints.push([derX, derY, derColor]);

        b1.display();
        b2.display();

        g.image(b1.graphics, b1.px, b1.py);
        g.image(b2.graphics, b2.px, b2.py);

        g.strokeWeight(10);
        for (let i = 0; i < this.derMarkedPoints.length; i++) {
            g.stroke(this.derMarkedPoints[i][2]);
            g.point(this.derMarkedPoints[i][0], this.derMarkedPoints[i][1]);
        }

        let opW = this.w * 0.95;
        g.textSize(24);
        g.fill(255);
        g.noStroke();
        g.textAlign(CENTER, CENTER);
        for (let i = 0; i < this.options.length; i++) {
            let op = this.options[i];
            g.text(op.label, opW, this.opH * i + this.opH / 2);
        }


        super.update();
        image(g, this.px, this.py);       

        b1.markedTanLines = [];
        b1.markedPoints = [];

        if (this.xPos > b1.rangeX[1]) {
            this.xPos = b1.rangeX[0];
            this.derMarkedPoints = [];
        }
    }

    onKeyPressed(key) {
        super.onKeyPressed(key);
    }

    onMousePressed(button, mx, my) {
        for (let i = 0; i < this.options.length; i++) {
            if (mx > this.w * 0.9) {
                if (my < (i + 1) * this.opH) {
                    this.selectOption(this.options[i]);
                    break;
                }
            }
        }
        super.onMousePressed(button, mx, my);
    }

    selectOption(op) {
        let ac = new DerivativeForming(this.px, this.py, this.w, this.h, true);
        ac.board1.fun = op.fun;
        ac.board1.rangeX = op.rangeX;
        ac.board1.rangeY = op.rangeY;
        ac.xPos = ac.board1.rangeX[0];
        ac.board2.fun = op.fun.der();
        ac.board2.rangeX = op.rangeX;
        ac.board2.rangeY = op.rangeY;
        act = ac;
    }
}