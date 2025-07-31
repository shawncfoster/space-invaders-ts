var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var setUpFeatures = {
    squareWidth: 100,
    squareHeight: 50,
    ncol: 30,
    nrow: 30,
    bgColor: "black"
};
var Sprite = /** @class */ (function () {
    function Sprite(loc, imgSource, clock) {
        if (clock === void 0) { clock = 0; }
        this.loc = loc;
        this.imgSource = imgSource;
        this.img = new Image();
        this.img.src = imgSource;
        this.clock = clock;
    }
    Sprite.prototype.move = function (coord) {
        this.loc.x = coord.x;
        this.loc.y = coord.y;
    };
    return Sprite;
}());
var Alien = /** @class */ (function (_super) {
    __extends(Alien, _super);
    function Alien(loc, imgSource, clock, speed, direction) {
        if (clock === void 0) { clock = 0; }
        if (direction === void 0) { direction = "right"; }
        var _this = _super.call(this, loc, imgSource, clock) || this;
        _this.direction = direction;
        _this.speed = speed;
        _this.img = new Image();
        _this.img.src = imgSource;
        return _this;
    }
    return Alien;
}(Sprite));
var canvas = document.querySelector("canvas");
;
var ctx = canvas.getContext("2d");
canvas.width = setUpFeatures.ncol * setUpFeatures.squareWidth;
canvas.height = setUpFeatures.nrow * setUpFeatures.squareHeight;
ctx.fillStyle = setUpFeatures.bgColor;
ctx.fillRect(0, 0, canvas.width, canvas.height);
var invader = new Image();
var invaderOpen = new Image();
invader.src = "gimp_alien_thick.png";
invaderOpen.src = "gimp_alien_open.png";
ctx.drawImage(invader, 0, 0);
ctx.drawImage(invaderOpen, 0, 0);
var Screen = /** @class */ (function () {
    function Screen(swarm, cnv, pc) {
        this.swarm = swarm;
        this.cnv = cnv;
        this.pc = pc;
    }
    return Screen;
}());
function drawSwarm(swarm, cnv, drawx, offSet) {
    if (drawx === void 0) { drawx = 10; }
    if (offSet === void 0) { offSet = 300; }
    var drawy = 0;
    var origin = drawx;
    for (var i = 0; i < swarm.length; i++) {
        drawx = origin;
        for (var j = 0; j < swarm[i].length; j++) {
            cnv.drawImage(swarm[i][j].img, drawx, drawy);
            drawx += offSet;
        }
        drawy += 150;
        // drawx = origin;
        //drawx -= offSet * swarm[i].length;
    }
}
var closedInvader = new Alien({ x: 0, y: 0 }, "gimp_alien_thick.png", 0, { x: 0, y: 0 });
var openInvader = new Alien({ x: 0, y: 0 }, "gimp_alien_open.png", 0, { x: 0, y: 0 });
var tank = new Alien({ x: 0, y: 0 }, "tank_big.png", 0, { x: 0, y: 0 });
var closedSwarm = Array.from({ length: 6 }, function () { return (closedInvader); });
var openSwarm = Array.from({ length: 6 }, function () { return (openInvader); });
var invaderSwarm = [closedSwarm, openSwarm];
var startPoint = { x: 10, y: 0 };
var startY = 0;
var gameTimer = 0;
var blinkEnd = 100;
var blinkStart = 10;
var blinkDur = blinkEnd + blinkStart;
var setOff = 100;
function loop() {
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (gameTimer >= 5 && (gameTimer <= blinkStart + blinkDur)) {
        drawSwarm(invaderSwarm, ctx, startPoint.x);
        gameTimer += 1;
    }
    else if (gameTimer > (blinkStart + blinkDur)) {
        startPoint.x += setOff;
        gameTimer = 0;
    }
    if (startPoint.x + (invaderSwarm[0].length * setOff * 3) >= canvas.width || startPoint.x + (invaderSwarm[0].length * setOff * 0.5) <= 0) {
        //drawSwarm(invaderSwarm, ctx, startPoint);
        setOff = setOff * -1;
    }
    gameTimer += 1;
    requestAnimationFrame(loop);
}
loop();
// invader.addEventListener("load", () => {ctx.drawImage(invader, 0, 0)})
// invaderOpen.addEventListener("load", () => {ctx.drawImage(invaderOpen, 150, 0)})
