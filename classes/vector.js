class Vector {
    constructor(x, y, id){
        this.id = id;
        this.vec = createVector(x, y);
        this.origin = [0, 0];
        this.color = color(255, 0, 0);
    }

    draw(board) {
        let gr = board.graphics;
        gr.stroke(this.color);
        gr.strokeWeight(1);
        gr.line(this.origin[0], this.origin[1], this.vec.x, this.vec.y);
        gr.push();
        gr.translate(this.vec.x, this.vec.y);

        gr.push();
        gr.rotate(HALF_PI - atan2(this.vec.x, this.vec.y));
        gr.triangle(0, -0.5, 0, 0.5, 1  , 0);
        gr.pop();

        gr.push();
        gr.scale(0.1    , -0.1);
        gr.fill(255);
        gr.stroke(255, 0, 0);
        gr.text(this.id, this.vec.x, this.vec.y + 20);  
        gr.pop();
        
        gr.pop();
    }

    label() {
        return this.id + ' = (' + round(this.vec.x) + ", " + round(this.vec.y) + ")";
    }
}