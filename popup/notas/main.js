
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
		for (j = 0; j < lista.length; j++) {
			for (i = 1; i < lista[j].length; i++){
				if (lista[j][i] != undefined) {
					if (lista[j][i] == "-") {
						lista[j][i] = "0";
					} else {
						lista[j][i] = lista[j][i].replace(",", ".");
					}
					if (lista[j][i] > 100) {
						exibirResultado("Você não pode informar notas maiores que 100!");
						return;
					}
				}
			}
			
		}
		exibirResultado("Lançando notas...");
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
			exibirResultado("Erro ao lançar notas: " + erro.message);
		});
	}

});