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

window.addEventListener('load', initializeAnaSin, false);

(function(){
(function(){
	Nodo = function(idArg)
	{
		this.id=idArg;
	};
	Nodo.prototype = {};
})();
extend(Nodo, Array,{});
})();

var com_movimiento;
var com_dibujo;
var arbolDer;
var erros;

function initializeAnaSin(){
	//<com_movimiento>  ::= av | re | gd | gi
	com_movimiento = [ 'av', 're', 'gd', 'gi','centro'];
	com_dibujo = ['mt', 'ot', 'sl', 'bl'];
	erros = [];
}

function AnalisisSintactico(){
	arbolDer = new Nodo('programa');
	var bloquesTkn=[];
	var bloquesLex=[];
	var indPara=0;
	for(var i=0; i < tokens.length; i++){
		if(tokens[i]=='para'){
			if(indPara!=i){
				bloquesTkn = tokens.slice(indPara,i);
				bloquesLex = lexemas.slice(indPara,i);
				arbolDer.push(new Nodo('cuerpo'));
				if(!anaCuerpo(arbolDer[arbolDer.length-1], bloquesTkn, bloquesLex)){	
					return false;
				}
			}
			indPara=i;
		}
		else if(tokens[i]=='fin'){
			bloquesTkn = tokens.slice(indPara,i+1);	
			bloquesLex = lexemas.slice(indPara,i+1);
			arbolDer.push(new Nodo('procedimiento'));
			if(!anaProcedimiento(arbolDer[arbolDer.length-1], bloquesTkn, bloquesLex)){	
				return false;
			}
			indPara=i+1;
		}
		if(i==tokens.length-1 && indPara!=tokens.length){
			bloquesTkn = tokens.slice(indPara,i+1);
			bloquesLex = lexemas.slice(indPara,i+1);
			arbolDer.push(new Nodo('cuerpo'));
			if(!anaCuerpo(arbolDer[arbolDer.length-1], bloquesTkn, bloquesLex)){	
				return false;
			}			
		}
	}
	return true;
}
function anaProcedimiento(NodoPadre, pilaTkn, pilaLxm){
	var idEF=pilaTkn.length-1;
	
	if(pilaTkn.length >=5 && pilaTkn[0]=='para' && pilaTkn[1]=='id' && pilaTkn[idEF]=='fin'){
		NodoPadre.push({tkn: pilaTkn[0], lxm: pilaLxm[0]});
		NodoPadre.push({tkn: pilaTkn[1], lxm: pilaLxm[1]});
		NodoPadre.push(new Nodo('argumentos'));
		
		cantArgs=cantArgumentos(pilaTkn.slice(2,idEF));
		anaArgumentos(NodoPadre[NodoPadre.length-1], pilaTkn.slice(2,2+(cantArgs*2)), pilaLxm.slice(2,2+(cantArgs*2)));
		
		NodoPadre.push(new Nodo('cuerpo'));
		NodoPadre.push({tkn: pilaTkn[idEF], lxm: pilaLxm[idEF]});
		if(idEF>4){
			if(!anaCuerpo(NodoPadre[3], pilaTkn.slice(2+(cantArgs*2),idEF), pilaLxm.slice(2+(cantArgs*2),idEF))){
				return false;
			}
		}
	}
	else{
		return false;
	}
	return true;
}
function anaArgumentos(NodoPadre, pilaTkn, pilaLxm){
	if(!pilaTkn.length==0){
	
	}
	return true;
}

function anaCuerpo(NodoPadre, pilaTkn, pilaLxm){
	var sentnTkn;
	var sentnLex;
	var indCMov=0;
	for(var i=0;i<pilaTkn.length;i++){
		if(pilaTkn[i]=='repite'){
			if(indCMov!=i){
				sentnTkn = pilaTkn.slice(indCMov,i);
				sentnLex = pilaLxm.slice(indCMov,i);
				NodoPadre.push(new Nodo('sentencia'));
				if(anaSentencia(NodoPadre[NodoPadre.length-1], sentnTkn, sentnLex)){
					sentnTkn=[];
					sentnLex=[];
				}
				else{
					return false;
				}
			}
			var ind=-1;
			if((ind=buscarSig(pilaTkn,i,'c1'))!=-1){
				indCMov=ind+1;
				sentnTkn = pilaTkn.slice(i,indCMov);	
				sentnLex = pilaLxm.slice(i,indCMov);
				NodoPadre.push(new Nodo('bucleRe'));
				i=indCMov;
				if(anaBucleRe(NodoPadre[NodoPadre.length-1], sentnTkn, sentnLex)){
					sentnTkn=[];
					sentnLex=[];
				}
				else{
					return false;
				}
			}
			else{
				return false;
			}
		}
		else if(esComMov(pilaTkn[i])!=-1){
			if(indCMov!=i){
				sentnTkn = pilaTkn.slice(indCMov,i);
				sentnLex = pilaLxm.slice(indCMov,i);
				NodoPadre.push(new Nodo('sentencia'));
				if(anaSentencia(NodoPadre[NodoPadre.length-1], sentnTkn, sentnLex)){
					sentnTkn=[];
					sentnLex=[];
				}
				else{
					return false;
				}
			}
			indCMov=i;
		}
		else if(esComDib(pilaTkn[i])!=-1){
			if(indCMov!=i){
				sentnTkn = pilaTkn.slice(indCMov,i);
				sentnLex = pilaLxm.slice(indCMov,i);
				NodoPadre.push(new Nodo('sentencia'));
				if(anaSentencia(NodoPadre[NodoPadre.length-1], sentnTkn, sentnLex)){
					sentnTkn=[];
					sentnLex=[];
				}
				else{
					return false;
				}
			}
			indCMov=i;
		}
		else if(esIdFunc(pilaTkn[i], pilaLxm[i])){
			if(indCMov!=i){
				sentnTkn = pilaTkn.slice(indCMov,i);
				sentnLex = pilaLxm.slice(indCMov,i);
				NodoPadre.push(new Nodo('sentencia'));
				if(anaSentencia(NodoPadre[NodoPadre.length-1], sentnTkn, sentnLex)){
					sentnTkn=[];
					sentnLex=[];
				}
				else{
					return false;
				}
			}
			indCMov=i;
		}
		else if(pilaTkn[i]=='ponpos'){
			if(indCMov!=i){
				sentnTkn = pilaTkn.slice(indCMov,i);
				sentnLex = pilaLxm.slice(indCMov,i);
				NodoPadre.push(new Nodo('sentencia'));
				if(anaSentencia(NodoPadre[NodoPadre.length-1], sentnTkn, sentnLex)){
					sentnTkn=[];
					sentnLex=[];
				}
				else{
					return false;
				}
			}
			indCMov=i;
		}
		if(i==pilaTkn.length-1 && indCMov!=pilaTkn.length){
			sentnTkn = pilaTkn.slice(indCMov,i+1);
			sentnLex = pilaLxm.slice(indCMov,i+1);
			NodoPadre.push(new Nodo('sentencia'));
			if(anaSentencia(NodoPadre[NodoPadre.length-1], sentnTkn, sentnLex)){
				sentnTkn=[];
				sentnLex=[];
			}
			else{
				return false;
			}
		}
	}
	return true;
}

function anaBucleRe(NodoPadre, pilaTkn, pilaLxm){
	var idUE=pilaTkn.length-1;
	if( pilaTkn.length >=4 && pilaTkn[0]=='repite' && pilaTkn[1]=='nu' && pilaTkn[2]=='c0' && pilaTkn[idUE]=='c1'){
		NodoPadre.push({tkn: pilaTkn[0], lxm: pilaLxm[0]});
		NodoPadre.push({tkn: pilaTkn[1], lxm: pilaLxm[1]});
		NodoPadre.push({tkn: pilaTkn[2], lxm: pilaLxm[2]});
		NodoPadre.push(new Nodo('cuerpo'));
		if(!anaCuerpo(NodoPadre[NodoPadre.length-1], pilaTkn.slice(3,idUE), pilaLxm.slice(3,idUE))){
			return false;
		}
		NodoPadre.push({tkn: pilaTkn[idUE], lxm: pilaLxm[idUE]});
			
	}
	return true;
}

function anaSentencia(NodoPadre, pilaTkn, pilaLxm){
	//<movimiento>      ::= <com_movimiento> <exp_numerica> | <centro>
	if(pilaTkn.length == 1){
		if(esIdFunc(pilaTkn[0], pilaLxm[0])){	
			NodoPadre.push({tkn: pilaTkn[0], lxm: pilaLxm[0]});
		}
		else{
			switch(pilaTkn[0]){
				case 'centro':
				case 'mt':
				case 'ot':
				case 'sl':
				case 'bl':
					NodoPadre.push({tkn: pilaTkn[0], lxm: pilaLxm[0]});
				break;
				default:
					return false;
			}
		}
	}
	else{
		var exSent=false;
		for(var i=0;i<com_movimiento.length;i++){
			if(pilaTkn[0]==com_movimiento[i]){
				if(exp_numerica(pilaTkn.slice(1))){
					for(var j=0;j<pilaTkn.length;j++){
						NodoPadre.push({tkn: pilaTkn[j], lxm: pilaLxm[j]});
					}
				}
				else{
					return false;
				}
				i=com_movimiento.length;
				exSent=true;
			}
		}
		if(!exSent){
			erros.push('Error en sentencia: '+pilaLxm.join(' '))
			return false;
		}
	}
	return true;
}

function exp_numerica(pila){
//<exp_numerica > ::= <exp_numerica ><op_nu> <exp_numerica > | <id> | <nu>
	if(pila.length==1){
		if(pila[0]=='id'){
			return true;
		}
		if(pila[0]=='nu'){
			return true;
		}
	}
	else{
		return false;
	}
}

function esComMov(com){
	for(var i=0;i<com_movimiento.length;i++){
		if(com==com_movimiento[i]){
			return i;
		}
	}
	return -1;
}

function esComDib(com){
	for(var i=0;i<com_dibujo.length;i++){
		if(com==com_dibujo[i]){
			return i;
		}
	}
	return -1;
}
function esIdFunc(tkn, lxm){
	if(tkn=='id'){
		var esId=false;
		var indNum = lxm[0].toLowerCase().charCodeAt()-97;
		if(simbols[indNum]){
			for(var i=0;i<simbols[indNum].length;i++){
				if(simbols[indNum][i]==lxm){
					esId=true;
				}
			}
		}
		if(!esId){
			return false;
		}
	}else{
		return false;
	}
	return true;
}
function esSimTip(simbolo, tipo){
	
}
function buscarSig(pilaTkn,ind,tkn){
	for(var i=ind;i<pilaTkn.length;i++){
		if(pilaTkn[i]==tkn){
			return i;
		}
	}
	return -1;
}
function cantArgumentos(pilaTkn){
	var cant=0;
	var i=0;
	while(i<pilaTkn.length-1){
		if(pilaTkn[i]=='dp' && pilaTkn[i+1]=='id'){
			cant++;
			i=i+2;
		}
		else{
			i=pilaTkn.length-1;
		}
	}
	return cant;
	
}