class Board {
    constructor(fun, px, py, w, h) {
        this.fun = fun;
        this.px = px;
        this.py = py;
        this.w = w;
        this.h = h;
        this.showFunction = true;
        this.showAxis = true;
        this.showRanges = true;
        this.showMarkedPoints = true;
        this.showMarkedLines = true;
        this.rangeX = [-2 * Math.PI, 2 * Math.PI];
        this.rangeY = [-60, 60];
        this.bgColor = color(0, 0, 0);
        this.markedPoints = [];
        this.markedXLines = [];
        this.markedYLines = [];
    }

    display(gr) {
        gr.push();
        gr.translate(this.px, this.py);

        gr.fill(this.bgColor);
        gr.stroke(255);
        gr.strokeWeight(1);
        gr.rect(0, 0, this.w, this.h);

        if (this.showAxis) this.drawAxis(gr);

        if (this.showMarkedLines) this.drawMarkedLines(gr);

        if (this.showFunction) this.drawFunction(gr);

        if (this.showMarkedPoints) this.drawMarkedPoints(gr);

        if (this.showRanges) this.drawRanges(gr);

        gr.pop();
    }

    drawMarkedLines(gr){
        gr.push();
        gr.translate(this.w / 2, this.h / 2);

        gr.push();
        gr.scale(1, -1);

        let fx, fy;
        gr.strokeWeight(2);
        gr.stroke(80, 120, 30);
        for (let i = 0; i <= this.markedXLines.length; i++) {
            fx = map(this.markedXLines[i], this.rangeX[0], this.rangeX[1], -this.w / 2, this.w / 2);
            gr.line(fx, this.h / 2, fx, -this.h / 2);
        }

        for (let i = 0; i <= this.markedYLines.length; i++) {
            fy = map(this.markedYLines[i], this.rangeY[0], this.rangeY[1], -this.h / 2, this.h / 2);
            gr.line(this.w / 2, fy, -this.w / 2, fy);
        }

        gr.pop();

        gr.fill(255);
        gr.textSize(16);
        gr.noStroke();


        for (let i = 0; i <= this.markedXLines.length; i++) {
            fx = map(this.markedXLines[i], this.rangeX[0], this.rangeX[1], -this.w / 2, this.w / 2);    
            gr.text(Math.round(this.markedXLines[i] * 10) / 10, fx, 15);
        }

        for (let i = 0; i <= this.markedYLines.length; i++) {
            fy = map(this.markedYLines[i], this.rangeY[0], this.rangeY[1], this.h / 2, -this.h / 2);
            gr.text(Math.round(this.markedYLines[i] * 10) / 10, 20, fy);
        }

        gr.pop();

    }

    drawMarkedPoints(gr){
        gr.push();
        gr.translate(this.w / 2, this.h / 2);
        gr.scale(1, -1);

        gr.strokeWeight(6);
        gr.stroke(255, 0, 0);
        let fx, fy;
        for (let i = 0; i <= this.markedPoints.length; i++) {
            fx = map(this.markedPoints[i], this.rangeX[0], this.rangeX[1], -this.w / 2, this.w / 2);
            fy = map(this.fun.valAt(this.markedPoints[i]), this.rangeY[0], this.rangeY[1], -this.h / 2, this.h / 2);
            gr.point(fx, fy);
        }

        gr.pop();
    }

    drawAxis(gr) {
        gr.stroke(255);
        gr.strokeWeight(1);

        gr.line(0, this.h / 2, this.w, this.h / 2);
        gr.line(this.w / 2, 0, this.w / 2, this.h);
    }

    drawRanges(gr) {
        gr.noStroke();
        gr.fill(255);
        gr.textSize(14);

        gr.textAlign(LEFT, CENTER);
        gr.text("" + Math.round(this.rangeX[0]), 3, this.h / 2 + 10);

        gr.textAlign(RIGHT, CENTER);
        gr.text("" + Math.round(this.rangeX[1]), this.w - 3, this.h / 2 + 10);

        gr.textAlign(CENTER, TOP);
        gr.text("" + Math.round(this.rangeY[1]), this.w / 2 + 10, 3);

        gr.textAlign(CENTER, BOTTOM);
        gr.text("" + Math.round(this.rangeY[0]), this.w / 2 + 10, this.h - 3);
    }

    drawFunction(gr) {
        gr.push();
        gr.translate(this.w / 2, this.h / 2);
        gr.scale(1, -1);

        gr.strokeWeight(1.5);
        gr.stroke(255, 0, 0);
        let fx, fy;
        let lastX = map(this.rangeX[0], this.rangeX[0], this.rangeX[1], -this.w / 2, this.w / 2);
        let lastY = map(this.fun.valAt(this.rangeX[0]), this.rangeY[0], this.rangeY[1], -this.h / 2, this.h / 2);
        for (let i = this.rangeX[0]; i <= this.rangeX[1]; i += 0.1) {
            fx = map(i, this.rangeX[0], this.rangeX[1], -this.w / 2, this.w / 2);
            fy = map(this.fun.valAt(i), this.rangeY[0], this.rangeY[1], -this.h / 2, this.h / 2);
            gr.line(lastX, lastY, fx, fy);
            lastX = fx;
            lastY = fy;
        }

        gr.pop();
    }

    drawPoint(gr, x) {
        gr.push();
        gr.translate(this.w / 2, this.h / 2);
        gr.scale(1, -1);

        gr.strokeWeight(1.5);
        gr.stroke(255, 0, 0);
        let fx = map(x, this.rangeX[0], this.rangeX[1], -this.w / 2, this.w / 2);
        let fy = map(this.fun.valAt(x), this.rangeY[0], this.rangeY[1], -this.h / 2, this.h / 2);
        gr.point(fx, fy);

        gr.pop();
    }
}