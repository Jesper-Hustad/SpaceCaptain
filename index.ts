// Declare classes --------------------------------

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
    rotationSpeed:number = 0.01

    velocityX:number = 0
    velocityY:number = 0

    thrustAmount:number = 2

    constructor(center: Point, width:number, height:number) {
        this.center = center
        this.width = width
        this.height = height
        this.rotation= Math.PI/4
    }

    getCenter(){
        return this.center
    }

    timeStep(){
        this.rotation += this.rotationSpeed
        this.center.x += this.velocityX
        this.center.y += this.velocityY
    }

    thrust(){
        let vec = rotationToPoint({x:this.thrustAmount,y:0},this.rotation)
        this.velocityX += vec.x
        this.velocityY += vec.y
    }

    draw(ctx:CanvasRenderingContext2D){
        //since rocket is just a square it's some simple trignometry
        
        ctx.fillStyle = "rgb(255,10,10)"
        ctx.save()
        ctx.translate(this.center.x, this.center.y);
        ctx.rotate(this.rotation);
        ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height)
        ctx.restore()  
        // drawPix(this.center)      

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


// Declare global variables --------------------------------
var canvas = <HTMLCanvasElement> document.getElementById("mainCanvas");
var ctx = canvas.getContext("2d");
var size : Point = {x:window.innerWidth,y:window.innerHeight}
ctx.canvas.width  = size.x;
ctx.canvas.height = size.y;

let globalLeft = false
let globalRight = false

let refreshRate = 300

let spaceship = new SpaceShip({x:60,y:100},30,90)


// Touch detection -------------------------------------------
canvas.addEventListener('touchstart', function(e) {touchUpdate(e.changedTouches)}, false);

canvas.addEventListener('touchmove', function(e) {touchUpdate(e.changedTouches)}, false);

canvas.addEventListener('touchend', function(e) {globalRight = globalLeft = false}, false);

function touchUpdate(touches:TouchList){

    let a = touchSide(touches)
    globalLeft = a.left
    globalRight = a.right
    
    // document.getElementById("p1").innerHTML = 'L: ' + (globalLeft?'000000000000000000000':'______________________') + '   R: ' + (globalRight?'00000000000000000000':'____________________')
}




// private helper functions -------------------------------- 

function touchSide(touches:TouchList){
    let left = false
    let right = false

    // go trough every touch
    for (let i = 0; i < touches.length; i++) {
        // if touch x coordinate is less than half the width the touch must be left, else right (add canvas offset from html)
        if(touches[i].clientX-canvas.getBoundingClientRect().left<(size.x/2)){
            left = true
        }else{
            right = true
        }
    }
    return {left:left,right:right}
}

function rotationToPoint(p:Point,rot:number){
    //https://academo.org/demos/rotation-about-point/ <-- read for info
    return {
                x:(p.x*Math.cos(rot)-p.y*Math.sin(rot)),
                y:(p.y*Math.cos(rot)+p.x*Math.sin(rot))
            }
}


// Game loop -------------------------------------------------



// spaceship.drawCollision(ctx)

setInterval(function gameLoop() {

    console.log("loop");
    

    const rotationChange = 0.01
    if(globalLeft){
        spaceship.rotationSpeed += rotationChange
        spaceship.thrust()
    }
    if(globalRight){
        spaceship.rotationSpeed += -rotationChange
        spaceship.thrust()
    }

    spaceship.timeStep()
    spaceship.draw(ctx)
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