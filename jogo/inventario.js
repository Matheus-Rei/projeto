let itensInventario = JSON.parse(sessionStorage.getItem("itensInventario")) || [];

function abrirInventario() {
    document.getElementById("painel-inventario").classList.toggle("aberto");
}

function adicionarItem(item) {
    for (let i = 0; i < itensInventario.length; i++) {
        if (itensInventario[i].nome === item.nome) {
            return;
        }
    }

    itensInventario.push(item);

    sessionStorage.setItem(
        "itensInventario",
        JSON.stringify(itensInventario)
    );

    atualizarInventario();
}

function possuiItem(nome) {
    for (let i = 0; i < itensInventario.length; i++) {
        if (itensInventario[i].nome === nome) {
            return true;
        }
    }

    return false;
}

function coletarChave() {
    if (possuiItem("chave")) return;

    adicionarItem({
        nome: "chave",
        icone: "🔑"
    });

    const botaoChave = document.getElementById("botao-chave");

    if (botaoChave) {
        botaoChave.style.display = "none";
    }
}

function atualizarInventario() {
    const lista = document.getElementById("itens-inventario");

    if (!lista) return;

    if (itensInventario.length === 0) {
        lista.innerHTML = '<p id="inventario-vazio">Nenhum item encontrado.</p>';
        return;
    }

    lista.innerHTML = "";

    for (let i = 0; i < itensInventario.length; i++) {
        lista.innerHTML += `
            <div class="item-inventario" title="${itensInventario[i].nome}">
                ${itensInventario[i].icone}
            </div>
        `;
    }
}

const botaoChave = document.getElementById("botao-chave");

if (botaoChave && possuiItem("chave")) {
    botaoChave.style.display = "none";
}

atualizarInventario();
