
// Preenche o #lista a partir de um CSV (";" ou "," como separador),
// reaproveitando o parsing/validação que cada main.js já faz sobre o textarea.
(function () {

	var CABECALHOS_CONHECIDOS = ["matricula", "matrícula", "aluno", "nome", "ra", "registro"];

	function limparCampo(campo) {
		return campo.trim().replace(/^"|"$/g, "");
	}

	function csvParaLista(texto) {
		var linhas = texto.split(/\r\n|\r|\n/).filter(function (linha) {
			return linha.trim() !== "";
		});
		if (linhas.length === 0) {
			return "";
		}

		var delimitador = linhas[0].indexOf(";") !== -1 ? ";" : ",";

		var primeiraColuna = limparCampo(linhas[0].split(delimitador)[0]).toLowerCase();
		if (CABECALHOS_CONHECIDOS.indexOf(primeiraColuna) !== -1) {
			linhas.shift();
		}

		return linhas
			.map(function (linha) {
				return linha.split(delimitador).map(limparCampo).join(" ");
			})
			.join("\n");
	}

	document.addEventListener("change", function (e) {
		if (e.target.id !== "csv") {
			return;
		}
		var arquivo = e.target.files[0];
		if (!arquivo) {
			return;
		}
		var leitor = new FileReader();
		leitor.onload = function () {
			document.getElementById("lista").value = csvParaLista(leitor.result);
		};
		leitor.readAsText(arquivo, "utf-8");
		e.target.value = "";
	});

})();
