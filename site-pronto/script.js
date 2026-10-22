// Front-end em JavaScript puro da versão "site-pronto" (abre com Go Live ou
// com dois cliques). Faz os botões funcionarem e envia as mensagens de
// interesse para o back-end (banco de dados do Lovable Cloud).
(function () {
  // Endereço público do banco de dados e chave pública (pode ficar no navegador).
  var BANCO_URL = "https://lyqwzyromrhkbtpeutkp.supabase.co";
  var BANCO_CHAVE = "sb_publishable_jCznnP3RtiiO4pHqi08-kw_pP8NEQ_h";

  var TAXA = 0.0189; // 1,89% ao mês
  var brl = function (v) {
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
  };

  // ---------- Galeria de fotos ----------
  var foto = document.querySelector("[data-foto]");
  var miniaturas = Array.prototype.slice.call(document.querySelectorAll("[data-miniatura]"));
  var numero = document.querySelector("[data-foto-numero]");
  var atual = 0;
  function mostrarFoto(i) {
    if (!foto || !miniaturas.length) return;
    atual = (i + miniaturas.length) % miniaturas.length;
    foto.src = miniaturas[atual].querySelector("img").src;
    miniaturas.forEach(function (m, j) {
      m.classList.toggle("border-primary", j === atual);
      m.classList.toggle("border-transparent", j !== atual);
      m.classList.toggle("opacity-60", j !== atual);
    });
    if (numero) numero.textContent = atual + 1 + " / " + miniaturas.length;
  }
  miniaturas.forEach(function (m, i) { m.addEventListener("click", function () { mostrarFoto(i); }); });
  var anterior = document.querySelector("[data-foto-anterior]");
  var proxima = document.querySelector("[data-foto-proxima]");
  if (anterior) anterior.addEventListener("click", function () { mostrarFoto(atual - 1); });
  if (proxima) proxima.addEventListener("click", function () { mostrarFoto(atual + 1); });

  // ---------- Simulação de financiamento ----------
  var entrada = document.querySelector("[data-entrada]");
  var botoesMeses = Array.prototype.slice.call(document.querySelectorAll("[data-meses]"));
  var parcela = document.querySelector("[data-parcela]");
  var mesesTexto = document.querySelector("[data-meses-texto]");
  var meses = 48;
  function simular() {
    if (!entrada || !parcela) return;
    var preco = Number(entrada.getAttribute("data-preco"));
    var financiado = Math.max(preco - Number(entrada.value || 0), 0);
    var valor = financiado > 0 ? (financiado * TAXA) / (1 - Math.pow(1 + TAXA, -meses)) : 0;
    parcela.textContent = brl(valor);
    if (mesesTexto) mesesTexto.textContent = meses;
    botoesMeses.forEach(function (b) {
      var ativo = Number(b.getAttribute("data-meses")) === meses;
      b.classList.toggle("bg-primary", ativo);
      b.classList.toggle("text-primary-foreground", ativo);
    });
  }
  if (entrada) entrada.addEventListener("input", simular);
  botoesMeses.forEach(function (b) {
    b.addEventListener("click", function () { meses = Number(b.getAttribute("data-meses")); simular(); });
  });

  // ---------- Ver telefone ----------
  var telefone = document.querySelector("[data-telefone]");
  if (telefone) telefone.addEventListener("click", function () {
    telefone.lastChild.textContent = " (11) 9XXXX-XX12 (exemplo)";
  });

  // ---------- Mensagem de interesse -> back-end ----------
  var form = document.querySelector("[data-interesse]");
  if (form) form.addEventListener("submit", function (e) {
    e.preventDefault();
    var dados = new FormData(form);
    var botao = form.querySelector("button[type=submit]");
    botao.disabled = true;
    botao.textContent = "Enviando...";
    fetch(BANCO_URL + "/rest/v1/interesses", {
      method: "POST",
      headers: { apikey: BANCO_CHAVE, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({
        anuncio_id: form.getAttribute("data-anuncio"),
        nome: String(dados.get("nome")).trim(),
        email: String(dados.get("email")).trim(),
        mensagem: String(dados.get("mensagem")).trim(),
        origem: "site-pronto",
      }),
    })
      .then(function (r) {
        if (!r.ok) throw new Error(String(r.status));
        form.outerHTML = '<p class="mt-4 rounded-lg bg-muted p-4 text-sm font-medium">Mensagem enviada! Ela ficou registrada no sistema.</p>';
      })
      .catch(function () {
        botao.disabled = false;
        botao.textContent = "Enviar mensagem";
        alert("Não foi possível enviar agora. Verifique a internet e tente de novo.");
      });
  });
})();
