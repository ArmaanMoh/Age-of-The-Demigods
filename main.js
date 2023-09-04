Incomplete version to restrict people stealing the game!
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 640;
canvas.height = 295;

let tasks = ['Find a demigod.','Find petrol.','Meetup with head Centaur']

let task = tasks[0];

let drawableObjects = [];
let movableObjects = [];

let currDo;
let currDo2;
let currMo;
let currMo2;

let rightBtn = document.getElementById('rightBtn');
let leftBtn = document.getElementById('leftBtn');
let jumpBtn = document.getElementById('jumpBtn');
let crouchBtn = document.getElementById('crouchBtn');

let touchScreen = false;

let keyRight = false;
let keyLeft = false;
let keyUp = false;
let keyCrouch = false;

window.onload = function(){
blurt('Welcome To The Age Of The Demigods By Armaan.M!');
setInterval(GameLoop,1000/30);
setTimeout(() => {
    rules()
}, 5000);
setTimeout(() => {
    PlayCutsceneChapter1();
}, 7000);
}


function GameLoop(){
    game.loop()
}


let game = new Game();

function Game(){
    this.x = canvas.getBoundingClientRect().x;
    this.y = canvas.getBoundingClientRect().y;
    this.width = canvas.width;
    this.height = canvas.height;
    this.loop = function(){
        Draw();
    

        this.x = canvas.getBoundingClientRect().x;
        this.y = canvas.getBoundingClientRect().y;
        this.width = canvas.width;
        this.height = canvas.height;

        player.move();
    }
}



let player = new Player(200,canvas.height - 75 * 2)


function Player(x,y){
    this.x = x;
    this.y = y;
    this.width = 75;
    this.height = 75;
    this.facing = 'right';
    this.velocity = {
        x: 0,
        y: 0,
    }
    this.grv = 0.9;
    this.friction = 0.2;
    this.onGround = false;
    this.maxHorrizontalVelocity = 8;
    this.movementAllowed = true;
    this.crouching = false;
    this.normalHeight = undefined;
    this.normalY = undefined;
    this.health = 100;
    this.maxHealth = 100;
    this.hasPetrol = false;
    this.img = new Image();
    this.move = function(){
       if(this.movementAllowed){
        if(keyRight){
      this.velocity.x += 1;
      this.facing = 'right';
        }
        if(keyLeft){
            this.velocity.x -= 1;
            this.facing = 'left';
        }
       }
       if(keyCrouch && this.normalHeight == undefined){
        this.normalY = this.y;
        this.normalHeight = this.height;
        this.y += this.normalHeight/3;
        this.height -= this.normalHeight/3;
        this.crouching = true;
       }
       
        if(!keyRight && !keyLeft || keyRight && keyLeft){
            this.velocity.x *= this.friction;
        }

        if(this.velocity.x > this.maxHorrizontalVelocity){
            this.velocity.x = this.maxHorrizontalVelocity;
        }
        else if(this.velocity.x < -this.maxHorrizontalVelocity){
            this.velocity.x = -this.maxHorrizontalVelocity;
        }

        if(touchScreen){
            rightBtn.style.display = 'block';
            leftBtn.style.display = 'block';
            jumpBtn.style.display = 'block';
        }
        if(this.health <= 0){
            if(task = tasks[1]){
                blurt('You Died');
                this.health = 10000000000000000;
                clearInterval(cyclops[0].interval)
                    transitionMission2();  
             

            }
        }

        for(let i = 0;i<cyclops.length;i++){
            cyclops[i].move();
        }

        if(this.movementAllowed){


        if(keyUp && !this.crouching){
            if(!this.onGround){
                keyUp = false;
            }
            this.velocity.y -= 6.5;
        }
    }
        this.onGround = false;

       this.velocity.y += this.grv


        let horrizontalRect = {
            x:this.x + this.velocity.x,
            y:this.y,
            width:this.width,
            height:this.height,
        }
        let verticalRect = {
            x:this.x,
            y: this.y + this.velocity.y,
            width:this.width,
            height:this.height,
        }


        for(let i = 0;i<blocks.length;i++){
            let borderRect = {
                x:blocks[i].x,
                y:blocks[i].y,
                width:blocks[i].width,
                height:blocks[i].height,
            }
            if(checkIntersection(horrizontalRect,borderRect)){
                this.velocity.x = 0;
            }
            if(checkIntersection(verticalRect,borderRect)){
                this.onGround = true;
                this.velocity.y = 0;
            }
        }


        for(let i = 0;i<barriers.length;i++){
            let borderRect = {
                x:barriers[i].x,
                y:barriers[i].y,
                width:barriers[i].width,
                height:barriers[i].height,
            }
            if(checkIntersection(horrizontalRect,borderRect)){
                this.velocity.x = 0;
            }
            if(checkIntersection(verticalRect,borderRect)){
                this.onGround = true;
                this.velocity.y = 0;
            }
        }

        for(let i = 0; i<cyclops.length;i++){
            let borderRect = {
                x:cyclops[i].x,
                y:cyclops[i].y,
                width:cyclops[i].width,
                height:cyclops[i].height,
            }
            if(checkIntersection(horrizontalRect,borderRect)){
                this.velocity.x = 0;
            }
        }


        
        for(let i = 0;i<movableObjects.length;i++){
            currMo = movableObjects[i];
            if(Array.isArray(currMo)){
                for(let j = 0;j<currMo.length;j++){
                    currMo2 = currMo[j];
                    currMo2.x -= this.velocity.x;
                    currMo2.y -= this.velocity.y;
                }
            }
            else{
                currMo.x -= this.velocity.x;
                currMo.y -= this.velocity.y;
            }
        }
        for(let i = 0;i<clouds.length;i++){
            clouds[i].x -= this.velocity.x * clouds[i].speed;
            clouds[i].y -= this.velocity.y
        }
    }
    this.draw = function(){
        if(this.facing == 'right'){
            if(this.crouching){
                this.img.src = 'demigodRightCrouchImg.png';
            }
            else{
            this.img.src = 'demigodRightImg.png';
            
            }
        }
        else if(this.facing == 'left'){
            if(this.crouching){
                this.img.src = 'demigodLeftCrouchImg.png';
            }
            else{
                this.img.src = 'demigodLeftImg.png';
            }
               }
               if(this.crouching){
                ctx.drawImage(this.img,this.x,this.normalY,this.width,this.normalHeight);
               }
               else{
            ctx.drawImage(this.img,this.x,this.y,this.width,this.height);
               }

               if(task == tasks[1]){
                ctx.fillStyle = 'black';
                ctx.fillRect(this.x - 15,this.y - 15,this.maxHealth,15);
               
                ctx.fillStyle = 'red';
                ctx.fillRect(this.x - 15,this.y - 15,this.health,15);
               }
    }
}


//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$


function Draw(){
    ctx.ImageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;  
    ctx.clearRect(0,0,game.width,game.height);
    if(task == tasks[0]){
    ctx.fillStyle = '#37C6FF';
    }
    else if(task == tasks[1]){
       ctx.fillStyle = '#333333'; 
    }
    else if(task == tasks[2]){
        ctx.fillStyle = 'rgb(245,245,222)'; 
     }
    ctx.fillRect(0,0,game.width,game.height);


    for(let i = 0;i<drawableObjects.length;i++){
         currDo = drawableObjects[i];
        if(Array.isArray(currDo)){
            for(let j = 0;j<currDo.length;j++){
                currDo2 = currDo[j];
                currDo2.draw();
            }
        }
        else{
            currDo.draw()
        }
    }

    ctx.font = 'bold 25px serif';
    ctx.fillStyle = 'red';

    ctx.fillText(`Mission ${tasks.indexOf(task) + 1}: ${task}`,canvas.width - 300,30,300)


}
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$


function rules(){
    blurt('You Are Hercules Son Of Zues!');
}

function PlayCutsceneChapter1(){
        blurt('You: Last Thing I remember I was on a mission in an abandoned temple about to find something important...');
    setTimeout(() => {
        blurt(`I have to find a demigod and get back to base!`);
    }, 5000);

    setTimeout(() => {
        blurt('Click People or Objects to Interact');
    }, 8000);

    setTimeout(() => {
        brompt('Are You On A touchscreen Device(Y or N)',function(ans){
            if(ans == 'Y' || ans == 'y' || ans == 'yes'){
              touchScreen = true;
            }
        })
    }, 11000);
  

};

    window.addEventListener('keydown',(e)=>{
        if(e.key == 'ArrowRight' ||  e.key == 'd'){
            e.preventDefault();
         keyRight = true;
        }
        if(e.key == 'ArrowLeft' ||  e.key == 'a'){
            e.preventDefault();
            keyLeft = true;
           }
        if(e.key == 'ArrowUp' ||  e.key == 'w' || e.key == ' '){
            e.preventDefault();
            if(player.onGround){
            keyUp = true;
            }
           }

           if(tasks.indexOf(task)>0){
            if(e.key == 'c' && player.onGround == true && player.crouching == false){
                keyCrouch = true;
            }
            else if(e.key == 'c' && player.crouching == true){
                keyCrouch = false;
                player.y = player.normalY;
                player.height = player.normalHeight;
                player.normalHeight = undefined;
                player.normalY = undefined;
                player.crouching = false;
            }
           }
    })

    



    window.addEventListener('keyup',(e)=>{
        if(e.key == 'ArrowRight' ||  e.key == 'd'){
            e.preventDefault();
         keyRight = false;
        }
        if(e.key == 'ArrowLeft' ||  e.key == 'a'){
            e.preventDefault();
            keyLeft = false;
           }
        if(e.key == 'ArrowUp' ||  e.key == 'w' || e.key == ' '){
            e.preventDefault();
            keyUp = false;
           }
           /*
           if(tasks.indexOf(task)>0){
            if(e.key == 'c' && player.normalHeight != undefined){
                keyCrouch = false;
                player.y = player.normalHeight;
                player.normalHeight = undefined;
            }
           }
           */
    });


   let blocks = [];

   drawableObjects.push(blocks);
   movableObjects.push(blocks);

   for(let i = -2;i<35;i++){
    blocks.push(new Block(i*75,canvas.height,75,75));
   }

    function Block(x,y,width,height,type){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
        this.img = new Image();
        this.draw = function(){
            if(this.type == 1){
                this.img.src = 'rockImg.png';
            }
            else if(this.type == 2){
                this.img.src = 'baseFloorImg.png';
            }
            else{
           this.img.src = 'grassImg.png';
            }
           ctx.drawImage(this.img,this.x,this.y,this.width,this.height);
        }
    }


    let barriers = [];

    barriers.push(new Barrier(75,canvas.height - 75,75,75));
    barriers.push(new Barrier(75,canvas.height - 75*2,75,75));
    barriers.push(new Barrier(75,canvas.height - 75*3,75,75));


    barriers.push(new Barrier(75 * 30,canvas.height - 75,75,75));
    barriers.push(new Barrier(75 * 30,canvas.height - 75*2,75,75));
    barriers.push(new Barrier(75 * 30,canvas.height - 75*3,75,75));

    movableObjects.push(barriers);

    function Barrier(x,y,width,height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }



    let humans = [];

    movableObjects.push(humans);
    drawableObjects.push(humans);

    humans.push(new Humans(75*10,canvas.height - 75,1,'right'));

    humans.push(new Humans(75*15,canvas.height - 75,2,'left'));

    humans.push(new Humans(75*20,canvas.height - 75,3,'right'));

    humans.push(new Humans(75*25,canvas.height - 75,'adnos','left'));

    function Humans(x,y,type,facing){
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 75;
        this.clickedOn = 0;
        this.type = type;
        this.id = RandomId();
        this.facing = facing;
        this.img = new Image();
        this.draw = function(){
          if(this.type == 1){
            if(this.facing == 'left'){
            this.img.src = 'humanType1Left.png';
            }
            else if(this.facing == 'right'){
                this.img.src = 'humanType1Right.png';
            }
          }

          else if(this.type == 2){
            if(this.facing == 'left'){
            this.img.src = 'humanType2Left.png';
            }
            else if(this.facing == 'right'){
                this.img.src = 'humanType2Right.png';
            }
          }

          else if(this.type == 3){
            if(this.facing == 'left'){
            this.img.src = 'humanType3Left.png';
            }
            else if(this.facing == 'right'){
                this.img.src = 'humanType3Right.png';
            }
          }

          else if(this.type == 'adnos'){
            this.width = 75;
            if(this.facing == 'left'){
            this.img.src = 'adnosLeftImg.png';
            }
            else if(this.facing == 'right'){
                this.img.src = 'adnosRightImg.png';
            }
          }

          ctx.drawImage(this.img,this.x,this.y,this.width,this.height);
        }
    }


    let moons = [];

    drawableObjects.push(moons);

    function Moon(x,y,width,height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.img = new Image();
        this.draw = function(){
         this.img.src = 'moonImg.png';
         ctx.drawImage(this.img,this.x,this.y,this.width,this.height);
        }
    }







    let clouds = [];

    drawableObjects.push(clouds);


    clouds.push(new Cloud(100,100,100,100,0.1));
    clouds.push(new Cloud(500,100,100,100,0.2));
    clouds.push(new Cloud(300,50,100,100,0.3));
    clouds.push(new Cloud(700,50,100,100,0.3));

    clouds.push(new Cloud(100,-50,100,100,0.1));
    clouds.push(new Cloud(500,-50,100,100,0.2));
    clouds.push(new Cloud(300,-100,100,100,0.3));
    clouds.push(new Cloud(700,-200,100,100,0.3));

    function Cloud(x,y,width,height,speed,type){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.type = type
        this.img = new Image();
        this.draw = function(){
            if(this.type == 1){
                this.img.src = 'stormCloudImg.png';
            }
            else{
            this.img.src = 'cloudImg.png';
            }
            ctx.drawImage(this.img,this.x,this.y,this.width,this.height);
            if(this.x + this.width < 0){
                this.x = canvas.width;
            }
        }
    }



    let cars = [];

    drawableObjects.push(cars);
    movableObjects.push(cars);

    function Car(x,y,width,height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.img = new Image();
        this.draw = function(){
            this.img.src = 'carImg.png';
            ctx.drawImage(this.img,this.x,this.y,this.width,this.height);
        }
    }





    let cyclops = [];

    drawableObjects.push(cyclops);
    movableObjects.push(cyclops);

    function Cyclops(x,y,width,height,type){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.hasTrigeredSpawns = false;
        this.type = type;
        this.facing = 'left';
        this.img = new Image();
        this.health = 100;
        this.maxHealth = 100;
        this.attacking = false;
        this.id = RandomId();
        this.pos;
        this.interval;
        this.grv = 0.9;
        this.velocityY = 0;
        this.move = function(){
          if(this.type == 2){
            for(let i = 0;i<cyclops.length;i++){
                if(this.id == cyclops[i].id){
                    this.pos = i;
                }
            }

            this.velocityY += this.grv

            let horrizontalRect = {
                x:player.x + player.velocity.x,
                y:player.y,
                width:player.width,
                height:player.height,
            }
            let verticalRect = {
                x:player.x,
                y: player.y + player.velocity.y,
                width:player.width,
                height:player.height,
            }
            
            if(!checkIntersection(horrizontalRect,cyclops[this.pos])){
            this.x --;
            }
            else{
                this.attack();
            }
            for(let i = 0;i<blocks.length;i++){
                if(checkIntersection(blocks[i],cyclops[this.pos])){
                    this.velocityY = 0;
                } 
            }
            
            this.y += this.velocityY;
          }
        }
        this.attack = function(){
         if(!player.crouching){
            player.health -= 0.2;
         }
        }
        this.spawn = function(){
            this.interval = setInterval(() => {
                cyclops.push(new Cyclops(this.x,this.y,40,40,2))
            }, 2000);
        }
        this.draw = function(){
            if(this.type == 1){
                if(this.x < canvas.width && this.hasTrigeredSpawns == false){
                    this.spawn();
                    this.hasTrigeredSpawns = true;
                    blurt('crouch to resist small Cyclops,click the king to damage him while uncrouched')
                }
            }
            if(this.facing == 'left'){
                if(this.type == 1){
                this.img.src = 'cyclopsLeftImg1.png';
                }
                else{
                    this.img.src = 'cyclopsLeftImg2.png';   
                }
            }
            else if(this.facing == 'right'){
                if(this.type == 1){
                this.img.src = 'cyclopsRightImg1.png';
                }
                else{
                    this.img.src = 'cyclopsRightImg2.png';   
                }
            }
            ctx.drawImage(this.img,this.x,this.y,this.width,this.height);
            if(this.type == 1){
                ctx.fillStyle = 'black';
             ctx.fillRect(this.x,this.y - 50,this.maxHealth * 2,50)
             ctx.fillStyle = 'red';
             ctx.fillRect(this.x,this.y - 50,this.health * 2,50)
            }
        }
    }


    let items = [];

    drawableObjects.push(items);
    movableObjects.push(items);


    function Item(x,y,width,height,type){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
        this.img = new Image();
        this.draw = function(){
            if(this.type == 'petrol'){
                this.img.src = 'petrolImg.png';
            }
            else if(this.type == 'torchFront'){
                this.img.src = 'torchImg2.png';
            }
            else if(this.type == 'torchSide'){
                this.img.src = 'torchImg1.png';
            }
            ctx.drawImage(this.img,this.x,this.y,this.width,this.height);
        }
    }
   


    function checkIntersection(r1, r2){
        if(r1.x >= r2.x+r2.width){
            return false;
        }
        else if(r1.x + r1.width <= r2.x){
            return false;
        }
        else if(r1.y >= r2.y + r2.height){
            return false;
        }
        else if(r1.y + r1.height <= r2.y){
            return false;
        }
    
    else{
        return true;
    }
    
    
    
    }




//set to get z position max
drawableObjects.push(player);



function RandomId(){
    return Math.random().toString(36);
}


window.addEventListener('click',(e)=>{
    if(!touchScreen){
    let x = e.x - game.x;
    let y  = e.y - game.y;
 for(let i = 0;i<blocks.length;i++){
    if(RegisterClick(x,y,blocks[i])){
         if(blocks[i].type == undefined){
        blurt('Smells earthy...');
         }
         else if(blocks[i].type == 1){
            blurt('Its Rock...');
             }
             else if(blocks[i].type == 2){
                blurt('The Floor is Made out of a Unique Rock called Tanzanite!');
                 }
    }
      
 }




 for(let i = 0;i<items.length;i++){
    if(RegisterClick(x,y,items[i])){
     if(items[i].type == 'petrol'){
        player.hasPetrol = true;
        items.splice(i,1);
     }
    }
 }

 for(let i = 0;i<humans.length;i++){
    if(RegisterClick(x,y,humans[i])){
    if(humans[i].type == 1){
       blurt('Jack: Weird Costume Dude!')
    }
    if(humans[i].type == 2){
        blurt('Mellanie: Get Away From Me Creep!!')
     }

     if(humans[i].type == 3){
        blurt('Policeman: Going to a cosplay?')
     }
     if(humans[i].type == 'adnos' && humans[i].clickedOn == 0){
        if(task == tasks[0]){
        humans[i].clickedOn +=1;
        player.movementAllowed = false;
        blurt('???: Oh my god it really is The Mighty Hercules son of Zues!');
        setTimeout(() => {
        blurt('You: Hi I just need to get back to base.');
        }, 3000);
        setTimeout(() => {
            blurt('Adnos: Sure... I am Adnos Son of Hades.');
            }, 6000);
            setTimeout(() => {
                blurt(`Adnos: Let's Go..`);
                }, 9000);
                setTimeout(() => {
                    blurt('Mission 1 completed!');
                    transitionMission2(1)
                    }, 11000);
     }
    }
}
 }

 for(let i = 0;i<cars.length;i++){
    if(RegisterClick(x,y,cars[i])){
        if(task == tasks[1]){
            if(player.hasPetrol == false){
            blurt('It Needs fuel.');
            }
            else{
                transitionMission3();
                }
        }
    }
 }

 for(let i = 0;i<moons.length;i++){
    if(RegisterClick(x,y,moons[i])){
        if(task == tasks[1]){
            blurt('Oh, Hi Selene Your Moon-Chariot is looking nice!');
        }
    }
 }

 for(let i = 0;i<cyclops.length;i++){
    if(RegisterClick(x,y,cyclops[i]) && player.crouching == false){
    
     if(cyclops[i].type == 1){
        cyclops[i].health -= 10;
        if(cyclops[i].health <= 0){
            blurt('Congrats, You Have Defeated the King Cyclops!');
            drawableObjects.splice(drawableObjects.indexOf(cyclops),1);
            clearInterval(cyclops[i].interval);
            spawnPetrol(cyclops[i].x);
            cyclops = [];
            drawableObjects.push(cyclops);
            movableObjects.push(cyclops)
        }

    }
}
 }
}
 
})



function RegisterClick(x,y,obj){
    if(Math.round(x) > Math.round(obj.x) && Math.round(x) < Math.round(obj.x) + obj.width){
        if(Math.round(y) > Math.round(obj.y) && Math.round(y) < Math.round(obj.y) + obj.height){
            return true;
        }
    }
    else{
        return false;
    }
}


window.addEventListener('touchstart',(e)=>{

    if(touchScreen &&!keyRight && !keyLeft && !keyUp){
    let x = e.touches[0].clientX - game.x;
    let y  = e.touches[0].clientY - (game.y);
    
 for(let i = 0;i<blocks.length;i++){
    if(RegisterClick(x,y,blocks[i])){
        if(blocks[i].type == undefined){
            blurt('Smells earthy...');
             }
             else if(blocks[i].type == 1){
                blurt('Its Rock...');
                 }
                 else if(blocks[i].type == 2){
                    blurt('The Floor is Made out of a Unique gem called Tanzanite!');
                     }

    }
      
 }

 for(let i = 0;i<items.length;i++){
    if(RegisterClick(x,y,items[i])){
     if(items[i].type == 'petrol'){
        player.hasPetrol = true;
        items.splice(i,1);
     }
    }
 }
 for(let i = 0;i<humans.length;i++){
    if(RegisterClick(x,y,humans[i])){
    if(humans[i].type == 1){
       blurt('Jack: Weird Costume Dude!')
    }
    if(humans[i].type == 2){
        blurt('Mellanie: Get Away From Me Creep!!')
     }

     if(humans[i].type == 3){
        blurt('Policeman: Going to a cosplay?')
     }
     if(humans[i].type == 'adnos' && humans[i].clickedOn == 0){
        if(task == tasks[0]){
        humans[i].clickedOn +=1;
        player.movementAllowed = false;
        blurt('???: Oh my god it really is The Mighty Hercules son of Zues!');
        setTimeout(() => {
        blurt('You: Hi I just need to get back to base.');
        }, 3000);
        setTimeout(() => {
            blurt('Adnos: Sure... I am Adnos Son of Hades.');
            }, 6000);
            setTimeout(() => {
                blurt(`Adnos: Let's Go..`);
                }, 9000);
                setTimeout(() => {
                    blurt('Mission 1 completed!');
                    transitionMission2(1);
                    }, 11000);

                 
                     
             
     }
    }


}
 }
 for(let i = 0;i<cars.length;i++){
    if(RegisterClick(x,y,cars[i])){
        if(task == tasks[1]){
            if(player.hasPetrol == false){
            blurt('It Needs fuel.');
            }
            else{
                transitionMission3();
                }
        }
    }
 }

 for(let i = 0;i<moons.length;i++){
    if(RegisterClick(x,y,moons[i])){
        if(task == tasks[1]){
            blurt('Oh, Hi Selene Your Moon-Chariot is looking nice!');
        }
    }
 }

 for(let i = 0;i<cyclops.length;i++){
    if(RegisterClick(x,y,cyclops[i]) && player.crouching == false){
     if(cyclops[i].type == 1){
        cyclops[i].health -= 10;
        if(cyclops[i].health <= 0){
            blurt('Congrats, You Have Defeated the King Cyclops!');
            drawableObjects.splice(drawableObjects.indexOf(cyclops),1);
            clearInterval(cyclops[i].interval);
            spawnPetrol(cyclops[i].x);
            cyclops = [];
            drawableObjects.push(cyclops);
            movableObjects.push(cyclops)
        }

    }
}
 }
}

});




rightBtn.addEventListener('touchstart',(e)=>{
    keyRight = true;
})
leftBtn.addEventListener('touchstart',(e)=>{
    keyLeft = true;
})

jumpBtn.addEventListener('touchstart',(e)=>{
    if(player.onGround == true){
    keyUp = true;
    }
})


crouchBtn.addEventListener('touchstart',(e)=>{
      if(tasks.indexOf(task)>0){
            if(player.onGround == true && player.crouching == false){
                keyCrouch = true;
            }
            else if(player.crouching == true){
                keyCrouch = false;
                player.y = player.normalY;
                player.height = player.normalHeight;
                player.normalHeight = undefined;
                player.normalY = undefined;
                player.crouching = false;
            }
           }
})


rightBtn.addEventListener('touchend',(e)=>{
    keyRight = false;
})
leftBtn.addEventListener('touchend',(e)=>{
    keyLeft = false;
})

jumpBtn.addEventListener('touchend',(e)=>{
   
    keyUp = false;
    
});
rightBtn.addEventListener('touchcancel',(e)=>{
    keyRight = false;
})
leftBtn.addEventListener('touchcancel',(e)=>{
    keyLeft = false;
})

jumpBtn.addEventListener('touchcancel',(e)=>{
   
    keyUp = false;
    
});


function transitionMission2(a){
    if(touchScreen == true){
    crouchBtn.style.display = 'block';
    }
   ClearStuff();
    barriers.push(new Barrier(75,canvas.height - 75,75,75));
    barriers.push(new Barrier(75,canvas.height - 75*2,75,75));
    barriers.push(new Barrier(75,canvas.height - 75*3,75,75));


    barriers.push(new Barrier(75 * 30,canvas.height - 75,75,75));
    barriers.push(new Barrier(75 * 30,canvas.height - 75*2,75,75));
    barriers.push(new Barrier(75 * 30,canvas.height - 75*3,75,75));


    clouds.push(new Cloud(100,100,100,100,0.1,1));
    clouds.push(new Cloud(500,100,100,100,0.2,1));
    clouds.push(new Cloud(300,50,100,100,0.3,1));
    clouds.push(new Cloud(700,50,100,100,0.3,1));

    clouds.push(new Cloud(100,-50,100,100,0.1,1));
    clouds.push(new Cloud(500,-50,100,100,0.2,1));
    clouds.push(new Cloud(300,-100,100,100,0.3,1));
    clouds.push(new Cloud(700,-200,100,100,0.3,1));

    moons.push(new Moon(0,0,100,100));

    humans.push(new Humans(75 * 4,canvas.height - 75,'adnos','left'));


    cars.push(new Car(100,canvas.height - 100,100,100));

    cyclops.push(new Cyclops(800,canvas.height - 200,200,200,1))


    player.health = 100;


    for(let i = -2;i<35;i++){
        blocks.push(new Block(i*75,canvas.height,75,75,1));
       }
    task = tasks[1];

    if(a == 1){

    setTimeout(() => {
        blurt('Adnos: Shoot We Ran Out Of Fuel!');
    }, 3000);
    setTimeout(() => {
        blurt('Adnos: We need to defeat the Cyclops Ahead and get Fuel!');
    }, 7200);
}

   
    setTimeout(() => {
        blurt('Crouch to Use Shield by pressing "c"');
    }, 10500);
        player.movementAllowed = true;

    for(let i = -2;i<35;i++){
        blocks.push(new Block(i*75,canvas.height,75,75,1));
       }

}

function transitionMission3(){
    blurt('You have Unlocked : Chapter 2: The Base Of Heavens');

    setTimeout(() => {
        blurt('Meet up With Chiron Head Centaur!');
    }, 3000);
    
    task = tasks[2];
    player.health = 100;

    ClearStuff();

    for(let i = -2;i<35;i++){
        blocks.push(new Block(i*75,canvas.height,75,75,2));
       }
       barriers.push(new Barrier(75,canvas.height - 75,75,75));
    barriers.push(new Barrier(75,canvas.height - 75*2,75,75));
    barriers.push(new Barrier(75,canvas.height - 75*3,75,75));


    barriers.push(new Barrier(75 * 30,canvas.height - 75,75,75));
    barriers.push(new Barrier(75 * 30,canvas.height - 75*2,75,75));
    barriers.push(new Barrier(75 * 30,canvas.height - 75*3,75,75));

    for(let i = 0;i<2500; i+= 100){
      items.push(new Item(i,100,40,40,'torchFront'));
    }

}

function spawnPetrol(x){
items.push(new Item(x,blocks[0].y - 75,75,75,'petrol'));
}

function ClearStuff(){
    blocks.splice(0,blocks.length);
    cars.splice(0,cars.length);
    cyclops.splice(0,cyclops.length);
    moons.splice(0,moons.length);
    items.splice(0,items.length);
    humans.splice(0,humans.length);
    clouds.splice(0,clouds.length);
    barriers.splice(0,barriers.length);
}


