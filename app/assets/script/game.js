// Elemento da tela.
var canvas;
var pontuacaoContainer;
var tempoContainer;
var btnAcao;
var recordContainer;

// Contexto 2d do canvas.
var ctx;

// Canvas width (w) e height (h).
var w = 990,h = 1290;

// Tamanho padrado do snake.
var TAMANHO_PADRAO = 30;

// Direção em que esta se movimentando.
var direcao;

// Pontos obtidos no jogo.
var pontos = 0;

// Tempo de jogo.
var tempoJogo = 0;

// Constantes de direção.
var ESQUERDA = 0, DIREITA = 1, CIMA = 2, BAIXO = 3;

// Array de posições das partes do snake.
var snake;

// Tempo da ultima vez que foi desenhada a tela.
var tempo;

// Velocidade em que deve ser redesenhado.
var VELOCIDADE = 80;

// Controle de status do jogo.
var STATUS;

// Status de jogo
var JOGANDO = 1;
var FIM_DE_JOGO = 2;

// Carregando elementos e iniciando jogo.
function carregarJogo() {
	carregarElementos();
	iniciarJogo();
}

// Carregando elementos na tela
function carregarElementos() {
	canvas = document.getElementsByTagName('canvas')[0];
	canvas.width = w;
	canvas.height = h;
	ctx = canvas.getContext("2d");

	recordePontosContainer = document.getElementById('pontosRecorde');
	recordeTempoContainer = document.getElementById('tempoRecorde');
	pontuacaoContainer = document.getElementById('pontosPartida');
	tempoContainer = document.getElementById('tempoPartida');

	btnAcao = document.getElementById('btnAcao');
	btnAcao.addEventListener('click', function() {
		reiniciar();
	}, false);

	var canvasContainerElem = document.getElementsByClassName('canvasContainer')[0];
	canvasContainerElem.appendChild(canvas);

	atualizarTamanho();
}

// Atualizando tamanho e posição dos elementos da tela.
function atualizarTamanho() {
	canvas.style.width = window.innerWidth / 2 - 20 + 'px';
	canvas.style.height = window.innerHeight - 20 + 'px';

	var infoContainerElem = document.getElementsByClassName('infoContainer')[0];
	infoContainerElem.style.height = window.innerHeight + "px";
}

// Criando elementos e aplicando listeners.
function iniciarJogo() {
	btnAcao.style.display = 'none';
	exibirRecord();
	direcao = DIREITA;
	STATUS = JOGANDO;

	snake = [];
	pontos = 0;
	tempoInicioJogo = new Date();

	criarSnake();
	criarComida();

	desenhar();

	document.onkeydown =  function(e) {
		var key = e.which;
		
		if(key == "37" && direcao != DIREITA) direcao = ESQUERDA;
		else if(key == "38" && direcao != BAIXO) direcao = CIMA;
		else if(key == "39" && direcao != ESQUERDA) direcao = DIREITA;
		else if(key == "40" && direcao != CIMA) direcao = BAIXO;
	};

	window.onresize = function(){
		atualizarTamanho();
		reiniciar();
	}
}

// Criando snake.
function criarSnake() {
	var tamanho = 5;
	for(var i = tamanho - 1; i >= 0; i--)
		snake.push({x: i, y:0});
}	

// Criando comida.
function criarComida() {
	comida = {
		x: Math.round(Math.random()*(w-TAMANHO_PADRAO)/TAMANHO_PADRAO), 
		y: Math.round(Math.random()*(h-TAMANHO_PADRAO)/TAMANHO_PADRAO), 
	}
}

// Desenhando movimentação do jogo.
function desenhar() {
	requestAnimationFrame(desenhar);

	if(STATUS == JOGANDO) {
		var diffTempo = (new Date() - tempoInicioJogo) / 1000;
		var sec = Math.round(diffTempo % 60);
		var min = Math.round(Math.floor(diffTempo / 60) % 60);
		tempoContainer.textContent = min + 'min ' + sec + 'sec';

		if(tempo == undefined || tempo + VELOCIDADE < new Date().getTime()) {
			atualizarVelocidade();
			pintar();
			tempo = new Date().getTime();	
		}
	}

}

// Atualizando velocidade do jogo de acordo com a quantidade de pontos.
function atualizarVelocidade() {
	if(pontos < 100) {
		VELOCIDADE = 80;
	} else if(pontos < 200) {
		VELOCIDADE = 60;
	} else if(pontos > 200) {
		VELOCIDADE = 40;
	}
}

// Limapando canvas e pintando elementos na tela.
function pintar() {
	var nx = snake[0].x;
	var ny = snake[0].y;

	if(direcao == DIREITA) nx++;
	else if(direcao == ESQUERDA) nx--;
	else if(direcao == CIMA) ny--;
	else if(direcao == BAIXO) ny++;

	if(nx == -1 || nx == w/TAMANHO_PADRAO || ny == -1 || ny == h/TAMANHO_PADRAO || verificarColisao(nx, ny, snake))
	{
		fimDeJogo();
		return;
	}

	// Limpando canvas
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, w, h);
	ctx.strokeStyle = "black";
	ctx.strokeRect(0, 0, w, h);

	if(nx == comida.x && ny == comida.y) {
		var rabo = {x: nx, y: ny};
		pontos = pontos + 10;

		criarComida();
	} else {
		var rabo = snake.pop();
		rabo.x = nx; rabo.y = ny;
	}

	snake.unshift(rabo);

	for(var i = 0; i < snake.length; i++) {
		var c = snake[i];
		
		pintarParte(c.x, c.y);
	}

	pintarParte(comida.x, comida.y);
	pontuacaoContainer.textContent = pontos;
}

// Desenhando elemento na tela.
function pintarParte(x, y) {
	ctx.fillStyle = "black";
	ctx.fillRect(x*TAMANHO_PADRAO, y*TAMANHO_PADRAO, TAMANHO_PADRAO, TAMANHO_PADRAO);
	ctx.strokeStyle = "white";
	ctx.strokeRect(x*TAMANHO_PADRAO, y*TAMANHO_PADRAO, TAMANHO_PADRAO, TAMANHO_PADRAO);
}

// Verificando se existe colisão.
function verificarColisao(x, y, array) {
	for(var i = 0; i < array.length; i++) {
		if(array[i].x == x && array[i].y == y)
			return true;
	}
	return false;
}

// Reiniciando jogo.
function reiniciar() {
	snake = [];
	iniciarJogo();
}

// Exibindo recorde se já existe ou exibindo zerado caso não exista.
function exibirRecord() {
	var recordePontos = localStorage.getItem('recordePontos');
	var recordeTempo = localStorage.getItem('recordeTempo');
	if(recordePontos) {
		var sec = Math.round(recordeTempo % 60);
		var min = Math.round(Math.floor(recordeTempo / 60) % 60);
		recordePontosContainer.textContent = recordePontos + ' pontos';
		recordeTempoContainer.textContent = min + 'min ' + sec + 'sec';	
	} else {
		recordePontosContainer.textContent = '0 pontos';
		recordeTempoContainer.textContent = '0min 0sec';
	}
}	

// Fim de jogo.
function fimDeJogo() {
	btnAcao.style.display = 'block';
	snake = [];
	STATUS = FIM_DE_JOGO;

	var recordePontos = localStorage.getItem('recordePontos');
	var recordeTempo = localStorage.getItem('recordeTempo');
	var diffTempo = (new Date() - tempoInicioJogo) / 1000;
	
	// Atualizando record e tempo se ja existe ou criando novos se não existir ainda.
	if(recordePontos) {
		if(recordePontos < pontos) {
			localStorage.setItem('recordePontos', pontos);
			localStorage.setItem('recordeTempo', diffTempo);	
		} else if(recordePontos == pontos && recordeTempo > diffTempo){
			localStorage.setItem('recordeTempo', diffTempo);
		}
	} else if(pontos > 0) {
		localStorage.setItem('recordePontos', pontos);
		localStorage.setItem('recordeTempo', diffTempo);
	}
}

