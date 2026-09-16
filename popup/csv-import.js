
// Lê um CSV (";" ou "," como separador) e deixa o usuário escolher qual
// coluna é a matrícula e quais colunas lançar (podem ser N notas ou N
// presenças, em qualquer ordem dentro do arquivo). O resultado final é
// escrito no #lista no mesmo formato "matricula valor1 valor2..." que
// cada main.js já sabe interpretar.
(function () {

	var CABECALHOS_MATRICULA_PRIORITARIOS = [
		"matricula", "matrícula", "ra", "registro",
		"identificação de usuário", "número de identificação"
	];
	var CABECALHOS_MATRICULA_FALLBACK = ["aluno", "nome"];

	function indiceColunaMatricula(cabecalhos) {
		var cabecalhosMinusculos = cabecalhos.map(function (nome) {
			return nome.toLowerCase();
		});
		var indice = cabecalhosMinusculos.findIndex(function (nome) {
			return CABECALHOS_MATRICULA_PRIORITARIOS.indexOf(nome) !== -1;
		});
		if (indice !== -1) {
			return indice;
		}
		return cabecalhosMinusculos.findIndex(function (nome) {
			return CABECALHOS_MATRICULA_FALLBACK.indexOf(nome) !== -1;
		});
	}

	function limparCampo(campo) {
		return (campo || "").trim().replace(/^"|"$/g, "");
	}

	function aplicarEscala(valor, multiplicarPor10) {
		var numero = Number(valor.replace(",", "."));
		if (isNaN(numero)) {
			return valor;
		}
		if (multiplicarPor10) {
			numero = numero * 10;
		}
		// O SUAP só aceita notas inteiras (input.int); arredonda mesmo
		// quando não há multiplicação, pra remover ".00" etc do CSV.
		return String(Math.round(numero));
	}

	function csvParaMatriz(texto) {
		var linhas = texto.split(/\r\n|\r|\n/).filter(function (linha) {
			return linha.trim() !== "";
		});
		if (linhas.length === 0) {
			return { cabecalhos: [], linhas: [] };
		}

		var delimitador = linhas[0].indexOf(";") !== -1 ? ";" : ",";
		var cabecalhos = linhas[0].split(delimitador).map(limparCampo);
		var linhasDados = linhas.slice(1).map(function (linha) {
			return linha.split(delimitador).map(limparCampo);
		});

		return { cabecalhos: cabecalhos, linhas: linhasDados };
	}

	function indicesValoresSelecionados() {
		return Array.prototype.slice
			.call(document.querySelectorAll(".csv-col-valor:checked"))
			.map(function (checkbox) {
				return parseInt(checkbox.value, 10);
			});
	}

	function recalcularLista() {
		var select = document.getElementById("csv-col-matricula");
		if (!select || !window.csvLinhasDados) {
			return;
		}
		var idxMatricula = parseInt(select.value, 10);
		var idxValores = indicesValoresSelecionados();
		var checkboxX10 = document.getElementById("csv-x10");
		var multiplicarPor10 = !!(checkboxX10 && checkboxX10.checked);

		var linhasSaida = window.csvLinhasDados.map(function (linha) {
			var matricula = limparCampo(linha[idxMatricula]);
			var valores = idxValores.map(function (idx) {
				return aplicarEscala(limparCampo(linha[idx]), multiplicarPor10);
			});
			return [matricula].concat(valores).join(" ");
		});

		document.getElementById("lista").value = linhasSaida.join("\n");
	}

	// Se nenhuma nota das colunas selecionadas passar de 10, sugere marcar o
	// ×10 (comum em exports com notas na escala 0-10, como o Moodle).
	function sugerirX10() {
		var checkboxX10 = document.getElementById("csv-x10");
		if (!checkboxX10 || !window.csvLinhasDados) {
			return;
		}
		var idxValores = indicesValoresSelecionados();
		var maiorValor = -Infinity;
		var encontrouNumero = false;

		window.csvLinhasDados.forEach(function (linha) {
			idxValores.forEach(function (idx) {
				var numero = Number(limparCampo(linha[idx]).replace(",", "."));
				if (!isNaN(numero)) {
					encontrouNumero = true;
					if (numero > maiorValor) {
						maiorValor = numero;
					}
				}
			});
		});

		checkboxX10.checked = encontrouNumero && maiorValor <= 10;
	}

	function atualizarDisponibilidadeColunas() {
		var select = document.getElementById("csv-col-matricula");
		var idxMatricula = select.value;
		document.querySelectorAll(".csv-col-valor").forEach(function (checkbox) {
			if (checkbox.value === idxMatricula) {
				checkbox.checked = false;
				checkbox.disabled = true;
			} else {
				checkbox.disabled = false;
			}
		});
		sugerirX10();
		recalcularLista();
	}

	function renderMapeamento(cabecalhos) {
		var container = document.getElementById("csv-mapeamento");
		container.textContent = "";

		if (!cabecalhos || cabecalhos.length === 0) {
			return;
		}

		var linhaMatricula = document.createElement("div");
		var labelMatricula = document.createElement("label");
		labelMatricula.textContent = "Coluna da matrícula: ";
		var selectMatricula = document.createElement("select");
		selectMatricula.id = "csv-col-matricula";
		cabecalhos.forEach(function (nome, indice) {
			var opcao = document.createElement("option");
			opcao.value = String(indice);
			opcao.textContent = nome || ("Coluna " + (indice + 1));
			selectMatricula.appendChild(opcao);
		});
		var indicePreSelecionado = indiceColunaMatricula(cabecalhos);
		selectMatricula.value = String(indicePreSelecionado !== -1 ? indicePreSelecionado : 0);
		labelMatricula.appendChild(selectMatricula);
		linhaMatricula.appendChild(labelMatricula);
		container.appendChild(linhaMatricula);

		var linhaValores = document.createElement("div");
		var tituloValores = document.createElement("p");
		tituloValores.textContent = "Colunas a lançar (na ordem das etapas/avaliações):";
		linhaValores.appendChild(tituloValores);

		var labelX10 = document.createElement("label");
		labelX10.className = "csv-x10-sugestao";
		labelX10.title = "Multiplica todas as colunas marcadas abaixo por 10 (ex.: notas de 0 a 10 para a escala de 0 a 100 do SUAP)";
		var checkboxX10 = document.createElement("input");
		checkboxX10.type = "checkbox";
		checkboxX10.id = "csv-x10";
		labelX10.appendChild(checkboxX10);
		labelX10.appendChild(document.createTextNode(" Multiplicar por 10 (notas na escala 0-10)"));
		linhaValores.appendChild(labelX10);

		cabecalhos.forEach(function (nome, indice) {
			var labelValor = document.createElement("label");
			var checkboxValor = document.createElement("input");
			checkboxValor.type = "checkbox";
			checkboxValor.className = "csv-col-valor";
			checkboxValor.value = String(indice);
			labelValor.appendChild(checkboxValor);
			labelValor.appendChild(document.createTextNode(" " + (nome || ("Coluna " + (indice + 1)))));
			linhaValores.appendChild(labelValor);
		});
		container.appendChild(linhaValores);

		selectMatricula.addEventListener("change", atualizarDisponibilidadeColunas);
		checkboxX10.addEventListener("change", recalcularLista);
		container.querySelectorAll(".csv-col-valor").forEach(function (checkbox) {
			checkbox.addEventListener("change", function () {
				sugerirX10();
				recalcularLista();
			});
		});

		atualizarDisponibilidadeColunas();
	}

	document.addEventListener("change", function (e) {
		if (e.target.id === "csv") {
			var arquivo = e.target.files[0];
			if (!arquivo) {
				return;
			}
			var leitor = new FileReader();
			leitor.onload = function () {
				var matriz = csvParaMatriz(leitor.result);
				window.csvLinhasDados = matriz.linhas;
				renderMapeamento(matriz.cabecalhos);
			};
			leitor.readAsText(arquivo, "utf-8");
			e.target.value = "";
			return;
		}

		if (e.target.name === "modo") {
			atualizarModoVisivel();
		}
	});

	function atualizarModoVisivel() {
		var modoTexto = document.querySelector('input[name="modo"][value="texto"]');
		var exibirTexto = !!(modoTexto && modoTexto.checked);
		document.getElementById("csv").style.display = exibirTexto ? "none" : "";
		document.getElementById("csv-mapeamento").style.display = exibirTexto ? "none" : "";
		document.getElementById("lista").style.display = exibirTexto ? "" : "none";
	}

	document.addEventListener("DOMContentLoaded", atualizarModoVisivel);

})();
