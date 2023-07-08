//==---basic Enviroment Setup==----
const canvas=document.createElement("canvas");
document.querySelector(".MyGame").appendChild(canvas);
canvas.height=innerHeight;
canvas.width=innerWidth
const context= canvas.getContext('2d');
// =======---Main function Here-------============-----

const difficulty=2;
const form =document.querySelector("form");
const scoreboard=document.querySelector(".scoreboard");
document.querySelector(".play-key").addEventListener("click",(e)=>{
     e.preventDefault();
     form.style.display="none";
     scoreboard.style.display="block";
     const uservalue=document.getElementById("difficulty").value;
     if(uservalue==="Easy"){
          setInterval(SpameEnemy,2000)
          return(difficulty=4)
     };
     if(uservalue==="Medium"){
          setInterval(SpameEnemy,1500)
          return(difficulty=7)
     };
     if(uservalue==="Hard"){
          setInterval(SpameEnemy,1200)
          return(difficulty=9)
     };
     if(uservalue==="Insane"){
          setInterval(SpameEnemy,1000)
          return(difficulty=11)
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
     constructor(redius,x,y,color){
          this.redius=redius;
          this.x=x;
          this.y=y;
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

const player1=new Player( 16,playerposition.x,playerposition.y, "red");
//=======---here weapon class======================//
class Weapon{
     constructor(redius,x,y,color,velocity){
          this.redius=redius;
          this.x=x;
          this.y=y;
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
//====================--here enemy class----========-----===---=--=----===
class Enemy{
     constructor(x,y,redius,color,velocity){
          this.redius=redius;
          this.x=x;
          this.y=y;
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
//=====---creating weaponsArray,enemirsArray-===
const weapons=[];
const enmies =[];
const SpameEnemy=()=>{
     //==--creating random size and color for enemies--====
     const enmysize=Math.random()*(40-5)+5;
     const enmycolor=`hsl(${Math.floor(Math.random()*36000)},100%,40%)`;
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
//====--- main logic here---===
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
          5,
          canvas.width/2,
          canvas.height/2,
          "white",
          velocity
     ))
})
//====---animation function here--====
let InimationId
function animation(){
  InimationId= requestAnimationFrame(animation);
  context.fillStyle="rgba(40,40,40,0.)"   
   context.fillRect(0,0,canvas.width,canvas.height)
     player1.draw();
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
                  if(Distance-player1.redius-enemy.redius<1){
                    cancelAnimationFrame(InimationId);
                  }
     //==--here find distance between enemy and weapons-==
        const distance=Math.hypot(
          weapon.x-enemy.x,
          weapon.y-enemy.y
        )
        if(distance-weapon.redius-enemy.redius<1){
          if(enemy.redius>18){
     
          }
        setTimeout(()=>{
          weapons.splice(weaponIndex,1)
          enmies.splice(enemyIndex,1)
        },0)
        }})
     })

}
animation()



