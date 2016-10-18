var canvas, ctx;

var x = 10;

var image, audio,perdaAudio, backgroundMusic;

var xInimigos = 90;
var yInimigos = 0;
var yAntigo = 0;

var pontos = 0;

var andandoSentido = 0;

//lista de inimigos
var enemies = [];

//Array dos tiros dos inimigoss
var bulletEnimies = [];

//bala que so vai ser atirada uma vez pelo player
var bullet;

//quando a hillary
var hillary;


var haveEnemy = 0;


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

  I.color = 'rgba(0,0,0,0)';


	I.draw = function() {
    	ctx.fillStyle = this.color;
    	ctx.fillRect(this.x, this.y, this.width, this.height);
    	var HillaryImage = document.getElementById("hillary");
    	ctx.drawImage(HillaryImage,this.x, this.y, this.width, this.height);
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
  I.height = 55;
  I.width = 45;

  I.x = 35;
  I.y = 40;

  I.color = 'rgba(0,0,0,0)';


	I.draw = function() {
    	ctx.fillStyle = this.color;
    	ctx.fillRect(this.x, this.y, this.width, this.height);
    	var HillaryImage = document.getElementById("obama");
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

  I.updateEnemy = function(){
	I.x -= I.xVelocity;
    I.y -= I.yVelocity;

    if(I.y < 0){
    	I.active = false;
    }
  }

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


function colidiuComTrump(a){
	var yTrump = window.innerHeight - 80;
	return a.x < x + 50 &&
         a.x + a.width > x &&
         a.y < yTrump + 50 &&
         a.y + a.height > yTrump;
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
	image = document.getElementById("trump");
	audio = document.getElementById("audio");
	perdaAudio = document.getElementById("fired");
	backgroundMusic = document.getElementById("backgroundMusic");

	x = window.innerWidth/2 - 120;
}

function movimentacaoInimigos(){

	//anda para direita
	if(andandoSentido == 0){
		if(xInimigos < 200){
			xInimigos+=0.3;
		}else{
			andandoSentido = 1;
		}
	}

	//anda para baixo
	if(andandoSentido == 1){
		if(yInimigos - yAntigo < 50){
			yInimigos+=0.3;
		}else{
			yAntigo = yInimigos;
			andandoSentido++;
		}
	}

	//andando para esquerda
	if(andandoSentido == 2){
		if(xInimigos > -90){
			xInimigos-=0.3;
		}else{
			andandoSentido = 3;
		}
	}

	// anda para baixo de novo
	if(andandoSentido == 3){
		if(yInimigos - yAntigo < 50){
			yInimigos+=0.3;
		}else{
			andandoSentido = 0;
			yAntigo = yInimigos;
		}
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



	//verificar se alguma bala colidiu no trump
	bulletEnimies.forEach(function(be) {
        if(colidiuComTrump(be)) {
            be.y += window.innerHeight;
            perdaAudio.play();
            perda();
            //trump falando algo engracadao	
            //tela de perda

            return;
        }
   	});

   	//verifica se algum inimigo encostou nele
   	enemies.forEach(function(enemy){
		if(colidiuComTrump(enemy)) {
            //enemy.explode();
            perdaAudio.play();
            perda();
            //trump falando algo engracadao	
            //tela de perda

            return;
        }
   	});

    haveEnemy = 0;

}

function perda(){
	alert('Parabens você fez ' + pontos + ' pontos');
	window.location.href='../Jogo2d/index.html';
}


function atualizar(){
	desenhar();
	movimentacaoInimigos();

	if(bullet != null){
		bullet.update();
		bullet.draw();
	}

	if(hillary != null){
		hillary.update();
		hillary.draw();
	}


	enemies.forEach(function(enemy) {
    if(enemy.active == true)
    {
      haveEnemy =1;
    }
        enemy.update();
  });

  if (haveEnemy==0){
    criaInimigos();
  } 

    bulletEnimies.forEach(function(be) {
        be.updateEnemy();
    });


    handleCollisions();

	window.requestAnimationFrame(atualizar);
}




function tecla(e){ 
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

  if(bullet == null || !bullet.active){
	audio.play();
  	bullet = Bullet({
    	speed: 10,
    	x: x + 25,
    	y: window.innerHeight - 80
  	});

  	bullet.draw();
  }

}


function criaInimigos(){

	 for (var i = 1; i < 12; i++) { 
	 	for(var j = 1; j < 6; j++){
			enemies.push(Enemy({
    			x: i*55 + 100,
    			y: j*55 + 50
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
    ctx.fillStyle = '#fff';
    //printa na tela os pontos do usuário
	ctx.fillText(pontos,70,70);

	
	ctx.fillStyle = 'rgba(0,0,0,0)';
	ctx.fillRect(x,window.innerHeight - 80,50,50);
	ctx.drawImage(image,x,window.innerHeight - 80,55,68);
	
	backgroundMusic.play();

    enemies.forEach(function(enemy) {
        enemy.draw();
    });




    //cria a hillary se nao existir outra no cenario
    if(hillary == null || !hillary.active){
		if(Math.random() < 0.001){
			criaHillary();
		}
    }

    inimigoAtira();


    bulletEnimies.forEach(function(be){
    	be.draw();
    });

	ctx.fill();
}

function inimigoAtira(){
	//cria o tiro inimigo
	enemies.forEach(function(e){
		if(Math.random() < 0.0001){
			bulletEnimies.push(Bullet({
				speed: 8,
    			x: e.x + 17,
    			y: e.y
  			}));
		}
	})	
}


function iniciar(){
	criarTela();
	criaInimigos();
	atualizar();
}



function colocaX(){
	if(x > (window.innerWidth - 120)){
		x = window.innerWidth - 120;
	}
	if(x < 0){
		x = 0;
	}
}


//caso queria colocar para o trump passar para o outro lado
/*
function colocaX(){
	if(x > (window.innerWidth - 120)){
		x= 0;
	}
	if(x < 0){
		x += window.innerWidth - 120;
	}
}*/


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
