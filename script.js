//==---basic Enviroment Setup==----
const canvas=document.createElement("canvas");
document.querySelector(".MyGame").appendChild(canvas);
canvas.height=innerHeight;
canvas.width=innerWidth
const context= canvas.getContext('2d');
// =======---Main function Here-------============-----

let  difficulty=2;
const lightdamage=10;
const heavydamage=20;
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
          return(difficulty=4)
     };
     if(uservalue==="Hard"){
          setInterval(SpameEnemy,1200)
          return(difficulty=5)
     };
     if(uservalue==="Insane"){
          setInterval(SpameEnemy,1000)
          return(difficulty=8)
     };
})
//====-- fixed player position----===
const playerposition={
     x:canvas.width/2,
     y:canvas.height/2
}

//====---creating classes player,enmy,Weapon===--

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

const player1=new Player(playerposition.x,playerposition.y,16,"red");
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
         (this.x+= this.velocity.x), (this.y+= this .velocity.y) 
     }
};
//====================--here enemy class----========-----===---=--=----===
class Enemy{
     constructor(x,y,redius,color,velocity){
          this.x=x;
          this.y=y;
          this.redius=redius;
          this.color=color;
          this.velocity=velocity;
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
         (this.x+= this.velocity.x), (this.y+= this .velocity.y) 
     }
};
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
//=====---creating weaponsArray,enemirsArray,ParticlasArray-===
const weapons=[];
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
//====--- main logic here-  addevent listener for lightweapon--===
canvas.addEventListener('click',(e)=>{
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

//====--- main logic here-  addevent listener for heavyweapon--===
canvas.addEventListener('contextmenu',(e)=>{
     e.preventDefault();
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
          12,
          "pink",
          velocity,
          heavydamage

     ))
})
//====---animation function here--====
let InimationId
function animation(){
  InimationId= requestAnimationFrame(animation);
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
          weapons.forEach((weapon,weaponIndex)=>{
           //==--here find distance between weapons and enmies--==
               const Distance=Math.hypot(
                    player1.x-enemy.x,
                    player1.y-enemy.y
                  )
                  //===--here end game if enemy hit player====---
                  if(Distance-player1.redius-enemy.redius<1){
                    cancelAnimationFrame(InimationId);
                  }
     //==--here find distance between enemy and weapons-==
        const distance=Math.hypot(
          weapon.x-enemy.x,
          weapon.y-enemy.y
        )
        if(distance-weapon.redius-enemy.redius<1) {
          if(enemy.redius>20){
          enemy.redius-= 15
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
        setTimeout(()=>{
          weapons.splice(weaponIndex,1)
          enmies.splice(enemyIndex,1)
        },0)
     }
        }})
     })

}
animation()



