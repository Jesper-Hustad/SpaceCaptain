// console.log("Hello cruel world 222")

var canvas = <HTMLCanvasElement> document.getElementById("mainCanvas");
var ctx = canvas.getContext("2d");
var size : Point = {x:window.innerWidth,y:window.innerHeight}
ctx.canvas.width  = size.x;
ctx.canvas.height = size.y;

// console.log('abcdefgh')

// ctx.fillRect(30,30,30,30)
// So here is a little test aa
// -------- aaa

class Point {
    x:number
    y:number
    constructor(x:number,y:number){
        this.x=x
        this.y=y
    }
}


class SpaceShip {
    center: Point
    width:number
    height:number

    rotation:number

    constructor(center: Point, width:number, height:number) {
        this.center = center
        this.width = width
        this.height = height
        this.rotation= Math.PI/4
    }

    getCenter(){
        return this.center
    }

    draw(ctx:CanvasRenderingContext2D){
        //since rocket is just a square it's some simple trignometry
        
        ctx.fillStyle = "rgb(255,10,10)"
        ctx.save()
        ctx.translate(this.center.x, this.center.y);
        ctx.rotate(this.rotation);
        ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height)
        ctx.restore()  
        drawPix(this.center)      

    }

    drawCollision(ctx:CanvasRenderingContext2D){
        let offset = rotationToPoint({x:0,y:this.height/2-this.width/2},this.rotation)

        let collisionPoints : Point[] = []

        collisionPoints.push({x:this.center.x + offset.x, y:this.center.y + offset.y})
        collisionPoints.push({x:this.center.x - offset.x, y:this.center.y - offset.y})
        collisionPoints.push(this.center)

        collisionPoints.forEach(p =>{
            ctx.beginPath();
            ctx.arc(p.x, p.y, this.width/2, 0, 2 * Math.PI);
            // ctx.closePath()
            ctx.stroke();
        })
        
    }

}


canvas.addEventListener('touchstart', function(e) {touchUpdate(e.changedTouches)}, false);

canvas.addEventListener('touchmove', function(e) {touchUpdate(e.changedTouches)}, false);

canvas.addEventListener('touchend', function(e) {touchUpdate(e.changedTouches)}, false);


let touches : TouchList = new TouchList()  

function touchUpdate(touches:TouchList){
    let output = ' '
    for (let i = 0; i < touches.length; i++) {
        const t = touches[i];

        var rect = canvas.getBoundingClientRect();
        drawPix({x:t.clientX-rect.left,y:t.clientY-rect.top})
        output = output + '  ' + t.identifier
    }
    document.getElementById("p1").innerHTML = output;
}


let spaceship = new SpaceShip({x:60,y:100},30,90)

spaceship.draw(ctx)
spaceship.drawCollision(ctx)

function rotationToPoint(p:Point,rot:number){
    //https://academo.org/demos/rotation-about-point/ <-- read for info
    return {
                x:(p.x*Math.cos(rot)-p.y*Math.sin(rot)),
                y:(p.y*Math.cos(rot)+p.x*Math.sin(rot))
            }
}

function drawPix(point:Point){
    ctx.fillStyle = "rgb(0,0,0)"
    ctx.fillRect(point.x-5,point.y-5,5,5)
    ctx.fillStyle = "rgb(255,10,10)"
}

// document.getElementById("p1").innerHTML = 'testing 123333';



// output = output + e.changedTouches[i].identifier + '  '
// console.log("changedTouches[" + i + "].identifier = " + e.changedTouches[i].identifier);
// let p = e.changedTouches[i]

// document.getElementById("p1").innerHTML = output;

// var rect = canvas.getBoundingClientRect();
// drawPix({x:p.clientX-rect.left,y:p.clientY-rect.top})