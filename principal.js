var paginaAtual = 1;
var qtPaginas = 1;
var porPagina = 8;
var qtDias = 1;
var cards;
var local;
readJSON("https://api.sheety.co/30b6e400-9023-4a15-8e6c-16aa4e3b1e72");

function readJSON(path) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', path, true);
	xhr.responseType = 'blob';
	xhr.onload = function (e) {
		if (this.status == 200) {
			var file = new File([this.response], 'temp');
			var fileReader = new FileReader();
			fileReader.addEventListener('load', function () {
				local = JSON.parse(fileReader.result);
				loadCards(1);
			});
			fileReader.readAsText(file);
		}
	}
	xhr.send();
}

function loadCards(num) {
	if (window.innerWidth < 1256) {
		porPagina = 6;
	} else {
		porPagina = 8;
	}
	if (num > 0) paginaAtual = Math.ceil(num / porPagina);
	qtPaginas = Math.ceil(local.length / porPagina);
	document.getElementById("bt_voltar").style.color = (paginaAtual === 1) ? "#DDD" : "#000"
	document.getElementById("bt_prox").style.color = (paginaAtual === qtPaginas) ? "#DDD" : "#000"
	document.getElementById("lbl_paginas").innerHTML = `${paginaAtual}/${qtPaginas}`;
	for (let u = 0; u < 8; u++) {
		let card = document.getElementsByClassName("card")[u];
		let i = (paginaAtual - 1) * porPagina + u
		if (u >= porPagina || i >= local.length) {
			card.style.display = "none";
			continue;
		}
		card.style.display = "block"
		card.childNodes[0].setAttribute("src", local[i].photo);
		card.childNodes[1].innerHTML = local[i].name;
		card.childNodes[2].innerHTML = local[i].property_type;
		card.childNodes[3].innerHTML = "R$" + local[i].price;
		if (qtDias > 1) card.childNodes[3].innerHTML = "R$" + local[i].price * qtDias + " para " + qtDias + " dias";
	}
}

function proximaPagina() {
	if (paginaAtual === qtPaginas) return;
	loadCards(paginaAtual * porPagina + 1);
}

function voltarPagina() {
	if (paginaAtual === 1) return;
	loadCards((paginaAtual - 1) * porPagina);
}

function checkDates() {
	let checkout = Date.parse(document.getElementById("checkout").value);
	let checkin = Date.parse(document.getElementById("checkin").value);
	let dif = (checkout - checkin) / 3600 / 24 / 1000;
	if (dif <= 0) {
		alert("A data de saida deve ser posterior a data de entrada.");
		document.getElementById("checkout").value = "";
		document.getElementById("checkin").value = "";
		dif = 1;
	}
	qtDias = dif;
	loadCards(0);
}