interface Features {
    squareWidth: number;
    squareHeight: number;
    ncol: number;
    nrow: number;
    bgColor: string;
}

interface Shape{
    height: number,
    width?: number,
    color: string
}

const setUpFeatures: Features = {
    squareWidth: 100,
    squareHeight: 50,
    ncol: 30,
    nrow: 30,
    bgColor: "black"
}

type Direction = "up" | "down" | "left" | "right";

interface CoordSpeed {
    x: number,
    y: number
}

class Sprite{
    loc: CoordSpeed;
    imgSource: string;
    clock: number;
    img

    constructor(loc: CoordSpeed, imgSource: string, clock: number = 0){
        this.loc = loc;
        this.imgSource = imgSource;
        this.img = new Image();
        this.img.src = imgSource;
        this.clock = clock;
    }

    move(coord: CoordSpeed) :void {
        this.loc.x = coord.x;
        this.loc.y = coord.y;
    }
}

class Alien extends Sprite{
    direction: Direction;
    speed: CoordSpeed;

    constructor(loc: CoordSpeed, imgSource: string, clock = 0, speed: CoordSpeed, direction: Direction = "right"){
        super(loc, imgSource, clock);
        this.direction = direction;
        this.speed = speed;
        this.img = new Image();
        this.img.src = imgSource;
    }

}

const canvas = document.querySelector("canvas") as HTMLCanvasElement;; 
const ctx  = canvas.getContext("2d") as CanvasRenderingContext2D;

canvas.width = setUpFeatures.ncol * setUpFeatures.squareWidth;
canvas.height =  setUpFeatures.nrow * setUpFeatures.squareHeight;

ctx.fillStyle = setUpFeatures.bgColor;
ctx.fillRect(0,0, canvas.width, canvas.height);

const invader = new Image();
const invaderOpen = new Image();
invader.src = "gimp_alien_thick.png";
invaderOpen.src = "gimp_alien_open.png";
ctx.drawImage(invader, 0, 0);
ctx.drawImage(invaderOpen, 0, 0);

function drawSwarm(swarm: Sprite[][], cnv: CanvasRenderingContext2D, drawx: number = 0){
    let drawy: number = 0;
    for(let i = 0; i < swarm.length; i++){
        for(let j = 0; j < swarm[i].length; j++){
            // swarm[i][j].img.onload = () =>
            // {cnv.drawImage(swarm[i][j].img, drawx, drawy)};
            cnv.drawImage(swarm[i][j].img, drawx, drawy)
            drawx +=150;
        }
        drawy += 150;
        drawx -= 300;
    }
}
const closedInvader = new Alien({x:0, y:0},"gimp_alien_thick.png",0,{x:0, y:0});
const openInvader = new Alien({x:0, y:0},"gimp_alien_open.png",0,{x:0, y:0});
const invaders: Alien[][] = [[openInvader, closedInvader],[openInvader, closedInvader]];
let startPoint: number = 10
let startY: number = 0
let startCounter: number = 0
const blinkEnd: number = 100;
const blinkStart: number = 10;
const blinkDur: number = blinkEnd + blinkStart
let offSet = 200
function loop() :void {
    ctx.fillRect(0,0, canvas.width, canvas.height);
    //drawSwarm(invaders, ctx, startPoint);
      if(startCounter >= 5 && startCounter <= blinkStart + blinkDur){
        drawSwarm(invaders, ctx, startPoint)
        startCounter += 1;
      }else if (startCounter > blinkStart + blinkDur){
        startPoint += offSet;
        startCounter = 0
      }
if(startPoint + (2* offSet) >= canvas.width || startPoint + (2* offSet) <= 0){
       drawSwarm(invaders, ctx, startPoint);
        //ctx.fillRect(0,0, canvas.width, canvas.height);
    //startPoint = 0
    offSet = offSet * -1;
    }
    startCounter +=1;
    requestAnimationFrame(loop);
}
loop();
// invader.addEventListener("load", () => {ctx.drawImage(invader, 0, 0)})
// invaderOpen.addEventListener("load", () => {ctx.drawImage(invaderOpen, 150, 0)})
