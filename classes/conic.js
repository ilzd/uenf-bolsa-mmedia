class Conic {

    draw(board) {

    }

    label() {

    }
}

class Circle extends Conic {
    constructor(r) {
        super();
        this.r = r;
    }

    draw(board) {
        let gr = board.graphics;
        gr.stroke(255, 0, 0);
        gr.strokeWeight(1);
        gr.noFill();
        gr.ellipse(0, 0, this.r * 2, this.r * 2);
    }

    label() {
        return "x² + y² = " + Math.round(this.r) + "²";
    }
}

class Ellipse extends Conic {
    constructor(a, b) {
        super();
        this.a = a;
        this.b = b;
    }

    draw(board) {
        let gr = board.graphics;
        gr.stroke(255, 0, 0);
        gr.strokeWeight(1);
        gr.noFill();
        gr.ellipse(0, 0, this.a * 2, this.b * 2);
    }

    label() {
        return "x²/" + round(this.a) + "² + y²/" + round(this.b) + "² = 1";
    }
}

class Parabola extends Conic {
    constructor(p) {
        super();
        this.p = p;
    }

    draw(board) {
        let gr = board.graphics;
        gr.stroke(255, 0, 0);
        gr.strokeWeight(1);
        gr.noFill();
        let fun = new QuadFunc(-1 / (2 * this.p), 0, 0);
        let step = 0.1;
        for(let i = board.rangeX[0] + step; i < board.rangeX[1]; i += step){
            gr.line(i - 1, fun.valAt(i - 1), i, fun.valAt(i));
        }
    }

    label() {
        return "x² = " + round(2 * this.p) + "y";
    }
}

class Hiperbole extends Conic {
    constructor(p) {
        super();
        this.p = p;
    }

    draw(board) {
        let gr = board.graphics;
        gr.stroke(255, 0, 0);
        gr.strokeWeight(1);
        gr.noFill();
        let fun = new QuadFunc(-1 / (2 * this.p), 0, 0);
        let step = 0.1;
        for(let i = board.rangeX[0] + step; i < board.rangeX[1]; i += step){
            gr.line(i - 1, fun.valAt(i - 1), i, fun.valAt(i));
        }
    }

    label() {
        return "x² = " + round(2 * (this.p)) + "y";
    }
}