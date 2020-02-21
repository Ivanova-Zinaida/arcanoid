const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

canvas.width = 500;
canvas.height = 500;

let image = new Image(880, 1024);
image.src = 'img.png';

let space = new Image;
space.src = 'space.png';

const atlas = {
    ball:{
        x:3,
        y:587,
        width: 38,
        height: 38
    },
    yellow:{
        x:174,
        y:36,
        width: 42,
        height: 20
    },
    red:{
        x:0,
        y:36,
        width: 42,
        height: 20
    },
    green:{
        x:174,
        y:0,
        width: 42,
        height: 20
    },
    pink:{
        x:116,
        y:36,
        width: 42,
        height: 20
    },
    platforma:{
        x:108,
        y:176,
        width: 210,
        height: 18
    }
    
}
const ball = {
    x: canvas.width/2,
    y: canvas.height-50,
    width: 10,
    height: 10,
    speed: 200,
    angle: Math.PI/4 + Math.random()* Math.PI/2
};
const platforma = {
    x: 10,
    y: canvas.height-40,
    width: 150,
    height: 20,
    speed: 200,
    leftKey: false,
    rightKey:false
};
const blocks = []

for(let x= 0; x<8; x++){
    for(let y = 0 ; y < 8; y++){
        blocks.push({
            x:50+50*x,
            y:50+20*y,
            width:50,
            height: 20,
            color:getRandom(['red', 'pink','green','yellow'])
        })
    }
}
const limits =[
    {x: 0, y: -20, width: canvas.width, height: 20},
    {x: canvas.width, y: 0, width:20, height: canvas.height},
    {x: 0, y: canvas.height, width: canvas.width, height: 20},
    {x: -20, y: 0, width: 20, height: canvas.height}
];

let play = true;
document.addEventListener('keydown', function(event){
    if(event.key ==='ArrowLeft'){
        platforma.leftKey = true
        
    }
    else if(event.key ==='ArrowRight'){
        platforma.rightKey = true
    }
    else if(play==false && event.key ==='Enter'){
        play=true;
        console.log('work')
        Object.assign( ball ,{
            x: canvas.width/2,
            y: canvas.height-50,
            width: 10,
            height: 10,
            speed: 200,
            angle: Math.PI/4 + Math.random()* Math.PI/2
        });
        Object.assign(platforma, {
            x: 10,
            y: canvas.height-40,
            width: 150,
            height: 20,
            speed: 200,
            leftKey: false,
            rightKey:false
        });
        blocks.splice(0, blocks.length-1)

        for(let x= 0; x<8; x++){
            for(let y = 0 ; y < 8; y++){
                blocks.push({
                    x:50+50*x,
                    y:50+20*y,
                    width:50,
                    height: 20,
                    color:getRandom(['red', 'pink','green','yellow'])
                })
            }
        }
    }
});
document.addEventListener('keyup', function(event){
    if(event.key ==='ArrowLeft'){
        platforma.leftKey = false
    }
    else if(event.key ==='ArrowRight'){
        platforma.rightKey = false
    }
});
requestAnimationFrame(loop)

let pTimestamp = 0

function loop(timestamp){
   
        requestAnimationFrame(loop);
         clearCanvas();
    if(play){
        const dTimestamp = Math.min(16.7, timestamp-pTimestamp);
        const secondPart = dTimestamp / 1000;

        pTimestamp = timestamp

       
        ball.x +=secondPart * ball.speed * Math.cos(ball.angle);
        ball.y -=secondPart * ball.speed * Math.sin(ball.angle);

        if(platforma.leftKey){
            platforma.x = Math.max(0, platforma.x - secondPart*platforma.speed)
        }
        if(platforma.rightKey){
            platforma.x = Math.min(canvas.width - platforma.width, platforma.x + secondPart*platforma.speed)
        }

        for (const block of blocks){
            if(isIntersection(block, ball)){
                toggleItem(blocks, block)

                const ctrl1 = {
                    x: block.x - 10,
                    y: block.y - 10,
                    width: 10 + block.width,
                    height: 10
                }
                const ctrl2 = {
                    x: block.x + block.with,
                    y: block.y - 10,
                    width: 10,
                    height: 10 + block.height
                }
                const ctrl3 = {
                    x: block.x ,
                    y: block.y+ block.height,
                    width: block.width + 10,
                    height: 10
                }
                const ctrl4 = {
                    x: block.x - 10,
                    y: block.y,
                    width: 10,
                    height: block.height+10
                }
                if (isIntersection(ctrl1, ball)|| isIntersection(ctrl3, ball)){
                    ball.angle = Math.PI *2 - ball.angle
                } else if(isIntersection(ctrl2, ball)|| isIntersection(ctrl4, ball)){
                    ball.angle = Math.PI - ball.angle   
                }
            }
        }

        if(isIntersection(limits[0], ball)){
            ball.angle = Math.PI *2 - ball.angle
        }
        if(isIntersection(limits[1], ball)||isIntersection(limits[3], ball) ){
            ball.angle = Math.PI - ball.angle
        }
        if (isIntersection(limits[2], ball)){
            play = false;
        }
        if (isIntersection(platforma, ball)){
            const x = ball.x + ball.width/2;
            const percent = (x - platforma.x)/platforma.width;
            
            ball.angle =Math.PI - Math.PI*8/10*(percent+0.05);
        }
        }
        drawBall(ball)

        for (const block of blocks){
            drawBlock(block)
        }
        drawPlatforma(platforma);
        if(!play){
            context.beginPath();
            context.rect(0, 0 , canvas.width, canvas.height);
            context.fillStyle = 'rgba(255, 255, 255, 0.5)'
            context.fill(); 
            context.font = '50px Arial';
            context.fillStyle ='black';
            context.textAlign = 'center'
            context.fillText('Конец игры', canvas.width/2, canvas.height/2);
            context.font = '30px Arial';
            context.fillStyle ='black';
            context.textAlign = 'center'
            context.fillText('Для продолжения нажми Enter', canvas.width/2, canvas.height/2+40);   
        }

}


function clearCanvas(){
    context.drawImage(space, 0, 0, canvas.width, canvas.height)
}



function drawRect(param){
    context.beginPath();
    context.rect(param.x, param.y, param.width, param.height);
    context.strokeStyle = 'red';
    context.stroke();
}
function isIntersection(blockA, blockB){
    const pointsA = [
        {x: blockA.x, y: blockA.y},
        {x: blockA.x + blockA.width, y: blockA.y},
        {x: blockA.x, y: blockA.y+ blockA.height},
        {x: blockA.x+ blockA.width, y: blockA.y+ blockA.height}
    ]
    
    for(const pointA of pointsA){
        if(blockB.x <= pointA.x && pointA.x <= blockB.x + blockB.width && blockB.y <= pointA.y&& pointA.y <= blockB.y + blockB.height){
            return true
        }
    }
    
    const pointsB = [
        {x: blockB.x, y: blockB.y},
        {x: blockB.x + blockB.width, y: blockB.y},
        {x: blockB.x, y: blockB.y+ blockB.height},
        {x: blockB.x+ blockB.width, y: blockB.y+ blockB.height}
    ]
    
    for(const pointB of pointsB){
        if(blockA.x <= pointB.x && pointB.x <= blockA.x + blockA.width && blockA.y <= pointB.y&& pointB.y <= blockA.y + blockA.height){
            return true
        }
    }
    return false;
}

function toggleItem( array, item){
    if(array.includes(item)){
        const index = array.indexOf(item)
        array.splice(index, 1)
    }
    else {
        array.push(item)
    }
}

function drawBall(ball){
    context.drawImage(
        image,
        atlas.ball.x, atlas.ball.y, atlas.ball.width, atlas.ball.height,
        ball.x, ball.y, ball.width, ball.height     
    );
}
function drawBlock(block){
    context.drawImage(
        image,
        atlas[block.color].x, atlas[block.color].y, atlas[block.color].width, atlas[block.color].height,
        block.x, block.y, block.width, block.height     
    );
}
function drawPlatforma(platforma){
    context.drawImage(
        image,
        atlas.platforma.x, atlas.platforma.y, atlas.platforma.width, atlas.platforma.height,
        platforma.x, platforma.y, platforma.width, platforma.height     
    );
}

function getRandom(array){
    const index = Math.floor(Math.random()* array.length)
    return array[index]
}