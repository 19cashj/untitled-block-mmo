var iso = new Isomer(document.getElementById("canvas"));
const ctx = document.getElementById("canvas").getContext('2d');

var Shape = Isomer.Shape;
var Point = Isomer.Point;

iso.add(Shape.Prism(Point.ORIGIN, 1, 1, 1));

var blue = new Isomer.Color(50, 60, 160);
var cube = Shape.Prism(Point.ORIGIN, 1, 1, 1);

let i = 1;
iso.add(cube
    .rotateZ(Point(1, 1.5, 0), 2 / i)
    .translate(0, 0, 2)
    , blue);  
const spin = setInterval(() => {
    ctx.fillStyle = `white`;
    ctx.fillRect(0,0,canvas.width,canvas.height);
    i-=0.03
    iso.add(cube
        .rotateZ(Point(0.5, 0.5, 0), i)
        , blue);   
}, 10);
const colorChange = setInterval(() => {
    Math.floor(Math.random() * 50)
    blue = new Isomer.Color(Math.ceil(Math.random() * 160), Math.ceil(Math.random() * 160), Math.ceil(Math.random() * 160));
}, 2300);