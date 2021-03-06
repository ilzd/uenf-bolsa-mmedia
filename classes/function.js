class Func {
    constructor() {
    }

    //Retorna o valor desta função no ponto x
    valAt(x) { }

    //Retorna a derivada desta função no ponto x
    derAt(x) { }

    //Retorna a função derivada desta função
    der() { }

    //Retorna uma cópia desta função
    copy() { }

    //Retorna o "label" desta função utilizando
    //"param" como variável independente
    label(param){}
}

class SumFunc extends Func {
    //f(x) = g(x) + h(x)
    constructor(g, h) {
        super();
        this.g = g;
        this.h = h;
    }

    //f(x) = g(x) + h(x)
    valAt(x) {
        return this.g.valAt(x) + this.h.valAt(x);
    }

    //f'(x) = g'(x) + h'(x)
    derAt(x) {
        return this.g.derAt(x) + this.h.derAt(x);
    }

    //f'(x) = g'(x) + h'(x)
    der() {
        return new SumFunc(
            this.g.der(),
            this.h.der()
        )
    }

    copy() {
        return new SumFunc(
            this.g.copy(),
            this.h.copy()
        );
    }

    label(param){
        return "(" + this.g.label(param) + ") + (" + this.h.label(param) + ")";
    }
}

class SubFunc extends Func {
    //f(x) = g(x) - h(x)
    constructor(g, h) {
        super();
        this.g = g;
        this.h = h;
    }

    //f(x) = g(x) - h(x)
    valAt(x) {
        return this.g.valAt(x) - this.h.valAt(x);
    }

    //f'(x) = g'(x) - h'(x)
    derAt(x) {
        return this.g.derAt(x) - this.h.derAt(x);
    }

    //f'(x) = g'(x) - h'(x)
    der() {
        return new SubFunc(
            this.g.der(),
            this.h.der()
        )
    }

    copy() {
        return new SubFunc(
            this.g.copy(),
            this.h.copy()
        );
    }

    label(param){
        return "(" + this.g.label(param) + ") - (" + this.h.label(param) + ")";
    }
}

class ProdFunc extends Func {
    //f(x) = g(x) * h(x)
    constructor(g, h) {
        super();
        this.g = g;
        this.h = h;
    }

    //f(x) = g(x) * h(x)
    valAt(x) {
        return this.g.valAt(x) * this.h.valAt(x);
    }

    //f'(x) = g'(x) * h(x) + g(x) * h'(x)
    derAt(x) {
        return this.g.derAt(x) * this.h.valAt(x) + this.g.valAt(x) * this.h.derAt(x);
    }

    //f'(x) = g'(x) * h(x) + g(x) * h'(x)
    der() {
        return new SumFunc(
            new ProdFunc(
                this.g.copy(),
                this.h.der()
            ),
            new ProdFunc(
                this.g.der(),
                this.h.copy()
            )
        )
    }

    copy() {
        return new ProdFunc(
            this.fun1.copy(),
            this.fun2.copy()
        );
    }

    label(param){
        return "(" + this.g.label(param) + ") * (" + this.h.label(param) + ")";
    }
}

class QuocFunc extends Func {
    //f(x) = g(x) / h(x)
    constructor(g, h) {
        super();
        this.g = g;
        this.h = h;
    }

    //f(x) = g(x) / h(x)
    valAt(x) {
        return this.g.valAt(x) / this.h.valAt(x);
    }

    //f'(x) = (g'(x) * h(x) - g(x) * h'(x)) / (h(x) * h(x))
    derAt(x) {
        return (this.g.derAt(x) * this.h.valAt(x) - this.g.valAt(x) * this.h.derAt(x)) / (this.h.valAt(x) * this.h.valAt(x));
    }

    //f'(x) = (g'(x) * h(x) - g(x) * h'(x)) / (h(x) * h(x))
    der() {
        return new QuocFunc(
            new SubFunc(
                new ProdFunc(
                    this.g.der(),
                    this.h.copy()
                ),
                new ProdFunc(
                    this.g.copy(),
                    this.h.der()
                )
            ),
            new ProdFunc(
                this.h.copy(),
                this.h.copy()
            )
        )
    }

    copy() {
        return new QuocFunc(
            this.g.copy(),
            this.h.copy()
        );
    }

    label(param){
        return "(" + this.g.label(param) + ") / (" + this.h.label(param) + ")";
    }
}

class ConsFunc extends Func {
    //f(x) = c
    constructor(c) {
        super();
        this.c = c;
    }

    //f(x) = c
    valAt(x) {
        return this.c;
    }

    //f'(x) = 0
    derAt(x) {
        return 0;
    }

    //f'(x) = 0
    der() {
        return new ConFunc(0);
    }

    copy() {
        return new ConsFunc(this.c);
    }

    label(param){
        return "" + this.c;;
    }
}

class PolyFunc extends Func {
    //f(x) = a + b*x + c*x^2 + d*x^3 + e*x^4 + ...
    constructor(params) {
        super();
        this.params = params;
    }

    valAt(x) {
        let y = 0;
        for (let i = 0; i < this.params.length; i++) {
            y += this.params[i][0] * Math.pow(x, this.params[i][1]);
        }

        return y;
    }

    derAt(x) {
        let d = 0;
        for (let i = 0; i < this.params.length; i++) {
            d += this.params[i][1] * this.params[i][0] * Math.pow(x, this.params[i][1] - 1);
        }

        return d;
    }

    der() {
        let derParams = [];
        for (let i = 0; i < this.params.length; i++) {
            derParams.push([]);
            derParams[i][0] = this.params[i][1] * this.params[i][0];
            derParams[i][1] = this.params[i][1] - 1;
        }

        return new PolyFunc(derParams);
    }

    copy() {
        let cParams = [];
        for (let i = 0; i < this.params.length; i++) {
            cParams.push([]);
            cParams[i][0] = this.params[i][0];
            cParams[i][1] = this.params[i][1];
        }

        return new PolyFunc(cParams);
    }

    label(param){
        let lab = "", check = false;

        for(let i = 0; i < this.params.length; i++){
            if(this.params[i][0] != 0){
                if(check) lab += " + ";

                lab += (this.params[i][0] != 1) ? "" + this.params[i][0] + param : param;
                lab += "^" + this.params[i][1];
                check = true;
            }
        }

        return lab;
    }
}

class SinFunc extends Func {
    //f(x) = a * sin(x)
    constructor(a) {
        super();
        this.a = a;
    }

    //f(x) = a * sin(x)
    valAt(x) {
        return this.a * Math.sin(x);
    }

    //f(x) = a * cos(x)
    derAt(x) {
        return this.a * Math.cos(x);
    }

    //f(x) = a * cos(x)
    der() {
        return new CosFunc(this.a);
    }

    copy() {
        return new SinFunc(this.a);
    }

    label(param){
        return "" + this.a + "sen(" + param + ")";
    }
}

class CosFunc extends Func {
    //f(x) = a * cos(x)
    constructor(a) {
        super();
        this.a = a;
    }

    //f(x) = a * cos(x)
    valAt(x) {
        return this.a * Math.cos(x);
    }

    //f(x) = -a * sin(x)
    derAt(x) {
        return -1 * this.a * Math.sin(x);
    }

    //f(x) = -a * sin(x)
    der() {
        return new SinFunc(-1 * this.a);
    }

    copy() {
        return new CosFunc(this.a);
    }

    label(param){
        return "" + this.a + "cos(" + param + ")";
    }
}

class LinFunc extends Func {
    //f(x) = ax + b
    constructor(a, b) {
        super();
        this.a = a;
        this.b = b;
    }

    //f(x) = ax + b
    valAt(x) {
        return this.a * x + this.b;
    }

    //f(x) = a
    derAt(x) {
        return this.a;
    }

    //f(x) = a
    der() {
        return new ConsFunc(this.a);
    }

    copy() {
        return new LinFunc(this.a, this.b);
    }

    label(param){
        let lab = "", check = false;
        if(this.a != 0) {
            lab += (this.a != 1) ? this.a : "";
            lab += param;
            check = true;
        }
        if(this.b != 0) {
            if(check) lab += " + ";
            lab += this.b;
        }

        return lab;
    }
}

class QuadFunc extends Func {
    //f(x) = ax^2 + bx + c
    constructor(a, b, c) {
        super();
        this.a = a;
        this.b = b;
        this.c = c;
    }

    //f(x) = ax^2 + bx + c
    valAt(x) {
        return this.a * Math.pow(x, 2) + this.b * x + this.c;
    }

    //f(x) = 2ax + b
    derAt(x) {
        return 2 * this.a * x + this.b;
    }

    //f(x) = 2ax + b
    der() {
        return new LinFunc(2 * this.a, this.b);
    }

    copy() {
        return new QuadFunc(this.a, this.b, this.c);
    }

    label(param){
        let lab = "", check = false;
        if(this.a != 0) {
            lab += (this.a != 1) ? this.a : "";
            lab += param + "^2";
            check = true;
        }
        if(this.b != 0) {
            if(check) lab += " + ";
            lab += (this.b != 1) ? this.b : "";
            lab += param;
            check = true;
        }
        if(this.c != 0) {
            if(check) lab += " + ";
            lab += this.c;
        }

        return lab;
    }
}