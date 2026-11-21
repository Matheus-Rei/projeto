
const areaRatos = document.getElementById("area-ratos");
const avisoRatos = document.getElementById("aviso-ratos");

let ratosRestantes = 0;
let ratosIniciados = false;

function iniciarRatos() {
    if (ratosIniciados) return;

    ratosIniciados = true;
    ratosRestantes = 5;

    areaRatos.querySelectorAll(".rato").forEach(rato => rato.remove());

    avisoRatos.textContent = "CLIQUE NOS RATOS PARA ELIMINÁ-LOS!";
    avisoRatos.classList.add("visivel");

    const largura = areaRatos.clientWidth;
    const altura = areaRatos.clientHeight;

    for (let i = 0; i < 5; i++) {
        const rato = document.createElement("div");
        rato.className = "rato";

        const corpo = document.createElement("div");
        corpo.className = "rato-corpo";

        corpo.innerHTML = `
            <span class="corpo"></span>
            <span class="orelha"></span>
            <span class="olho"></span>
            <span class="focinho"></span>
            <span class="cauda"></span>
            <span class="patas"></span>
        `;

        const explosao = document.createElement("span");
        explosao.className = "explosao";

        rato.appendChild(corpo);
        rato.appendChild(explosao);

        rato.style.left = (largura * 0.48 + Math.random() * 25) + "px";
        rato.style.top = (altura * 0.75 + Math.random() * 10) + "px";

        areaRatos.appendChild(rato);

        let ativo = true;
        let movimento;

        function moverRato() {
            if (!ativo) return;

            const limiteX = Math.max(0, largura - 65);
            const limiteY = Math.max(0, altura - 50);

            rato.style.left = Math.random() * limiteX + "px";
            rato.style.top = (altura * 0.48 + Math.random() * Math.max(0, limiteY - altura * 0.48)) + "px";

            movimento = setTimeout(moverRato, 1000 + Math.random() * 1200);
        }

        movimento = setTimeout(moverRato, 500 + i * 250);

        rato.addEventListener("click", function () {
            if (!ativo) return;

            ativo = false;
            clearTimeout(movimento);

            rato.classList.add("explodindo");
            ratosRestantes--;

            setTimeout(() => {
                rato.remove();

                if (ratosRestantes === 0) {
                    finalizarRatos();
                }
            }, 300);
        });
    }
}

function finalizarRatos() {
    avisoRatos.textContent = "TODOS OS RATOS FORAM ELIMINADOS!";
    
    setTimeout(() => {
        avisoRatos.classList.remove("visivel");
        ratosIniciados = false;
    }, 1800);
}
