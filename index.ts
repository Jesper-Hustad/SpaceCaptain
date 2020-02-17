

// Slider function ------------------------------------------

var gravitySlider = document.getElementById("gravitySlider");
// var gravityDisplay = document.getElementById("gravityDiplay");
let gravDisplay = parseInt((<HTMLInputElement>gravitySlider).value)/30;
// gravityDisplay.innerHTML = (<HTMLInputElement>gravitySlider).value;
// gravityDisplay.innerHTML = 'hello'

gravitySlider.oninput = function() {
    gravDisplay = parseInt((<HTMLInputElement>this).value)/30;
    console.log(gravDisplay);    
  }


var rotationSlider = document.getElementById("rotationSlider");
let rotDisplay = parseInt((<HTMLInputElement>rotationSlider).value)/30;
// var roationDisplay = document.getElementById("rotationDiplay");

rotationSlider.oninput = function() {
    rotDisplay = parseInt((<HTMLInputElement>this).value)/30;
    console.log(rotDisplay);
    
  }


var thrustSlider = document.getElementById("thrustSlider");
let thrustDisplay = parseInt((<HTMLInputElement>thrustSlider).value)/30;

thrustSlider.oninput = function() {
    thrustDisplay = parseInt((<HTMLInputElement>this).value)/30;
    console.log(thrustDisplay);
  }

// sliderGrav.innerHTML = slider.value;

// roationSlider.oninput = function() {
//   roationDisplay.innerHTML = (<HTMLInputElement>this).value;
// }
// document.getElementById("rotationDiplay").innerHTML = "testing54321"

// var roationDisplay = document.getElementById("rotationDiplay");
// roationDisplay.innerHTML = "hello dude"




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
    rotationSpeed:number = 0

    velocityX:number = 0
    velocityY:number = 0

    thrustAmount:number = 0.33

    constructor(center: Point, width:number, height:number) {
        this.center = center
        this.width = width
        this.height = height
        this.rotation= 0 - (Math.PI/2)
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
        let vec = rotationToPoint({x:1,y:0},this.rotation)
        this.velocityX += vec.x * this.thrustAmount
        this.velocityY += vec.y * this.thrustAmount
    }

    draw(ctx:CanvasRenderingContext2D){
        //since rocket is just a square it's some simple trignometry
        
        ctx.fillStyle = "rgb(255,10,10)"
        ctx.save()
        ctx.translate(this.center.x, this.center.y);
        ctx.rotate(this.rotation-(Math.PI/2));
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

let refreshRate = 17
let rotationChange = 0.003
let gravity = 0.1

let spaceship = new SpaceShip({x:60,y:100},30,90)


// canvas.requestFullscreen()


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

let isPaused = false
function pause(){
    isPaused = !isPaused
}

function reset(){
    spaceship = new SpaceShip({x:60,y:100},30,90)
    //clear screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw new frame
    spaceship.draw(ctx)

    
}

function debug(){
    isPaused = false
    gameLoop()
    document.getElementById("title").innerHTML = "Gravity: " + gravity.toFixed(4) + '   Rotation: ' + rotationChange.toFixed(6) + '   Thrust: ' + spaceship.thrustAmount.toFixed(6)
    isPaused = true
    isPaused = true
}

function gameLoop() {

    if(isPaused) return

    //sliders
    rotationChange = 0.0029 * rotDisplay
    gravity = 0.32 * gravDisplay
    spaceship.thrustAmount = 0.33 * thrustDisplay 

    
    // activite engine from touch 
    if(globalLeft){
        spaceship.rotationSpeed += rotationChange
        spaceship.thrust()
    }
    if(globalRight){
        spaceship.rotationSpeed += -rotationChange
        spaceship.thrust()  
    }

    // do a timestep
    spaceship.timeStep()

    // gravity
    spaceship.velocityY += gravity

    //clear screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw new frame
    spaceship.draw(ctx)

}

setInterval(gameLoop, refreshRate);




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