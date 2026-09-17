
(function () {

	if (window.hasRun) {
		return;
	}
	window.hasRun = true;

	function mensagemRecebida(request, sender, sendResponse) {
		alunos = request.mensagem;
		var alunos_nao_encontrados = "";
		var alunos_duplicados = "";
		var alunos_encontrados = 0;
		var notas_sem_valor = 0;
		var tabelas = document.querySelectorAll("#table_notas");
		for (j = 0; j < alunos.length; j++) {
			var encontrou = false;
			var qtd_encontrado = 0;
			for (var q = 0; q < tabelas.length; q++) {
				matriculas = tabelas[q].querySelectorAll("dd a");
				for (var i = 0; i < matriculas.length; i++) {
					if (matriculas[i].innerHTML.trim().toLowerCase()==alunos[j][0].trim().toLowerCase()) {
						var notas = matriculas[i].closest("tr").querySelectorAll("input.int:not(.disabled-input)");
						for(var k=0;k<notas.length;k++){
							if (alunos[j][k+1] != undefined){
								// Sem nota ("-" ou vazio): não há o que lançar,
								// deixa o campo como está em vez de escrever um
								// valor que o SUAP recusaria.
								if (alunos[j][k+1].trim() == "-" || alunos[j][k+1].trim() == ""){
									notas_sem_valor++;
									continue;
								}
								notas[k].value = alunos[j][k+1];
								notas[k].dispatchEvent(new Event('blur'));
							}
						}
						alunos_encontrados++;
						qtd_encontrado++;
						encontrou = true;
					}
				}
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
		var sem_valor = "";
		if (notas_sem_valor > 0) {
			sem_valor = "\n\nSem nota no CSV (campo mantido como estava): " + notas_sem_valor;
		}
		var resumo = "Você informou " + alunos.length + " alunos.\nForam encontrados " + alunos_encontrados + " alunos." + alunos_nao_encontrados + alunos_duplicados + sem_valor;
		return Promise.resolve(resumo);
	}

	browser.runtime.onMessage.addListener(mensagemRecebida);

})();

