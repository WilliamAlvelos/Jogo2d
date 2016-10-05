var canvas, ctx;

var x = 10;

var image, audio, backgroundMusic;

var xInimigos = 90;
var yInimigos = 0;
var yAntigo = 0;

var andandoSentido = 0;


var enemies = [];


var bullet;



/*
	0 andando para direita
	1 andando para baixo
	2 andando para esquerda
	3 andando para cima
*/

function draw() {
	ctx.clearRect(0, 0, W, H);
	
	x += vx;
	y += vy;
	ctx.fillRect(x, y, w, h);
}

function criarTela(){
	canvas = document.createElement("canvas");
	canvas.setAttribute("id","tela");
	canvas.setAttribute("width",window.innerWidth);
	canvas.setAttribute("height",window.innerHeight);
	canvas.style.position = "fixed";
	canvas.style.top = "0px";
	canvas.style.left = "0px";
	document.body.appendChild(canvas);
	ctx = canvas.getContext("2d");

	audio = document.getElementById("audio");
	image = document.getElementById("trump");
	backgroundMusic = document.getElementById("backgroundMusic");

	x = window.innerWidth/2 - 120;
}

function movimentacaoInimigos(){

	//anda para direita
	if(andandoSentido == 0){
		if(xInimigos < 200){
			xInimigos++;
		}else{
			andandoSentido = 1;
		}
	}

	//anda para baixo
	if(andandoSentido == 1){
		if(yInimigos - yAntigo < 50){
			yInimigos++;
		}else{
			yAntigo = yInimigos;
			andandoSentido++;
		}
	}

	//andando para esquerda
	if(andandoSentido == 2){
		if(xInimigos > -90){
			xInimigos--;
		}else{
			andandoSentido = 3;
		}
	}

	// anda para baixo de novo
	if(andandoSentido == 3){
		if(yInimigos - yAntigo < 50){
			yInimigos++;
		}else{
			andandoSentido = 0;
			yAntigo = yInimigos;
		}
	}

}

function verificaPerda(){
	if(yInimigos + 60 > window.innerHeight - 200){
		alert('PERDEU');
	}

}

function atualizar(){
	desenhar();
	movimentacaoInimigos();
	verificaPerda();

	if(bullet != null){
		bullet.update();
		bullet.draw();
	}

	window.requestAnimationFrame(atualizar);
}




document.onkeypress = function(e){ 
	if(e.which == 37){
		x-=20;
	}else if(e.which == 39){
		x+=20;
	}

	if(e.which == 32){
		atira();
	}

	colocaX();
}

document.onkeydown  = function(e){ 
	if(e.which == 37){
		x-=15;
	}else if(e.which == 39){
		x+=15;
	}

	if(e.which == 32){
		atira();
	}

	colocaX();
}


document.onclick = function(e){ 
	atira();
}

function atira(){
  audio.play();



  if(bullet == null || !bullet.active){

  	bullet = Bullet({
    	speed: 10,
    	x: x + 60,
    	y: window.innerHeight - 210
  	});


  	bullet.draw();


  }

}


function criaInimigos(){

	 for (var i = 1; i < 14; i++) { 
	 	for(var j = 1; j < 5; j++){
	 		//enemies.push(Inimigos({
	 		//	x = i*80;
	 		//	y = 60*j
	 		//}));
	 		ctx.fillRect(xInimigos + i*80,60*j + yInimigos,50,50);
	 	}
	 }
}

function desenhar(){
	
	ctx.clearRect(0,0,window.innerWidth, window.innerHeight);
	ctx.fillStyle = "hsl(180,100%,50%)";
	ctx.fillRect(x,window.innerHeight - 200,120,120);
	ctx.drawImage(image,x,window.innerHeight - 210,125,155);
	backgroundMusic.play();

	criaInimigos();

	//ctx.moveTo(300, 300);
	//ctx.lineTo(280, 320);
	//ctx.lineTo(300, 340);
	//ctx.lineTo(320, 340);
	//ctx.lineTo(340, 320);
	//ctx.lineTo(320, 300);
	ctx.fill();
}

function iniciar(){
	criarTela();
	atualizar();
}

window.addEventListener("load",iniciar);


function colocaX(){
	if(x > (window.innerWidth - 120)){
		x = window.innerWidth - 120;
	}
	if(x < 0){
		x = 0;
	}
}

/*
//caso queria colocar para o trump passar para o outro lado

function colocaX(){
	if(x > (window.innerWidth - 120)){
		x= 0;
	}
	if(x < 0){
		x += window.innerWidth - 120;
	}
}
*/

window.addEventListener("deviceorientation", function(event) {
    x = (((event.alpha+180)/360)*window.innerWidth)*1.8;

    colocaX();

}, true);


function Inimigos(I){
	I.active = true;
	I.width = 30;
	I.height = 30;
	I.color = "#212121";


	I.draw = function() {
    	ctx.fillStyle = this.color;
    	ctx.fillRect(this.x, this.y, this.width, this.height);
  	};


  	I.update = function() {
  		ctx.fillStyle = this.color;
    	ctx.fillRect(this.x, this.y, this.width, this.height);
  	};


  	return I;
}; 

function Bullet(I) {
  I.active = true;


  I.xVelocity = 0;
  I.yVelocity = -I.speed;
  I.width = 3;
  I.height = 17;
  I.color = "#212121";

  I.draw = function() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };

  I.update = function() {
    I.x += I.xVelocity;
    I.y += I.yVelocity;

    if(I.y < 0){
    	I.active = false;
    }

  };



  return I;
}


function collides(a, b) {
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
}
