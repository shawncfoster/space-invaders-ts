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

class Shape{
    height: number;
    width: number;
    position: CoordSpeed;
    speed: CoordSpeed;
    stat: Status;
    
    constructor(height:number = 100, width: number = 100, position: CoordSpeed = {x:0, y:0},
        speed:CoordSpeed = {x: 1, y: 1}, stat: Status = "dead"){
        this.height = height;
        this.width = width;
        this.position = position;
        this.speed = speed;
        this.stat = stat;
    }

     move(coord: CoordSpeed) :void {
        this.position.x = coord.x;
        this.position.y = coord.y;
    }
}

class Sprite{
    position: CoordSpeed;
    imgSource: string;
    img;
    imgList: imageList;
    stat: Status;

    constructor(position: CoordSpeed, imgSource: string, 
        imgList: imageList = {images:[], deadSprite:"", cycle: 0},
        stat: Status = "dead"){
        this.position = position;
        this.imgSource = imgSource;
        this.img = new Image();
        this.img.src = imgSource;
        this.imgList = imgList;
        this.stat = stat;
    }

    move(coord: CoordSpeed) :void {
        this.position.x = coord.x;
        this.position.y = coord.y;
    }

    animate(): void{
        if(this.stat != "dead"){
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

    translate(xdirection:number, ydirection:number): void{
        this.position.x += xdirection;
        this.position.y +=ydirection;
    }
}

class Alien extends Sprite{
    constructor(position: CoordSpeed, imgSource: string, imgList: imageList = {images:[], deadSprite:"", cycle:0}){
        super(position, imgSource);
        this.img = new Image();
        this.img.src = imgSource;
        this.imgList = imgList;
    }
}

class PlayerCharacter extends Sprite{
    constructor(position: CoordSpeed, imgSource: string, imgList: imageList = {images:[], deadSprite:"", cycle:0}){
        super(position, imgSource);
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
    speed: CoordSpeed
    bullet: Shape;
    //feel like I'm just recreating global scope using one big class that contains everything.
    constructor(swarm: Sprite[][], cnv: CanvasRenderingContext2D, pc: PlayerCharacter, startPoint = {x:0, y:0},
         offSet = {x:200, y:200}, setUp: Features = setUpFeatures, speed = {x:100, y: 1} 
    ){
        this.swarm = swarm; 
        this.cnv = cnv;
        this.pc = pc;
        this.swarmTimer = 0;
        this.startPoint = startPoint;
        this.offSet = offSet;
        this.setUp = setUp;
        this.bullet = new Shape(100, 10, {x: 0, y: 0}, {x: 1, y: 100});
        this.speed = speed;
    }
//this part works. Why doesn't update?
    initSwarm(){
        let {x, y} = this.startPoint;
        for(let i = 0; i < this.swarm.length; i++){
                x = this.startPoint.x;
                for(let j = 0; j < this.swarm[i].length; j++){
                    this.swarm[i][j].move({x:x,y:y})//MUST remember to move at initialization
                    this.cnv.drawImage(this.swarm[i][j].img, x, y);
                    x += this.offSet.x;
            }
                y += this.offSet.y;
        }
    }

    updateSwarm(blinkStart= 5, blinkDur= 25){
    //let {x, y} = this.startPoint;
    if(this.swarmTimer >= blinkStart && (this.swarmTimer <= blinkStart + blinkDur)){
            for(let i = 0; i < this.swarm.length; i++){
                for(let j = 0; j < this.swarm[i].length; j++){
                    let alien = this.swarm[i][j];
                    //let {x, y} = alien.position;
                    alien.translate(this.speed.x, 0);
                    //alien.move({x: alien.position.x + this.speed.x, y:alien.position.y});//why is this appo the same for every sprite?
                    //this.swarm[i][j].move({x: this.swarm[i][j].position.x + this.speed.x, y: this.swarm[i][j].position.y})
                    //x += this.offSet.x;i`
                    if(alien.position.x >= (canvas.width) || alien.position.x <= (0)){
                        this.swarm.forEach(element => {
                            element.forEach(z => {
                                z.move({x:z.position.x, y: z.position.y + this.speed.y});
                            });
                        });
                        //.move({x:this.swarm[i][j].position.x, y: this.swarm[i][j].position.y + this.speed.y})
                        this.speed.x *= -1;
                        //this.startPoint.x = x + this.offSet.x;
                }
                //this.cnv.drawImage(this.swarm[i][j].img, this.swarm[i][j].position.x, this.swarm[i][j].position.y);
                this.cnv.drawImage(alien.img, alien.position.x, alien.position.y);
            }
                //y += 150;
        }
    //this.startPoint.y +=150;    
    this.swarmTimer += 1;
    }else if(this.swarmTimer > (blinkStart + blinkDur)){
        this.swarmTimer = 0;
        //this.startPoint.x += this.offSet.x * speed
    }
    this.swarmTimer += 1
}
    shoot(){
        if(this.bullet.stat === "dead"){
            this.bullet.position = {x: this.pc.position.x, y: this.pc.position.y + this.bullet.height};
            this.bullet.stat = "alive";
        }
    }

    updateBullet(){
        if(this.bullet.stat === "alive"){
           this.cnv.fillStyle = "white";
           this.cnv.fillRect(this.bullet.position.x,this.bullet.position.y , this.bullet.width, this.bullet.height);
           this.bullet.move({x: this.bullet.position.x, y: this.bullet.position.y - this.bullet.speed.y})
           this.cnv.fillStyle = "black";
        }
        if(this.bullet.position.y <=0){
            // this.bullet.position.x = this.pc.position.x;
            // this.bullet.position.x = this.pc.position.y;
            this.bullet.stat = "dead";
        }
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

//const closedInvader = new Alien({x:0, y:0},"gimp_alien_thick.png");
//const openInvader = new Alien({x:0, y:0},"gimp_alien_open.png");
const tank = new PlayerCharacter({x: 1, y:canvas.height - 120},"tank_big.png");
//const closedSwarm: Alien[]= Array.from({length: 11}, () => (closedInvader));
//const openSwarm: Alien[]= Array.from({length: 11}, () => (openInvader));
const openSwarmArray: Alien[] = Array(11).fill(0).map(() => new Alien({x:0, y:0},"gimp_alien_thick.png"))
const closedSwarmArray: Alien[] = Array(11).fill(0).map(() => new Alien({x:0, y:0},"gimp_alien_thick.png"))
//
// const swarm1: Alien[] = [];
// for(let i = 0; i < 11; i++){
    
// }
const invaderSwarm: Alien[][] = [closedSwarmArray, openSwarmArray];

const gameScreen = new Screen(invaderSwarm, ctx, tank);

//yes, global, bad. can't make it work inside the thing
    window.addEventListener("keydown", (e) => {
            switch (e.key) {
              case "a":
                    if(gameScreen.pc.position.x > 100){
                        gameScreen.pc.move({x:gameScreen.pc.position.x - 100, y:gameScreen.pc.position.y});
                    }
                    break;
              case "d":
                    if(gameScreen.pc.position.x < canvas.width - 100){
                        gameScreen.pc.move({x:gameScreen.pc.position.x + 100, y: gameScreen.pc.position.y});
                    }
                break;
            case "w":
                gameScreen.shoot();
                break;
                
            }
        })

let isPlaying: boolean = true;

gameScreen.initSwarm();
function loop() :void {
    if(isPlaying == true)
    {ctx.fillRect(0,0, canvas.width, canvas.height);
    //gameScreen.initSwarm();
    gameScreen.updateSwarm();
    gameScreen.updateBullet();
    gameScreen.cnv.drawImage(gameScreen.pc.img, gameScreen.pc.position.x, gameScreen.pc.position.y);
    requestAnimationFrame(loop);
}
}
window.addEventListener('keydown', function (e){
    if (e.key === "Escape"){
        if(isPlaying){
            isPlaying = false;

        }else{
            isPlaying = true;
            loop()
        }
    }
})
loop();
// invader.addEventListener("load", () => {ctx.drawImage(invader, 0, 0)})
// invaderOpen.addEventListener("load", () => {ctx.drawImage(invaderOpen, 150, 0)})
