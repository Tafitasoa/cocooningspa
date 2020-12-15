// [spa.duration,spa.exceptional_price,spa.ordinary_price,spa.exceptional_acompte,spa.ordinary_acompte]
// [price.duration,price.exceptional_price,price.exceptional_acompte,price.ordinary_price,price.ordinary_acompte]
scriptPrincipal()
function scriptPrincipal(){
	/*==========================================================================*/
	/*~~~~~~~~~~~~~~~~~~~~~~~~~SPA~~~~~~~~~~~~~~~~~~~~~~~~~*/
	let removeSpa = document.getElementById("remove-spa")
	let addSpa = document.getElementById("add-spa")
	removeSpa.addEventListener('click',removeSpaList)
	addSpa.addEventListener('click',addSpaList)
	/*==========================================================================*/
	/*~~~~~~~~~~~~~~~~~~~~~~~Massage~~~~~~~~~~~~~~~~~~~~~~~*/
	let buttonRmvs = document.querySelectorAll('.remove-massage');
	buttonRmvs.forEach(buttonRmv => {
		buttonRmv.addEventListener('click',removeCategoryMassage);
	});

	let buttonAdds = document.querySelectorAll('.add-massage');
	buttonAdds.forEach(buttonAdd => {
		buttonAdd.addEventListener('click',addCategoryMassage);
	});
	/*==========================================================================*/
	/*~~~~~~~~~~~~~~~~~~~~~~~Cadeau~~~~~~~~~~~~~~~~~~~~~~~*/
	let rmvCadeau = document.querySelectorAll(".cadeau-rmv")
	rmvCadeau.forEach(rmv => {
		rmv.addEventListener('click',removeCadeau);
	});

	let addCadeau = document.querySelectorAll(".cadeau-add")
	addCadeau.forEach(add => {
		add.addEventListener('click',aDDCadeau);
	});
	/*==========================================================================*/
	/*~~~~~~~~~~~~Date Heurs Pays Departement Praticient ~~~~~~~~~~~~~~~~~*/
	document.getElementById("country-choice").addEventListener("change", showDepartementIfFrance);
	// praticien
	let addPraticient = document.querySelectorAll(".praticien-list")
	addPraticient.forEach(add => {
		add.addEventListener('change',addPraticientAtSession);
	});

	document.getElementById("heure-spa").addEventListener("change",addHoursInPrestation)

	document.getElementById("heure-massage").addEventListener("change",addHoursInPrestation)

	/*==========================================================================*/
	/*~~~~~~~~~~~~Verifier si il y a un truc dans la session ~~~~~~~~~~~~~*/
	verifySession()
}
// 
//
/*==========================================================================*/
// verifier si la session est vide ou pas
function verifySession(){
	// ajouter le pays dans la session
	let isHasSpaMassage = false
	let spa = sessionStorage.getItem("spa")
	let massages = sessionStorage.getItem("massages")
	let cadeau = sessionStorage.getItem("cadeau")
	// prestations.pays = "" // prestations.departement = "" // prestations.date = "" // prestations.heurs = "" // prestations.praticient = ""	
	let prestations = sessionStorage.getItem("prestations")
	let jsonPresta = JSON.parse(prestations);
	if ( (spa == null || spa == "") && (massages == null || massages == "") ){
		initSession()
		return
	}else{
		if (spa != null && spa != "") {
			spa = JSON.parse(spa)
			for (var i = spa.length - 1; i >= 0; i--) {
				if (spa[i].id == null || spa[i].time == "") {
					spa.splice(i,1) // null daholo ny spa ato
				}else{
					isHasSpaMassage = true //nisy spa tsy null le aza
				}
			}
			sessionStorage.setItem("spa",JSON.stringify(spa))
		}
		if ( massages != null && massages != "") {
			massages = JSON.parse(massages)
			for (var i = massages.length - 1; i >= 0; i--) {
				if (massages[i].id == null || massages[i].cat == "" || typeof(massages[i].sub) == "string" || typeof(massages[i].time) == "string"){
					massages.splice(i,1) // null daholo ny massages
				}else{
					isHasSpaMassage = true // nisy massages tsy null le aza
				}
			}
			sessionStorage.setItem("massages",JSON.stringify(massages))
		}
	}
	if (isHasSpaMassage) {
		addDomIndex()
		if (jsonPresta.code_promo) {
			changePromoCode(jsonPresta);
		}
	}else{
		initSession()
	}
}

// initialiser la session
function initSession(){
	sessionStorage.setItem("prestations","{}")
	sessionStorage.setItem("spa","[]")
	sessionStorage.setItem("massages","[]")
	sessionStorage.setItem("cadeau","[]")
	sessionStorage.setItem("inc","0")
}
/*==========================================================================*/
// remettre les elements si un l'user a actualisé
function addDomIndex(){
	let dataForm = JSON.parse(document.getElementById('form-data').dataset.spas)
	let dataOption = JSON.parse(document.getElementById('form-data').dataset.spaoptions)
	let dataMassages = JSON.parse(document.getElementById('form-data').dataset.massages)
	let spa = JSON.parse(sessionStorage.getItem("spa"))
	let massages = JSON.parse(sessionStorage.getItem("massages"))
	let cadeau = JSON.parse(sessionStorage.getItem("cadeau"))
	// prestations.pays = "" // prestations.departement = "" // prestations.date = "" // prestations.heurs = "" // prestations.praticient = ""	
	let prestations = JSON.parse(sessionStorage.getItem("prestations"))
	// Ajouter les spa selectionné dans le dom
	let tmpTime = ""
	if (0 < spa.length) {
		for (var i = 0; i < spa.length ; i++) {
			actualiseDomSpa(spa[i].id,[spa[i].id,spa[i].time,spa[i].option,spa[i].info])
			tmpTime = document.querySelector("input[data-index=\'"+spa[i].id+"\'][data-array=\'"+spa[i].time+"\'].time-spa-list").value
			htmlTimeSpaOrder(tmpTime,spa[i].id,dataOption,dataForm)
			htmlOptionSpaOrder(spa[i].id,dataOption,dataForm,spa[i].option)
		}
		document.getElementById("heure-spa").value = prestations.heureSpa
	}
	// Ajouter les massages selectionné dans le dom
	if (massages.length != 0) {
		for (var i = 0; i < massages.length ; i++) {
			actualiseDomMassage(massages[i].cat,massages[i].id,massages[i].sub,massages[i].time)
			priceTotalForOneMassage(dataMassages,massages[i].id)
			priceTotalForAllMassage(dataMassages)
		}
		document.getElementById("heure-massage").value = prestations.heureMassage
	}
	// Ajouter le cadeau selectionné dans le dom
	if (cadeau.length != 0) {
		valueInInput = ""
		for (var i = 0; i < cadeau.length ; i++) {
			// [[6,8],[7,3],[8,2],[9,1]]
			document.getElementById(cadeau[i][0]+"-nbr").innerHTML = cadeau[i][1]
			valueInInput += cadeau[i][0]+"-"+cadeau[i][1]+"|"
		}
		document.getElementById("cadeau-id").value = valueInInput
		priceForAllCadeau()
	}
	// Ajouter les information sur la zone et type de praticient
	if (prestations.praticien != undefined){
		let listPratitiens = document.querySelectorAll(".praticien-list")
		for (var i = listPratitiens.length - 1; i >= 0; i--) {
			if(listPratitiens[i].value == prestations.praticien){
				listPratitiens[i].checked = true
			}
		}
	}
}
/*==========================================================================*/
	// les fonctions concernatant Date Heurs Pays Departement Praticient
	function showDepartementIfFrance() {
		var x = this.value
		var input_dptm = document.getElementById("Departement")
		var div_dptm = document.getElementById("list-department")
		if (x == "France") {
			input_dptm.removeAttribute("disabled")
			div_dptm.removeAttribute("class")
		}else{
			input_dptm.setAttribute("disabled","disabled")
			div_dptm.classList.add("hidden")
		}
	}
	// pour le praticien 
	function addPraticientAtSession(){
		let prestations = JSON.parse(sessionStorage.getItem("prestations"))
		prestations.praticien = this.value
		sessionStorage.setItem("prestations",JSON.stringify(prestations))
	}

	/*==========================================================================*/
	// les fonctions primaire utilisé dans SPA et massage
	function incrementeInc(){ /*incremente la valeur inc pour les params*/
		let inc = JSON.parse(sessionStorage.getItem("inc"))
		inc++
		sessionStorage.setItem("inc",JSON.stringify(inc))
		return inc
	}
	/*==========================================================================*/
	// les fonctions primaire SPA
// [logemtn,installation,eau]
function changeLogement (){
	let sessionSpa = JSON.parse(sessionStorage.getItem("spa"))
	for (var i = sessionSpa.length - 1; i >= 0; i--) {
		if (sessionSpa[i].id == this.dataset.index) {
			sessionSpa[i].info[0] = this.value
			break
		}
	}
	sessionStorage.setItem("spa",JSON.stringify(sessionSpa))
}
function changeInstallation (){
	let sessionSpa = JSON.parse(sessionStorage.getItem("spa"))
	for (var i = sessionSpa.length - 1; i >= 0; i--) {
		if (sessionSpa[i].id == this.dataset.index) {
			sessionSpa[i].info[1] = this.value
			break
		}
	}
	sessionStorage.setItem("spa",JSON.stringify(sessionSpa))
}
function changeTypeSpa (){
	let sessionSpa = JSON.parse(sessionStorage.getItem("spa"))
	for (var i = sessionSpa.length - 1; i >= 0; i--) {
		if (sessionSpa[i].id == this.dataset.index) {
			sessionSpa[i].info[2] = this.value
			break
		}
	}
	sessionStorage.setItem("spa",JSON.stringify(sessionSpa))
}

// "time":"1","option":[1,2,3]}]
function valueToHtmlSpa(id,time=null,option="",info=""){ /* code html pour l'ajout d'un spa */
let data = document.getElementById('form-data').dataset
let dataSpas = JSON.parse(data.spas)
let dataSpaoptions = JSON.parse(data.spaoptions)
	// spa.duration,spa.exceptional_price,spa.ordinary_price,spa.exceptional_acompte,spa.ordinary_acompte
	let typeSpa = "<div class='col-sm-3'><h4><center class=\"titleSpa dureTitle\">Durée location</center></h4>"
	for (var i = 0; i < dataSpas.length ; i++) {
		if (time == i) {
			typeSpa += "<div class=\"duree-spa\"><input class=\"time-spa-list\" type=\"radio\" id=\""+id+"h"+dataSpas[i][0]+"\" checked name=\"timeSpa["+id+"][]\" value=\""+ dataSpas[i][0] +"\" data-prices=\"["+dataSpas[i][1]+","+dataSpas[i][2]+"]\" data-acompte=\"["+dataSpas[i][3]+","+dataSpas[i][4]+"]\" data-index=\""+id+"\" data-array=\""+i+"\"><label for=\""+id+"h"+dataSpas[i][0]+"\" class=\"label-spa\">"+ dataSpas[i][0] +"h</label></div>"
		}else{
			typeSpa += "<div class=\"duree-spa\"><input class=\"time-spa-list\" type=\"radio\" id=\""+id+"h"+dataSpas[i][0]+"\" name=\"timeSpa["+id+"][]\" value=\""+ dataSpas[i][0] +"\" data-prices=\"["+dataSpas[i][1]+","+dataSpas[i][2]+"]\" data-acompte=\"["+dataSpas[i][3]+","+dataSpas[i][4]+"]\" data-index=\""+id+"\" data-array=\""+i+"\"><label for=\""+id+"h"+dataSpas[i][0]+"\" class=\"label-spa\">"+ dataSpas[i][0] +"h</label></div>"
		}
	}
	typeSpa += "</div><div class='col-sm-4 ambianceresponsive'><h4><center class=\"titleSpa\">Ambiance</center></h4>"
	for (var i = 0; i < dataSpaoptions.length ; i++) {
		if (option.includes(i)) {
			typeSpa += "<div class=\"list-ambiance\"><input class=\"option-spa-list\" type=\"checkbox\" checked name=\"optionSpa["+id+"][]\" value=\""+dataSpaoptions[i][1]+"\" id=\"opt"+dataSpaoptions[i][0]+""+id+"\" data-array=\""+i+"\" data-price=\""+dataSpaoptions[i][2]+"\" data-index=\""+id+"\" ><label for=\"opt"+dataSpaoptions[i][0]+""+id+"\" class=\"label-option-spa\">"+dataSpaoptions[i][1]+"</label><i class=\"fa fa-question-circle questionMarkSpa\" aria-hidden=\"true\" data-toggle=\"modal\" data-target=\"#"+dataSpaoptions[i][1]+"\"></i></div>"
		}else{
			if (typeof(option)!="string") {
				typeSpa += "<div class=\"list-ambiance\"><input class=\"option-spa-list\" type=\"checkbox\" name=\"optionSpa["+id+"][]\" value=\""+dataSpaoptions[i][1]+"\" id=\"opt"+dataSpaoptions[i][0]+""+id+"\" data-array=\""+i+"\" data-price=\""+dataSpaoptions[i][2]+"\" data-index=\""+id+"\" ><label for=\"opt"+dataSpaoptions[i][0]+""+id+"\" class=\"label-option-spa\">"+dataSpaoptions[i][1]+"</label><i class=\"fa fa-question-circle questionMarkSpa\" aria-hidden=\"true\" data-toggle=\"modal\" data-target=\"#"+dataSpaoptions[i][1]+"\"></i></div>"
			}else{
				typeSpa += "<div class=\"list-ambiance\"><input class=\"option-spa-list\" type=\"checkbox\" name=\"optionSpa["+id+"][]\" value=\""+dataSpaoptions[i][1]+"\" id=\"opt"+dataSpaoptions[i][0]+""+id+"\" data-array=\""+i+"\" data-price=\""+dataSpaoptions[i][2]+"\" data-index=\""+id+"\" disabled ><label for=\"opt"+dataSpaoptions[i][0]+""+id+"\" class=\"label-option-spa\">"+dataSpaoptions[i][1]+"</label><i class=\"fa fa-question-circle questionMarkSpa\" aria-hidden=\"true\" data-toggle=\"modal\" data-target=\"#"+dataSpaoptions[i][1]+"\"></i></div>"
			}
		}
	}
	// [logemtn,installation,eau]
	function isPresent(key,value){
		if (key == value) {
			return "selected=\"selected\""
		}else{
			return ""	
		}
	}
	if (info!="") {
		typeSpa += "</div><div class=\"col-sm-5 fin-spa\"><h4><center class=\"titleSpa informationTitle\">Informations sur la location</center></h4><br><div class=\"infoSpa\"><label class=\"label-info-spa\" for=\"logement"+id+"\">Type de logement</label><select class=\"logement selectElement select-dro\" data-index=\""+id+"\" name=\"typeSpa["+id+"][]\" id=\"logement"+id+"\" ><option value=\"Appartement\" "+ isPresent(info[0],"Appartement") +">Appartement</option><option value=\"Villa - Maison\" "+ isPresent(info[0],"Villa - Maison") +" >Villa - Maison</option></select></div><div class=\"infoSpa\"><label for=\"installation"+id+"\" class=\"label-info-spa\">Type d'installation</label><select class=\"installation selectElement select-dro\" data-index=\""+id+"\" name=\"typeSpa["+id+"][]\" id=\"installation"+id+"\"><option value=\"Intérieur\" "+ isPresent(info[1],"Intérieur") +">Intérieur</option><option value=\"Extérieur\" "+ isPresent(info[1],"Extérieur") +">Extérieur</option></select></div><div class=\"infoSpa\"><label for=\"eau"+id+"\" class=\"label-info-spa\">Système d'eau</label><select class=\"typeSpa selectElement select-dro\" data-index=\""+id+"\" name=\"typeSpa["+id+"][]\" id=\"eau"+id+"\" ><option value=\"Cumulus - Ballon d'eau (eau chaude limitée)\"  "+ isPresent(info[2],"Cumulus - Ballon d'eau (eau chaude limitée)") +">Cumulus - Ballon d\'eau (eau chaude limitée)</option><option value=\"Chaudière (eau chaude continue)\" "+ isPresent(info[2],"Chaudière (eau chaude continue)") +" >Chaudière (eau chaude continue)</option></select></div></div>"
	}else{
		typeSpa += "</div><div class=\"col-sm-5 fin-spa\"><h4><center class=\"titleSpa informationTitle\">Informations sur la location</center></h4><br><div class=\"infoSpa\"><label class=\"label-info-spa\" for=\"logement"+id+"\">Type de logement</label><select class=\"logement selectElement select-dro\" data-index=\""+id+"\" name=\"typeSpa["+id+"][]\" id=\"logement"+id+"\" ><option value=\"Appartement\" selected=\"selected\">Appartement</option><option value=\"Villa - Maison\">Villa - Maison</option></select></div><div class=\"infoSpa\"><label for=\"installation"+id+"\" class=\"label-info-spa\">Type d'installation</label><select class=\"installation selectElement select-dro\" data-index=\""+id+"\" name=\"typeSpa["+id+"][]\" id=\"installation"+id+"\"><option value=\"Intérieur\" selected=\"selected\">Intérieur</option><option value=\"Extérieur\">Extérieur</option></select></div><div class=\"infoSpa\"><label for=\"eau"+id+"\" class=\"label-info-spa\">Système d'eau</label><select class=\"typeSpa selectElement select-dro\" data-index=\""+id+"\" name=\"typeSpa["+id+"][]\" id=\"eau"+id+"\" ><option value=\"Cumulus - Ballon d'eau (eau chaude limitée)\" selected=\"selected\">Cumulus - Ballon d\'eau (eau chaude limitée)</option><option value=\"Chaudière (eau chaude continue)\">Chaudière (eau chaude continue)</option></select></div></div>"
	}
	return typeSpa
}


function numberSpaSelected(){
	let list = document.getElementsByClassName("spa-list-prestations")
	document.getElementById("number-spa").innerHTML = list.length
}

/*==========================================================================*/
	// les fonctions primaire MASSAGE
	function numberMassageSelected(name) {
		let list = document.getElementsByClassName("massage-list-"+name)
		document.getElementById("number-"+name).innerHTML = list.length
	}

// [{"id":1,"cat":"Homme","sub":3,"time":1},{"id":2,"cat":"Femme","sub":0,"time":1}]
function valueToHtmlMassage(name,id,sub=null,time=null){
	let data = document.getElementById('form-data').dataset
	let dataMassages = JSON.parse(data.massages)

	let categories = []
	if ( name == "Homme") {
		categories = dataMassages[0]
	}else{
		categories = dataMassages[1]
	}
	let heurs = []
	let htmlSub = ""
	let htmlTime = ""
	for (var i = 0; i < categories[1].length ; i++) {
		htmlSub += "<div class=\"massage-type\">"
		if (i == 0) {
			htmlSub += "<input type=\"text\" name=\"massageSu["+id+"][]\" value=\""+ name +"\" class=\"hidden\">"
		}
		if (sub != null && sub == i) {
			htmlSub += "<input type=\"checkbox\" value=\""+ categories[1][i][0] +"\" checked id=\"sub"+ i +""+ id +"\" class=\"massage-su\" name=\"massageSu["+id+"][]\" data-info=\"["+ [id,i] +"]\"><label class=\"label-massage\" for=\"sub"+ i +""+ id +"\"> "+ categories[1][i][0] +" </label><i class=\"fa fa-question-circle questionMark\" aria-hidden=\"true\" data-toggle=\"modal\" data-target=\"#modal"+ i +""+ id +"\"></i>"
			htmlTime += "<div class=\"times-massage\" data-info=\"["+ [id,i] +"]\" ><ul>"
		}else{
			htmlSub += "<input type=\"checkbox\" value=\""+ categories[1][i][0] +"\" id=\"sub"+ i +""+ id +"\" class=\"massage-su\" name=\"massageSu["+id+"][]\" data-info=\"["+ [id,i] +"]\"><label class=\"label-massage\" for=\"sub"+ i +""+ id +"\"> "+ categories[1][i][0] +" </label><i class=\"fa fa-question-circle questionMark\" aria-hidden=\"true\" data-toggle=\"modal\" data-target=\"#modal"+ i +""+ id +"\"></i>"
			htmlTime += "<div class=\"times-massage hidden\" data-info=\"["+ [id,i] +"]\" ><ul>"
		}
		htmlSub += "</div>"
		heurs = categories[1][i][1] // liste des heurs possibles
		for (var j = 0; j < heurs.length ; j++) {
			if (time != null && time == j && sub != null && sub == i) {
				htmlTime += "<li class=\"duree-massage\"><input class=\"input-time-list time-spa-list\" type=\"radio\" value=\""+ heurs[j][0] +"\" checked id=\"time"+j+i+id+"\" name=\"massageSuPrice["+id+"][]\" data-info=\"["+ [id,i,j] +"]\" data-price=\"["+ [heurs[j][1],heurs[j][2],heurs[j][3],heurs[j][4]] +"]\" data-sub=\""+categories[1][i][0]+"\" data-name=\""+name+"\" ><label class=\"form label-spa\" for=\"time"+j+i+id+"\"> "+ heurs[j][0] +" </label></li>"
			}else{
				htmlTime += "<li class=\"duree-massage\"><input class=\"input-time-list time-spa-list\" type=\"radio\" value=\""+ heurs[j][0] +"\" id=\"time"+j+i+id+"\" name=\"massageSuPrice["+id+"][]\" data-info=\"["+ [id,i,j] +"]\" data-price=\"["+ [heurs[j][1],heurs[j][2],heurs[j][3],heurs[j][4]] +"]\" data-sub=\""+categories[1][i][0]+"\" data-name=\""+name+"\" ><label class=\"form label-spa\" for=\"time"+j+i+id+"\"> "+ heurs[j][0] +" </label></li>"
			}
		}
		htmlTime += "</ul></div>"
	}
	return "<div class=\"row\"><div class=\"col-sm-12 sm-9-spa\"><div class=\"innerWrapper\"><div class=\"table-responsive table-responsiveInfos\"><table class=\"table tableInfos\"><thead><tr class=\"tr\"><th id=\"tableHead\">"+name+"</th></tr></thead></table></div></div></div></div><div class=\"row\"><div class=\"col-sm-10\"><h4><center class=\"titleMassage\">Types de massage</center></h4><div class=\"sm-6-massage\">"+ htmlSub +"</div></div><div class=\"col-sm-2 col-sm2Duree\"><h4>Durée(min)</h4>"+htmlTime+"</div></div>"
}



/* #################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################### */
/* #################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################### */
/* #################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################### */

function showTimesOnClickMassageSu(){
	// data-info=\"["+ [id,i] +"]\"
	let dataMassages = JSON.parse(document.getElementById('form-data').dataset.massages)
	let myData = JSON.parse(this.dataset.info)[0]
	document.getElementById("list-order-"+myData).classList.add("hidden")
	let timeListAll = document.getElementsByClassName("times-massage")
	let timeList = []
	let inputList = []
	// Enregistrement dans la session
	let sessionMassage = JSON.parse(sessionStorage.getItem("massages"))
	// sessionMassage.push({id:id,cat:categories[0],sub:"",time:"",price:""})
	for (var i = sessionMassage.length - 1; i >= 0; i--) {
		if(sessionMassage[i].id == myData){
			sessionMassage[i].sub = JSON.parse(this.dataset.info)[1]
			sessionMassage[i].time = ""
		}
	}
	sessionStorage.setItem("massages",JSON.stringify(sessionMassage))
	// Modification dans le DOM

	// Selection les heurs et les checkbox a cocher disponible
	for (var i = 0; i < timeListAll.length ; i++) {
		if (JSON.parse(timeListAll[i].dataset.info)[0] == myData) {
			timeList = timeListAll[i].parentElement.getElementsByTagName("div")
			inputList = timeListAll[i].parentElement.getElementsByTagName("input")
			break
		}
	}
	// remetre a zero les choix precedent sur les heurs dispo
	for (var i = inputList.length - 1; i >= 0; i--) {
		inputList[i].checked = false
	}
	// decocher les autre type de massage selectionné recedent!
	let listCheck = document.getElementsByClassName("massage-su")
	for (var i = listCheck.length - 1; i >= 0; i--) {
		if (JSON.parse(listCheck[i].dataset.info)[0] == myData && listCheck[i] != this) {
			listCheck[i].checked = false
		}
	}
	if (this.checked) {
		for (var i = 0; i < timeList.length ; i++) {
			if (timeList[i].dataset.info == this.dataset.info){
				timeList[i].className = "times-massage"
			}else{
				timeList[i].className = "times-massage hidden"
			}
		}
	}else{
		for (var i = 0; i < timeList.length ; i++) {
			if (timeList[i].dataset.info == this.dataset.info){
				timeList[i].className = "times-massage hidden"
			}
		}
	}
	priceTotalForAllMassage(dataMassages)
	// Grand prix total
	bigTotalPrice()
}


/*==========================================================================*/
// Fonction pour l'enregistrement de l'heurs
function addHoursInPrestation(){
	let prestations = JSON.parse(sessionStorage.getItem("prestations"))
	if (this.name == "heureMassage"){
		prestations.heureMassage = this.value
	}else{
		prestations.heureSpa = this.value
	}
	sessionStorage.setItem("prestations",JSON.stringify(prestations))
}

/*==========================================================================*/
// fonction principale SPA
// evenement on click
function actualiseDomSpa(id,data=""){
	// Modification dans le DOM
	let div = document.createElement('div')
	div.classList.add('spa-list-prestations')
	if (data != "") {
		// [spa[i].id,spa[i].time,spa[i].option,spa[i].info]
		div.innerHTML = valueToHtmlSpa(data[0],data[1],data[2],data[3])
	}else{
		div.innerHTML = valueToHtmlSpa(id)	
	}

	document.getElementById('spa-input').appendChild(div)

	// Ajout des sous element dans la session et dans le panier
	let timeSpa = document.querySelectorAll(".time-spa-list")
	timeSpa.forEach(tSpa => {
		tSpa.addEventListener('change',addRmvTimSpaInOrder);
	});

	let optionSpa = document.querySelectorAll(".option-spa-list")
	optionSpa.forEach(oSpa => {
		oSpa.addEventListener('change',addRmvOptionSpaInOrder);
	});

	// Ajout des autre information dans la session
	let logement = document.querySelectorAll(".logement")
	let installation = document.querySelectorAll(".installation")
	let typeSpa = document.querySelectorAll(".typeSpa")

	logement.forEach(log => {
		log.addEventListener('change',changeLogement);
	});
	installation.forEach(inst => {
		inst.addEventListener('change',changeInstallation);
	});
	typeSpa.forEach(type => {
		type.addEventListener('change',changeTypeSpa);
	});
	// Ajout dans le panier
	addSpaInOrder(id)
	// nombre de spa - 0 +
	numberSpaSelected()
	// Grand prix total
	bigTotalPrice()
}

function addSpaList(){
	let id = incrementeInc() // Augmente de 1 la session
	// Enregistrement dans la session
	let sessionSpa = JSON.parse(sessionStorage.getItem("spa"))
	// [logemtn,installation,eau]
	sessionSpa.push({id:id,time:"",option:[],info:["Appartement","Intérieur","Cumulus - Ballon d\'eau (eau chaude limitée)"]})
	sessionStorage.setItem("spa",JSON.stringify(sessionSpa))
	actualiseDomSpa(id)
}
// evenement on click
function removeSpaList(){
	let dataForm = JSON.parse(document.getElementById('form-data').dataset.spas)
	let dataOption = JSON.parse(document.getElementById('form-data').dataset.spaoptions)
	// Enregistrement dans la session
	let sessionSpa = JSON.parse(sessionStorage.getItem("spa"))
	sessionSpa.pop()
	sessionStorage.setItem("spa",JSON.stringify(sessionSpa))
	numberAtOrderBtn()
	// Modification dans le DOM
	let list = document.getElementsByClassName("spa-list-prestations")
	if (list.length > 0) {
		list[list.length-1].remove()
		// supprimer l'element dans le panier
		rmvSpaInOrder()
		// recalculer le prix total
		priceTotalForAllSpa(dataOption,dataForm)
	}
	numberSpaSelected()
	// Grand prix total
	bigTotalPrice()
}
////////////////////////////////////////////////////////
// fonction principale commande SPA
function addSpaInOrder(id){
	let divOrder = document.getElementById("spa-order")
	let div = document.createElement("div")
	div.classList = "spa-order hidden"
	div.setAttribute("id","spa-list-"+id)
	div.innerHTML = "<p class=\"ul-panier\"><span class=\"spa-duration\">Spa pour : <span id=\"spa-time-"+id+"\"></span> h </span><br><span id=\"spa-price-"+id+"\"></span></p><ul></ul>"
	divOrder.appendChild(div)
}

function rmvSpaInOrder(){
	let a = document.getElementsByClassName("spa-order")
	a[a.length-1].remove()
	if(a.length == 0){
		document.getElementById("spa-order").classList.add('hidden');
	}
}

function addRmvTimSpaInOrder(){ //checkbox na option spa
	let dataForm = JSON.parse(document.getElementById('form-data').dataset.spas)
	let dataOption = JSON.parse(document.getElementById('form-data').dataset.spaoptions)
	let index = this.dataset.index
	let sessionSpa = JSON.parse(sessionStorage.getItem("spa"))
	// Activer les checkbox pour les options spa
	let inputList = document.querySelectorAll(".option-spa-list[data-index=\'"+index+"\']")
	for (var i = inputList.length - 1; i >= 0; i--) {
		inputList[i].removeAttribute("disabled")
	}
	for (var i = sessionSpa.length - 1; i >= 0; i--) {
		if (sessionSpa[i].id == index) {
			sessionSpa[i].time = this.dataset.array
			break
		}
	}
	sessionStorage.setItem("spa",JSON.stringify(sessionSpa))
	numberAtOrderBtn()
	// Ajouter l'element selectionné dans le dom
	htmlTimeSpaOrder(this.value,index,dataOption,dataForm)
}

function htmlTimeSpaOrder(name,index,dataOption,dataForm){
	document.getElementById("spa-order").classList.remove('hidden');
	document.getElementById("spa-list-"+index).classList.remove('hidden');
	document.getElementById("spa-time-"+index).innerHTML = name
	// calcul prix pour un spa selectionné
	// let pricesSpa = JSON.parse(this.dataset.prices)[1]
	// let acompteSpa = JSON.parse(this.dataset.acompte)[1]
	priceTotalForOneSpa(index,dataOption,dataForm)
	// total prix pours les spas selectionné
	priceTotalForAllSpa(dataOption,dataForm)
}

function addRmvOptionSpaInOrder(){ //checkbox na option spa
	let dataForm = JSON.parse(document.getElementById('form-data').dataset.spas)
	let dataOption = JSON.parse(document.getElementById('form-data').dataset.spaoptions)
	let index = this.dataset.index
	let id = JSON.parse(this.dataset.array)
	// Ajout ou supression d'element dans la session
	let sessionSpa = JSON.parse(sessionStorage.getItem("spa"))
	let listOptions = []
	if(this.checked){
		for (var i = sessionSpa.length - 1; i >= 0; i--) {
			if (sessionSpa[i].id == index) {
				sessionSpa[i].option = [id]
				listOptions = sessionSpa[i].option
				break
			}
		}
	}else{
		for (var i = sessionSpa.length - 1; i >= 0; i--) {
			if (sessionSpa[i].id == index) {
				sessionSpa[i].option = []
				listOptions = sessionSpa[i].option
				break
			}
		}
	}

	let inputList = document.querySelectorAll(".option-spa-list[data-index=\'"+index+"\']")
	inputList.forEach(inputL => {
		if(this != inputL){
			inputL.checked = false
		}
	});

	sessionStorage.setItem("spa",JSON.stringify(sessionSpa))
	// Ajout des element dans le dom
	htmlOptionSpaOrder(index,dataOption,dataForm,listOptions)
}

function htmlOptionSpaOrder(index,dataOption,dataForm,listOptions){
	let ulList = (document.getElementById("spa-list-"+index).getElementsByTagName("ul"))
	let liList = ""
	// [1, "Décoration romantique", 20] agencement dans la dataOption
	for (var i = 0; i < listOptions.length; i++) {
		liList += "<li class=\"li-ambiance\">Ambiance : "+dataOption[listOptions[i]][1]+"</li>"
	}
	ulList[0].innerHTML = liList
	// modifier la petite some
	priceTotalForOneSpa(index,dataOption,dataForm)
	// modifier la somme total
	priceTotalForAllSpa(dataOption,dataForm)
}

function priceTotalForOneSpa(index,dataOption,dataForm){
// [spa.duration,spa.exceptional_price,spa.ordinary_price,spa.exceptional_acompte,spa.ordinary_acompte]
// [24, 180, 100, 50, 30]
let exceptionalDate = [["14","02"],["24","12"],["25","12"],["31","12"]]
let zone = JSON.parse(sessionStorage.getItem("zone"))
	zone = zone.date.split("/") // MM - DD - YYYY
	let exceptionalPrice = false
	for (var i = exceptionalDate.length - 1; i >= 0; i--) {
		if (exceptionalDate[i][0] == zone[0] && exceptionalDate[i][1] == zone[1]){
			exceptionalPrice = true
			break
		}
	}

	let spaPrice = document.getElementById("spa-price-"+index)
	
	let price = [0,0]
	let sessionSpa = JSON.parse(sessionStorage.getItem("spa"))
	for (var i = sessionSpa.length - 1; i >= 0; i--) {
		if (sessionSpa[i].id == index) {
			if (exceptionalPrice) {
				price[0] += dataForm[sessionSpa[i].time][1] // prix
				price[1] += dataForm[sessionSpa[i].time][3] // acompte
			}else{
				price[0] += dataForm[sessionSpa[i].time][2] // prix
				price[1] += dataForm[sessionSpa[i].time][4] // acompte
			}
			let spa = sessionSpa[i].option
			for (var j = spa.length - 1; j >= 0; j--) {
				price[0] += dataOption[spa[j]][2]
			}
			spaPrice.innerHTML = "<li class=\"li-prix hidden\">Prix : "+price[0]+"€ </li><li class=\"li-acompte hidden\">Acompte : "+price[1]+"€</li>"
			break
		}
	}
}

function priceTotalForAllSpa(dataOption,dataForm){
	let exceptionalDate = [["14","02"],["24","12"],["25","12"],["31","12"]]
	let zone = JSON.parse(sessionStorage.getItem("zone"))
	zone = zone.date.split("/") // MM - DD - YYYY
	let exceptionalPrice = false
	for (var i = exceptionalDate.length - 1; i >= 0; i--) {
		if (exceptionalDate[i][0] == zone[0] && exceptionalDate[i][1] == zone[1]){
			exceptionalPrice = true
			break
		}
	}

	let spanPriceTotal = document.getElementById("spa-price-total")
	let prixSomme = [0,0]
	let sessionSpa = JSON.parse(sessionStorage.getItem("spa"))
	let tmp = ""
	for (var i = sessionSpa.length - 1; i >= 0; i--) {
		// somme heurs des spa
		if (sessionSpa[i].time != "") {
			if (exceptionalPrice) {
				prixSomme[0] += dataForm[sessionSpa[i].time][1] // prix
				prixSomme[1] += dataForm[sessionSpa[i].time][3] // acompte
			}else{
				prixSomme[0] += dataForm[sessionSpa[i].time][2] // prix
				prixSomme[1] += dataForm[sessionSpa[i].time][4] // acompte
			}
			// some prix pour les options déco
			tmp = sessionSpa[i].option
			for (var j = tmp.length - 1; j >= 0; j--) {
				prixSomme[0] += dataOption[tmp[j]][2]
			}
		}
	}

	let prestations = JSON.parse(sessionStorage.getItem("prestations"))
	prestations.priceSpa = prixSomme[0]
	sessionStorage.setItem("prestations",JSON.stringify(prestations))

	spanPriceTotal.innerHTML = " : "+prixSomme[0]+" € "
	spanPriceTotal.dataset.price = "["+[prixSomme[0],prixSomme[1]]+"]"
	// Grand prix total
	bigTotalPrice()
}

/*==========================================================================*/
	// fonction principale MASSAGE
	function addCategoryMassage(){
		let id = incrementeInc()
		let data = document.getElementById('form-data').dataset
		let dataMassages = JSON.parse(data.massages)
		let categories = []
		if ( this.dataset.cat == "Homme") {
			categories = dataMassages[0]
		}else{
			categories = dataMassages[1]
		}
	// Enregistrement dans la session
	
	let sessionSpa = JSON.parse(sessionStorage.getItem("massages"))
	sessionSpa.push({id:id,cat:categories[0],sub:"",time:""})
	sessionStorage.setItem("massages",JSON.stringify(sessionSpa))
	/* ************************************** MILA MODAL NGAMBA */
	if (sessionSpa.length >= 1){
		let homme = document.getElementById('addHomme')
		let femme = document.getElementById('addFemme')
		homme.addEventListener('click',showAlert);
		femme.addEventListener('click',showAlert);
	}

	if (sessionSpa){
		let moinhomme = document.getElementById('moinHomme')
		let moinfemme = document.getElementById('moinFemme')

		moinhomme.addEventListener('click',deletAlert);
		moinfemme.addEventListener('click',deletAlert);
	}
	function deletAlert(){
		let homme = document.getElementById('addHomme')
		let femme = document.getElementById('addFemme')

		homme.removeAttribute("data-target");
		homme.removeAttribute("data-toggle");
		femme.removeAttribute("data-target");
		femme.removeAttribute("data-toggle");
		if(sessionSpa.length > 0 ){
				sessionSpa.splice(-1,1);
		}
	}

	function showAlert(){
		let homme = document.getElementById('addHomme')
		let femme = document.getElementById('addFemme')
		if (sessionSpa.length >= 1){
			homme.setAttribute("data-target", "#pushMassage2");
			homme.setAttribute("data-toggle", "modal");
			femme.setAttribute("data-target", "#pushMassage2");
			femme.setAttribute("data-toggle", "modal");
		}
	}
	/* ************************************** MILA MODAL NGAMBA */
	// Modification dans le DOM
	actualiseDomMassage(this.dataset.cat,id)
}

function actualiseDomMassage(name,id,sub=null,time=null){
	let div = document.createElement('div')
	div.classList.add('massage-list-'+name)
	if (sub != null && time != null) {
		div.innerHTML = valueToHtmlMassage(name,id,sub,time)
	}else{
		div.innerHTML = valueToHtmlMassage(name,id)	
	}
	document.getElementById("massage-order").innerHTML += "<div id=\"list-order-"+id+"\" class=\"hidden\"><div><p class=\"msg-duration\">"+ name +"</p></div><div class=\"prestation-message\"><li class=\"li-msgType\"></li><div><ul></ul></div></div></div>"

	document.getElementById('massage-input').appendChild(div)

	// nombre de massage pour homme et femme
	numberMassageSelected(name)
	// evement pour afficher les horaires disponible pour un massages
	let checkRadio = document.querySelectorAll('.massage-su');
	checkRadio.forEach(checkR => {
		checkR.addEventListener('change',showTimesOnClickMassageSu);
	});
	// evenement pour ajouter un element si une Time est cocher
	let checkRadioList = document.querySelectorAll('.input-time-list');
	checkRadioList.forEach(checkR => {
		checkR.addEventListener('change',addMassageInOrder);
	});
	// Grand prix total
	bigTotalPrice()
}

/* ########################################################################################################################################################################## */
/* ########################################################################################################################################################################## */

function addMassageInOrder(){
	let dataForm = JSON.parse(document.getElementById('form-data').dataset.spas)
	let dataOption = JSON.parse(document.getElementById('form-data').dataset.spaoptions)
	let dataMassages = JSON.parse(document.getElementById('form-data').dataset.massages)
	/*  [id,i,j]  */
	// <input class="input-time-list" type="radio" value="60" id="time164" name="massageSuPrice[4][]" data-info="[4,6,1]" data-name="Homme">
	let myData = JSON.parse(this.dataset.info)
	// Modifier la session
	let sessionMassage = JSON.parse(sessionStorage.getItem("massages"))
	for (var i = sessionMassage.length - 1; i >= 0; i--) {
		if(sessionMassage[i].id == myData[0]){
			sessionMassage[i].time = myData[2]
			numberAtOrderBtn()
		}
	}
	sessionStorage.setItem("massages",JSON.stringify(sessionMassage))
	// Calculer le prix et ajouter dans le dom
	// priceTotalForOneMassage(this.dataset.name,myData,this.dataset.sub)
	priceTotalForOneMassage(dataMassages,myData[0])
	priceTotalForAllMassage(dataMassages)
}

function priceTotalForOneMassage(dataMassages,myData){
	let exceptionalDate = [["14","02"],["24","12"],["25","12"],["31","12"]]
	let zone = JSON.parse(sessionStorage.getItem("zone"))
	zone = zone.date.split("/") // MM - DD - YYYY
	let exceptionalPrice = false
	for (var i = exceptionalDate.length - 1; i >= 0; i--) {
		if (exceptionalDate[i][0] == zone[0] && exceptionalDate[i][1] == zone[1]){
			exceptionalPrice = true
			break
		}
	}

	let sub =""
	let time =""
	let cat =""

	let sessionMassage = JSON.parse(sessionStorage.getItem("massages"))
	for (var i = sessionMassage.length - 1; i >= 0; i--) {
		if (sessionMassage[i].id == myData) {
			sub = sessionMassage[i].sub
			time = sessionMassage[i].time
			cat = sessionMassage[i].cat
			break
		}
	}
	let categories = []
	if ( cat == "Homme") {
		categories = dataMassages[0]
	}else{
		categories = dataMassages[1]
	}
	let divMassage = document.getElementById("list-order-"+myData)
	document.getElementById("massage-order").classList.remove('hidden')
	divMassage.classList.remove('hidden')
	divMassage.getElementsByTagName("li")[0].innerHTML = categories[1][sub][0]
	//  [30, 70, 30, 50, 20]
	if (exceptionalPrice) {
		divMassage.getElementsByTagName("ul")[0].innerHTML = "<li class=\"li-msgPrix hidden\">Prix: "+categories[1][sub][1][time][1]+"€</li><li class=\"li-msgAcompte hidden\">Acompte: "+categories[1][sub][1][time][2]+"€</li>"
	}else{
		divMassage.getElementsByTagName("ul")[0].innerHTML = "<li class=\"li-msgPrix hidden\">Prix: "+categories[1][sub][1][time][3]+"€</li><li class=\"li-msgAcompte hidden\">Acompte: "+categories[1][sub][1][time][4]+"€</li>"
	}
}

function priceTotalForAllMassage(dataMassages){
	let exceptionalDate = [["14","02"],["24","12"],["25","12"],["31","12"]]
	let zone = JSON.parse(sessionStorage.getItem("zone"))
	zone = zone.date.split("/") // MM - DD - YYYY
	let exceptionalPrice = false
	for (var i = exceptionalDate.length - 1; i >= 0; i--) {
		if (exceptionalDate[i][0] == zone[0] && exceptionalDate[i][1] == zone[1]){
			exceptionalPrice = true
			break
		}
	}

	let sessionMassage = JSON.parse(sessionStorage.getItem("massages"))
	let price = 0
	let acompte = 0
	for (var i = sessionMassage.length - 1; i >= 0; i--) {
		if (typeof(sessionMassage[i].sub) == "number" && typeof(sessionMassage[i].time) == "number") {
			let categories = []
			if ( sessionMassage[i].cat == "Homme") {
				categories = dataMassages[0]
			}else{
				categories = dataMassages[1]
			}

			if (exceptionalPrice) {
				price += categories[1][sessionMassage[i].sub][1][sessionMassage[i].time][1]
				acompte += categories[1][sessionMassage[i].sub][1][sessionMassage[i].time][2]
			}else{
				price += categories[1][sessionMassage[i].sub][1][sessionMassage[i].time][3]
				acompte += categories[1][sessionMassage[i].sub][1][sessionMassage[i].time][4]
			}
		}
	}

	document.getElementById("massage-price-total").innerHTML = " : "+price+"€"+acompte+"€"
	document.getElementById("massage-price-total").dataset.price = "["+[price,acompte]+"]"

	let prestations = JSON.parse(sessionStorage.getItem("prestations"))
	prestations.priceMassage = price
	sessionStorage.setItem("prestations",JSON.stringify(prestations))	
	document.getElementById("massage-price-total").innerHTML = " : "+price+" € "

	if (price == 0 && acompte == 0) {
		document.getElementById("massage-order").classList.add('hidden')
	}
	// Grand prix total
	bigTotalPrice()
}

/* ########################################################################################################################################################## */
/* ########################################################################################################################################################################## */

function removeCategoryMassage(){
	let dataMassages = JSON.parse(document.getElementById('form-data').dataset.massages)
	// Enregistrement dans la session
	let sessionMassage = JSON.parse(sessionStorage.getItem("massages"))
	for (var i = sessionMassage.length - 1; i >= 0; i--) {
		if(sessionMassage[i].cat == this.dataset.cat){
			document.getElementById("list-order-"+sessionMassage[i].id).remove()
			sessionMassage.splice(i,1)
			break
		}
	}
	sessionStorage.setItem("massages",JSON.stringify(sessionMassage))
	// Modification dans le DOM
	let list = document.getElementsByClassName('massage-list-'+this.dataset.cat)
	if (list.length > 0) {
		list[list.length-1].remove()
	}
	// nombre de massage pour homme et femme
	numberMassageSelected(this.dataset.cat)

	numberAtOrderBtn()
	priceTotalForAllMassage(dataMassages)
	// Grand prix total
	bigTotalPrice()
}
/*==========================================================================*/
	// fonction principale CADEAU
	function removeCadeau(){
		let id = JSON.parse(this.dataset.id)
		let cadeau = JSON.parse(sessionStorage.getItem("cadeau"))
		for (var i = cadeau.length - 1; i >= 0; i--) {
			if(cadeau[i][0] == id){
				cadeau[i][1]--
				document.getElementById(id+"-nbr").innerHTML = cadeau[i][1]
				if(cadeau[i][1] == 0){
					cadeau.splice(i,1)
				}
				break
			}
		}
		sessionStorage.setItem("cadeau",JSON.stringify(cadeau))
		numberAtOrderBtn()

		let changeCadeau = JSON.parse(sessionStorage.getItem("cadeau"))
		valueInInput = ""
		for (var i = changeCadeau.length - 1; i >= 0; i--) {
			valueInInput += changeCadeau[i][0]+"-"+changeCadeau[i][1]+"|"
		}
		document.getElementById("cadeau-id").value = valueInInput
	// calcul du prix
	priceForAllCadeau()
}
function aDDCadeau(){
	let id = JSON.parse(this.dataset.id)
	let cadeau = JSON.parse(sessionStorage.getItem("cadeau"))
	let test = true
	for (var i = cadeau.length - 1; i >= 0; i--) {
		if(cadeau[i][0] == id){
			test = false
			cadeau[i][1]++
			document.getElementById(id+"-nbr").innerHTML = cadeau[i][1]
			break
		}
	}
	if (test) {
		cadeau.push([id,1,this.dataset.name,this.dataset.price])
		document.getElementById(id+"-nbr").innerHTML = 1
	}
	sessionStorage.setItem("cadeau",JSON.stringify(cadeau))
	numberAtOrderBtn()

	let changeCadeau = JSON.parse(sessionStorage.getItem("cadeau"))
	valueInInput = ""
	for (var i = changeCadeau.length - 1; i >= 0; i--) {
		valueInInput += changeCadeau[i][0]+"-"+changeCadeau[i][1]+"|"
	}
	document.getElementById("cadeau-id").value = valueInInput
	// calcul du prix
	priceForAllCadeau()
}

function priceForAllCadeau(){
	let addCadeau = document.querySelectorAll(".cadeau-add")
	infoCadeau = []
	addCadeau.forEach(listCadeau => {
		infoCadeau.push([JSON.parse(listCadeau.dataset.id),listCadeau.dataset.name,JSON.parse(listCadeau.dataset.price)])
	});
	let cadeau = JSON.parse(sessionStorage.getItem("cadeau"))
	let orderCadeau = document.getElementById("cadeau-order")
	let totalPrice = 0
	let elementDom = "<ul>"
	for (var i = 0; i < cadeau.length; i++) {
		for (var j = infoCadeau.length - 1; j >= 0; j--) {
			if (cadeau[i][0] == infoCadeau[j][0]){
				totalPrice += cadeau[i][1]*infoCadeau[j][2] /* isany * prix */ /* infoCadeau[i][1] anarany*/
				elementDom += "<li class=\"li-cadeau\">"+ infoCadeau[i][1] +"<div class=\"nbr-cadeau\"> Nombres : "+ cadeau[i][1] +" <br> Prix : "+ cadeau[i][1]*infoCadeau[j][2] +" € </br></li>"
				break
			}
		}
	}
	if (totalPrice == 0) {
		orderCadeau.classList.remove("hidden")
		orderCadeau.classList.add("hidden")
		document.getElementById("cadeau-price-total").innerHTML = ""
	}else{
		orderCadeau.classList.remove("hidden")
		document.getElementById("cadeau-price-total").innerHTML = totalPrice
		orderCadeau.getElementsByTagName("div")[0].innerHTML = elementDom+"</ul>"
	}
	// Grand prix total
	bigTotalPrice()
}

function bigTotalPrice(){
	let spa = document.getElementById("spa-price-total").dataset.price
	let massage = document.getElementById("massage-price-total").dataset.price

	if ((spa == "" || spa == "[0,0]") && (massage == "" || massage == "[0,0]")) {
		document.getElementById("empty-order").classList.remove("hidden")
	}else{
		document.getElementById("empty-order").classList.add("hidden")
	}
	if (spa != "") {
		spa = JSON.parse(spa)
	}else{
		spa = [0,0]
	}
	if (massage != "") {
		massage = JSON.parse(massage)
	}else{
		massage = [0,0]
	}
	let code_promo = 0
	let prestations = JSON.parse(sessionStorage.getItem("prestations"));
	if (prestations.code_promo) {
		code_promo = prestations.code_promo[1]
	}

	let somePrice = spa[0] + massage[0]
	let someAcompte = spa[1] + massage[1]

	if(somePrice > 0){
		somePrice -= code_promo
	}
	if(someAcompte > 0){
		someAcompte -= code_promo
	}

	document.getElementById("total-price").innerHTML = somePrice
	document.getElementById("total-acompte").innerHTML =  someAcompte
}
// pour l'enregistrement des donné dans le panier du boutons
function numberAtOrderBtn(){
	let spa = JSON.parse(sessionStorage.getItem("spa"))
	let massages = JSON.parse(sessionStorage.getItem("massages"))
	let cadeau = JSON.parse(sessionStorage.getItem("cadeau"))
	let number = 0
	if (spa) {
		for (var i = spa.length - 1; i >= 0; i--) {
			if(spa[i].time != ""){
				number++
			}
		}
	}
	if (massages) {
		for (var i = massages.length - 1; i >= 0; i--) {
			if(typeof(massages[i].sub) != "string"){
				number++	
			}
		}
	}
	if (cadeau) {
		for (var i = cadeau.length - 1; i >= 0; i--) {
			number += cadeau[i][1]
		}
	}
	document.getElementById("number-cart-ok").innerHTML = number
}

document.getElementById("nex-submi-tag").addEventListener('click',submitFormulaire)

function submitFormulaire(){
	if(true){
		document.getElementById("form-data").submit()
	}else{
		document.getElementById("loc-spa-fafana").classList.add("active")
		document.getElementsByClassName("accordion-body js-accordion-body").style.display="block"
	}
}

function changePromoCode(prestations) {
	document.getElementById("alert-code").classList.remove("hidden");
	document.getElementById("form-promo-code").classList.add("hidden");
	document.getElementById("alert-code").innerHTML = "Votre code promo "+ prestations.code_promo[0] +" est validé avec succès." + " Vous avez gagné un reduction de " +prestations.code_promo[1]+ "€ pour l'acompte total à payer!";
}

// document.getElementById('submi-tag').onCl
// LIGNE 580 RA ILAINA ILAY ACCOMPTE
// spanPriceTotal.innerHTML = "prix: "+prixSomme[0]+"€ acompte: "+prixSomme[1]+"€"
// LIGNE 712 RA ILAINA ILAY ACCOMPTE
// document.getElementById("massage-price-total").innerHTML = "prix: "+price+" € "+acompte+"€"

/*



*/
