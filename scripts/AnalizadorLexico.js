/**
 * Logo - Chelys
 * 
 * Copyleft (C) John Garavito Suarez 2012
 * email: talent.corp at gmail.com
 * 
 * El presente interprete del lenguaje Logo, se desarrollo con fines académicos
 * por lo cual se autoriza su uso siempre y cuando su fin sea académico y se conserven
 * las referencias al autor
 */


window.addEventListener('load', initializeAnaLex, false);
var divST, divTL, syntaxTable, simbolsTable;
var tokens=[], lexemas=[];
var indSim = new Array;
var simbols = new Array();
var tipoSim = new Array();
var cont;
var txt;

function initializeAnaLex(){
	syntaxTable = document.getElementById("syntaxTable");
	simbolsTable = document.getElementById("simbolsTable");
	divST = document.getElementById("div-simbols");
	divTL = document.getElementById("div-table");
}
function AnalisisLexico(){
	cont=0;
	tokens=[], lexemas=[];
	indSim = new Array;
	simbols = new Array();
	txt=document.textArea.code.value;
	var palres = [ 'av', 're', 'gd', 'gi', 'centro', 'ponpos', 'para', 'fin', 'repite', 'bp', 'mt', 'ot', 'sl', 'bl']; //, 'bp', 'ot', 'mt', 'sl', 'bl', 'poncl', 'poncr',  'poncp', 'rellena', 'escribe', 'suma', 'diferencia', 'producto', 'division', 'menoigu', 'mayoigu', 'igual', 'no', 'o', 'y', 'repite', 'contador', 'para', 'fin', 'si'
	var tokLen = palres.concat(['dp', 'op', 'pt', 'cm', 'p0', 'p1', 'c0', 'c1', 'l0', 'l1', 'nu', 'id']);
	if(txt.charAt(0)){
		while(txt.charAt(0).search(/[\t\r\v\f\b\n\s\0]/)==0){
			txt=txt.substring(1,txt.length);
		}
	}
	if(txt.charAt(txt.length-1)){
		while(txt.charAt(txt.length-1).search(/[\t\r\v\f\b\n\s\0]/)==0){
			txt=txt.substring(0,txt.length-1);
		}
	}
	var i=0;
	while(i<txt.length){
		if(txt[i].search(/[\t\r\v\f\'\"‘’“”]/)!=-1){ 
			txt=txt.substring(0,i).concat(txt.substring(i+1,txt.length));
		}
		switch(txt[i]){
			case ':':
			case '.':
			case ',':
			case '+':
			case '-':
			case '*':
			case '/':
			case '(':
			case ')':
			case '[':
			case ']':
			case '{':
			case '}':
				i+=separarLexema(i)+1;
			break;
			case "\n":
				txt=txt.substring(0,i).concat(' '+txt.substring(i+1,txt.length));
				i++;
			break;
			default:
				i++;
		}
	}
	while(txt.indexOf('  ') != -1){
		txt=txt.replace('  ',' ');
	}
	var txtLex=txt.split(' ');
	txt=document.textArea.code.value;
	var esPalRes=false;
	if(txtLex[0]!=''){
		for(var i=0;i<txtLex.length;i++){
			for(var j=0;j<palres.length;j++){
				if(txtLex[i].toLowerCase()==palres[j]){
					tokens[cont]  = palres[j];
					lexemas[cont] = txtLex[i].toLowerCase();
					esPalRes=true;
					j=palres.length;
					cont++;
				}
			}
			if(!esPalRes){
				switch(txtLex[i].toLowerCase()){
					case 'avanza':
						agreTokLex(tokLen[0],txtLex[i]);
						cont++;
					break;
					case 'retrocede':
						agreTokLex(tokLen[1],txtLex[i]);
						cont++;
					break;
					case 'giraderecha':
						agreTokLex(tokLen[2],txtLex[i]);
						cont++;
					break;
					case 'giraizquierda':
						agreTokLex(tokLen[3],txtLex[i]);
						cont++;
					break;
					case 'ponposicion':
						agreTokLex(tokLen[5],txtLex[i]);
						cont++;
					break;
					case ':':
						agreTokLex(tokLen[13],txtLex[i]);
						cont++;
					break;
					case '+':
					case '-':
					case '*':
					case '/':
						agreTokLex(tokLen[15],txtLex[i]); 
						cont++;
					break;
					case '.':
						agreTokLex(tokLen[16],txtLex[i]);
						cont++;
					break;
					case ',':
						agreTokLex(tokLen[17],txtLex[i]);
						cont++;
					break;
					case '(':
						agreTokLex(tokLen[18],txtLex[i]);
						cont++;
					break;	
					case ')':
						agreTokLex(tokLen[19],txtLex[i]);
						cont++;
					break;
					case '[':
						agreTokLex(tokLen[20],txtLex[i]);
						cont++;
					break;
					case ']':
						agreTokLex(tokLen[21],txtLex[i]);
						cont++;
					break;
					case '{':
						agreTokLex(tokLen[22],txtLex[i]);
						cont++;
					break;
					case '}':
						agreTokLex(tokLen[23],txtLex[i]);
						cont++;
					break;
					case '':
					break;
					default:
						if(txtLex[i].search(/\D/)==-1){
							agreTokLex(tokLen[24],txtLex[i]);
							cont++;
						}
						else if(txtLex[i].search(/\W/)==-1){
							if(txtLex[i].search(/\d/)==0){
								return false;
							}
							agreTokLex(tokLen[25],txtLex[i]);
							agregarTS(txtLex[i]);
							cont++;
						}	
				}
			}
			else{
				esPalRes=false;
			}
		}
	}
	LimpiarTablaLex();
	LlenarTablaLex(cont);
	LimpiarTablaSim();
	LlenarTablaSim();
	return true;
}
function separarLexema(ind){
	var desInd=txt.length;
	if (ind!=(txt.length-1) && txt[ind+1]!=' '){
		txt=txt.substring(0,ind+1).concat(' ',txt.substring(ind+1,txt.length));
	}
	if (ind!=0 && txt[ind-1]!=' '){
		txt=txt.substring(0,ind).concat(' ',txt.substring(ind,txt.length));
	}
	desInd=txt.length-desInd;
	return desInd;
}
function agreTokLex(tok, lex){
	tokens[cont]  = tok;
	lexemas[cont] = lex;
}
function agregarTS(txtLex){
	var indNum = txtLex[0].toLowerCase().charCodeAt()-97;
	if(!simbols[indNum]){
		simbols[indNum]=new Array();
		simbols[indNum][0]=txtLex;
	}
	else{
		simbols[indNum][simbols[indNum].length]=txtLex;
	}
	if(!indSim[indNum]){
		indSim[indNum] = new Array();
		indSim[indNum][0] = txt.search(txtLex);
	}
	else{
		indSim[indNum][indSim[indNum].length] = txt.search(txtLex);
	}
}
function LimpiarDatos(){
	tokens=[], lexemas=[], simbols = new Array(), indSim = new Array();
	document.textArea.code.value="";
	LimpiarTablaLex();
	LimpiarTablaSim();
	limGra();
}
function LimpiarTablaLex(){
	var rowsCant = syntaxTable.tBodies[0].rows.length;
	if(rowsCant>0){
		for(var i=rowsCant-1;i>=0;i--)
			syntaxTable.tBodies[0].deleteRow(i);
	}
}
function LlenarTablaLex(cont){
	for(var i=0; i<cont; i++){
		syntaxTable.tBodies[0].insertRow(i);
		syntaxTable.tBodies[0].rows[i].insertCell(0);
		syntaxTable.tBodies[0].rows[i].cells[0].innerHTML = tokens[i];
		syntaxTable.tBodies[0].rows[i].insertCell(1);
		syntaxTable.tBodies[0].rows[i].cells[1].innerHTML = lexemas[i];
	}
}
function LimpiarTablaSim(){
	var rowsCant = simbolsTable.tBodies[0].rows.length;
	if(rowsCant>0){
		for(var i=rowsCant-1;i>=0;i--)
			simbolsTable.tBodies[0].deleteRow(i);
	}
	while(simbolsTable.tHead.rows[0].childNodes.length>2){
		simbolsTable.tHead.rows[0].removeChild( simbolsTable.tHead.rows[0].lastChild )
	}
}
function LlenarTablaSim(){
	var cant=0;
	for(var i=0;i<simbols.length;i++){
		if(simbols[i]){
			cant=Math.max(simbols[i].length,cant);
		}
	}
	for(var i=0;i<cant;i++){
		var thElem=document.createElement('th');
		thElem.appendChild(document.createTextNode('Elem: '+(i+1)));
		simbolsTable.tHead.rows[0].appendChild(thElem);
	}
	for(var i=0; i<26; i++){
		simbolsTable.tBodies[0].insertRow(i);
		simbolsTable.tBodies[0].rows[i].insertCell(0);
		simbolsTable.tBodies[0].rows[i].cells[0].innerHTML = String.fromCharCode(65+i)+' - '+i;
		for(var j=0;j<cant;j++){
			simbolsTable.tBodies[0].rows[i].insertCell(j+1);
			var val='';
			if(simbols[i]&&simbols[i][j]){	
				val=simbolsTable.tBodies[0].rows[i].cells[j+1].innerHTML=simbols[i][j]+' - '+indSim[i][j];
			}
			simbolsTable.tBodies[0].rows[i].cells[j+1].innerHTML=val;
		}		
	}
}
function TablasSimbolos(){
	if(divST.style.display=='none'||divST.style.display==''){
		divST.style.display='block';
		divTL.style.display='block';
	}
	else{
		divST.style.display='none';
		divTL.style.display='none';
	}
}