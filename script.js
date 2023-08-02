// importing sound effect
const shootingsong= new Audio("./Music/shooting.mp3");
const killenemy= new Audio("./Music/killEnemy.mp3");
const gameover=new Audio("./Music/gameOver.mp3");
const hugeweapon= new Audio("./Music/hugeWeapon.mp3");
const heavyweapon= new Audio("./Music/heavyWeapon.mp3");
//==---basic Enviroment Setup==----
const canvas=document.createElement("canvas");
document.querySelector(".MyGame").appendChild(canvas);
canvas.height=innerHeight;
canvas.width=innerWidth
const context= canvas.getContext('2d');
// =======---Main function Here-------============-----

let  difficulty=2;
const lightdamage=10;
const heavydamage=25;
let playerscore=0;
const form =document.querySelector("form");
const scoreboard=document.querySelector(".scoreboard");
document.querySelector(".play-key").addEventListener("click",(e)=>{
     e.preventDefault();
     form.style.display="none";
     scoreboard.style.display="block";
     const uservalue=document.getElementById("difficulty").value;
     if(uservalue==="Easy"){
          setInterval(SpameEnemy,2000)
          return(difficulty=3)
     };
     if(uservalue==="Medium"){
          setInterval(SpameEnemy,1500)
          return(difficulty=5)
     };
     if(uservalue==="Hard"){
          setInterval(SpameEnemy,1200)
          return(difficulty=7)
     };
     if(uservalue==="Insane"){
          setInterval(SpameEnemy,1000)
          return(difficulty=9)
     };
})

/**
 * Creates an end screen with the player's score, a high score, and a play-again button.
 * If the player's score is higher than the previous high score, it updates the high score in local storage.
 */
const gameoverloader = () => {
  // Create end screen elements
  const gameoverBanner = document.createElement("div");
  const gameoverButton = document.createElement("button");
  const highscore = document.createElement("div");

  // Get the previous high score from local storage
  const oldHighScore = localStorage.getItem("highscore");

  // Get the current score from local storage
  const currentScore = localStorage.getItem("playerscore");

  // Calculate the new high score
  const newHighScore = Math.max(oldHighScore, currentScore);

  // Update the high score in local storage
  localStorage.setItem("highscore", newHighScore);

  // Set the high score text
  highscore.innerHTML = `High Score: ${newHighScore}`;

  // Set the text for the play-again button
  gameoverButton.innerHTML = 'Play Again';

  // Reload the page when the play-again button is clicked
  gameoverButton.onclick = () => {
    window.location.reload();
  };

  // Add elements to the end screen div
  gameoverBanner.appendChild(highscore);
  gameoverBanner.appendChild(gameoverButton);

  // Add class to the end screen div
  gameoverBanner.classList.add("Game-Over");

  // Append the end screen div to the body of the HTML document
  document.querySelector("body").appendChild(gameoverBanner);
};

//====-- fixed player position----===
const playerposition={
     x:canvas.width/2,
     y:canvas.height/2
}

//====---creating classes player,enmy,Weapon,Huageweapon===--

//=====--here player class--===
class Player{
     constructor(x,y,redius,color){
          this.x=x;
          this.y=y;
          this.redius=redius;
          this.color=color;
     };
     draw(){
          context.beginPath();
          context.arc(
               this.x,
               this.y,
               this.redius,
               (Math.PI/180)*0,
               (Math.PI/180)*360,
               false,
          )
          context.fillStyle=this.color;
          context.fill();
     }
};
//===--creating a player here===--
const player1=new Player(playerposition.x,playerposition.y,18,"red");
//=======---here weapon class======================//
class Weapon{
     constructor(x,y,redius,color,velocity,damage){
          this.x=x;
          this.y=y;
          this.redius=redius;
          this.color=color;
          this.velocity=velocity;
          this.damage=damage;
     };
     draw(){
          context.beginPath();
          context.arc(
               this.x,
               this.y,
               this.redius,
               (Math.PI/180)*0,
               (Math.PI/180)*360,
               false,
          )
          context.fillStyle=this.color;
          context.fill();
     };
     
     update(){
          this.draw();
         (this.x+= this.velocity.x), 
         (this.y+= this .velocity.y) 
     }
};
//====--here hugeweapon class--====
class HuageWeapon{
     constructor(x,y,){
          this.x=x;
          this.y=y;
          this.color="green";
          
     };
     draw(){
          context.beginPath();
          context.fillRect(this.x,this.y,200,canvas.height)
          context.fillStyle=this.color;
          context.fill();
     };
     update(){
          this.draw();
         this.x += 30
     }
};
class Enemy {
     /**
      * Creates a new Enemy object.
      * @param {number} x - The x-coordinate of the enemy's position.
      * @param {number} y - The y-coordinate of the enemy's position.
      * @param {number} radius - The size of the enemy.
      * @param {string} color - The color of the enemy.
      * @param {object} velocity - The velocity of the enemy, represented as an object with x and y components.
      */
     constructor(x, y, radius, color, velocity) {
          this.x = x;
          this.y = y;
          this.radius = radius;
          this.color = color;
          this.velocity = velocity;
     }

     /**
      * Draws the enemy on the canvas.
      */
     draw() {
          context.beginPath();
          context.arc(
               this.x,
               this.y,
               this.radius,
               0,
               Math.PI * 2,
               false
          );
          context.fillStyle = this.color;
          context.fill();
     }

     /**
      * Updates the position of the enemy based on its velocity.
      */
     update() {
          this.draw();
          this.x += this.velocity.x;
          this.y += this.velocity.y;
     }
}
//===---here particals class---===

class Partical{
     constructor(x,y,redius,color,velocity){
          this.x=x;
          this.y=y;
          this.redius=redius;
          this.color=color;
          this.velocity=velocity;
          this.alpha=1
     };
     draw(){
          context.save();
          context.globalAlpha=this.alpha;
          context.beginPath();
          context.arc(
               this.x,
               this.y,
               this.redius,
               (Math.PI/180)*0,
               (Math.PI/180)*360,
               false,
          )
          context.fillStyle=this.color;
          context.fill();
          context.restore();
          
     };
     update(){
          this.draw();
          this.x+= this.velocity.x,
          this.y+= this .velocity.y,
          this.alpha -= 0.01; 
     }
};
//=====---creating weaponsArray huageweaponArray,enemirsArray,ParticlasArray-===
const weapons=[];
const huageweapons=[];
const enmies =[];
const particals=[];

let enmycolor
const SpameEnemy=()=>{
     //==--creating random size and color for enemies--====
     const enmysize=Math.random()*(40-5)+5;
      enmycolor=`hsl(${Math.floor(Math.random()*360)},100%,40%)`;
     let random;
     if(Math.random()<0.5){
          random={
               x:Math.random()<0.5?canvas.width+enmysize:0-enmysize,
               y:Math.random()*canvas.height,
          }
     }else{
          random={
               x:Math.random()*canvas.width,
               y:Math.random()<0.5?canvas.height+enmysize:0-enmysize,
     
          }
     };
     const MyAngle= Math.atan2(
          canvas.height/2-random.y,
          canvas.width/2-random.x,          
     );
     const velocity={
          x:Math.cos(MyAngle)*6,
          y:Math.sin(MyAngle)*6, 
     };

     enmies.push(new Enemy(random.x,random.y,enmysize,enmycolor,velocity))
}
//====--- main logic here addevent listener for lightweapon to rightclick--===
canvas.addEventListener('click',(e)=>{
     shootingsong.play();
     //==-finding angle between player position and click co-ordinate
     const MyAngle= Math.atan2(
          e.clientY-canvas.height/2,
          e.clientX-canvas.width/2,          
     );
     const velocity={
          x:Math.cos(MyAngle)*difficulty,
          y:Math.sin(MyAngle)*difficulty, 
     };
     weapons.push(new Weapon(
          canvas.width/2,
          canvas.height/2,
          6,
          "white",
          velocity,
          lightdamage

     ))
})
//====--- main logic here addevent listener for heavyweapon to leftclick--===
canvas.addEventListener('contextmenu',(e)=>{
     //===--rendering player score--==
     if(playerscore<=0)return;
     heavyweapon.play();
     //===-- decreasing playerscore  using heavyweapons--==
     playerscore -= 2;
     //---==updateing player score==--
     scoreboard.innerHTML=`Score:${playerscore}`

     const MyAngle= Math.atan2(
          e.clientY-canvas.height/2,
          e.clientX-canvas.width/2,          
     );
     const velocity={
          x:Math.cos(MyAngle)*difficulty,
          y:Math.sin(MyAngle)*difficulty, 
     };
     weapons.push(new Weapon(
          canvas.width/2,
          canvas.height/2,
          10,
          "pink",
          velocity,
          heavydamage

     ))
})
//====--- main logic here-addevent listener for hugeweapon to spacebar--===
addEventListener('keypress',(e)=>{
   if(e.key===" "){
     if(playerscore<20)return;
     hugeweapon.play();
     playerscore -= 6;
  scoreboard.innerHTML=`Score:${playerscore}`

     huageweapons.push(new HuageWeapon(
         0,
         0, 
     ))
   }
    
})
addEventListener('contextmenu',(e)=>{
   e.preventDefault();
  });

  addEventListener('resize',(e)=>{
       window.location.reload()
  })

//====---animation function here--====
let InimationId
function animation(){
  InimationId= requestAnimationFrame(animation);
  //===--updating playerscore in scoreboard in html--==
  scoreboard.innerHTML=`Score:${playerscore}`

  context.fillStyle="rgba(45,45,45,0.3)"   
   context.fillRect(0,0,canvas.width,canvas.height)
     player1.draw();
     //===---creating particals--=====
     particals.forEach((partical,particalindex)=>{
          if(this.alpha<=0){
               particals.splice(particalindex,1)
          }else{
          partical.update();
          }
     })
     //===---creating huageweapons===---
     huageweapons.forEach((Huageweapon,Huageweaponindex)=>{
          if(huageweapons.x>canvas.width){
            huageweapons.splice(Huageweaponindex,1)
          }else{
               Huageweapon.update()
          }
      
     })
  //==--generating lighter weapons--===
     weapons.forEach((Weapon,WeaponIndex)=>{
      Weapon.update();
      
      if(Weapon.x+Weapon.redius<1||
         Weapon.y+Weapon.redius<1||
         Weapon.x-Weapon.redius>canvas.width||
         Weapon.y-Weapon.redius>canvas.height) {
        weapons.splice(WeaponIndex,1) }
     });
     enmies.forEach((enemy,enemyIndex)=>{
          enemy.update()
          huageweapons.forEach((huageweapon)=>{
               const distancebetweenhuageweaponandenmies=huageweapon.x-enemy.x;
          
               if(distancebetweenhuageweaponandenmies<=200 &&
                     distancebetweenhuageweaponandenmies>=-200){
                    //===--rendering player score--===
                    playerscore +=10;
                    scoreboard.innerHTML=`Score:${playerscore}`
                    setTimeout(()=>{
                         killenemy.play();
                         enmies.splice(enemyIndex,1)
                       },0)
               }
             })
          weapons.forEach((weapon,weaponIndex)=>{
           //==--here find distance between weapons and enmies--==
               const Distance=Math.hypot(
                    player1.x-enemy.x,
                    player1.y-enemy.y
                  )
                  //===--here end game if enemy hit player====---
                  if(Distance-player1.redius-enemy.redius<1){
                    cancelAnimationFrame(InimationId);
                    gameover.play();
                    return gameoverloader()
                  }
     //==--here find distance between enemy and weapons-==
        const distance=Math.hypot(
          weapon.x-enemy.x,
          weapon.y-enemy.y
        )
        if(distance-weapon.redius-enemy.redius<1) {
          if(enemy.redius>20){
          enemy.redius-= 12
          weapons.splice(weaponIndex,1)
          }
       else{ 
          for(let i=0;i<10;i++){
               particals.push(new Partical(
                weapon.x,
                weapon.y,
                2,
                enmycolor,
                {
                x: (Math.random() - 0.5)*(Math.random()*20),
                y: (Math.random() - 0.5)*(Math.random()*20)
                }
                ))
            }
            playerscore +=10;
            //==-- updating playerscore in scoreboard in html===--
            scoreboard.innerHTML=`Score:${playerscore}`
        setTimeout(()=>{
          killenemy.play();
          weapons.splice(weaponIndex,1)
          enmies.splice(enemyIndex,1)
        },0)
     }
        }})
     })
}
animation()



