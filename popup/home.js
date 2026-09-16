
// O painel de page_action fecha sozinho ao perder o foco (por exemplo,
// quando o seletor de arquivo do sistema abre), o que destruía qualquer
// estado da página (arquivo escolhido, mapeamento de colunas, etc).
// Por isso Presença/Notas abrem numa janela separada, que não fecha
// sozinha, em vez de navegar dentro deste painel.
(function () {

	function abrirFerramenta(pagina) {
		browser.tabs.query({ active: true, currentWindow: true }).then(function (abas) {
			var tabId = abas[0].id;
			var url = browser.runtime.getURL("popup/" + pagina + "?tabId=" + tabId);
			browser.windows.create({
				url: url,
				type: "popup",
				width: 420,
				height: 520
			});
			window.close();
		});
	}

	document.getElementById("btn-presenca").addEventListener("click", function () {
		abrirFerramenta("presenca/main.html");
	});

	document.getElementById("btn-notas").addEventListener("click", function () {
		abrirFerramenta("notas/main.html");
	});

})();
