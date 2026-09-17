
(function () {

	if (window.hasRun) {
		return;
	}
	window.hasRun = true;

	function textoNormalizado(elemento) {
		return ((elemento && elemento.textContent) || "").replace(/\s+/g, " ").trim();
	}

	// O cabeçalho da coluna é algo como "16/09/2026 Qua, 4 aulas". Precisa
	// casar especificamente o número seguido de "aula(s)": um /(\d+)/ solto
	// pegaria o dia do mês (16) em vez da quantidade de aulas (4).
	function quantidadeDeAulas(texto) {
		var encontrado = texto.match(/(\d+)\s*aulas?\b/i);
		return encontrado ? encontrado[1] : null;
	}

	// Cada dia letivo é a coluna que declara a quantidade de aulas. Montar a
	// lista por esse critério dispensa supor quantas colunas fixas existem
	// antes (matrícula, nome...) ou depois (totais) das aulas.
	function aulasPorColuna() {
		var tabela = document.querySelector("#table_faltas");
		if (!tabela) {
			return [];
		}
		var cabecalhos = tabela.querySelectorAll("thead th");
		if (cabecalhos.length === 0) {
			cabecalhos = tabela.querySelectorAll("th");
		}
		return Array.prototype.map.call(cabecalhos, function (th) {
			return quantidadeDeAulas(textoNormalizado(th));
		}).filter(function (aulas) {
			return aulas !== null;
		});
	}

	function matriculaDoElemento(elemento) {
		var alvo = elemento.children && elemento.children.length > 0 ? elemento.children[0] : elemento;
		return textoNormalizado(alvo).toLowerCase();
	}

	function mensagemRecebida(request, sender, sendResponse) {
		var alunos = request.mensagem;

		var alunos_nao_encontrados = "";
		var alunos_duplicados = "";
		var alunos_encontrados = 0;
		var alunos_trancados = 0;
		var presenca = 0;
		var falta = 0;
		var colunas_sem_aulas = 0;
		var aulas = aulasPorColuna();
		var matriculas = document.querySelectorAll(".hide-sm");

		for (var j = 0; j < alunos.length; j++) {
			var encontrou = false;
			var qtd_encontrado = 0;
			for (var i = 0; i < matriculas.length; i++) {
				if (matriculaDoElemento(matriculas[i]) != alunos[j][0].trim().toLowerCase()) {
					continue;
				}
				var linha = matriculas[i].closest("tr");
				var celulas = linha ? linha.querySelectorAll("td.text-center") : [];
				for (var k = 0; k < celulas.length; k++) {
					var valor = alunos[j][k + 1];
					if (valor == undefined) {
						continue;
					}
					var campo = celulas[k].querySelector("input");
					if (!campo || campo.disabled) {
						alunos_trancados++;
						break;
					}
					if (valor.trim() == "-" || valor.trim() == "") {
						// Sem nota naquele dia: falta em todas as aulas da data.
						if (aulas[k] == undefined) {
							colunas_sem_aulas++;
							continue;
						}
						campo.value = aulas[k];
						falta++;
					} else {
						// Com nota: esteve presente, zero faltas.
						campo.value = "0";
						presenca++;
					}
					campo.dispatchEvent(new Event('blur'));
				}
				alunos_encontrados++;
				qtd_encontrado++;
				encontrou = true;
			}
			if (qtd_encontrado > 1) {
				alunos_duplicados = alunos_duplicados + "\n- " + alunos[j][0];
			}
			if (!encontrou) {
				alunos_nao_encontrados = alunos_nao_encontrados + "\n- " + alunos[j][0];
			}
		}
		if (alunos_nao_encontrados != "") {
			alunos_nao_encontrados = "\n\nAlunos não encontrados:" + alunos_nao_encontrados;
		}
		if (alunos_duplicados != "") {
			alunos_duplicados = "\n\nAlunos duplicados:" + alunos_duplicados;
		}
		var aviso_colunas = "";
		if (colunas_sem_aulas > 0) {
			aviso_colunas = "\n\nAtenção: não foi possível ler a quantidade de aulas de "
				+ colunas_sem_aulas + " lançamento(s); essas faltas não foram preenchidas."
				+ "\nConfira se você selecionou no CSV a mesma quantidade de colunas que há de dias letivos.";
		}
		var resumo = "Você informou " + alunos.length + " alunos.\nForam encontrados " + alunos_encontrados + " alunos." + alunos_nao_encontrados + "\nTrancados: " + alunos_trancados + alunos_duplicados + "\n\nPresenças: " + presenca + "\nFaltas: " + falta + aviso_colunas;
		return Promise.resolve(resumo);
	}

	browser.runtime.onMessage.addListener(mensagemRecebida);

})();

