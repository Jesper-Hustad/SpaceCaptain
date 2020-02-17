// Declare classes --------------------------------
var Point = /** @class */ (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    return Point;
}());
var SpaceShip = /** @class */ (function () {
    function SpaceShip(center, width, height) {
        this.rotationSpeed = 0.01;
        this.velocityX = 0;
        this.velocityY = 0;
        this.thrustAmount = 2;
        this.center = center;
        this.width = width;
        this.height = height;
        this.rotation = Math.PI / 4;
    }
    SpaceShip.prototype.getCenter = function () {
        return this.center;
    };
    SpaceShip.prototype.timeStep = function () {
        this.rotation += this.rotationSpeed;
        this.center.x += this.velocityX;
        this.center.y += this.velocityY;
    };
    SpaceShip.prototype.thrust = function () {
        var vec = rotationToPoint({ x: this.thrustAmount, y: 0 }, this.rotation);
        this.velocityX += vec.x;
        this.velocityY += vec.y;
    };
    SpaceShip.prototype.draw = function (ctx) {
        //since rocket is just a square it's some simple trignometry
        ctx.fillStyle = "rgb(255,10,10)";
        ctx.save();
        ctx.translate(this.center.x, this.center.y);
        ctx.rotate(this.rotation);
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
        // drawPix(this.center)      
    };
    SpaceShip.prototype.drawCollision = function (ctx) {
        var _this = this;
        var offset = rotationToPoint({ x: 0, y: this.height / 2 - this.width / 2 }, this.rotation);
        var collisionPoints = [];
        collisionPoints.push({ x: this.center.x + offset.x, y: this.center.y + offset.y });
        collisionPoints.push({ x: this.center.x - offset.x, y: this.center.y - offset.y });
        collisionPoints.push(this.center);
        collisionPoints.forEach(function (p) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, _this.width / 2, 0, 2 * Math.PI);
            // ctx.closePath()
            ctx.stroke();
        });
    };
    return SpaceShip;
}());
// Declare global variables --------------------------------
var canvas = document.getElementById("mainCanvas");
var ctx = canvas.getContext("2d");
var size = { x: window.innerWidth, y: window.innerHeight };
ctx.canvas.width = size.x;
ctx.canvas.height = size.y;
var globalLeft = false;
var globalRight = false;
var refreshRate = 300;
var spaceship = new SpaceShip({ x: 60, y: 100 }, 30, 90);
// Touch detection -------------------------------------------
canvas.addEventListener('touchstart', function (e) { touchUpdate(e.changedTouches); }, false);
canvas.addEventListener('touchmove', function (e) { touchUpdate(e.changedTouches); }, false);
canvas.addEventListener('touchend', function (e) { globalRight = globalLeft = false; }, false);
function touchUpdate(touches) {
    var a = touchSide(touches);
    globalLeft = a.left;
    globalRight = a.right;
    // document.getElementById("p1").innerHTML = 'L: ' + (globalLeft?'000000000000000000000':'______________________') + '   R: ' + (globalRight?'00000000000000000000':'____________________')
}
// private helper functions -------------------------------- 
function touchSide(touches) {
    var left = false;
    var right = false;
    // go trough every touch
    for (var i = 0; i < touches.length; i++) {
        // if touch x coordinate is less than half the width the touch must be left, else right (add canvas offset from html)
        if (touches[i].clientX - canvas.getBoundingClientRect().left < (size.x / 2)) {
            left = true;
        }
        else {
            right = true;
        }
    }
    return { left: left, right: right };
}
function rotationToPoint(p, rot) {
    //https://academo.org/demos/rotation-about-point/ <-- read for info
    return {
        x: (p.x * Math.cos(rot) - p.y * Math.sin(rot)),
        y: (p.y * Math.cos(rot) + p.x * Math.sin(rot))
    };
}
// Game loop -------------------------------------------------
// spaceship.drawCollision(ctx)
setInterval(function gameLoop() {
    console.log("loop");
    var rotationChange = 0.01;
    if (globalLeft) {
        spaceship.rotationSpeed += rotationChange;
        spaceship.thrust();
    }
    if (globalRight) {
        spaceship.rotationSpeed += -rotationChange;
        spaceship.thrust();
    }
    spaceship.timeStep();
    spaceship.draw(ctx);
}, refreshRate);
// function drawPix(point:Point){
//     ctx.fillStyle = "rgb(0,0,0)"
//     ctx.fillRect(point.x-5,point.y-5,5,5)
//     ctx.fillStyle = "rgb(255,10,10)"
// }
// document.getElementById("p1").innerHTML = 'testing 123333';
// output = output + e.changedTouches[i].identifier + '  '
// console.log("changedTouches[" + i + "].identifier = " + e.changedTouches[i].identifier);
// let p = e.changedTouches[i]
// document.getElementById("p1").innerHTML = output;
// var rect = canvas.getBoundingClientRect();
// drawPix({x:p.clientX-rect.left,y:p.clientY-rect.top})
