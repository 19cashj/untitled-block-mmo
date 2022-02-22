var canvas = document.getElementById("canvas01");
const ctx = canvas.getContext('2d');
const parent = document.querySelector('.parent');

var iso = new Isomer(canvas);
var Shape = Isomer.Shape;
var Point = Isomer.Point;
var Color = Isomer.Color;
var Path = Isomer.Path;
var selectedColor = new Color(100, 0, 0, 0.4);

let shapes = [];
let clickables = [];

const clickFunctions = [
  function logClick(event) {
    console.log(`clicked ${event.target.id}`)
  },
  function placeBlock(event) {
    event.target.classList.remove('hoverable');
    event.target.replaceWith(event.target.cloneNode(true));
    let x = Number(event.target.getAttribute('x'));
    let y = Number(event.target.getAttribute('y'));
    let z = Number(event.target.getAttribute('z'));
    iso.add(Shape.Prism(new Point(x, y, z)));
    shapes.push({x: x, y: y, z: z});
    draw();
  }
];

const interactionHandlers = [
  function mouseOver(event) {
    document.body.style.cursor = "pointer";
  },
  function mouseOut(event) {
    document.body.style.cursor = "default";
  }
];

const stageLoaders = [
  function stageOne() {
    let clickContainer1 = document.createElement("div");
    let clickContainer2 = document.createElement("div");
    clickContainer1.classList.add('clickareas1')
    clickContainer1.classList.add('buildborder')
    clickContainer2.classList.add('clickareas2')
    parent.append(clickContainer1)
    parent.append(clickContainer2)
    for (i=0, x=15, y=15; i<225; i++) {
      if (y==0) {
        x--;
        y=15;
      }
      let clickArea = document.createElement("div");
      clickArea.classList.add('clickarea');
      clickArea.classList.add('hoverable');
      clickArea.classList.add('layer1');
      clickArea.setAttribute('x', x);
      clickArea.setAttribute('y', y)
      clickArea.setAttribute('z', 0)
      clickContainer1.appendChild(clickArea);
      clickables.push(clickArea);
      y--;
    }
    for (i=0, x=15, y=15; i<225; i++) {
      if (y==0) {
        x--;
        y=15;
      }
      let clickArea = document.createElement("div");
      clickArea.classList.add('clickarea');
      clickArea.classList.add('layer2');
      clickArea.setAttribute('x', x);
      clickArea.setAttribute('y', y)
      clickArea.setAttribute('z', 1)
      clickContainer2.appendChild(clickArea);
      y--;
    }
  }
];

function changeLayer(layerNum, dir="up") {
  if (layerNum>=1) {
    let nextLayer;
    let nextLayerSelect;
    if (dir=='up') {
      nextLayer = document.querySelectorAll(`.layer${layerNum-1}:not(.hoverable)`)
      document.querySelector(`.clickareas${layerNum-1}`).style.zIndex = '0';
      document.querySelector(`.clickareas${layerNum-1}`).classList.remove('buildborder');
    }
    else {
      nextLayer = document.querySelectorAll(`.layer${layerNum+1}:not(.hoverable)`)
      document.querySelector(`.clickareas${layerNum+1}`).style.zIndex = '0';
      document.querySelector(`.clickareas${layerNum+1}`).classList.remove('buildborder');
    }
    for (i=0;i<clickables.length;i++) {
      clickables[i].classList.remove('hoverable');
      clickables[i].replaceWith(clickables[i].cloneNode(true));
    }
    clickables = [];
    for (i=0;i<nextLayer.length;i++) {
      let x = nextLayer[i].getAttribute('x');
      let y = nextLayer[i].getAttribute('y');
      let z = nextLayer[i].getAttribute('z');
      if (dir=='up') {
        nextLayerSelect = document.querySelector(`[x="${x}"][y="${y}"][z="${Number(z+1)}"]`)
      }
      else {
        nextLayerSelect = document.querySelector(`[x="${x}"][y="${y}"][z="${Number(z-1)}"]`)
      }
      nextLayerSelect.classList.add('hoverable');
      clickables.push(nextLayerSelect)
      nextLayerSelect.addEventListener("mouseover", interactionHandlers[0]);
      nextLayerSelect.addEventListener("mouseout", interactionHandlers[1]);
      nextLayerSelect.addEventListener("click", clickFunctions[1]);
    }
    document.querySelector(`.clickareas${layerNum}`).style.zIndex = '1';
    document.querySelector(`.clickareas${layerNum}`).classList.add('buildborder');
  }
  // Get list of current elements that are hoverable and remove them from clickables.
  // Then add elements from next layer based on the elements from the current layer that were not hoverable
  // Finally, change z indexes
}


function draw() {
  // Real Render:
  iso.canvas.clear();
  iso.add(Shape.Prism(Point.ORIGIN, 15, 15, 1));
  shapes.sort(function (a, b) {
    return b.y - a.y;
  });
  shapes.sort(function (a, b) {
    return b.x - a.x;
  });
  shapes.map((e) => {
    iso.add(Shape.Prism(new Point(e.x, e.y, e.z)), selectedColor);
  })
}

init();
draw();

function init() {
  stageLoaders[0]();
  clickables.forEach((e, index) => {
    e.addEventListener("mouseover", interactionHandlers[0]);//
    e.addEventListener("mouseout", interactionHandlers[1]);
    e.addEventListener("click", clickFunctions[1]);
  })
  window.addEventListener('wheel', function(event) {
    if (event.deltaY < 0)
    {
      changeLayer(2, 'up')
    }
    else if (event.deltaY > 0)
    {
      changeLayer(1, 'down')
    }
  });
}