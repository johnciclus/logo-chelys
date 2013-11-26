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

window.addEventListener('load', initializeAnaSem, false);

var k3dmain;
var ubiX, ubiY, ubiZ, ang;
var rel;

var newScript;
var codigo;

var mostrar=true;
var lapiz=true;

function initializeAnaSem(){
	
	var canvas = document.getElementById('canvas');
	k3dmain = new K3D.Controller(canvas);
	k3dmain.frame();
	k3dmain.paused = false;
	
	ubiX = 0, ubiY = 0, ubiZ = 0, ang=90;
	rel = 380/400;
	
	mostrarTor();
}

function AnalisisSemantico(){
	ubiX = 0, ubiY = 0, ubiZ = 0, ang=90;
	
	bp();
	k3dmain.objects.pop();
	
	codigo="";
	recorrerDer(arbolDer);
    var head = document.getElementsByTagName("head")[0];
	newScript = document.createElement('script');
	newScript.type = 'text/javascript';
	newScript.src = 'scripts/eval.js';
	head.appendChild(newScript);	
	return true;
}
function Ejecutar(){
	if(AnalisisLexico()){
		if(AnalisisSintactico()){
			if(!AnalisisSemantico()){
				alert('Error en analizador semantico');
			}
		}
		else{
			alert('Error en analizador sintactico');
		}
	}
	else{
		alert('Error en analizador lexico');
	}
}
function polToCar(x, y, a){
	var ca = Cos(RAD*a);
	var sa = Sin(RAD*a);
	var nx = x*ca - y*sa;
	var ny = x*sa + y*ca;
	return {nX: nx, nY: ny};
}

var indBu=[];

function recorrerDer(Nodo){
	var tkns=[];
	var lxms=[];
	for(var i=0; i<Nodo.length; i++){
		if(Nodo[i].id){
			switch(Nodo[i].id){
				case 'programa':
					recorrerDer(Nodo[i]);
				break;
				case 'cuerpo':
					recorrerDer(Nodo[i]);
				break;
				case 'procedimiento':
					codigo+='function '+Nodo[i][1].lxm+'(';
					recorrerDer(Nodo[i][2]);
					codigo+='){ ';
					recorrerDer(Nodo[i][3]);
					codigo+='} ';
				break;
				case 'argumentos':
					alert("ingreso a argumentos");
				break;
				case 'bucleRe':
					indBu.push(String.fromCharCode(105+indBu.length));
					var ind=indBu[indBu.length-1];
					codigo+='for(var '+ind+'=0;'+ind+'<'+Nodo[i][1].lxm+';'+ind+'++){ '
					recorrerDer(Nodo[i][3]);
					codigo+='} ';
					indBu.pop();
				break;
				case 'sentencia':
					for(var j=0; j<Nodo[i].length; j++){
						tkns.push(Nodo[i][j].tkn);
						lxms.push(Nodo[i][j].lxm);	
					}
					codigo+=codSentencia(tkns, lxms)+' ';
					tkns=[];
					lxms=[];
				break;
			}
		}
	}
}

function mostrarTor(){
	if(mostrar){
		var pAux;
		var points = [], edges = [], polys = [];
		pAux = polToCar(-10, 0, ang-90);	
		points.push({x: ubiX+pAux.nX, y: ubiY+pAux.nY, z: ubiZ});
		
		pAux = polToCar(0, 20*Sin(RAD*60), ang-90);	
		points.push({x: ubiX+pAux.nX, y: ubiY+pAux.nY, z: ubiZ});
		
		pAux = polToCar(10, 0, ang-90);	
		points.push({x: ubiX+pAux.nX, y: ubiY+pAux.nY, z: ubiZ});
		
		var obj = new K3D.K3DObject();
		obj.drawmode = "wireframe";
		obj.color = [0, 0, 0];
		obj.scale = rel;
		obj.init(
			points,
			[{a:0,b:1}, {a:1,b:2}, {a:2,b:0}],
			[{color:[255,0,0],vertices:[0,1,2]}]
		);
		k3dmain.addK3DObject(obj);
	}
		k3dmain.frame();
}
function av(dist){
	var dX=dist*Cos(RAD*ang), dY=dist*Sin(RAD*ang), dZ=0;
	if(lapiz){
		var obj = new K3D.K3DObject();
		obj.drawmode = "wireframe";
		obj.color = [0, 0, 0];
		obj.scale = rel;
		obj.init(
			[{x: ubiX, y: ubiY, z:ubiZ},{x: ubiX+dX, y: ubiY+dY, z:ubiZ+dZ}],
			[{a:0,b:1}],
			[]
		);
		k3dmain.addK3DObject(obj);
	}
	ubiX+=dX;
	ubiY+=dY;	
	ubiZ+=dZ;
}
function re(dist){
	var dX=dist*Cos(RAD*ang), dY=dist*Sin(RAD*ang), dZ=0;
	if(lapiz){
		var obj = new K3D.K3DObject();
		obj.drawmode = "wireframe";
		obj.color = [0, 0, 0];
		obj.scale = rel;
		obj.init(
			[{x: ubiX, y: ubiY, z:ubiZ},{x: ubiX-dX, y: ubiY-dY, z:ubiZ-dZ}],
			[{a:0,b:1}],
			[]
		);
		k3dmain.addK3DObject(obj);
	}
	ubiX-=dX;
	ubiY-=dY;	
	ubiZ-=dZ;
}
function centro(){
	ubiX = 0, ubiY = 0, ubiZ = 0, ang=90;
}
function gd(angGiro){
	ang-=angGiro;
}
function gi(angGiro){
	ang+=angGiro;
}
function bp(){
	var cant=k3dmain.objects.length;
	for(var i=0;i<cant;i++){
		k3dmain.objects.pop();
	}
	centro();
	mt();
}
function mt(){
	mostrar=true;
}
function ot(){
	mostrar=false;
}
function bl(){
	lapiz=true;
}
function sl(){
	lapiz=false;
}

function codSentencia(tknsArg, lxmsArg){
	var cod;
	if(tknsArg[0]!='id'){
		cod=tknsArg[0]+'(';
	}else{
		cod=lxmsArg[0]+'(';
	}
	for(var i=1; i<tknsArg.length-1; i++){
		cod+=lxmsArg[i]+',';
	}
	for(var i=1; i<tknsArg.length; i++){
		cod+=lxmsArg[i];
	}
	cod+=');'
	
	return cod;
}

function ejemplo(nombre){
	var cod='';
	switch(nombre){
		case 'Triangulo':
			cod='gd 30'+
			'\nrepite 3 [av 150 gd 120]';
		break;
		case 'Cuadrado':
			cod='para cuadrado'+
			'\nrepite 4 [av 100 gd 90]'+
			'\nfin'+
			'\ncuadrado';
		break;
		case 'Hexagono':
			cod='repite 6 [av 80 gd 60]';
		break;
		case '360-gono':
			cod='sl'+
			'\nav 100'+
			'\ngd 90'+
			'\nbl'+
			'\nrepite 360 [av 2 gd 1]';
		break;
		case 'Casa':
			cod='av 100'+
			'\ngd 90'+
			'\nav 100'+
			'\nre 100'+
			'\ngi 90'+
			'\ngd 30'+
			'\nav 100'+
			'\ngd 120'+
			'\nav 100'+
			'\ngd 30'+
			'\nav 100'+
			'\ngd 90'+
			'\nav 100'+
			'\nre 30'+
			'\ngd 90'+
			'\nav 50'+
			'\ngd 90'+
			'\nav 40'+
			'\ngd 90'+
			'\nav 50'+
			'\ncentro';
		break;
		case 'Molino':
			cod='sl'+
			'\nre 30'+
			'\ngd 90'+
			'\nre 30'+
			'\ngi 90'+
			'\nbl'+
			'\nrepite 8 [ av 100 gd 90 av 50 gd 45]'+
			'\not'
		break;
		case 'Rombo':
			cod='para cuadrado'+
			'\nrepite 4 [av 100 gd 90]'+
			'\nfin'+
			'\ncuadrado'+
			'\nrepite 24['+
			'\ngd 15'+
			'\ncuadrado]'+
			'\not';
		break;
		case 'Figura_3D':
			cod='sl'+
			'\nav 100 gi 90 av 50'+ 
			'\nbl'+
			'\ngd 135 av 50  gd 45  av 50  gd 135 av 50'+
			'\ngd 45  av 50  gi 90  av 50  gd 90  av 50'+
			'\ngd 135 av 50  gd 45  av 15  gd 90  av 36'+
			'\ngi 90  av 100 gi 45  av 50  gi 135 av 50'+
			'\ngd 90  av 50  re 25  gd 90  av 25  gd 90'+
			'\nav 25  gi 180 av 25  gi 135 av 84  gd 135'+
			'\nav 50  re 50  gi 180 av 100 gi 135 av 35'+
			'\ngi 45  av 25  gi 90  av 25  re 50  gd 90'+
			'\nav 50  gd 45  av 50  gd 135 av 50  gd 45'+
			'\nav 50  gd 45  av 50  gi 90  av 50  gd 90'+
			'\nav 50  gd 90  av 25  gi 90  av 25  gd 90'+
			'\nav 25  gi 90  av 25  gd 90  av 50  gd 90'+
			'\nav 50  gd 135 av 36  gi 45  av 50  gi 90'+
			'\nav 50  gi 90  av 50  gi 90  av 50  re 50'+
			'\ngd 135 av 36  re 36  gd 135 av 50  gi 135'+
			'\nav 36'+ 
			'\not';
		break;
		case 'Dona':
			cod='sl'+
			'\nav 20'+
			'\ngd 90'+
			'\nbl'+
			'\npara circulo'+
			'\nrepite 36[av 10 gd 10]'+
			'\nfin'+
			'\nrepite 40[circulo gd 9]'+
			'\not';
		break;
	}
	document.textArea.code.value=cod;
	Ejecutar();
}