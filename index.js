console.log("Hello cruel world 222");
var canvas = document.getElementById("mainCanvas");
var ctx = canvas.getContext("2d");
var size = { x: window.innerWidth, y: window.innerHeight };
ctx.canvas.width = size.x;
ctx.canvas.height = size.y;
console.log('abcdefgh');
// ctx.fillRect(30,30,30,30)
var Point = /** @class */ (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    return Point;
}());
var SpaceShip = /** @class */ (function () {
    function SpaceShip(center, width, height) {
        this.center = center;
        this.width = width;
        this.height = height;
        this.rotation = Math.PI / 4;
    }
    SpaceShip.prototype.getCenter = function () {
        return this.center;
    };
    SpaceShip.prototype.draw = function (ctx) {
        //since rocket is just a square it's some simple trignometry
        ctx.fillStyle = "rgb(255,10,10)";
        ctx.save();
        ctx.translate(this.center.x, this.center.y);
        ctx.rotate(this.rotation);
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
        drawPix(this.center);
    };
    SpaceShip.prototype.drawCollision = function (ctx) {
        var _this = this;
        var offset = rotationToPoint({ x: 0, y: this.height / 2 - this.width / 2 }, this.rotation);
        // ctx.fillStyle = "rgb(0,0,0)"
        // ctx.fillRect(this.center.x+p1.x-5,this.center.y+p1.y-5,5,5)
        // ctx.fillStyle = "rgb(255,10,10)"
        var collisionPoints = [];
        // collisionPoints.push
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
canvas.addEventListener('touchmove', function (event) {
    // If there's exactly one finger inside this element
    console.log('Touch occured');
    if (event.targetTouches.length == 1) {
        var touch = event.targetTouches[0];
        // Place element where the finger is
        var rect = canvas.getBoundingClientRect();
        drawPix({ x: touch.pageX - rect.left, y: touch.pageY - rect.top });
    }
}, false);
var spaceship = new SpaceShip({ x: 60, y: 100 }, 30, 90);
spaceship.draw(ctx);
spaceship.drawCollision(ctx);
// canvas.addEventListener("touchmove", handleMove, false)
function rotationToPoint(p, rot) {
    //https://academo.org/demos/rotation-about-point/ <-- read for info
    return {
        x: (p.x * Math.cos(rot) - p.y * Math.sin(rot)),
        y: (p.y * Math.cos(rot) + p.x * Math.sin(rot))
    };
}
function drawPix(point) {
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(point.x - 5, point.y - 5, 5, 5);
    ctx.fillStyle = "rgb(255,10,10)";
}
