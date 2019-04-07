	// Recuperation du canvas
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

	// Taille du canvas
canvas.width = 500;
canvas.height = 500;

// Variable pour lancement des monstres (si joueur 1 ou pas)
let intervalMonstres = new Boolean(false);


	// Fonction appellé au chargement de la page
function onLoad(){

	// Fonction pour créer les boucliers sous forme d'objets
createBouclier();
	// Fonction pour créer les monstres sous forme d'objets
createMonstre();
	// Jouer les sons du début
moteur.play();
fond.play();


}


	// Fusee 1
let fusee1img = new Image();
fusee1img.src="img/fusee.png";
let fusee1 = {x:0, y:canvas.height-50, width:50, height:50};
	// Vies de la fusee 1
let lifeFusee1 = 200;

	// Fusee 2
let fusee2img = new Image();
fusee2img.src = "img/fusee2.png";
let fusee2 = {x:canvas.width/2, y:0, width:50, height:50};
	// Vies de la fusee2
let lifeFusee2 = 200;

	// Missiles
	// Nombre de missiles
let MissileNumbera = 0;
let MissileNumberb = 0;
	// Listes des missiles actuels
let listeMissileA = [];
let listeMissileB = [];
	// taille des Missiles
let missileSize=9.3;
	// Nombre de missile actifs
let missileMinA = 1;
let missileMinB = 1;
	// Images des missiles
let missileImg1 = new Image();
missileImg1.src = "img/missileImg1.png";

let missileImg2 = new Image();
missileImg2.src = "img/missileImg2.png";

// Boucliers
	// Nombre de boucliers
let bouclierNumber = 0;
let bouclierSize = 14;
	// Liste des boucliers encore présents
let bouclierListe = [];

// Image du bouclier
let bouclierImg = new Image();
bouclierImg.src = "img/bouclierImg.JPG";

	// Image des monstres
let monstreImg = new Image();
monstreImg.src = "img/monstre.png";
	// Boolean si des monstres sont encore présents
let monstresAlive = new Boolean(true);

	// Barres de vie
let healthBar1 = document.getElementById("healthBar1");
let healthBar2 = document.getElementById("healthBar2");
	// Vie des barres
let vieBarre1 = 500;
let vieBarre2 = 500;
let vieBarre1Max = 500;
let vieBarre2Max = 500;
	// Degats des fusees
let degatsFusee1 = 25;
let degatsFusee2 = 25;
	// Valeurs des attaques spéciales
let valeurSpecial1 = 0;
let valeurSpecial2 = 0;
	// Barre des speciales
let specialBar1 = document.getElementById('specialBar1');
let specialBar2 = document.getElementById('specialBar2');

	// Audio
let tir = new Audio("sons/tir.mp3");
let fond = new Audio("sons/fond.mp3");
let moteur = new Audio("sons/debut.mp3");


// Rafraichissement du canvas
let fps = setInterval(clearCanvas, 5);


/************	Evenements des touches	************/


	// liste des touches enfoncées
let touches = [];
	// Ajouter la touche à la liste
window.addEventListener("keydown", function(e){
	


	// Switch des differentes touches
	switch(e.key){
				// Touche Z
			case "z":
			if(touches.includes("z") == false && numeroJoueur == 2){
				touches.push("z");
				socket.emit('caseIn', e.key);	
			}
			break;

				// Touche A
			case "a":
			if(touches.includes("a") == false && numeroJoueur == 2){
				touches.push("a");
				socket.emit('caseIn', e.key);
			}
			break;

				// Fleche de gauche
			case "ArrowLeft":
			if(touches.includes("ArrowLeft") == false && numeroJoueur == 1){
				touches.push("ArrowLeft");
				socket.emit('caseIn', e.key);
			}
			break;

				// Fleche de droite
			case "ArrowRight":
			if(touches.includes("ArrowRight") == false && numeroJoueur == 1){
				touches.push("ArrowRight");
				socket.emit('caseIn', e.key);
			}
			break;

				// Fleche du haut (ulti)
			case "ArrowUp":
			if(valeurSpecial1 >= 10 && numeroJoueur == 1){
				useSpecial(1, 4);
				specialBarre(1);
			}
			break;

				// Fleche du bas (ulti)
			case "ArrowDown":
			if(valeurSpecial1 >= 10 && numeroJoueur == 1){
					// Appel de la fonction pour réinitialiser l'ulti
				useSpecial(1, 3);
					// Actualiser la barre de progression speciale
				specialBarre(1);
					// Acutaliser la barre de vie
				degatsBarre(1,0);
			}
			break;

			case "q":
			if(valeurSpecial2 >= 10 && numeroJoueur == 2){
				useSpecial(2, 3);
				specialBarre(2);
				degatsBarre(2,0);
			}
			break;

			case "s":
			if(valeurSpecial2 >=10 && numeroJoueur == 2){
				useSpecial(2, 4);
				specialBarre(2);
			}
			break;
			

			
	}

})


	// Retirer la touche de la liste
window.addEventListener("keyup", function(e){
	
	switch(e.key){
		// Touche Z
		case "z":
			touches.splice(touches.indexOf("z"), 1);
			socket.emit('caseOut', "z");
		break;
		// Touche A
		case "a":
			touches.splice(touches.indexOf("a"), 1);
			socket.emit('caseOut', "a");
		break;
		// Fleche de gauche
		case "ArrowLeft":
			touches.splice(touches.indexOf("ArrowLeft"), 1);
			socket.emit('caseOut', "ArrowLeft");
			socket.emit('position', fusee1);
		break;
		// Bas2
		case "ArrowRight":
			touches.splice(touches.indexOf("ArrowRight"), 1);
			socket.emit('caseOut', "ArrowRight");
			socket.emit('position', fusee1);
		break;

	}
})
/************	Evenements des touches	************/

	// Appel de la fonction move
let moveInterval = setInterval(move, 1);
	// Vitesse de la fusée
let fuseeSpeed = 1;
	// Vitesse des monstres
let monstreSpeed = -1;

/********* Fonction move pour faire bouger les elements *********/
function move(){
		// Fleche de gauche
	if(fusee1.x > 0){
		if(touches.includes("ArrowLeft")){
			fusee1.x -= fuseeSpeed;
		}
			}

			// Fleche de droite
	if(fusee1.x < canvas.width-fusee1.width){
		if(touches.includes("ArrowRight")){
			fusee1.x += fuseeSpeed;
		}
			}

			// Touche A
	if (fusee2.x >0){
		if(touches.includes("a")){
			fusee2.x -= fuseeSpeed;

		}
			}

			// Touche Z
	if(fusee2.x < canvas.width  - fusee2.width){
		if(touches.includes("z")){
			fusee2.x += fuseeSpeed;

		}
			}
			
			// Déplacement des monstres
			// Collisions avec le canvas
let petitMonstre;
let grandMonstre;
			// Si il existe encore des monstres alors la variable = true
	if(monstreListe.length > 0){
		monstresAlive = true;
	}else{
		monstresAlive = false;
	}
			// Vérifier si il y a encore des monstres
	if(monstresAlive == true){
				// Vérifier si il y a encore des monstres sur la ligne du bas
			if(monstresBas.length > 0){
					// Définir quel monstre est le plus a gauche (la plus petite valeur)
				if(monstresBas[0] > monstresHaut[0] - monstreNumber/2){
					petitMonstre = monstresHaut[0];
					
				}else{
					petitMonstre = monstresBas[0];
					
				}
			}else{
					// Si il n'y a plus de monstres en bas alors le plus petit est en haut
				petitMonstre = monstresHaut[0];	
				
			}
				// Vérifier si il y a des monstres en bas
			if(monstresBas.length !=0){
					// Enlever le nombre maximum de monstres au dernier dans la liste la ligne pour voir lequel est le plus a droite (la plus grand valeur est le plus a droite)
				if(monstresBas[(monstresBas.length - 1)] - monstreNumber/2 >= monstresHaut[monstresHaut.length-1] - monstreNumber){
					grandMonstre = monstresBas[monstresBas.length-1];
				}else{
					grandMonstre = monstresHaut[monstresHaut.length-1];
				}
				if(monstresHaut.length == 0){
					grandMonstre = monstresBas[monstresBas.length-1];
				}
			}else{
				grandMonstre = monstresHaut[monstresHaut.length-1];
			}

			// Collisions des monstres avec le canvas
	eval("if(monstre"+petitMonstre+".x < 0 ){monstreSpeed = 1}");
	eval("if(monstre"+grandMonstre+".x + monstreSize > canvas.width){monstreSpeed = -1}");
			// Ajout de la valeur de la vitesse aux monstres encore présents
	monstreListe.forEach(function(element){
		eval("monstre"+element+".x += monstreSpeed");
		})		
	}
	
		

}

/********* Fonction move pour faire bouger les elements *********/



/************	Fonction draw	************/

// Dessiner les élements du jeu
function draw(){

	// Dessin de la fusée 1
ctx.drawImage(fusee1img, 20, 20, 1000, 1000, fusee1.x, fusee1.y, 50, 50);
	// Dessin de la fusée 2
ctx.drawImage(fusee2img, 20, 20, 1000, 1000, fusee2.x, fusee2.y, 50, 50);
	// drawImage(image, sx, sy, sLargeur, sHauteur, dx, dy, dLargeur, dHauteur);

	// Dessin des missiles a et collisions
	listeMissileA.forEach(function(i){
				// Dessin des missiles a (fusee1)
			eval("ctx.drawImage(missileImg1, 0, 0, 146, 330, missilea"+i+".x, missilea"+i+".y, 9.3, 18.5)");
				// Deplacement des missiles
			eval("missilea"+i+".y-=3");
				// Collision des missiles a sur fusée 2
			eval("if(missilea"+i+".x + 9.3/2 > fusee2.x && missilea"+i+".x + 9.3/2 < fusee2.x +50 && missilea"+i+".y < fusee2.y + 35){collisiona(i);}")
				// Enlever la prise en compte du missile qui sort du canvas ou qui touche la fusée
			eval("if(missilea"+i+".y + 18.5 < 0){missileMinA +=1; listeMissileA.splice(listeMissileA.indexOf(i), 1)}");
				// Collisons des misisles a sur les boucliers
			bouclierListe.forEach(function(element){
				eval("if(missilea"+i+".x + missileSize/2 >= bouclier"+element+".x && missilea"+i+".x + missileSize/2 <= bouclier"+element+".x + bouclierSize && missilea"+i+".y <= bouclier"+element+".y){collisionMissileaBouclier(element, i);}");
			})
				// Collisions des missiles a sur les monstres
			if(mancheActuel == "pve"){
			monstreListe.forEach(function(element){
				eval("if(missilea"+i+".x >= monstre"+element+".x && missilea"+i+".x <= monstre"+element+".x + monstreSize && missilea"+i+".y <= monstre"+element+".y + monstreSize && missilea"+i+".y >= monstre"+element+".y){collisionMissileaMonstre(element, i)}");
			})}
		
		})	


	

	// Dessin des missiles b et collisions
	listeMissileB.forEach(function(i){
				// Dessin des missiles b (fusee1)
			eval("ctx.drawImage(missileImg2, 0, 0, 146, 330, missileb"+i+".x, missileb"+i+".y, 9.3, 18.5)");
				// Deplacement des missiles
			eval("missileb"+i+".y+=3");
				// Collisions des missiles b sur la fusee 1
			eval("if(missileb"+i+".x + 9.3/2 > fusee1.x && missileb"+i+".x + 9.3/2 < fusee1.x +50 && missileb"+i+".y + 18.5 > fusee1.y + 25){collisionb(i);}")
				//Enlever la prise en compte du missile qui sort du canvas ou qui touche la fusée
			eval("if(missileb"+i+".y > canvas.height){missileMinB +=1; listeMissileB.splice(listeMissileB.indexOf(i), 1)}");
				// Collisions des missiles b sur les boucliers   
			bouclierListe.forEach(function(element){
				eval("if(missileb"+i+".x + missileSize/2 >= bouclier"+element+".x && missileb"+i+".x + missileSize/2 <= bouclier"+element+".x + bouclierSize && missileb"+i+".y + missileSize >= bouclier"+element+".y){collisionMissilebBouclier(element, i);}");
			})
				// Collisions des missibles b sur les monstres
			if(mancheActuel == "pve"){
			monstreListe.forEach(function(element){
				eval("if(missileb"+i+".x >= monstre"+element+".x && missileb"+i+".x <= monstre"+element+".x + monstreSize && missileb"+i+".y >= monstre"+element+".y && missileb"+i+".y <= monstre"+element+".y + monstreSize){collisionMissilebMonstre(element, i)}");
			})}

	})
	
	
	// Dessin des boucliers
	bouclierListe.forEach(function(element){
		eval("ctx.drawImage(bouclierImg, 0,0, bouclierSize, bouclierSize, bouclier"+element+".x, bouclier"+element+".y, bouclierSize, bouclierSize)");
		
	})

	// Dessin des monstre
	if(mancheActuel == "pve"){
	monstreListe.forEach(function(element){
		eval("ctx.drawImage(monstreImg, 0, 0, monstreImg.width, monstreImg.height, monstre"+ element +".x, monstre"+ element +".y, monstreSize, monstreSize)");
	})}


	
	
}
/************	Fonction draw	************/

function clearCanvas(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	draw();
	

}




/************	Constructeur de missiles	************/

function Missile(x, y){
	this.x = x;
	this.y = y;
}

function createMissile1(){
	MissileNumbera +=1;
	eval("missilea" + MissileNumbera + " = new Missile(fusee1.x+fusee1.width/2-missileSize/2, fusee1.y - missileSize)");
	listeMissileA.push(MissileNumbera);
	if(numeroJoueur == 1){socket.emit('tir1');}
	tir.play();

}

function createMissile2(){
	MissileNumberb +=1;
	eval("missileb" + MissileNumberb + " = new Missile(fusee2.x+fusee2.width/2-missileSize/2, fusee2.y + fusee2.width)");
	listeMissileB.push(MissileNumberb);
	if(numeroJoueur == 1){socket.emit('tir2');}
	
}
	// Faire tirer les missiles tout seuls
let intervalMissile1;
let intervalMissile2;


/************	Constructeur de missiles	************/

/************	Fonctions pour les collisions	************/
	// Collisions missiles sur fusee
function collisiona(i){
	missileMinA +=1;
	lifeFusee1 -=1;
	listeMissileA.splice(listeMissileA.indexOf(i), 1);
	degatsBarre(2, degatsFusee2);
	
}

function collisionb(i){
	missileMinB +=1;
	lifeFusee2 -=1;
	listeMissileB.splice(listeMissileB.indexOf(i), 1);
	degatsBarre(1, degatsFusee1);
}



/************	Fonctions pour les collisions	************/

/************	Constructeur de boucliers	************/

function Bouclier(x, y, size){
	this.x = x;
	this.y = y;
	this.size = size;
}

function createBouclier(){
		// variables pour repérer les boucliers
	let let1 = 1;
	let let2 = 2;
	let let3 = 3;
	let let4 = 4;

	
		// Pourcentage pour la position du premier bouclier
	let pos = 0.165;
	let height = 0.75;
		// Boucle for pour creer les 24 boucliers
	for (let i = 1; i < 25; i++) {
		bouclierNumber +=1;
		bouclierListe.push(i);
		if(i == 5){
			let1 = 5;
			let2 = 6;
			let3 = 7;
			let4 = 8;
			pos += 0.33;
		}
		if(i == 9){
			let1 = 9;
			let2 = 10;
			let3 = 11;
			let4 = 12;
			pos += 0.33;
		}
		if(i == 13){
			pos = 0.165;
			height = 0.25 - (bouclierSize/canvas.height);
			let1 = 13;
			let2 = 14;
			let3 = 15;
			let4 = 16;
		}
		if(i == 17){
			pos += 0.33;
			let1 = 17;
			let2 = 18;
			let3 = 19;
			let4 = 20;
		}
		if(i == 21){
			pos += 0.33;
			let1 = 21;
			let2 = 22;
			let3 = 23;
			let4 = 24;
		}

		if(i == let1){
				eval("bouclier"+ i +" = new Bouclier(canvas.width*"+ pos +"- bouclierSize, canvas.height*"+height+", bouclierSize)");
		}
		if(i == let2){
				eval("bouclier"+ i + " = new Bouclier(bouclier"+ let1 + ".x + bouclierSize, bouclier"+ let1 + ".y, bouclierSize)");
		}
		if(i == let3){
				eval("bouclier"+ i + "= new Bouclier(bouclier"+ let1 + ".x, bouclier"+ let1 + ".y + bouclierSize, bouclierSize)");
		}
		if(i == let4){
				eval("bouclier"+ i+ " = new Bouclier(bouclier"+ let2 + ".x, bouclier" + let3 + ".y, bouclierSize)");
		}
		

	}



}


function collisionMissilebBouclier(element, i){
	bouclierNumber -=1;
	listeMissileB.splice(listeMissileB.indexOf(i), 1);
		// Retirer de la liste le bouclier
	bouclierListe.splice(bouclierListe.indexOf(element), 1);
	missileMinB +=1;
}

function collisionMissileaBouclier(element, i){
	bouclierNumber -=1;
	listeMissileA.splice(listeMissileA.indexOf(i), 1);
		// Retirer de la liste le bouclier
	bouclierListe.splice(bouclierListe.indexOf(element), 1);
	missileMinA +=1;
}

/************	Constructeur de boucliers	************/


/************	Etat du jeu	************/
	// Timer pour changer les manches
let intervalJeu = setInterval(etatJeu, 1000);
	// Temps actuel
let tempsJeu = 0;
	// Durée entre les manches en secondes
let tempsManche = 15;
	// Nombre de manches
let mancheNumber = 1;
	// Manche actuelle
let mancheActuel = "pvp";

function etatJeu(){
	if(numeroJoueur == 1){
		tempsJeu +=1;
		if(tempsJeu == tempsManche){
			mancheNumber +=1;
			tempsJeu =0;
			if(mancheNumber%2 == 0){
				mancheActuel = "pve";
				socket.emit('manches', mancheActuel);
				deleteMonstre();

			}else{
				mancheActuel = "pvp";
				socket.emit('manches', mancheActuel);

			}

		}
	}
}

/************	Etat du jeu	************/

/************	Constructeur de monstres	************/
let monstreNumber = 16;
let monstreSize = 25;
let monstreMarge = 15;
let monstreListe = [];
	// Monstres du bas
let monstresBas = [];
	// Monstres du haut
let monstresHaut = [];


function Monstre(x, y, size,){
	this.x = x;
	this.y  = y;
	this.size = size;

}

function createMonstre(){
	for(index = 1; index != monstreNumber + 1; index++){
		if(index == 1){
			eval("monstre"+index+" = new Monstre(canvas.width/2 - monstreMarge* monstreNumber/4 - monstreSize* monstreNumber/4, canvas.height/2 - monstreMarge, monstreSize)");
		}else if(index == monstreNumber/2+1){
			eval("monstre"+index+" = new Monstre(monstre1.x, canvas.height/2+ monstreMarge + monstreSize, monstreSize)");
		}else{
			eval("monstre"+index+" = new Monstre(monstre"+ (index-1) +".x + monstreMarge + monstreSize, monstre"+ (index - 1) +".y, monstreSize)");
		}
		monstreListe.push(index);
		if(index <= monstreNumber/2){
			monstresBas.push(index);
		}else{
			monstresHaut.push(index);
		}
	} 
}
function deleteMonstre(){

	monstreListe = [];
	monstresBas = [];
	monstresHaut = [];

	for(index = 1; index != monstreNumber + 1; index++){
		if(index == 1){
			eval("monstre"+index+" = {x: canvas.width/2 - monstreMarge* monstreNumber/4 - monstreSize* monstreNumber/4, y: canvas.height/2 - monstreMarge, size: monstreSize}");
		}else if(index == monstreNumber/2+1){
			eval("monstre"+index+" = {x:monstre1.x, y: canvas.height/2+ monstreMarge + monstreSize, size: monstreSize}");
		}else{
			eval("monstre"+index+" = {x: monstre"+ (index-1) +".x + monstreMarge + monstreSize, y: monstre"+ (index - 1) +".y, size: monstreSize}");
		}
		monstreListe.push(index);
		if(index <= monstreNumber/2){
			monstresBas.push(index);
		}else{
			monstresHaut.push(index);
		}
	}
}
function collisionMissileaMonstre(element, i){
		// Enlever le monstre de la liste de monstres
	monstreListe.splice(monstreListe.indexOf(element), 1);
		// Enlever le missile de la liste de monstres
	listeMissileA.splice(listeMissileA.indexOf(i), 1);
			// Enlever le monstre d'une des deux listes haut et bas
	if(element <= monstreNumber/2){
		monstresBas.splice(monstresBas.indexOf(element), 1);
	}else{
		monstresHaut.splice(monstresHaut.indexOf(element), 1);
	}
	valeurSpecial1 +=1;
	specialBarre(1);

}

function collisionMissilebMonstre(element, i){
		// Enlever le monstre de la liste de monstres
	monstreListe.splice(monstreListe.indexOf(element), 1);
		// Enlever le missile de la liste de missiles
	listeMissileB.splice(listeMissileB.indexOf(i), 1);
		// Enlever le monstre d'une des deux listes haut et bas
	if(element <= monstreNumber/2){
		monstresBas.splice(monstresBas.indexOf(element), 1);
	}else{
		monstresHaut.splice(monstresHaut.indexOf(element), 1);
	}
	valeurSpecial2 +=1;
	specialBarre(2);
}



/************	Constructeur de monstres	************/

/********** Barres *********/

function degatsBarre(numero, degats){
	eval("vieBarre"+numero+" -= "+degats);
	let width = vieBarre1 / vieBarre1Max;
	if(eval("vieBarre"+numero+"<= 0")){
		width = 0;
		let temp;
		if(numero == 1){
			temp = 2;
		}else{
			temp = 1;
		}
		eval("healthBar"+numero+".style.width = vieBarre"+numero+"Max * "+width+"+ 'px'");
		endGame(temp);
		
	}
		eval("healthBar"+numero+".style.width = vieBarre"+numero+"Max * "+width+"+ 'px'");

}
function specialBarre(numero){
		// Coefficient par rapport aux nombres de monstres qu'il faut tuer pour avoir la capacité spéciale
	let width = eval("valeurSpecial"+numero+"*50");
			// Verification du numero de la fusée ainsi que de la valeur speciale
		if(numero == 1 && width <= 500){
			specialBar1.style.width = width + "px";
		}
		if(numero == 2 && width <= 500){
			specialBar2.style.width = width + "px";
		}
	
	return width;
	
}
	// Utilisation de l'ulti
function useSpecial(numero, choice){

	// 3 = defense, 4 = attaque

		// Vérifier le type d'ulti
	if(choice == 4){
			// Augmenter l'attaque et réinitialisation de la valeurSpécial
		eval("degatsFusee"+numero+" *= 1.2");
		eval("valeurSpecial"+numero+" = 0");
	}

	if(choice == 3){
			// Augmenter la vie de la fusée et réinitialisation de la valeurSpécial
		eval("vieBarre"+numero+" *= 1.15");
		eval("valeurSpecial"+numero+ "= 0");
	}
		// Vérifier si la vie ne dépasse pas 500
	if(eval("vieBarre"+numero+" > 500")){
		eval("vieBarre"+numero+" = 500");
	}
	
	console.log("ok");
}

	// Fonction pour arrêter le jeu quand il y a un vainqueur (numero du gagnant)
function endGame(numero){
alert("Fin du jeu, joueur "+numero+" gagnant !");
}




/********** Barres *********/

/********** Audio *********/
fond.loop = true;

/********** Audio *********/

/********* Serveur ***********/
// Connection à socket.io
let socket = io.connect('http://spaceinvadersisn.herokuapp.com:8080');
// Numero de joueur
let numeroJoueur = 0;
// Emettre une requete indiquant la connection
socket.emit('connection', 'Un nouveau joueur s\'est connecté !');


// Reception des requetes
// Recevoir la connection des autres joueurs
socket.on('connection', function(message){
	console.log(message);
});


socket.on('numero', function(numero){
	numeroJoueur = numero;
	console.log(numeroJoueur);
	if(numeroJoueur == 1){
		intervalMissile1  = setInterval(createMissile1, 700);
		intervalMissile2 = setInterval(createMissile2, 700);
	
	}
});
socket.on('caseIn', function(touche){
	touches.push(touche);
});
socket.on('caseOut', function(touche){
	touches.splice(touches.indexOf(touche), 1);
});

socket.on('tir1', function(){
	createMissile1();
	
});
socket.on('tir2', function(){
	createMissile2();
	
});
socket.on('manches', function(manche){
	mancheActuel = manche;
});
socket.on('playerLeft', function(){
	
});
socket.on('disconnect', function(){
	socket.emit('disconnect', numeroJoueur);
});


/********* Serveur ***********/
