
const areaRatos = document.getElementById("area-ratos");
const avisoRatos = document.getElementById("aviso-ratos");

let ratosRestantes = 0;
let ratosIniciados = false;

function iniciarRatos() {
    if (ratosIniciados) {
        return;
    }

    if (sessionStorage.getItem("ratosEliminados") === "true") {
        ratosIniciados = true;
        avisoRatos.classList.remove("visivel");
        return;
    }

    ratosIniciados = true;
    ratosRestantes = 5;

    const ratosAntigos = areaRatos.querySelectorAll(".rato");

    for (let i = 0; i < ratosAntigos.length; i++) {
        ratosAntigos[i].remove();
    }

    avisoRatos.textContent = "CLIQUE NOS RATOS PARA ELIMINÁ-LOS!";
    avisoRatos.classList.add("visivel");

    const largura = areaRatos.clientWidth;
    const altura = areaRatos.clientHeight;

    let html = "";

    for (let i = 0; i < 5; i++) {
        const x = largura * 0.48 + Math.random() * 25;
        const y = altura * 0.75 + Math.random() * 10;

        html += `
            <div class="rato" onclick="clicarRato(this)" style="left: ${x}px; top: ${y}px;">
                <div class="rato-corpo">
                    <span class="corpo"></span>
                    <span class="orelha"></span>
                    <span class="olho"></span>
                    <span class="focinho"></span>
                    <span class="cauda"></span>
                    <span class="patas"></span>
                </div>
                <span class="explosao"></span>
            </div>
        `;
    }

    areaRatos.innerHTML += html;

    const ratos = areaRatos.querySelectorAll(".rato");

    for (let i = 0; i < ratos.length; i++) {
        ratos[i].dataset.ativo = "true";

        ratos[i].movimento = setTimeout(function() {
            moverRato(ratos[i]);
        }, 500 + i * 250);
    }
}

function moverRato(rato) {
    if (rato.dataset.ativo !== "true") {
        return;
    }

    const largura = areaRatos.clientWidth;
    const altura = areaRatos.clientHeight;

    const limiteX = Math.max(0, largura - 65);
    const limiteY = Math.max(0, altura - 50);

    rato.style.left = Math.random() * limiteX + "px";

    rato.style.top = (
        altura * 0.48 +
        Math.random() * Math.max(0, limiteY - altura * 0.48)
    ) + "px";

    rato.movimento = setTimeout(function() {
        moverRato(rato);
    }, 1000 + Math.random() * 1200);
}

function clicarRato(rato) {
    if (rato.dataset.ativo !== "true") {
        return;
    }

    rato.dataset.ativo = "false";

    clearTimeout(rato.movimento);

    rato.classList.add("explodindo");

    ratosRestantes--;

    setTimeout(function() {
        rato.remove();

        if (ratosRestantes === 0) {
            finalizarRatos();
        }
    }, 300);
}

function finalizarRatos() {
    sessionStorage.setItem("ratosEliminados", "true");

    avisoRatos.textContent = "TODOS OS RATOS FORAM ELIMINADOS!";

    if (typeof atualizarContinuar === "function") {
        atualizarContinuar();
    }

    setTimeout(function() {
        avisoRatos.classList.remove("visivel");
        ratosIniciados = true;
    }, 1800);
}
