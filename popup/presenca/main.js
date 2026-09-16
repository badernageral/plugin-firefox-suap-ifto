
document.addEventListener("click", function (e) {
	
	if(e.target.id=="botao"){
		var params = new URLSearchParams(window.location.search);
		var tabId = parseInt(params.get("tabId"), 10);
		if (!tabId) {
			alert("Não foi possível identificar a aba do SUAP. Abra a extensão de novo.");
			return;
		}
		var lista = [];
		document.getElementById("lista").value.trim().split("\n").forEach(function (item, indice, array) {
			lista.push(item.trim().split(/\s+/));
		});
		let executando = browser.tabs.executeScript(tabId, {
			file: "magic.js"
		});
		executando.then((resultado)=>{
			browser.tabs.sendMessage(tabId, {
				mensagem: lista
			});
		});
	}

});