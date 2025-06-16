// Variáveis globais
let tela = "inicio";
let idioma = "pt";
let nomeJogador = "";
let inputNome;
let botaoConfirmar;
let vidas = 3;
let cellSize = 40;
let cols, rows;
let maze;
let player;
let dots = [];
let macas = [];
let fantasmas = [];
let labirintoIniciado = false;
let faseAtual = 1;
let pontuacao = 0;
let perguntasFase = [];
let perguntaAtual = 0;
let mostrandoPerguntas = false;
let todasMacasColetadas = macas.every(m => m.coletada);
let todasPerguntasRespondidas = dots.every(d => d.coletado);

// Imagens do personagem
let BartNormal, BartAssustada, BartEstrelas, BartTriste, BartBrava;

function preload() {
  BartNormal = loadImage('BartNormal.png');
  BartAssustada = loadImage('BartAssustada.png');
  BartEstrelas = loadImage('BartEstrelas.png');
  BartTriste = loadImage('BartTriste.png');
  BartBrava = loadImage('BartBrava.png');
}

// Layouts do labirinto
const layouts = [
  [
    "###############",
    "#             #",
    "# ### ##### ###",
    "# #   #   #   #",
    "# # ### # ### #",
    "#     #       #",
    "###############"
  ],
  [
    "###############",
    "#.....#.......#",
    "#.###.#.#####.#",
    "#.#.....#.....#",
    "#.#.###.#.###.#",
    "#.#.#...#...#.#",
    "#.#.#.#####.#.#",
    "#...#.......#.#",
    "###.#######.#.#",
    "#.............#",
    "###############"
  ]
];

// Perguntas por fase
const perguntasPorFase = [
  [
    { posX: 3, posY: 1, pergunta: "Qual a importância da agricultura sustentável para o meio ambiente?", opcoes: ["Preserva os recursos naturais e mantém o solo saudável", "Aumenta a poluição do ar e da água", "Destrói os habitats naturais"], correta: 0 },
    { posX: 7, posY: 3, pergunta: "Qual destes alimentos é cultivado em uma fazenda típica?", opcoes: ["Arroz", "Sorvete", "Pizza"], correta: 0 },
    { posX: 11, posY: 5, pergunta: "O que significa “agricultura familiar”?", opcoes: ["Produção feita por grandes empresas agrícolas", "Produção agrícola realizada por famílias em pequenas propriedades", "Agricultura feita só para alimentar animais"], correta: 1 }
  ],
  [
    { posX: 1, posY: 1, pergunta: "Qual prática ajuda a conservar o solo e evitar a erosão?", opcoes: ["Desmatar as árvores para plantar mais rápido", "Plantar árvores e usar técnicas de plantio direto", "Jogar lixo nas plantações"], correta: 1 },
    { posX: 3, posY: 3, pergunta: "Por que é importante valorizar o produtor rural?", opcoes: ["Porque eles produzem alimentos que chegam até nossas casas", "Porque eles só trabalham com máquinas", "Porque não precisamos dos alimentos que eles produzem"], correta: 0 }
  ]
];

// ---------- SETUP E DRAW -----------
function setup() {
  createCanvas(800, 500);
  textAlign(CENTER, CENTER);
  textSize(20);

  criarInputNome(); 
}

function criarInputNome() {
  inputNome = createInput('');
  inputNome.position(100, 180);
  inputNome.hide();  // Esconde inicialmente

  botaoConfirmar = createButton('Confirmar');
  botaoConfirmar.position(100, 220);
  botaoConfirmar.hide();

  botaoConfirmar.mousePressed(() => {
    nomeJogador = inputNome.value();
    if (nomeJogador.trim() !== "") {
      tela = "mapa";
      inputNome.hide();
      botaoConfirmar.hide();
    }
  });
}

function draw() {
  background(255, 240, 245);

  switch (tela) {
    case "inicio":
      desenharTelaInicial();
      // Esconder input e botão na tela inicial
      if(inputNome) inputNome.hide();
      if(botaoConfirmar) botaoConfirmar.hide();
      break;

    case "nome":
      desenharTelaNome();
      // Mostrar input e botão só aqui
      if(inputNome) inputNome.show();
      if(botaoConfirmar) botaoConfirmar.show();
      break;

    case "mapa":
      desenharMapaFases();
      // Input e botão escondidos aqui
      if(inputNome) inputNome.hide();
      if(botaoConfirmar) botaoConfirmar.hide();
      break;

    case "aviso":
      desenharAviso();
      if(inputNome) inputNome.hide();
      if(botaoConfirmar) botaoConfirmar.hide();
      break;

    case "jogo":
      if (!labirintoIniciado) {
        inicializarLabirinto(faseAtual);
      }
      desenharLabirinto();
      desenharJogo();
      if(inputNome) inputNome.hide();
      if(botaoConfirmar) botaoConfirmar.hide();
      break;

    case "fim":
      desenharTelaFinal();
      if(inputNome) inputNome.hide();
      if(botaoConfirmar) botaoConfirmar.hide();
      break;
  }
}

// Função desenharLabirinto separada do switch

function desenharLabirinto() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (maze[y][x] === '#') {
        fill(0); // Preto para parede
        rect(x * cellSize, y * cellSize, cellSize, cellSize);
      } else {
        fill(255); // Espaço livre branco
        rect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }
}


// ----------- TELAS ------------

function desenharTelaInicial() {
  let tamanhoQuadro = 40;
  for (let y = 0; y < height; y += tamanhoQuadro) {
    for (let x = 0; x < width; x += tamanhoQuadro) {
      if ((x / tamanhoQuadro + y / tamanhoQuadro) % 2 === 0) {
        fill(255, 200, 210);
      } else {
        fill(240, 180, 190);
      }
      noStroke();
      rect(x, y, tamanhoQuadro, tamanhoQuadro);
    }
  }
  fill(255, 100, 100);
  textSize(40);
  text("🍎 O Enigma da Fazenda de Pomar 🍎", width / 2, 70);

  fill(237, 59, 59);
  rect(320, 160, 160, 40, 10);
  rect(320, 230, 160, 40, 10);

  fill(255);
  textSize(20);
  text("Jogar", 400, 180);
}

 function desenharTelaNome() {
 background(102, 16, 16);
  textSize(40);
  textAlign(CENTER, CENTER);
  fill(255, 100);

  let spacing = 60;
  for (let x = 0; x < width; x += spacing) {
    for (let y = 0; y < height; y += spacing) {
      text('🍎', x, y);
    }
  }

  fill(255);
  textSize(45);
  textAlign(CENTER, CENTER);
  text("Digite seu nome:", width / 2, 130);

  if (inputNome) inputNome.show();
  if (botaoConfirmar) botaoConfirmar.show();
}


function desenharMapaFases() {
  fill('#d1242c');
  textSize(32);
  text(`Bem-vinda, ${nomeJogador}!`, width / 2, 80);
  text("Escolha uma fase:", width / 2, 130);
  for (let i = 0; i < layouts.length; i++) {
    let x = 150 + i * 180;
    let y = 250;
    fill(i + 1 === faseAtual ? '#2ad124' : '#d12424');
    rect(x, y, 140, 140, 20);
    fill(255);
    textSize(24);
    text("Fase " + (i + 1), x + 70, y + 75);
  }
}


function desenharTelaFinal() {
  background(240, 220, 230);
  fill(150, 50, 100);
  textAlign(CENTER, CENTER);
  textSize(24);
  text(
    "Você finalizou este jogo.\n\nMuito obrigada por me escolherem para o Agrinho!\n\n" +
    "Espero que, enquanto estavam jogando, tenham conhecido um pouco mais\n" +
    "essa conexão entre o rural e a cidade.\n\n" +
    "Sou muito grata a todos que me apoiaram e acreditaram no meu trabalho.\n\n" +
    "Sem vocês, esse projeto não teria sido possível.",
    width / 2, height / 2 - 20
  );
}

function desenharAviso() {
  background(200, 240, 200);
  
  fill(64, 7, 7);
  textAlign(CENTER, TOP);
  textSize(22);
  text("Missão:", width / 2, 50);

  textSize(18);
  text("Bartelomena está com fome e quer comer maçãs.\nSua missão é ajudá-la a comer o máximo possível,\nsem que o fazendeiro pegue ela.\n\nObs: Os pontos com '?' podem dar mais maçãs\nse você responder corretamente!", width / 2, 90);

  textSize(24);
  fill(0, 128, 0);
  text("Bom Jogo!!!", width / 2, height - 100);

  fill(255, 192, 203);
  rect(width / 2 - 100, height - 60, 200, 40, 10);
  fill(64, 7, 7);
  textSize(20);
  text("Começar", width / 2, height - 55);
}

// -------- LABIRINTO ----------

function inicializarLabirinto(fase) {
  maze = layouts[fase - 1];
  perguntasFase = perguntasPorFase[fase - 1];
  cols = maze[0].length;
  rows = maze.length;
  player = { x: 1, y: 1 };
  dots = perguntasFase.map(p => ({ x: p.posX, y: p.posY, coletado: false }));

  macas = [];
  let quantidadeMacas = 100;
  let tentativas = 0;

  while (macas.length < quantidadeMacas && tentativas < 1000) {
    tentativas++;
    let x = floor(random(cols));
    let y = floor(random(rows));
    let livre = maze[y][x] !== "#" &&
                !dots.some(d => d.x === x && d.y === y) &&
                !(x === player.x && y === player.y) &&
                !macas.some(m => m.x === x && m.y === y);
    if (livre) macas.push({ x: x, y: y, coletada: false });
  }

  fantasmas = [];
  if (fase === 2) {
    fantasmas.push(new Fantasma(3, 3));
    fantasmas.push(new Fantasma(6, 6));
  }

  perguntaAtual = 0;
  mostrandoPerguntas = false;
  labirintoIniciado = true;
  vidas = 3;
  pontuacao = 0;
}

function verificarAvancoDeFase() {
  let todasMacasColetadas = macas.every(m => m.coletada);
  let todasPerguntasRespondidas = dots.every(d => d.coletado);

  if (todasMacasColetadas && todasPerguntasRespondidas) {
    if (faseAtual >= layouts.length) {
      tela = "fim";
    } else {
      alert(`Parabéns, ${nomeJogador}! Fase ${faseAtual} completa!\nPontuação: ${pontuacao}`);
      faseAtual++;
      tela = "mapa";
      labirintoIniciado = false;
    }
  }
}

function desenharJogo() {
  background(200, 240, 200);
  
  
   for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (maze[y][x] === "#") {
        fill(72, 207, 75); 
        noStroke();
        rect(x * cellSize, y * cellSize, cellSize, cellSize);
      } else {
        fill(200, 240, 200);  // cor do chão (mesma do background)
        noStroke();
        rect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }
   
  verificarAvancoDeFase();

  fill(255, 0, 0);
  textSize(24);
  textAlign(LEFT, TOP);
  text("❤️".repeat(vidas), 20, 10);

  for (let d of dots) {
    if (!d.coletado) {
      fill(189, 53, 53);
      ellipse(d.x * cellSize + cellSize / 2, d.y * cellSize + cellSize / 2, 20);
      fill(255);
      textSize(16);
      textAlign(CENTER, CENTER);
      text("?", d.x * cellSize + cellSize / 2, d.y * cellSize + cellSize / 2);
    }
  }

  textSize(24);
  textAlign(CENTER, CENTER);
  for (let m of macas) {
    if (!m.coletada) {
      fill(255, 0, 0);
      text("🍎", m.x * cellSize + cellSize / 2, m.y * cellSize + cellSize / 2 + 2);
      verificarAvancoDeFase();
    }
  }
imageMode(CENTER);
  image(
    BartNormal,
    player.x * cellSize + cellSize / 2,
    player.y * cellSize + cellSize / 2,
    cellSize,
    cellSize
  );

  for (let f of fantasmas) {
    f.mover();
    f.desenhar();
    if (f.x === player.x && f.y === player.y) {
      vidas--;
      if (vidas <= 0) {
        tela = "fim";
        return;
      } else {
        alert(`👩‍ Você foi pego pelo fazeideiro! Vidas restantes: ${vidas}`);
        player.x = 1;
        player.y = 1;
      }
    }
  }

  fill(27, 99, 27);
  textSize(22);
  textAlign(RIGHT, TOP);
  text(`🍎 ${pontuacao}`, width - 300, 10);

  if (mostrandoPerguntas) {
    fill(0, 150);
    rect(0, 0, width, height);

    let cx = width / 2;
    let cy = height / 2;

    fill(255, 105, 105, 245);
    rect(cx - 200, cy - 120, 420, 240, 12);

    fill(64, 7, 7);
    textAlign(CENTER, CENTER);
    textSize(13);
    text(perguntasFase[perguntaAtual].pergunta, cx, cy - 40);

    let opW = 200, opH = 35, baseX = cx - opW / 2, baseY = cy - 10;
    for (let j = 0; j < perguntasFase[perguntaAtual].opcoes.length; j++) {
      fill(255, 192, 203);
      rect(baseX, baseY + j * (opH + 10), opW, opH, 8);
      fill(64, 7, 7);
      text(perguntasFase[perguntaAtual].opcoes[j], baseX + opW / 2, baseY + j * (opH + 10) + opH / 2);
    }
  }
}

function ehParede(x, y) {
  if (x < 0 || y < 0 || y >= rows || x >= cols) return true;
  return maze[y][x] === "#";
console.log(ehParede(-1, 0)); // true, fora do labirinto
console.log(ehParede(0, 0));  // true, se for parede
console.log(ehParede(1, 1));  // false, se for espaço aberto
console.log(ehParede(cols, rows)); // true, fora do labirinto
}

function moverJogador(direcaoX, direcaoY) {
  let novoX = player.x + direcaoX;
  let novoY = player.y + direcaoY;

  if (!ehParede(novoX, novoY)) {
    player.x = novoX;
    player.y = novoY;

    for (let m of macas) {
      if (!m.coletada && m.x === player.x && m.y === player.y) {
        m.coletada = true;
        pontuacao++;
      }
    }

    for (let d of dots) {
      if (!d.coletado && d.x === player.x && d.y === player.y) {
        d.coletado = true;
        mostrandoPerguntas = true;
        perguntaAtual = 0;
      }
    }
  }
}


// ------- FANTASMA -------

class Fantasma {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.dir = random([[1, 0], [-1, 0], [0, 1], [0, -1]]);
    this.timer = 0;
    this.velocidade = 15;
  }

  mover() {
    this.timer++;
    if (this.timer % this.velocidade !== 0) return;

    if (this.timer > 30) {
      this.dir = random([[1, 0], [-1, 0], [0, 1], [0, -1]]);
      this.timer = 0;
    }

    let nx = this.x + this.dir[0];
    let ny = this.y + this.dir[1];
    if (nx >= 0 && nx < cols && ny >= 0 && ny < rows && maze[ny][nx] !== "#") {
      this.x = nx;
      this.y = ny;
    }
  }
desenhar() {
  textSize(cellSize * 0.9);
  textAlign(CENTER, CENTER);
  text("👩‍🌾", this.x * cellSize + cellSize / 2, this.y * cellSize + cellSize / 2);
}
}

// ------- CONTROLES -------

function keyPressed() {
  if (tela === "inicio" && key === 'Enter') {
    tela = "nome";
  } else if (tela === "mapa" && key === 'c') {
    mostrarConfig = !mostrarConfig;
  } else if (tela === "jogo" && !mostrandoPerguntas) {
    let nx = player.x;
    let ny = player.y;

    if (keyCode === UP_ARROW) ny--;
    else if (keyCode === DOWN_ARROW) ny++;
    else if (keyCode === LEFT_ARROW) nx--;
    else if (keyCode === RIGHT_ARROW) nx++;

    if (nx >= 0 && nx < cols && ny >= 0 && ny < rows && maze[ny][nx] !== "#") {
      moverJogador(nx - player.x, ny - player.y);
    }
  }
}
function mousePressed() {
  if (tela === "aviso") {
    if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100 &&
        mouseY > height - 60 && mouseY < height - 20) {
      tela = "jogo";
      if (!labirintoIniciado) {
        inicializarLabirinto(faseAtual);
      }
    }
    return;
  }

  // Tela de Início
  if (tela === "inicio") {
    if (mouseX > 320 && mouseX < 480 && mouseY > 160 && mouseY < 200) {
      console.log("Botão Jogar clicado");
      tela = "nome";
      return;
    }
  }
  // Tela de Mapa
  if (tela === "mapa") {
    for (let i = 0; i < layouts.length; i++) {
      let x = 150 + i * 180;
      let y = 250;
      if (mouseX > x && mouseX < x + 140 && mouseY > y && mouseY < y + 140) {
        faseAtual = i + 1;
        tela = "jogo";
        labirintoIniciado = false;
        
      }
    }
  }

  // Perguntas durante o jogo
  if (tela === "jogo" && mostrandoPerguntas) {
    let cx = width / 2, cy = height / 2;
    let opW = 200, opH = 35, baseX = cx - opW / 2, baseY = cy - 10;

    for (let i = 0; i < perguntasFase[perguntaAtual].opcoes.length; i++) {
      if (mouseX > baseX && mouseX < baseX + opW &&
          mouseY > baseY + i * (opH + 10) && mouseY < baseY + i * (opH + 10) + opH) {

        if (i === perguntasFase[perguntaAtual].correta) {
          pontuacao += 10;
          dots[perguntaAtual].coletado = true;
          verificarAvancoDeFase();

          let todasMacasColetadas = macas.every(m => m.coletada);
          let todasPerguntasRespondidas = dots.every(d => d.coletado);

          if (todasMacasColetadas && todasPerguntasRespondidas) {
            if (faseAtual >= layouts.length) {
              tela = "fim";
            } else {
              alert(`Parabéns, ${nomeJogador}! Fase ${faseAtual} completa!\nPontuação: ${pontuacao}`);
              faseAtual++;
              tela = "mapa";
              labirintoIniciado = false;
            }
          }
        } else {
          alert("Resposta errada! Tente novamente.");
        }
        mostrandoPerguntas = false;
      }
    }
  
}
}