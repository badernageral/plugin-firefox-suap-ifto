
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
		var alunos_trancados=0;
		var presenca = 0;
		var falta = 0;
		var matriculas = document.querySelectorAll(".hide-sm");
		for (j = 0; j < alunos.length; j++) {
			var encontrou = false;
			var qtd_encontrado = 0;
			for (var i = 0; i < matriculas.length; i++) {
				if (matriculas[i].children[0].innerHTML.trim().toLowerCase()==alunos[j][0].trim().toLowerCase()) {
					var notas = matriculas[i].parentNode.parentNode.querySelectorAll("td.text-center");
					for(var k=0;k<notas.length;k++){
						if (alunos[j][k+1] != undefined){
							if(notas[k].childNodes[0].childNodes[0]==undefined){
								alunos_trancados++;
								break;
							}else{
								if (alunos[j][k+1].trim() == "-") {
									let quantidade_aulas = document.querySelector("#table_faltas").childNodes[0].childNodes[0].childNodes[k+1].childNodes[1].innerHTML.match(/(\d+)/)[0];
									notas[k].childNodes[0].childNodes[0].childNodes[0].value = quantidade_aulas;
									falta++;
								} else {
									notas[k].childNodes[0].childNodes[0].childNodes[0].value = "0";
									presenca++;
								}
								notas[k].childNodes[0].childNodes[0].childNodes[0].dispatchEvent(new Event('blur'));
							}
						}
					}
					alunos_encontrados++;
					qtd_encontrado++;
					encontrou = true;
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
		var resumo = "Você informou " + alunos.length + " alunos.\nForam encontrados " + alunos_encontrados + " alunos." + alunos_nao_encontrados + "\nTrancados: " + alunos_trancados + alunos_duplicados + "\n\nPresenças: " + presenca + "\nFaltas: " + falta;
		return Promise.resolve(resumo);
	}

	browser.runtime.onMessage.addListener(mensagemRecebida);

})();

