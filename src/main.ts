interface Features {
    squareWidth: number;
    squareHeight: number;
    ncol: number;
    nrow: number;
    width:number;
    height:number;
    bgColor: string;
}

interface imageList{
    images: string[];
    deadSprite: string;
    cycle: number
}
const setUpFeatures: Features = {
    squareWidth: 100,
    squareHeight: 50,
    ncol: 30,
    nrow: 30,
    width: 4800,
    height: 2000,
    bgColor: "black"
}

type Status = "alive" | "dead";

interface CoordSpeed {
    x: number,
    y: number
}

class Sprite{
    loc: CoordSpeed;
    imgSource: string;
    img;
    imgList: imageList;
    status: Status;

    constructor(loc: CoordSpeed, imgSource: string, 
        imgList: imageList = {images:[], deadSprite:"", cycle: 0},
        status: Status = "alive"){
        this.loc = loc;
        this.imgSource = imgSource;
        this.img = new Image();
        this.img.src = imgSource;
        this.imgList = imgList;
        this.status = status;
    }

    move(coord: CoordSpeed) :void {
        this.loc.x = coord.x;
        this.loc.y = coord.y;
    }

    animate(): void{
        if(this.status != "dead"){
            if(this.imgList.cycle < this.imgList.images.length){
                this.imgList.cycle += 1;
            }else{
                this.imgList.cycle = 0;
            }
            this.img.src = this.imgList.images[this.imgList.cycle];
        }
        else{
            this.img.src = this.imgList.deadSprite;
        }
    }
}

class Alien extends Sprite{
    constructor(loc: CoordSpeed, imgSource: string, imgList: imageList = {images:[], deadSprite:"", cycle:0}){
        super(loc, imgSource);
        this.img = new Image();
        this.img.src = imgSource;
        this.imgList = imgList;
    }
}

class PlayerCharacter extends Sprite{
    constructor(loc: CoordSpeed, imgSource: string, imgList: imageList = {images:[], deadSprite:"", cycle:0}){
        super(loc, imgSource);
        this.img = new Image();
        this.img.src = imgSource;
        this.imgList = imgList;
    }

    shoot(){
        
    }

}

class Screen {
    swarm: Sprite[][];
    pc: PlayerCharacter;
    swarmTimer: number
    cnv: CanvasRenderingContext2D
    startPoint: CoordSpeed;
    setUp: Features;
    offSet: CoordSpeed;
    //good place to use destructuring?
    constructor(swarm: Sprite[][], cnv: CanvasRenderingContext2D, pc: PlayerCharacter, 
        startPoint: CoordSpeed = {x:0, y:0}, offSet: CoordSpeed = {x:200, y:0}, setUp:Features = setUpFeatures
    ){
        this.swarm = swarm; 
        this.cnv = cnv;
        this.pc = pc;
        this.swarmTimer = 0;
        this.startPoint = startPoint;
        this.offSet = offSet;
        this.setUp = setUp;
    }

    drawSwarm(blinkStart= 5, blinkDur= 50, speed = 1){
    let {x, y} = this.startPoint;
    if(this.swarmTimer >= blinkStart && (this.swarmTimer <= blinkStart + blinkDur)){
            for(let i = 0; i < this.swarm.length; i++){
                x = this.startPoint.x;
                for(let j = 0; j < this.swarm[i].length; j++){
                    this.cnv.drawImage(this.swarm[i][j].img, x, y);
                    x += this.offSet.x;
                    if(x >= (canvas.width - (this.offSet.x)) || x <= (- this.offSet.x)){
                        this.startPoint.y += 100
                        this.offSet.x *= -1;
                        this.startPoint.x = x + this.offSet.x;
                }
            }
                y += 150;
        }
    //this.startPoint.y +=150;    
    this.swarmTimer += 1;
    }else if(this.swarmTimer > (blinkStart + blinkDur)){
        this.swarmTimer = 0;
        this.startPoint.x += this.offSet.x * speed
    }
    this.swarmTimer += 1
}
}
const canvas = document.querySelector("canvas") as HTMLCanvasElement;; 
const ctx  = canvas.getContext("2d") as CanvasRenderingContext2D;

canvas.width = setUpFeatures.width;
canvas.height = setUpFeatures.height;

ctx.fillStyle = setUpFeatures.bgColor;
ctx.fillRect(0,0, canvas.width, canvas.height);

const invader = new Image();
const invaderOpen = new Image();
invader.src = "gimp_alien_thick.png";
invaderOpen.src = "gimp_alien_open.png";

const closedInvader = new Alien({x:0, y:0},"gimp_alien_thick.png");
const openInvader = new Alien({x:0, y:0},"gimp_alien_open.png");
const tank = new PlayerCharacter({x: 1, y:canvas.height - 120},"tank_big.png");
const closedSwarm: Alien[]= Array.from({length: 11}, () => (closedInvader));
const openSwarm: Alien[]= Array.from({length: 11}, () => (openInvader));
const invaderSwarm: Alien[][] = [closedSwarm, openSwarm];

const gameScreen = new Screen(invaderSwarm, ctx, tank);

//yes, global, bad. can't make it work inside the thing
    window.addEventListener("keydown", (e) => {
            switch (e.key) {
              case "a":
                    if(gameScreen.pc.loc.x > 100){
                        gameScreen.pc.move({x:gameScreen.pc.loc.x - 100, y:gameScreen.pc.loc.y});
                    }
                    break;
              case "d":
                    if(gameScreen.pc.loc.x < canvas.width - 100){
                        gameScreen.pc.move({x:gameScreen.pc.loc.x + 100, y: gameScreen.pc.loc.y});
                    }
                break;
            case "Space":
                gameScreen.pc.shoot();
                break;
                
            }
        })

function loop() :void {
    ctx.fillRect(0,0, canvas.width, canvas.height);
    gameScreen.drawSwarm();
    gameScreen.cnv.drawImage(gameScreen.pc.img, gameScreen.pc.loc.x, gameScreen.pc.loc.y);
    requestAnimationFrame(loop);
}
loop();
// invader.addEventListener("load", () => {ctx.drawImage(invader, 0, 0)})
// invaderOpen.addEventListener("load", () => {ctx.drawImage(invaderOpen, 150, 0)})
