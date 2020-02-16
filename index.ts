console.log("Hello cruel world 222")

var canvas = <HTMLCanvasElement> document.getElementById("mainCanvas");
var ctx = canvas.getContext("2d");
var size : Point = {x:window.innerWidth,y:window.innerHeight}
ctx.canvas.width  = size.x;
ctx.canvas.height = size.y;

console.log('abcdefgh')

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
        // ctx.fillStyle = "rgb(0,0,0)"
        // ctx.fillRect(this.center.x+p1.x-5,this.center.y+p1.y-5,5,5)
        // ctx.fillStyle = "rgb(255,10,10)"

        let collisionPoints : Point[] = []

        // collisionPoints.push

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


canvas.addEventListener('touchmove', function(event) {
    // If there's exactly one finger inside this element

    console.log('Touch occured')


    

    if (event.targetTouches.length == 1) {
      var touch = event.targetTouches[0];
      // Place element where the finger is
      
      var rect = canvas.getBoundingClientRect();
      drawPix({x:touch.pageX-rect.left,y:touch.pageY-rect.top})
    }
  }, false);


let spaceship = new SpaceShip({x:60,y:100},30,90)

spaceship.draw(ctx)
spaceship.drawCollision(ctx)


// canvas.addEventListener("touchmove", handleMove, false)



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