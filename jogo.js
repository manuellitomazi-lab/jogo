// ==================================================
// CONFIGURAÇÃO DO CANVAS
// ==================================================

// Pegamos o Canvas pelo ID.
const canvas = document.getElementById("jogo");

// Pegamos o contexto 2D para desenhar.
const ctx = canvas.getContext("2d");


// ==================================================
// CONFIGURAÇÕES DO CHÃO
// ==================================================

const chaoY = 250;


// ==================================================
// DINOSSAURO
// ==================================================

let dinossauroX = 100;
let dinossauroY = chaoY - 50;

const dinossauroLargura = 50;
const dinossauroAltura = 50;


// ==================================================
// FÍSICA DO PULO
// ==================================================

let velocidadeY = 0;

const gravidade = 0.8;

const forcaPulo = -15;

let estaNoChao = true;


// ==================================================
// CONFIGURAÇÕES DOS CACTOS
// ==================================================

// Lista que guarda os cactos existentes.
let cactos = [];

// Velocidade inicial dos cactos.
const velocidadeInicialCacto = 5;

// Velocidade atual dos cactos.
let velocidadeCacto = velocidadeInicialCacto;

// Velocidade máxima.
// Isso evita que o jogo fique impossível.
const velocidadeMaximaCacto = 8;

// Quanto a velocidade aumenta a cada 100 pontos.
const aumentoVelocidade = 0.3;

const larguraCacto = 20;

const alturaMinimaCacto = 25;

const alturaMaximaCacto = 60;


// ==================================================
// CONTROLE DO TEMPO DOS CACTOS
// ==================================================

let ultimoCacto = 0;

let intervaloCacto = numeroAleatorio(1000, 2500);


// ==================================================
// CONTROLE DO JOGO
// ==================================================

let jogoTerminou = false;


// ==================================================
// PONTUAÇÃO
// ==================================================

// Pontuação atual.
let pontuacao = 0;

// Guarda o momento usado para calcular a pontuação.
let ultimoTempoPontuacao = 0;


// ==================================================
// RECORDE
// ==================================================

// Tentamos pegar o recorde que está salvo no navegador.
//
// O localStorage guarda informações mesmo depois
// que o navegador é fechado.
let recorde = Number(
    localStorage.getItem("recordeDinossauro")
) || 0;


// ==================================================
// FUNÇÃO PARA GERAR NÚMEROS ALEATÓRIOS
// ==================================================

function numeroAleatorio(minimo, maximo) {

    return Math.floor(
        Math.random() * (maximo - minimo + 1)
    ) + minimo;
}


// ==================================================
// DESENHAR O CHÃO
// ==================================================

function desenharChao() {

    ctx.fillStyle = "#555";

    ctx.fillRect(
        0,
        chaoY,
        canvas.width,
        3
    );
}


// ==================================================
// DESENHAR O DINOSSAURO
// ==================================================

function desenharDinossauro() {

    ctx.fillStyle = "#333";

    // Corpo
    ctx.fillRect(
        dinossauroX,
        dinossauroY + 15,
        35,
        35
    );

    // Cabeça
    ctx.fillRect(
        dinossauroX + 25,
        dinossauroY,
        30,
        25
    );

    // Pescoço
    ctx.fillRect(
        dinossauroX + 20,
        dinossauroY + 10,
        15,
        20
    );

    // Perna esquerda
    ctx.fillRect(
        dinossauroX + 5,
        dinossauroY + 45,
        8,
        10
    );

    // Perna direita
    ctx.fillRect(
        dinossauroX + 25,
        dinossauroY + 45,
        8,
        10
    );

    // Cauda
    ctx.fillRect(
        dinossauroX - 15,
        dinossauroY + 25,
        20,
        8
    );

    // Olho
    ctx.fillStyle = "#fff";

    ctx.fillRect(
        dinossauroX + 45,
        dinossauroY + 7,
        5,
        5
    );
}


// ==================================================
// CRIAR UM NOVO CACTO
// ==================================================

function criarCacto() {

    // Escolhe uma altura aleatória.
    const altura = numeroAleatorio(
        alturaMinimaCacto,
        alturaMaximaCacto
    );

    // Cria o objeto do cacto.
    const novoCacto = {

        // Começa no lado direito da tela.
        x: canvas.width,

        // Faz o cacto ficar apoiado no chão.
        y: chaoY - altura,

        // Largura.
        largura: larguraCacto,

        // Altura aleatória.
        altura: altura
    };

    // Coloca o cacto na lista.
    cactos.push(novoCacto);
}


// ==================================================
// ATUALIZAR OS CACTOS
// ==================================================

function atualizarCactos() {

    // Percorre todos os cactos.
    for (let i = 0; i < cactos.length; i++) {

        // Move o cacto para a esquerda.
        cactos[i].x -= velocidadeCacto;
    }


    // Remove os cactos que saíram da tela.
    for (let i = cactos.length - 1; i >= 0; i--) {

        if (cactos[i].x + cactos[i].largura < 0) {

            cactos.splice(i, 1);
        }
    }
}


// ==================================================
// DESENHAR OS CACTOS
// ==================================================

function desenharCactos() {

    // Percorre todos os cactos.
    for (let i = 0; i < cactos.length; i++) {

        const cacto = cactos[i];

        // Cor verde.
        ctx.fillStyle = "green";

        // Corpo do cacto.
        ctx.fillRect(
            cacto.x,
            cacto.y,
            cacto.largura,
            cacto.altura
        );

        // Braço esquerdo.
        ctx.fillRect(
            cacto.x - 8,
            cacto.y + cacto.altura * 0.45,
            8,
            10
        );

        // Braço direito.
        ctx.fillRect(
            cacto.x + cacto.largura,
            cacto.y + cacto.altura * 0.30,
            8,
            10
        );
    }
}


// ==================================================
// FAZER O DINOSSAURO PULAR
// ==================================================

function pular() {

    // Só pode pular quando está no chão.
    if (estaNoChao) {

        velocidadeY = forcaPulo;

        estaNoChao = false;
    }
}


// ==================================================
// CONTROLE DO TECLADO
// ==================================================

document.addEventListener("keydown", function(event) {

    // Se o jogo acabou e o jogador apertou espaço,
    // reiniciamos tudo.
    if (
        event.code === "Space" &&
        jogoTerminou
    ) {

        event.preventDefault();

        reiniciarJogo();

        return;
    }


    // Se o jogo está funcionando,
    // espaço ou seta para cima fazem o dinossauro pular.
    if (
        !jogoTerminou &&
        (
            event.code === "Space" ||
            event.code === "ArrowUp"
        )
    ) {

        event.preventDefault();

        pular();
    }
});


// ==================================================
// ATUALIZAR O DINOSSAURO
// ==================================================

function atualizarDinossauro() {

    // Gravidade aumenta a velocidade de queda.
    velocidadeY += gravidade;

    // Atualiza a posição vertical.
    dinossauroY += velocidadeY;


    // Verifica se chegou ao chão.
    if (dinossauroY >= chaoY - dinossauroAltura) {

        dinossauroY = chaoY - dinossauroAltura;

        velocidadeY = 0;

        estaNoChao = true;
    }
}


// ==================================================
// ATUALIZAR A PONTUAÇÃO
// ==================================================

function atualizarPontuacao(tempoAtual) {

    // Na primeira atualização, guardamos o tempo.
    if (ultimoTempoPontuacao === 0) {

        ultimoTempoPontuacao = tempoAtual;

        return;
    }


    // Calculamos quanto tempo passou.
    const tempoPassado =
        tempoAtual - ultimoTempoPontuacao;


    // A cada 100 milissegundos,
    // ganhamos 1 ponto.
    if (tempoPassado >= 100) {

        const pontosGanhos =
            Math.floor(tempoPassado / 100);

        // Aumenta a pontuação.
        pontuacao += pontosGanhos;

        // Atualiza o relógio.
        ultimoTempoPontuacao = tempoAtual;

        // Verifica se conseguimos um novo recorde.
        verificarRecorde();

        // Atualiza a velocidade dos cactos.
        atualizarVelocidade();
    }
}


// ==================================================
// VERIFICAR E SALVAR O RECORDE
// ==================================================

function verificarRecorde() {

    // Se a pontuação atual passou do recorde...
    if (pontuacao > recorde) {

        // Atualizamos o recorde.
        recorde = pontuacao;

        // Salvamos o novo recorde no navegador.
        localStorage.setItem(
            "recordeDinossauro",
            recorde
        );
    }
}


// ==================================================
// ATUALIZAR A VELOCIDADE DOS CACTOS
// ==================================================

function atualizarVelocidade() {

    // Descobrimos quantos grupos de 100 pontos
    // já foram alcançados.
    const nivelVelocidade =
        Math.floor(pontuacao / 100);


    // Aumenta um pouco a velocidade.
    velocidadeCacto =
        velocidadeInicialCacto +
        (nivelVelocidade * aumentoVelocidade);


    // Nunca ultrapassa a velocidade máxima.
    if (velocidadeCacto > velocidadeMaximaCacto) {

        velocidadeCacto = velocidadeMaximaCacto;
    }
}


// ==================================================
// DESENHAR PONTUAÇÃO E RECORDE
// ==================================================

function desenharPontuacao() {

    // Transforma a pontuação em texto com 5 dígitos.
    //
    // 5    -> 00005
    // 125  -> 00125
    // 340  -> 00340
    //
    const textoPontuacao =
        pontuacao.toString().padStart(5, "0");


    // Transforma o recorde em texto com 5 dígitos.
    const textoRecorde =
        recorde.toString().padStart(5, "0");


    // Configuração do texto.
    ctx.fillStyle = "#333";

    ctx.font = "20px Arial";

    // Faz o texto ficar alinhado à direita.
    ctx.textAlign = "right";


    // Mostra a pontuação.
    ctx.fillText(
        textoPontuacao,
        canvas.width - 145,
        30
    );


    // Mostra o recorde ao lado da pontuação.
    ctx.fillText(
        "HI " + textoRecorde,
        canvas.width - 20,
        30
    );


    // Voltamos ao alinhamento central.
    ctx.textAlign = "center";
}


// ==================================================
// VERIFICAR COLISÃO
// ==================================================

function verificarColisao() {

    // Percorremos todos os cactos.
    for (let i = 0; i < cactos.length; i++) {

        const cacto = cactos[i];


        // Área do dinossauro.
        const dinossauroEsquerda = dinossauroX;

        const dinossauroDireita =
            dinossauroX + dinossauroLargura;

        const dinossauroTopo = dinossauroY;

        const dinossauroBaixo =
            dinossauroY + dinossauroAltura;


        // Área do cacto.
        const cactoEsquerda = cacto.x;

        const cactoDireita =
            cacto.x + cacto.largura;

        const cactoTopo = cacto.y;

        const cactoBaixo =
            cacto.y + cacto.altura;


        // Verifica se os dois retângulos se sobrepõem.
        if (
            dinossauroDireita > cactoEsquerda &&
            dinossauroEsquerda < cactoDireita &&
            dinossauroBaixo > cactoTopo &&
            dinossauroTopo < cactoBaixo
        ) {

            // O jogo terminou.
            jogoTerminou = true;

            // Para o movimento vertical.
            velocidadeY = 0;

            break;
        }
    }
}


// ==================================================
// CONTROLAR NASCIMENTO DOS CACTOS
// ==================================================

function controlarNascimentoDosCactos(tempoAtual) {

    // Calcula quanto tempo passou.
    const tempoPassado =
        tempoAtual - ultimoCacto;


    // Se chegou a hora, cria um cacto.
    if (tempoPassado >= intervaloCacto) {

        criarCacto();

        // Guarda o momento atual.
        ultimoCacto = tempoAtual;

        // Escolhe um novo intervalo aleatório.
        intervaloCacto =
            numeroAleatorio(1000, 2500);
    }
}


// ==================================================
// DESENHAR GAME OVER
// ==================================================

function desenharGameOver() {

    // Se o jogo não terminou, não fazemos nada.
    if (!jogoTerminou) {
        return;
    }


    // Texto principal.
    ctx.fillStyle = "#333";

    ctx.font = "bold 50px Arial";

    ctx.textAlign = "center";

    ctx.fillText(
        "GAME OVER",
        canvas.width / 2,
        130
    );


    // Texto para reiniciar.
    ctx.font = "20px Arial";

    ctx.fillText(
        "aperte o espaço para jogar de novo",
        canvas.width / 2,
        175
    );
}


// ==================================================
// DESENHAR O JOGO
// ==================================================

function desenhar() {

    // Limpa a tela.
    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // Desenha o chão.
    desenharChao();

    // Desenha os cactos.
    desenharCactos();

    // Desenha o dinossauro.
    desenharDinossauro();

    // Desenha a pontuação e o recorde.
    desenharPontuacao();

    // Desenha o GAME OVER, se necessário.
    desenharGameOver();
}


// ==================================================
// REINICIAR O JOGO
// ==================================================

function reiniciarJogo() {

    // Coloca o dinossauro na posição inicial.
    dinossauroX = 100;

    dinossauroY =
        chaoY - dinossauroAltura;


    // Zera a velocidade vertical.
    velocidadeY = 0;

    // O dinossauro começa no chão.
    estaNoChao = true;


    // Remove todos os cactos.
    cactos = [];


    // Zera a pontuação.
    //
    // IMPORTANTE:
    // Não zeramos o recorde!
    // Ele continua salvo no localStorage.
    pontuacao = 0;


    // Volta a velocidade dos cactos para o começo.
    velocidadeCacto =
        velocidadeInicialCacto;


    // O jogo volta a funcionar.
    jogoTerminou = false;


    // Reinicia o relógio da pontuação.
    ultimoTempoPontuacao =
        performance.now();


    // Reinicia o relógio dos cactos.
    ultimoCacto =
        performance.now();


    // Escolhe um novo intervalo aleatório.
    intervaloCacto =
        numeroAleatorio(1000, 2500);
}


// ==================================================
// LOOP PRINCIPAL DO JOGO
// ==================================================

function loop(tempoAtual) {

    // Só atualizamos o jogo se ele estiver funcionando.
    if (!jogoTerminou) {

        // Atualiza o dinossauro.
        atualizarDinossauro();

        // Atualiza os cactos.
        atualizarCactos();

        // Cria novos cactos.
        controlarNascimentoDosCactos(tempoAtual);

        // Atualiza a pontuação.
        atualizarPontuacao(tempoAtual);

        // Verifica colisões.
        verificarColisao();
    }


    // Desenha tudo.
    desenhar();


    // Continua o loop.
    requestAnimationFrame(loop);
}


// ==================================================
// INICIAR O JOGO
// ==================================================

requestAnimationFrame(loop);