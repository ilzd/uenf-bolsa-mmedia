const INF = 999999;

class Activity {
    constructor(px, py, w, h) {
        this.px = px;
        this.py = py;
        this.w = w;
        this.h = h;
        this.graphics = createGraphics(w, h);
    }

    update() { }

    onKeyPressed(key) { }

    onMousePressed(button, mx, my) { }
}

class SimpleGraph extends Activity {
    constructor(px, py, w, h) {
        super(px, py, w, h);
        this.board = new Board(new SinFunc(50), 0, 0, w, h);
    }

    update() {
        let g = this.graphics;
        let b = this.board;

        g.background(127, 80, 56);
        b.display(g);
        image(g, this.px, this.py);
    }

    onKeyPressed(key) {
    }

    onMousePressed(button, mx, my) {
    }
}

class CurveForming extends Activity {
    constructor(px, py, w, h) {
        super(px, py, w, h);
        this.fun = new QuadFunc(2, 0, 0);

        this.board = new Board(this.fun, w / 4, h / 3, w / 2, h / 1.8);
        this.board.showFunction = false;

        this.labelTextSize = 64;
        this.funcLabelText = "f(x) = " + this.fun.label("x") + " = y";
        this.labelPos = [this.w / 2, this.h / 6];
        this.graphics.textSize(this.labelTextSize);
        this.funcLabelWidth = this.graphics.textWidth(this.funcLabelText);
        this.labelXPos = [this.labelPos[0] - this.funcLabelWidth / 2 + 55, this.labelPos[1]];
        this.labelYPos = [this.labelPos[0] + this.funcLabelWidth / 2 - 16, this.labelPos[1]];

        this.waitDuration = 0;
        this.waitTimer = this.waitDuration;
        this.animationStage = 0;
        this.animationPosition = 0;

        this.newPoint;
    }

    update() {
        let g = this.graphics;
        let b = this.board;

        g.background(0);
        b.display(g);

        g.fill(255);
        g.noStroke();
        g.textSize(64);
        g.textAlign(CENTER, CENTER);
        g.text(this.funcLabelText, this.labelPos[0], this.labelPos[1]);

        if (this.waitTimer > 0) {
            this.waitTimer--;
        } else {
            switch (this.animationStage) {
                case 0:
                    this.newPoint = b.rangeX[0] + Math.random() * (b.rangeX[1] - b.rangeX[0]);
                    b.markedXLines.push(this.newPoint);
                    this.animationStage += 2;
                    this.animationPosition = 0;
                    break;
                case 1:
                    g.stroke(255, 255, 0);
                    g.strokeWeight(10);
                    g.point(map(Math.sqrt(this.animationPosition), 0, 1, 0, this.w), this.h / 2);
                    this.animationPosition += 0.01;
                    if(this.animationPosition >= 1){
                        this.animationStage++;
                        this.animationPosition = 0;
                        this.waitTimer = this.waitDuration;
                    }
                    break;
                case 2:
                    b.markedYLines.push(this.fun.valAt(this.newPoint));
                    this.animationStage++;
                    break;
                case 3:
                    b.markedPoints.push(this.newPoint);
                    this.animationStage++;
                    break;
                case 4:
                    b.markedXLines = [];
                    b.markedYLines = [];
                    this.animationStage = 0;
                    break;
                default:
                    break;
            }
            this.waitTimer = this.waitDuration;
        }

        image(g, this.px, this.py);
    }

    onKeyPressed(key) {

    }

    onMousePressed(button, mx, my) {

    }

}