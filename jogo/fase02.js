const modalCarta = document.getElementById("modal-carta");
const modalGerador = document.getElementById("modal-gerador");

const origens = document.querySelectorAll("#origens .fio");
const destinos = document.querySelectorAll("#destinos .fio");

const placa = document.getElementById("placa");
const svg = document.getElementById("fios-svg");
const mensagem = document.getElementById("mensagem-puzzle");

const sucesso = document.getElementById("sucesso-gerador");

let fioSelecionado = null;
let conexoes = {};

let geradorAtivado = sessionStorage.getItem("geradorAtivado") === "true";

const cores = {
    vermelho: "#e04444",
    azul: "#448ee0",
    amarelo: "#e5c34c",
    verde: "#55b875"
};

function abrirCarta() {
    modalCarta.classList.add("aberto");
}

function fecharCarta() {
    modalCarta.classList.remove("aberto");
}

function fecharCartaFundo(evento) {
    if (evento.target === modalCarta) {
        fecharCarta();
    }
}

function abrirGerador() {
    modalGerador.classList.add("aberto");

    if (geradorAtivado) {
        sucesso.classList.add("aberto");
    }

    setTimeout(function() {
        desenharFios();
    }, 50);
}

function fecharGerador() {
    modalGerador.classList.remove("aberto");
}

function fecharGeradorFundo(evento) {
    if (evento.target === modalGerador) {
        fecharGerador();
    }
}

function continuarGerador() {
    fecharGerador();
}

function subirEscada() {
    window.location.href = "fase03.html";
}

function selecionarFio(fio) {
    if (geradorAtivado) return;

    const cor = fio.dataset.color;

    for (let i = 0; i < origens.length; i++) {
        origens[i].classList.remove("selecionado");
    }

    fioSelecionado = cor;
    fio.classList.add("selecionado");

    mensagem.textContent = "Agora selecione o terminal correspondente.";
}

function conectarFio(terminal) {
    if (!fioSelecionado || geradorAtivado) return;

    const corDestino = terminal.dataset.color;

    if (fioSelecionado !== corDestino) {
        mensagem.textContent = "Conexão incorreta. Tente outro terminal.";
        return;
    }

    conexoes[fioSelecionado] = corDestino;
    fioSelecionado = null;

    atualizarPainel();

    let total = 0;

    for (let cor in conexoes) {
        total++;
    }

    if (total === 4) {
        ativarGerador();
    } else {
        mensagem.textContent = "Conexão realizada! Continue.";
    }
}

function atualizarPainel() {
    for (let i = 0; i < origens.length; i++) {
        const cor = origens[i].dataset.color;
        const conectado = conexoes[cor] !== undefined;

        origens[i].classList.toggle("conectado", conectado);
        origens[i].classList.remove("selecionado");
    }

    for (let i = 0; i < destinos.length; i++) {
        const cor = destinos[i].dataset.color;
        let conectado = false;

        for (let origem in conexoes) {
            if (conexoes[origem] === cor) {
                conectado = true;
            }
        }

        destinos[i].classList.toggle("conectado", conectado);
    }

    desenharFios();
}

function desenharFios() {
    svg.innerHTML = "";

    const area = placa.getBoundingClientRect();

    if (area.width === 0 || area.height === 0) return;

    svg.setAttribute("viewBox", `0 0 ${area.width} ${area.height}`);

    for (let corOrigem in conexoes) {
        const corDestino = conexoes[corOrigem];

        let origem = null;
        let destino = null;

        for (let i = 0; i < origens.length; i++) {
            if (origens[i].dataset.color === corOrigem) {
                origem = origens[i];
            }
        }

        for (let i = 0; i < destinos.length; i++) {
            if (destinos[i].dataset.color === corDestino) {
                destino = destinos[i];
            }
        }

        if (origem === null || destino === null) continue;

        const pontoOrigem = origem.querySelector(".terminal").getBoundingClientRect();
        const pontoDestino = destino.querySelector(".terminal").getBoundingClientRect();

        const x1 = pontoOrigem.left + pontoOrigem.width / 2 - area.left;
        const y1 = pontoOrigem.top + pontoOrigem.height / 2 - area.top;

        const x2 = pontoDestino.left + pontoDestino.width / 2 - area.left;
        const y2 = pontoDestino.top + pontoDestino.height / 2 - area.top;

        const distancia = (x2 - x1) * 0.45;

        svg.innerHTML += `
            <path
                d="M ${x1} ${y1} C ${x1 + distancia} ${y1}, ${x2 - distancia} ${y2}, ${x2} ${y2}"
                stroke="${cores[corOrigem]}"
                stroke-width="5"
                fill="none"
                stroke-linecap="round"
            ></path>
        `;
    }
}

function ativarGerador() {
    geradorAtivado = true;

    sessionStorage.setItem("geradorAtivado", "true");

    mensagem.textContent = "Todas as conexões foram realizadas.";

    setTimeout(function() {
        sucesso.classList.add("aberto");
    }, 500);
}

function resetarPuzzle() {
    if (geradorAtivado) return;

    conexoes = {};
    fioSelecionado = null;

    atualizarPainel();

    mensagem.textContent = "Selecione uma ponta de fio.";
}

window.onresize = desenharFios;

document.onkeydown = function(evento) {
    if (evento.key === "Escape") {
        fecharCarta();
        fecharGerador();
    }
};
