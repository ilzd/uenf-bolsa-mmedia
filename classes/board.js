class Board {
    constructor(fun, px, py, w, h) {
        this.fun = fun;
        this.px = px;
        this.py = py;
        this.w = w;
        this.h = h;
        this.graphics = createGraphics(w, h);
        this.showFunction = true;
        this.showAxis = true;
        this.showRanges = true;
        this.showMarkedPoints = true;
        this.showMarkedLines = true;
        this.showMarkedTanLines = true;
        this.showFunctionLabel = true;
        this.rangeX = [-50, 50];
        this.rangeY = [-50, 50];
        this.bgColor = color(0, 10, 0);
        this.markedPoints = [];
        this.markedXLines = [];
        this.markedYLines = [];
        this.markedTanLines = [];

        this.markedTanLinesColor = color(255, 255, 80);
        this.markedTanLinesWeight = 2;

        this.markedPointsColor = color(255, 0, 0);
        this.markedPointsWeight = 8;
    }

    display() {
        let gr = this.graphics;
        gr.background(0);

        gr.fill(this.bgColor);
        gr.noStroke();
        gr.rect(1, 1, this.w - 2, this.h - 2);

        //Desenha os eixos somente se o estado do quadro indica que sim
        if (this.showAxis) this.drawAxis(gr);

        //Desenha assíntotas selecionadas somente se o estado do quadro indica que sim
        if (this.showMarkedLines) this.drawMarkedLines(gr);

        //Desenha a curva da função somente se o estado do quadro indica que sim
        if (this.showFunction) this.drawFunction(gr);

        //Desenha retas tangentes selecionadas somente se o estado do quadro indica que sim
        if (this.showMarkedTanLines) this.drawMarkedTanLines(gr);

        //Desenha pontos selecionadas somente se o estado do quadro indica que sim
        if (this.showMarkedPoints) this.drawMarkedPoints(gr);

        //Desenha os limites do plano somente se o estado do quadro indica que sim
        if (this.showRanges) this.drawRanges(gr);

        //Desenha o "label" da função somente se o estado do quadro indica que sim
        if (this.showFunctionLabel) this.drawFunctionLabel(gr);

        gr.noFill();
        gr.stroke(255);
        gr.strokeWeight(.5);
        gr.rect(1, 1, this.w - 2, this.h - 2);
    }

    drawFunctionLabel() {
        let gr = this.graphics;
        gr.textAlign(CENTER, TOP);
        gr.fill(255, 127);
        gr.textSize(24);
        gr.text("f(x) = " + this.fun.label("x"), 3 * (this.w / 4), 10);
    }

    drawMarkedTanLines() {
        let gr = this.graphics;
        gr.push();
        gr.translate(this.w / 2, this.h / 2);

        let fx, fy;
        gr.strokeWeight(this.markedTanLinesWeight);
        gr.stroke(this.markedTanLinesColor);
        for (let i = 0; i < this.markedTanLines.length; i++) {
            let px = this.markedTanLines[i], py = this.fun.valAt(px);
            fx = map(px, this.rangeX[0], this.rangeX[1], -this.w / 2, this.w / 2);
            fy = map(py, this.rangeY[1], this.rangeY[0], -this.h / 2, this.h / 2);

            let der = this.fun.derAt(px);
            let ang = Math.atan(der);
            let auxP1 = [px - Math.cos(ang) * (this.w + this.h), py - Math.sin(ang) * (this.w + this.h)];
            let auxP2 = [px + Math.cos(ang) * (this.w + this.h), py + Math.sin(ang) * (this.w + this.h)];
            auxP1[0] = map(auxP1[0], this.rangeX[0], this.rangeX[1], -this.w / 2, this.w / 2);
            auxP1[1] = map(auxP1[1], this.rangeY[1], this.rangeY[0], -this.h / 2, this.h / 2);
            auxP2[0] = map(auxP2[0], this.rangeX[0], this.rangeX[1], -this.w / 2, this.w / 2);
            auxP2[1] = map(auxP2[1], this.rangeY[1], this.rangeY[0], -this.h / 2, this.h / 2);
            gr.line(auxP1[0], auxP1[1], auxP2[0], auxP2[1]);
        }

        gr.pop();
    }

    drawMarkedLines() {
        let gr = this.graphics;
        gr.push();
        gr.translate(this.w / 2, this.h / 2);

        gr.push();
        gr.scale(1, -1);

        let fx, fy;
        gr.strokeWeight(1.5);
        gr.stroke(80, 120, 30);
        for (let i = 0; i < this.markedXLines.length; i++) {
            fx = map(this.markedXLines[i], this.rangeX[0], this.rangeX[1], -this.w / 2, this.w / 2);
            gr.line(fx, this.h / 2, fx, -this.h / 2);
        }

        for (let i = 0; i < this.markedYLines.length; i++) {
            fy = map(this.markedYLines[i], this.rangeY[0], this.rangeY[1], -this.h / 2, this.h / 2);
            gr.line(this.w / 2, fy, -this.w / 2, fy);
        }

        gr.pop();

        gr.fill(255);
        gr.textSize(16);
        gr.noStroke();


        for (let i = 0; i < this.markedXLines.length; i++) {
            fx = map(this.markedXLines[i], this.rangeX[0], this.rangeX[1], -this.w / 2, this.w / 2);
            gr.text(Math.round(this.markedXLines[i] * 10) / 10, fx, 15);
        }

        for (let i = 0; i < this.markedYLines.length; i++) {
            fy = map(this.markedYLines[i], this.rangeY[0], this.rangeY[1], this.h / 2, -this.h / 2);
            gr.text(Math.round(this.markedYLines[i] * 10) / 10, 20, fy);
        }

        gr.pop();

    }

    drawMarkedPoints() {
        let gr = this.graphics;
        gr.push();
        gr.translate(this.w / 2, this.h / 2);
        gr.scale(1, -1);

        gr.strokeWeight(this.markedPointsWeight);
        gr.stroke(this.markedPointsColor);
        let fx, fy;
        for (let i = 0; i < this.markedPoints.length; i++) {
            fx = map(this.markedPoints[i][0], this.rangeX[0], this.rangeX[1], -this.w / 2, this.w / 2);
            fy = map(this.markedPoints[i][1], this.rangeY[0], this.rangeY[1], -this.h / 2, this.h / 2);
            gr.point(fx, fy);
        }

        gr.pop();
    }

    drawAxis() {
        let gr = this.graphics;
        gr.stroke(255);
        gr.strokeWeight(1);

        gr.line(0, this.h / 2, this.w, this.h / 2);
        gr.line(this.w / 2, 0, this.w / 2, this.h);
    }

    drawRanges() {
        let gr = this.graphics;
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

    drawFunction() {
        let gr = this.graphics;
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

    drawPoint(x) {
        let gr = this.graphics;
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

class BoardC {
    constructor(conic, px, py, w, h) {
        this.conic = conic;
        this.px = px;
        this.py = py;
        this.w = w;
        this.h = h;
        this.graphics = createGraphics(w, h);
        this.showAxis = true;
        this.showRanges = true;
        this.showConicLabel = true;
        this.rangeX = [-50, 50];
        this.rangeY = [-50, 50];
        this.bgColor = color(0, 10, 0);
    }

    display() {
        let gr = this.graphics;
        gr.background(0);

        gr.fill(this.bgColor);
        gr.noStroke();
        gr.rect(1, 1, this.w - 2, this.h - 2);

        //Desenha os eixos somente se o estado do quadro indica que sim
        if (this.showAxis) this.drawAxis(gr);

        //Desenha os limites do plano somente se o estado do quadro indica que sim
        if (this.showRanges) this.drawRanges(gr);

        //Desenha o "label" da função somente se o estado do quadro indica que sim
        if (this.showConicLabel) this.drawConicLabel(gr);

        this.drawConic();

        gr.noFill();
        gr.stroke(255);
        gr.strokeWeight(.5);
        gr.rect(1, 1, this.w - 2, this.h - 2);
    }

    drawConic() {
        let gr = this.graphics;
        gr.push();
        gr.translate(this.w / 2, this.h / 2);
        gr.scale(this.w / (this.rangeX[1] - this.rangeX[0]), this.h / (this.rangeY[1] - this.rangeY[0]));
        this.conic.draw(this);
        gr.pop();
    }

    drawConicLabel() {
        let gr = this.graphics;
        gr.textAlign(CENTER, TOP);
        gr.fill(255, 127);
        gr.textSize(24);
        gr.text(this.conic.label(), 3 * (this.w / 4), 10);
    }

    drawAxis() {
        let gr = this.graphics;
        gr.stroke(255);
        gr.strokeWeight(1);

        gr.line(0, this.h / 2, this.w, this.h / 2);
        gr.line(this.w / 2, 0, this.w / 2, this.h);
    }

    drawRanges() {
        let gr = this.graphics;
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

}

class BoardV {
    constructor(vec, px, py, w, h) {
        this.vec = vec;
        this.px = px;
        this.py = py;
        this.w = w;
        this.h = h;
        this.graphics = createGraphics(w, h);
        this.showAxis = true;
        this.showRanges = true;
        this.showVecLabel = true;
        this.rangeX = [-50, 50];
        this.rangeY = [-50, 50];
        this.bgColor = color(0, 10, 0);
        this.sliders;
    }

    display() {
        let gr = this.graphics;
        gr.background(0);

        gr.fill(this.bgColor);
        gr.noStroke();
        gr.rect(1, 1, this.w - 2, this.h - 2);

        //Desenha os eixos somente se o estado do quadro indica que sim
        if (this.showAxis) this.drawAxis(gr);

        //Desenha os limites do plano somente se o estado do quadro indica que sim
        if (this.showRanges) this.drawRanges(gr);

        //Desenha o "label" da função somente se o estado do quadro indica que sim
        if (this.showVecLabel) this.drawVectorLabel(gr);

        this.drawVector();
        this.updateSliders();

        gr.noFill();
        gr.stroke(255);
        gr.strokeWeight(.5);
        gr.rect(1, 1, this.w - 2, this.h - 2);
    }

    drawVector() {
        let gr = this.graphics;
        gr.push();
        gr.translate(this.w / 2, this.h / 2);
        gr.scale(this.w / (this.rangeX[1] - this.rangeX[0]), -this.h / (this.rangeY[1] - this.rangeY[0]));
        for (let i = 0; i < this.vec.length; i++) {
            this.vec[i].draw(this);
        }
        gr.pop();
    }

    drawVectorLabel() {
        let gr = this.graphics;
        gr.textAlign(CENTER, TOP);
        gr.fill(255, 127);
        gr.textSize(24);
        for (let i = 0; i < this.vec.length; i++) {
            gr.text(this.vec[i].label(), 3 * (this.w / 4), 10 + 25 * i);
        }
    }

    drawAxis() {
        let gr = this.graphics;
        gr.stroke(255);
        gr.strokeWeight(1);

        gr.line(0, this.h / 2, this.w, this.h / 2);
        gr.line(this.w / 2, 0, this.w / 2, this.h);
    }

    drawRanges() {
        let gr = this.graphics;
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

    updateSliders() {
        push();
        let gr = this.graphics;
        let sliderXRange = { min: gr.width * 0.7, max: gr.width * 0.95 };
        gr.stroke(255);
        gr.strokeWeight(2);
        gr.textAlign(LEFT, CENTER);
        for (let i = 0; i < this.sliders.length; i++) {
            let currentVec = this.sliders[i].vec;
            let sliderY1 = gr.height * 0.95 - (gr.height * 0.1 * i);
            let sliderY2 = gr.height * 0.95 - (gr.height * 0.1 * i) + 20;
            gr.fill(255);
            gr.text(currentVec.id + " = (" + round(currentVec.vec.x) + ", " + round(currentVec.vec.y) + ")", sliderXRange.min, sliderY1 - 25);
            gr.line(sliderXRange.min, sliderY1, sliderXRange.max, sliderY1);
            gr.line(sliderXRange.min, sliderY2, sliderXRange.max, sliderY2);
            gr.fill(255, 0, 0);
            gr.ellipse(map(currentVec.vec.x, -this.sliders[i].xRange, this.sliders[i].xRange, sliderXRange.min, sliderXRange.max), sliderY1, 15, 15);
            gr.ellipse(map(currentVec.vec.y, -this.sliders[i].yRange, this.sliders[i].yRange, sliderXRange.min, sliderXRange.max), sliderY2, 15, 15);

            if (mouseIsPressed) {
                if (mouseY > sliderY1 - 8 && mouseY < sliderY1 + 8) {
                    let mouseXPos = mouseX - this.px;
                    if (mouseXPos >= sliderXRange.min && mouseXPos <= sliderXRange.max) {
                        currentVec.vec.x = map(mouseXPos, sliderXRange.min, sliderXRange.max, -this.sliders[i].xRange, this.sliders[i].xRange);
                    }
                }
                if (mouseY > sliderY2 - 8 && mouseY < sliderY2 + 8) {
                    let mouseXPos = mouseX - this.px;
                    if (mouseXPos >= sliderXRange.min && mouseXPos <= sliderXRange.max) {
                        currentVec.vec.y = map(mouseXPos, sliderXRange.min, sliderXRange.max, -this.sliders[i].yRange, this.sliders[i].yRange);
                    }
                }
            }
        }
        pop();
    }

}