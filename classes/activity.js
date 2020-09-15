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
        b.display();
        g.image(b.graphics, b.px, b.py);
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
        this.fun = new LinFunc(1, 0);

        this.board = new Board(this.fun, w / 4, h / 3, w / 2, h / 1.8);
        this.board.rangeY = [-6, 6];
        this.board.showFunction = false;

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
                    if(this.justRestarted){
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

        image(g, this.px, this.py);
    }

    calculateLabel() {
        this.funcLabelText = "f(" + this.labelParam + ") = " + this.fun.label("(" + this.labelParam + ")") + " = " + this.labelY;
        this.graphics.textSize(this.labelTextSize);
        this.funcLabelWidth = this.graphics.textWidth(this.funcLabelText);
        this.labelXPos = [this.labelPos[0] - this.funcLabelWidth / 2 + 40, this.labelPos[1]];
        this.labelYPos = [this.labelPos[0] + this.funcLabelWidth / 2 - 16, this.labelPos[1]];
    }

    onKeyPressed(key) {

    }

    onMousePressed(button, mx, my) {

    }

}