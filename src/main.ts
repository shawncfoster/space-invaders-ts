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

class Screen {
    swarm: Sprite[][];
    pc: Sprite;
    swarmTimer: number
    cnv: CanvasRenderingContext2D
    startPoint: CoordSpeed;
    offSet: number;
    //good place to use destructuring?
    constructor(swarm: Sprite[][], cnv: CanvasRenderingContext2D, pc: Sprite, 
        startPoint: CoordSpeed = {x:0, y:0}, offSet: number = 300
    ){
        this.swarm = swarm; 
        this.cnv = cnv;
        this.pc = pc;
        this.swarmTimer = 0;
        this.startPoint = startPoint;
        this.offSet = offSet;
    }

    drawSwarm(blinkStart= 5, blinkDur= 100){
    let {x, y} = this.startPoint;
    if(this.swarmTimer >= blinkStart && (this.swarmTimer <= blinkStart + blinkDur)){
            for(let i = 0; i < this.swarm.length; i++){
                x = this.startPoint.x;
                for(let j = 0; j < this.swarm[i].length; j++){
                    this.cnv.drawImage(this.swarm[i][j].img, x, y);
                    x += this.offSet;
                    if(x >= (canvas.width - this.offSet) || x < (- this.offSet + 0)){
                        this.offSet *= -1; //may lead to being drawn in the wrong direction
                        console.log(this.startPoint.x);
                        this.startPoint.x = x;
                }
            }
                y += 150;
        }
    this.swarmTimer += 1;
    }else if(this.swarmTimer > (blinkStart + blinkDur)){
        this.swarmTimer = 0;
        this.startPoint.x +=this.offSet
    }
    this.swarmTimer += 1
}
    timeSwarm(blinkStart: number = 5, blinkDur: number = 100): void{
        if(this.swarmTimer >= blinkStart && (this.swarmTimer <= blinkStart + blinkDur)){
        //drawSwarm(invaderSwarm, ctx, startPoint.x);
        gameScreen.drawSwarm()
        gameTimer += 1;
      }else if (this.swarmTimer > (blinkStart + blinkDur)){
        startPoint.x += setOff;
        gameTimer = 0
      }
    if(startPoint.x + (this.swarm[0].length * setOff *3) >= canvas.width || startPoint.x + 
    (this.swarm[0].length * setOff * 0.5) <= 0){
    //drawSwarm(invaderSwarm, ctx, startPoint);
    setOff = setOff * -1;
    }
    }
}
// function drawSwarm(swarm: Sprite[][], cnv: CanvasRenderingContext2D, drawx: number = 10, offSet: number = 300) : void{
//     let drawy: number = 0;
//     let origin: number = drawx
//     for(let i = 0; i < swarm.length; i++){
//         drawx = origin;
//         for(let j = 0; j < swarm[i].length; j++){
//             cnv.drawImage(swarm[i][j].img, drawx, drawy)
//             drawx +=offSet;
//         }
//         drawy += 150;
//     }
// }
const closedInvader = new Alien({x:0, y:0},"gimp_alien_thick.png",0,{x:0, y:0});
const openInvader = new Alien({x:0, y:0},"gimp_alien_open.png",0,{x:0, y:0});
const tank = new Alien({x:0, y:0},"tank_big.png",0,{x:0, y:0});
const closedSwarm: Alien[]= Array.from({length: 6}, () => (closedInvader));
const openSwarm: Alien[]= Array.from({length: 6}, () => (openInvader));
const invaderSwarm: Alien[][] = [closedSwarm, openSwarm];

let startPoint: CoordSpeed = {x: 10, y: 0}
let startY: number = 0
let gameTimer: number = 0
const blinkEnd: number = 100;
const blinkStart: number = 10;
const blinkDur: number = blinkEnd + blinkStart
let setOff = 100
const gameScreen = new Screen(invaderSwarm, ctx, tank);

function loop() :void {
    ctx.fillRect(0,0, canvas.width, canvas.height);
//       if(gameTimer >= 5 && (gameTimer <= blinkStart + blinkDur)){
//         //drawSwarm(invaderSwarm, ctx, startPoint.x);
//         gameScreen.drawSwarm(startPoint)
//         gameTimer += 1;
//       }else if (gameTimer > (blinkStart + blinkDur)){
//         startPoint.x += setOff;
//         gameTimer = 0
//       }
// if(startPoint.x + (invaderSwarm[0].length * setOff *3) >= canvas.width || startPoint.x + (invaderSwarm[0].length * setOff * 0.5) <= 0){
//     //drawSwarm(invaderSwarm, ctx, startPoint);
//     setOff = setOff * -1;
//     }
    gameScreen.drawSwarm();
    
    gameTimer +=1;
    requestAnimationFrame(loop);
}
loop();
// invader.addEventListener("load", () => {ctx.drawImage(invader, 0, 0)})
// invaderOpen.addEventListener("load", () => {ctx.drawImage(invaderOpen, 150, 0)})
