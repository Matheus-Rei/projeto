
const botaoCarta = document.getElementById("botao-carta");
const modalCarta = document.getElementById("modal-carta");
const fecharCarta = document.getElementById("fechar");

const botaoGerador = document.getElementById("botao-gerador");
const modalGerador = document.getElementById("modal-gerador");
const fecharGerador = document.getElementById("fechar-gerador");

const botaoEscada = document.getElementById("botao-escada");

const origens = document.querySelectorAll("#origens .fio");
const destinos = document.querySelectorAll("#destinos .fio");
const placa = document.getElementById("placa");
const svg = document.getElementById("fios-svg");
const mensagem = document.getElementById("mensagem-puzzle");

const sucesso = document.getElementById("sucesso-gerador");
const continuar = document.getElementById("continuar-gerador");
const reiniciar = document.getElementById("reiniciar-puzzle");

let fioSelecionado = null;
let conexoes = {};
let geradorAtivado = sessionStorage.getItem("geradorAtivado") === "true";

const cores = {
    vermelho: "#e04444",
    azul: "#448ee0",
    amarelo: "#e5c34c",
    verde: "#55b875"
};

botaoCarta.addEventListener("click", () => {
    modalCarta.classList.add("aberto");
});

fecharCarta.addEventListener("click", () => {
    modalCarta.classList.remove("aberto");
});

modalCarta.addEventListener("click", (evento) => {
    if (evento.target === modalCarta) {
        modalCarta.classList.remove("aberto");
    }
});

botaoGerador.addEventListener("click", () => {
    modalGerador.classList.add("aberto");

    if (geradorAtivado) {
        sucesso.classList.add("aberto");
    }
});

fecharGerador.addEventListener("click", () => {
    modalGerador.classList.remove("aberto");
});

continuar.addEventListener("click", () => {
    modalGerador.classList.remove("aberto");
});

botaoEscada.addEventListener("click", () => {
    window.location.href = "fase03.html";
});

function selecionarFio(fio) {
    if (geradorAtivado) return;

    const cor = fio.dataset.color;

    origens.forEach(item => item.classList.remove("selecionado"));

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

    const total = Object.keys(conexoes).length;

    if (total === 4) {
        ativarGerador();
    } else {
        mensagem.textContent = "Conexão realizada! Continue.";
    }
}

function atualizarPainel() {
    origens.forEach(fio => {
        const conectado = Boolean(conexoes[fio.dataset.color]);

        fio.classList.toggle("conectado", conectado);
        fio.classList.remove("selecionado");
    });

    destinos.forEach(terminal => {
        const conectado = Object.values(conexoes).includes(terminal.dataset.color);
        terminal.classList.toggle("conectado", conectado);
    });

    desenharFios();
}

function desenharFios() {
    svg.innerHTML = "";

    const area = placa.getBoundingClientRect();

    svg.setAttribute("viewBox", `0 0 ${area.width} ${area.height}`);

    Object.entries(conexoes).forEach(([corOrigem, corDestino]) => {
        const origem = [...origens].find(
            fio => fio.dataset.color === corOrigem
        );

        const destino = [...destinos].find(
            fio => fio.dataset.color === corDestino
        );

        const pontoOrigem = origem.querySelector(".terminal").getBoundingClientRect();
        const pontoDestino = destino.querySelector(".terminal").getBoundingClientRect();

        const x1 = pontoOrigem.left + pontoOrigem.width / 2 - area.left;
        const y1 = pontoOrigem.top + pontoOrigem.height / 2 - area.top;

        const x2 = pontoDestino.left + pontoDestino.width / 2 - area.left;
        const y2 = pontoDestino.top + pontoDestino.height / 2 - area.top;

        const curva = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
        );

        const distancia = (x2 - x1) * 0.45;

        curva.setAttribute(
            "d",
            `M ${x1} ${y1} C ${x1 + distancia} ${y1}, ${x2 - distancia} ${y2}, ${x2} ${y2}`
        );

        curva.setAttribute("stroke", cores[corOrigem]);
        curva.setAttribute("stroke-width", "5");
        curva.setAttribute("fill", "none");
        curva.setAttribute("stroke-linecap", "round");

        svg.appendChild(curva);
    });
}

function ativarGerador() {
    geradorAtivado = true;
    sessionStorage.setItem("geradorAtivado", "true");

    mensagem.textContent = "Todas as conexões foram realizadas.";

    setTimeout(() => {
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

origens.forEach(fio => {
    fio.addEventListener("click", () => {
        if (!conexoes[fio.dataset.color]) {
            selecionarFio(fio);
        }
    });
});

destinos.forEach(terminal => {
    terminal.addEventListener("click", () => {
        conectarFio(terminal);
    });
});

reiniciar.addEventListener("click", resetarPuzzle);

window.addEventListener("resize", desenharFios);

document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") {
        modalCarta.classList.remove("aberto");
        modalGerador.classList.remove("aberto");
    }
});
