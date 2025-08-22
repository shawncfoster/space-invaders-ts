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
        imgList: imageList = {images:["gimp_alien_open.png", "gimp_alien_thick.png"], deadSprite:"gimp_alien_blank.png", cycle:0},
        stat: Status = "alive"){
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
    }

    translate(xdirection:number, ydirection:number): void{
        this.position.x += xdirection;
        this.position.y +=ydirection;
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
    baseSpeed: CoordSpeed;
    negativeSpeed: CoordSpeed;
    positiveSpeed: CoordSpeed;
    bullet: Shape;
    //feel like I'm just recreating global scope using one big class that contains everything.
    constructor(swarm: Sprite[][], cnv: CanvasRenderingContext2D, pc: PlayerCharacter, startPoint = {x:0, y:50},
         offSet = {x:200, y:200}, setUp: Features = setUpFeatures, speed = {x:100, y: 50} 
    ){
        this.swarm = swarm; 
        this.cnv = cnv;
        this.pc = pc;
        this.swarmTimer = 0;
        this.startPoint = startPoint;
        this.offSet = offSet;
        this.setUp = setUp;
        this.bullet = new Shape(100, 10, {x: 0, y: 0}, {x: 1, y: 100});
        this.baseSpeed = speed;
        this.positiveSpeed = {x:speed.x, y:speed.y};
        this.negativeSpeed = {x:-speed.x, y:-speed.y}
    }

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
    //lesson: You probably don't need to squeeze every drop of performance 
    //to make an arcade game from 1978 in a 2025 browser 
    updateSwarm(blinkStart= 5, blinkDur= 50){
        this.baseSpeed.y = 0;
            if(this.swarmTimer >= blinkStart && (this.swarmTimer <= blinkStart + blinkDur)){
                this.swarm.forEach(row => {
                        this.checkPosition(row);
                        this.checkDeathArray(row);//it loops through the array AGAIN every time I call this though :/
                        row.forEach(alien => {
                            this.cnv.drawImage(alien.img, alien.position.x, alien.position.y)})})
                this.swarmTimer +=1
        }
            else if(this.swarmTimer > (blinkStart + blinkDur)){
                    this.swarm.forEach( row => 
                    {this.checkPosition(row);
                        row.forEach(alien => {
                            this.checkDeath(alien);
                            //alien.animate();
                            //for whatever reason putting this in THIS PARTICULAR FUNCTION breaks the image
                            alien.translate(this.baseSpeed.x, this.baseSpeed.y)})})
                this.swarmTimer = 0;
    }
    this.baseSpeed.y = 0;
    this.swarmTimer += 1;
}

//there's a way I can fix my trouble here
//giving up and hardcoding is the way to go
//currently seems to glitch whenever one row is shot completely...
    checkPosition(aliens: Sprite[]){
        if(aliens.length > 0){
            if(aliens[0].position.x < 0){
                this.baseSpeed.x = this.positiveSpeed.x;
                this.baseSpeed.y = this.positiveSpeed.y;
            }
            if(aliens[0].stat === "dead"){
            aliens.shift();
        }}
        if(aliens.length > 0){
            if(aliens[aliens.length - 1].position.x >= canvas.width){
                this.baseSpeed.x = this.negativeSpeed.x;
                this.baseSpeed.y = this.positiveSpeed.y;//check here later
                }
            if(aliens[aliens.length - 1].stat === "dead"){
                aliens.pop();
            }
        }
    }

    checkDeath(alien: Sprite){
        //figure an object will at least make things more readable than a MASSIVE hairy boolean
        let contained = {
            right: this.bullet.position.x <= (alien.position.x + (0.5 * alien.img.width)),
            left: this.bullet.position.x >= (alien.position.x - (0.5 * alien.img.width)),
            up:  this.bullet.position.y <= (alien.position.y + (0.5 * alien.img.height)),
            down: this.bullet.position.x >= (alien.position.x - (0.5 * alien.img.height)),
         }

        if((contained.right && contained.left) && (contained.up && contained.down)){
            alien.stat = "dead";
            alien.img.src = alien.imgList.deadSprite;
            this.bullet.stat = "dead";
        }
    }

    checkDeathArray(Sprites: Sprite[]){
        for (let i = 0; i< Sprites.length; i++){
            let alien = Sprites[i];
            let contained = {
            right: this.bullet.position.x <= (alien.position.x + (0.5 * alien.img.width)),
            left: this.bullet.position.x >= (alien.position.x - (0.5 * alien.img.width)),
            up:  this.bullet.position.y <= (alien.position.y + (0.5 * alien.img.height)),
            down: this.bullet.position.x >= (alien.position.x - (0.5 * alien.img.height)),
         }
         
         if((contained.right && contained.left) && (contained.up && contained.down)){
            alien.stat = "dead";
            alien.img.src = alien.imgList.deadSprite;
            this.bullet.stat = "dead";
        }
        Sprites = Sprites.filter(x => x.stat !== "dead");// why is it it doesn't modify when I WANT it to?
        } 
    

        
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
            this.bullet.stat = "dead";
        }
        if(this.bullet.stat == "dead"){
            this.bullet.position.x = this.pc.position.x;
            this.bullet.position.y = this.pc.position.y;
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
const invaderSprites: string[] = ["gimp_alien_thick.png","gimp_alien_open.png"] 

//const closedInvader = new Alien({x:0, y:0},"gimp_alien_thick.png");
//const openInvader = new Alien({x:0, y:0},"gimp_alien_open.png");
const tank = new PlayerCharacter({x: 1, y:canvas.height - 120},"tank_big.png");
//const closedSwarm: Alien[]= Array.from({length: 11}, () => (closedInvader));
//const openSwarm: Alien[]= Array.from({length: 11}, () => (openInvader));
const openSwarmArray: Sprite[] = Array(3).fill(0).map(() => new Sprite({x:0, y:25},"gimp_alien_thick.png"))
const closedSwarmArray: Sprite[] = Array(11).fill(0).map(() => new Sprite({x:0, y:25},"gimp_alien_thick.png"))
const closedSwarmArrayTwo: Sprite[] = Array(11).fill(0).map(() => new Sprite({x:0, y:25},"gimp_alien_thick.png"))
//
// const swarm1: Alien[] = [];
// for(let i = 0; i < 11; i++){
    
// }
const invaderSwarm: Sprite[][] = [closedSwarmArray, openSwarmArray, closedSwarmArrayTwo];

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
