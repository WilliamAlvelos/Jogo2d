var canvas, ctx;

var x = 10;

var image, audio, backgroundMusic;

var xInimigos = 90;
var yInimigos = 0;
var yAntigo = 0;

var pontos = 0;

var andandoSentido = 0;

//lista de inimigos
var enemies = [];

//bala que so vai ser atirada uma vez pelo player
var bullet;

//quando a hillary
var hillary;


/*
	0 andando para direita
	1 andando para baixo
	2 andando para esquerda
	3 andando para cima
*/

function Enemy(I){
	I = I || {};

  I.active = true;
  I.width = 35;
  I.height = 35;

  I.xInicial = I.x;
  I.yInicial = I.y;

  I.color = "#000";


	I.draw = function() {
    	ctx.fillStyle = this.color;
    	ctx.fillRect(this.x, this.y, this.width, this.height);
  	};


  	I.update = function() {
  		I.x = I.xInicial + xInimigos;
    	I.y = I.yInicial + yInimigos;
  	};

  	I.explode = function() {
        //Sound.play("explosion");
        pontos+=50;
        this.active = false;
            // Extra Credit: Add an explosion graphic
    };
        
  	return I;
}; 


function Hillary(I){
	I = I || {};

  I.active = true;
  I.height = 155;
  I.width = 125;

  I.x = 35;
  I.y = 80;

  I.color = "#262727";


	I.draw = function() {
    	ctx.fillStyle = this.color;
    	ctx.fillRect(this.x, this.y, this.width, this.height);
    	var HillaryImage = document.getElementById("hillary");
    	ctx.drawImage(HillaryImage,this.x, this.y, this.width, this.height);
  	};


  	I.update = function() {
  		I.x += 1; 
  	};

  	I.explode = function() {
        //Sound.play("explosion");
        pontos+=150;
        this.active = false;
        I.y = 4000;
    };
        
  	return I;
}; 

function Bullet(I) {
  I.active = true;


  I.xVelocity = 0;
  I.yVelocity = -I.speed;
  I.width = 3;
  I.height = 17;
  I.color = "#000";

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


function colidiu(a, b) {
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
}




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

function handleCollisions() {
	

	//verifica os inimigos que foram atingidos e marcam eles com false
	if(bullet != null){
    	enemies.forEach(function(enemy) {
        	if(colidiu(bullet, enemy)) {
            	bullet.y = -150;
            	enemy.explode();
            	
            	enemies = enemies.filter(function(enemy) {
        			return enemy.active;
    			});

            	return;
        	}
    	});


    	if(hillary != null){
    		if(colidiu(bullet, hillary)) {
            	bullet.y = -150;
            	hillary.explode();
            	
            	enemies = enemies.filter(function(enemy) {
        			return enemy.active;
    			});

            	return;
        	}
    	}
	}
	//retira os inimigos que foram atingidos

}


function atualizar(){
	desenhar();
	movimentacaoInimigos();
	verificaPerda();

	if(bullet != null){
		bullet.update();
		bullet.draw();
	}

	if(hillary != null){
		hillary.update();
		hillary.draw();
	}

	enemies.forEach(function(enemy) {
        enemy.update();
    });


    handleCollisions();

	window.requestAnimationFrame(atualizar);
}




function tecla(e){ 
	if(e.which == 37){
		x-=25;
	}else if(e.which == 39){
		x+=25;
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

  if(bullet == null || !bullet.active){
	audio.play();
  	bullet = Bullet({
    	speed: 10,
    	x: x + 60,
    	y: window.innerHeight - 210
  	});

  	bullet.draw();
  }

}


function criaInimigos(){

	 for (var i = 1; i < 12; i++) { 
	 	for(var j = 1; j < 6; j++){
			enemies.push(Enemy({
    			x: i*50,
    			y: j*50
  			}));
	 	}
	 }
}



function criaHillary(){
	hillary = Hillary();
    hillary.draw();
}

function desenhar(){
	
	ctx.clearRect(0,0,window.innerWidth, window.innerHeight);

	ctx.font = '42px "Arcade"';
    ctx.fillStyle = '#000';
    //printa na tela os pontos do usuário
	ctx.fillText(pontos,70,70);

	
	ctx.fillStyle = "#262727";
	ctx.fillRect(x,window.innerHeight - 200,120,120);
	ctx.drawImage(image,x,window.innerHeight - 210,125,155);
	
	backgroundMusic.play();

    enemies.forEach(function(enemy) {
        enemy.draw();
    });

    if(hillary == null || !hillary.active){
		if(Math.random() < 0.001){
			criaHillary();
		}
    }

	ctx.fill();
}

function iniciar(){
	criarTela();
	criaInimigos();
	atualizar();
}


/*
function colocaX(){
	if(x > (window.innerWidth - 120)){
		x = window.innerWidth - 120;
	}
	if(x < 0){
		x = 0;
	}
}
*/

//caso queria colocar para o trump passar para o outro lado

function colocaX(){
	if(x > (window.innerWidth - 120)){
		x= 0;
	}
	if(x < 0){
		x += window.innerWidth - 120;
	}
}


//cria os eventos

window.addEventListener("deviceorientation", function(event) {
    x = (((event.alpha+180)/360)*window.innerWidth)*1.8;

    colocaX();

}, true);

window.addEventListener("load",iniciar);

window.addEventListener('keydown',this.tecla,true);

window.addEventListener('keyup',this.tecla,true);

window.addEventListener('keypressed',this.tecla,true);

window.addEventListener('resize',this.resize,true);



//re ajuste da tela
function resize(e){
	colocaX();
}