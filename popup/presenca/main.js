
function exibirResultado(texto) {
	var el = document.getElementById("resultado");
	if (el) {
		el.textContent = texto;
	}
}

document.addEventListener("click", function (e) {
	
	if(e.target.id=="botao"){
		var params = new URLSearchParams(window.location.search);
		var tabId = parseInt(params.get("tabId"), 10);
		if (!tabId) {
			exibirResultado("Não foi possível identificar a aba do SUAP. Abra a extensão de novo.");
			return;
		}
		var lista = [];
		document.getElementById("lista").value.trim().split("\n").forEach(function (item, indice, array) {
			lista.push(item.trim().split(/\s+/));
		});
		exibirResultado("Lançando presença...");
		let executando = browser.tabs.executeScript(tabId, {
			file: "magic.js"
		});
		executando.then(()=>{
			return browser.tabs.sendMessage(tabId, {
				mensagem: lista
			});
		}).then((resumo)=>{
			exibirResultado("");
			alert(resumo);
		}).catch((erro)=>{
			exibirResultado("Erro ao lançar presença: " + erro.message);
		});
	}

});