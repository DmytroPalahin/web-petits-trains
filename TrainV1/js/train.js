"use strict";


/*****************************************    Constantes    *****************************************/
//  -->  Dimensions du plateau
// Nombre de cases par défaut du simulateur
const LARGEUR_PLATEAU = 30;
const HAUTEUR_PLATEAU = 15;

// Dimensions des cases par défaut en pixels
const LARGEUR_CASE = 35;
const HAUTEUR_CASE = 40;

//  -->  Temps
const TEMPS_INTERVALLE = 500;

//  -->  Récapitulative :
// * Largeur : 30 * 35 = 1050 px
// * Hauteur : 30 * 35 = 600 px
const LARGEUR_TOTAL = LARGEUR_PLATEAU * LARGEUR_CASE;
const HAUTEUR_TOTAL = HAUTEUR_PLATEAU * HAUTEUR_CASE;

/****************************************************************************************************/


/*********************************************    Types Cases    *********************************************/
class Type_de_case {
	static Foret = new Type_de_case("🌲🌳🌿 Foret");
	static Eau = new Type_de_case("💦 Eau");
	static Rail_horizontal = new Type_de_case("rail horizontal");
	static Rail_vertical = new Type_de_case("rail vertical");
	// NOTE: faisant la fonction de horizontal à vertical en allant vers la droite puis vers le haut (ou de vertical vers horizontal en allant de bas vers gauche)
	static Rail_droite_vers_haut = new Type_de_case("rail droite vers haut");
	// NOTE: faisant la fonction de vertical à horizontal en allant vers le haut puis vers la droite (ou de horizontal à vertical en allant de gauche vers le bas)
	static Rail_haut_vers_droite = new Type_de_case("rail haut vers droite");
	// NOTE: faisant la fonction de horizontal à vertical en allant vers la droite puis vers le bas (ou de vertical vers horizontal en allant de haut vers gauche)
	static Rail_droite_vers_bas	 = new Type_de_case("rail droite vers bas");
	// NOTE: faisant la fonction de vertical à horizontal en allant vers le bas puis vers la droite (ou de horizontal à vertical en allant de gauche vers le haut)
	static Rail_bas_vers_droite	 = new Type_de_case("rail bas vers droite");
	constructor(nom) {
		this.nom = nom;
	}
}
/*************************************************************************************************************/


/*****************************************    Images    *****************************************/
const IMAGE_EAU = new Image();
IMAGE_EAU.src = "images/eau.png";

const IMAGE_FORET = new Image();
IMAGE_FORET.src = "images/foret.png";

const IMAGE_RAIL_HORIZONTAL = new Image();
IMAGE_RAIL_HORIZONTAL.src = "images/rail-horizontal.png";

const IMAGE_RAIL_VERTICAL = new Image();
IMAGE_RAIL_VERTICAL.src = "images/rail-vertical.png";

const IMAGE_RAIL_BAS_VERS_DROITE = new Image();
IMAGE_RAIL_BAS_VERS_DROITE.src = "images/rail-bas-vers-droite.png";

const IMAGE_RAIL_DROITE_VERS_BAS = new Image();
IMAGE_RAIL_DROITE_VERS_BAS.src = "images/rail-droite-vers-bas.png";

const IMAGE_RAIL_DROITE_VERS_HAUT = new Image();
IMAGE_RAIL_DROITE_VERS_HAUT.src = "images/rail-droite-vers-haut.png";

const IMAGE_RAIL_HAUT_VERS_DROITE = new Image();
IMAGE_RAIL_HAUT_VERS_DROITE.src = "images/rail-haut-vers-droite.png";

const IMAGE_ECLAIRAGE = new Image();
IMAGE_ECLAIRAGE.src = "images/eclairage.png";

const IMAGE_LOCOMOTIVE = new Image();
IMAGE_LOCOMOTIVE.src = "images/locomotive.png";

const IMAGE_WAGON = new Image();
IMAGE_WAGON.src = "images/wagon.png";

const createTransparentImage = (width, height) => {
	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	const image = new Image();
	return image;
};
const TRANSPARENT_IMAGE = createTransparentImage(LARGEUR_CASE, HAUTEUR_CASE);
/************************************************************************************************/


/***********************************    Variables Globales    ***********************************/
let boutons_imgs;
let bouton_img_click = null;
let bouton_pause;
let drapeau_pause = false;
let canvas;
let contexte;
let eclairage;
let trains = [];
let intervalles = [];
/************************************************************************************************/


/*****************************************    Classes    *****************************************/
//   -->  Plateau
class Plateau {
	constructor() {
		this.largeur = LARGEUR_PLATEAU;
		this.hauteur = HAUTEUR_PLATEAU;

		this.cases = [];
		for (let x = 0; x < this.largeur; x++) {
			this.cases[x] = [];
			for (let y = 0; y < this.hauteur; y++) {
				this.cases[x][y] = Type_de_case.Foret;
			}
		}
	}
}

//   -->  Eclairage
class Eclairage {
	constructor() {
		this.largeur = LARGEUR_PLATEAU;
		this.hauteur = HAUTEUR_PLATEAU;

		this.cases = [];
		for (let x = 0; x < this.largeur; x++) {
			this.cases[x] = [];
			for (let y = 0; y < this.hauteur; y++) {
				this.cases[x][y] = false;
			}
		}
	}
}

//   -->  Train
// 1  -> Locomotive
// 0  -> Wagon
// -1 -> Rien
class Train {
	constructor(nb_wagon, dir, loc_x, loc_y) {
		this.nb_wagon = nb_wagon;
		this.dir = dir;
		this.loc_x = loc_x;
		this.loc_y = loc_y;
		this.lst_coord = [];
		for (let i = 0; i <= nb_wagon; i++)
			this.lst_coord.push([loc_x - i, loc_y]);

		this.largeur = LARGEUR_PLATEAU;
		this.hauteur = HAUTEUR_PLATEAU;
		this.cases = [];
		for (let x = 0; x < this.largeur; x++) {
			this.cases[x] = [];
			for (let y = 0; y < this.hauteur; y++) {
				this.cases[x][y] = -1;
			}
		}

		this.cases[loc_x][loc_y] = 1;
		for (let i = 0; i < nb_wagon; i++)
			this.cases[loc_x - (i + 1)][loc_y] = 0;
	}
}
/*************************************************************************************************/


/****************************************    Méthodes    *****************************************/
//   -->  ********************    Méthodes de 'return'    ********************
function image_case(type_de_case) {
	switch (type_de_case) {
		case Type_de_case.Foret	: return IMAGE_FORET;
		case Type_de_case.Eau : return IMAGE_EAU;
		case Type_de_case.Rail_horizontal : return IMAGE_RAIL_HORIZONTAL;
		case Type_de_case.Rail_vertical : return IMAGE_RAIL_VERTICAL;
		case Type_de_case.Rail_droite_vers_haut	: return IMAGE_RAIL_DROITE_VERS_HAUT;
		case Type_de_case.Rail_haut_vers_droite	: return IMAGE_RAIL_HAUT_VERS_DROITE;
		case Type_de_case.Rail_droite_vers_bas : return IMAGE_RAIL_DROITE_VERS_BAS;
		case Type_de_case.Rail_bas_vers_droite : return IMAGE_RAIL_BAS_VERS_DROITE;
    }
}

function image_case_train(valeur_de_case) {
	switch (valeur_de_case) {
		case 1 : return IMAGE_LOCOMOTIVE;
		case 0 : return IMAGE_WAGON;
		case -1 : return TRANSPARENT_IMAGE;
    }
}

function type_bouton(img_id) {
	switch (img_id) {
		case "bouton_foret" : return Type_de_case.Foret;
		case "bouton_eau" : return Type_de_case.Eau;
		case "bouton_rail_horizontal" : return Type_de_case.Rail_horizontal;
		case "bouton_rail_vertical" : return Type_de_case.Rail_vertical;
		case "bouton_rail_droite_vers_haut" : return Type_de_case.Rail_droite_vers_haut;
		case "bouton_rail_haut_vers_droite" : return Type_de_case.Rail_haut_vers_droite;
		case "bouton_rail_droite_vers_bas" : return Type_de_case.Rail_droite_vers_bas;
		case "bouton_rail_bas_vers_droite" : return Type_de_case.Rail_bas_vers_droite;
	}
}

function type_train(train) {
	switch (train.nb_wagon) {
		case 0 : return "🚂 Locomotive";
		case 1 : return "🚂 Locomotive et 1 🚃 Wagon";
		case 3 : return "🚂 Locomotive et 3 🚃 Wagon";
		case 5 : return "🚂 Locomotive et 5 🚃 Wagon";
	}
}
//   -->  ********************************************************************

//   -->  ********************    Méthodes de 'dessin'    ********************
function dessine_case(contexte, plateau, x, y) {
	const la_case_plateau = plateau.cases[x][y];
	let image_a_afficher = image_case(la_case_plateau);
	contexte.drawImage(image_a_afficher, x * LARGEUR_CASE, y * HAUTEUR_CASE, LARGEUR_CASE, HAUTEUR_CASE);
}

function dessine_plateau(contexte, plateau) {
	for (let x = 0; x < plateau.largeur; x++)
		for (let y = 0; y < plateau.hauteur; y++)
			dessine_case(contexte, plateau, x, y);
}

function dessine_eclairage(contexte, eclairage) {
	for (let x = 0; x < eclairage.largeur; x++) {
		for (let y = 0; y < eclairage.hauteur; y++) {
			if (eclairage.cases[x][y] === true) {
				contexte.globalAlpha = 0.7;
				contexte.drawImage(IMAGE_ECLAIRAGE, x * LARGEUR_CASE, y * HAUTEUR_CASE, LARGEUR_CASE, HAUTEUR_CASE);
				contexte.globalAlpha = 1.0;
			}
		}
	}
}

function dessine_tous_trains(contexte) {
    trains.forEach(train => {dessine_train(contexte, train);});
}

function dessine_train(contexte, train) {
	for (let x = 0; x < train.largeur; x++)
		for (let y = 0; y < train.hauteur; y++)
			dessine_case_train(contexte, train, x, y);
}

function dessine_case_train(contexte, train, x, y) {
	if (train.cases[x][y] === 1)
		contexte.drawImage(IMAGE_LOCOMOTIVE, x * LARGEUR_CASE, y * HAUTEUR_CASE, LARGEUR_CASE, HAUTEUR_CASE);
	else if (train.cases[x][y] === 0)
		contexte.drawImage(IMAGE_WAGON, x * LARGEUR_CASE, y * HAUTEUR_CASE, LARGEUR_CASE, HAUTEUR_CASE);
}
//   -->  ********************************************************************

//   -->  ********************    Méthodes de vérification 'check'    ********************
// 1  --> Bouton : [bouton_train_1, bouton_train_2, bouton_train_4, bouton_train_6]
// 0  --> Bouton : [bouton_foret, bouton_eau, bouton_rail_horizontal, bouton_rail_vertical, ...]
// -1 --> Bouton non sélectionné
function check_bouton_train(bouton_img) {
	if (bouton_img !== null) {
		if (
			bouton_img.id === "bouton_foret" ||
			bouton_img.id === "bouton_eau" ||
			bouton_img.id === "bouton_rail_horizontal" ||
			bouton_img.id === "bouton_rail_vertical" ||
			bouton_img.id === "bouton_rail_droite_vers_haut" ||
			bouton_img.id === "bouton_rail_haut_vers_droite" ||
			bouton_img.id === "bouton_rail_droite_vers_bas" ||
			bouton_img.id === "bouton_rail_bas_vers_droite"
		)
			return 0;
		else
			return 1;
	}
	else
		return -1;
}

function check_rail_horizontal(plateau, train) {
	for (let i = 1; i <= train.nb_wagon; i++)
		if (plateau.cases[train.loc_x - i][train.loc_y].nom !== "rail horizontal")
			return (-i);
	return 1;
}

function check_wagon_place(train_nom, x) {
	let nb_wagon = parseInt(train_nom[train_nom.length - 1]) - 1;
	if (x < nb_wagon) {
		console.log(`\n\n❗❌ Il n'y a pas de place (${train_nom}) pour ${nb_wagon - x} wagon`);
		return false;
	}
	return true;
}

function check_autres_train(trains, train_pretendant) {
	// lst_return -> liste de 5 elements ;
	// 1) - Boolean, s'il y a interception 2) - Raison de l'interception (Locomotive/Wagon) 3) - Notre pretendant (Locomotive/Wagon)
	// 4) et 5) - Coordonnées de première superposition
	let lst_res = [];
	let train_pretend_y = train_pretendant.loc_y;
	let tete_train_pretend_x = train_pretendant.loc_x;
	let queue_train_pretend_x = train_pretendant.loc_x - train_pretendant.nb_wagon;

	for (let i = queue_train_pretend_x; i <= tete_train_pretend_x; i++) {
		trains.forEach((train_ieme) => {
			if (train_ieme.cases[i][train_pretend_y] === 1 || train_ieme.cases[i][train_pretend_y] === 0) {
				lst_res.push(true);
				if (train_ieme.cases[i][train_pretend_y] === 1)
					lst_res.push("🚂 Locomotive");																			 // 2) Raison de l'interception -> Locomotive
				else
					lst_res.push("🚃 Wagon");																				 // 2) Raison de l'interception -> Wagon
				lst_res.push(train_pretendant.cases[i][train_pretend_y] === 1 ? "🚂 Locomotive" : "🚃 Wagon");				// 3) Notre pretendant
				lst_res.push(i);																							 // 4) - Coordonnées X de première superposition
				lst_res.push(train_pretend_y);																				 // 5) - Coordonnées Y de première superposition
				return lst_res;
			}
		});
	}
	lst_res.push(false)
	return (lst_res);
}

function check_position_statique(plateau, trains, train_pretendant) {
	let futur_loc_x = train_pretendant.loc_x;
	let futur_loc_y = train_pretendant.loc_y;
	if (plateau.cases[futur_loc_x][futur_loc_y].nom !== "rail horizontal") {
		console.log(`\n\n❗❌ Attention, vous ne pouvez pas mettre '${bouton_img_click.id}' sur la case de '${plateau.cases[futur_loc_x][futur_loc_y].nom}' !`);
		console.log(`--> Impossible d'ajouter une locomotive ou un wagon sur une case hors rail horizontal !`);
		return false;
	}
	else {
		let check_rail = check_rail_horizontal(plateau, train_pretendant);
		if (check_rail < 0) {
			console.log(`\n\n❗❌ Attention, vous ne pouvez pas mettre '${bouton_img_click.id}', à cause de la case '${plateau.cases[futur_loc_x + check_rail][futur_loc_y].nom}' ! (📍 Coordonnées : [${futur_loc_x + check_rail}, ${futur_loc_y}])`);
			return false;
		}

		if (trains.length >= 1) {
			let check_autres_train_lst = check_autres_train(trains, train_pretendant);
			if (check_autres_train_lst[0]) {
				console.log(`\n\n❗❌ Attention, vous ne pouvez pas mettre '${bouton_img_click.id}', car future ${check_autres_train_lst[2]} superposé avec existant ${check_autres_train_lst[1]} ! (📍 Coordonnées : [${check_autres_train_lst[3]}, ${check_autres_train_lst[4]}])`);
				return false;
			}
		}
	}
	return true;
}

function check_click_plateau_non_train(bouton_img_click, x, y, trains) {
	let drapeau = true;
	let force_break = false;
	trains.forEach((train_ieme) => {
		if (train_ieme.cases[x][y] === 1 || train_ieme.cases[x][y] === 0) {
			console.log(train_ieme.cases[x][y] === 1 ? `\n\n❗ Attention, vous ne pouvez pas mettre '${bouton_img_click.id}' sur la case, car il y a déjà 🚂 Locomotive sur cette case.` :
				`\n\n❗ Attention, vous ne pouvez pas mettre '${bouton_img_click.id}' sur la case, car il y a déjà 🚃 Wagon sur cette case.`);
			drapeau = false;
			force_break = true;
		}
		if (force_break)
			return drapeau;
	});
	return drapeau;
}
//   -->  ********************************************************************************

//   -->  ********************    Méthodes auxiliaires    ********************
function eclairage_false(eclairage) {
	for (let i = 0; i < eclairage.cases.length; i++)
		for (let j = 0; j < eclairage.cases[i].length; j++)
			eclairage.cases[i][j] = false;
}

function non_train(train) {
	for (let i = 0; i < train.largeur; i++)
		for (let j = 0; j < train.hauteur; j++)
			train.cases[i][j] = -1;
}

function mise_a_jour_prochain_coord(dir, x, y) {
    switch (dir) {
        case 'E': return {x: x + 1, y: y};
        case 'N': return {x: x, y: y - 1};
        case 'O': return {x: x - 1, y: y};
        case 'S': return {x: x, y: y + 1};
        default: return {x: x, y: y};
    }
}
//   -->  ********************************************************************

//   -->  ********************    Méthodes de déplacement    ********************
function deplacer_train(contexte, intervalle, plateau, train) {
	if (!drapeau_pause) {
		let prochain_x = train.loc_x;
		let prochain_y = train.loc_y;
		let coord = mise_a_jour_prochain_coord(train.dir, prochain_x, prochain_y);
		prochain_x = coord.x;
		prochain_y = coord.y;

		// Vérifiez si le cas suivant est en dehors du plateau
		if (prochain_x < 0 || prochain_x >= plateau.largeur || prochain_y < 0 || prochain_y >= plateau.hauteur) {
			console.log(`\n\n🚨 Train : ${type_train(train)} a quitté la zone du plateau ! (📍 Coordonnées : [${prochain_x}, ${prochain_y}])`);
			non_train(train);
			dessine_plateau(contexte, plateau);
			trains = trains.filter(item => item !== train);
			console.log(`☑️📝--> Nombre total de Trains : ${trains.length}\n`);
			clearInterval(intervalle);
			intervalles = intervalles.filter(item => item !== intervalle);
			return;
		}

		const plateau_case_type = plateau.cases[prochain_x][prochain_y];

		if (train.dir === 'E' && (plateau_case_type === Type_de_case.Rail_horizontal || plateau_case_type === Type_de_case.Rail_droite_vers_bas || plateau_case_type === Type_de_case.Rail_droite_vers_haut)) {
			deplacer_locomotive(train, prochain_x, prochain_y);
			if (plateau_case_type === Type_de_case.Rail_droite_vers_bas)
				train.dir = 'S';
			else if (plateau_case_type === Type_de_case.Rail_droite_vers_haut)
				train.dir = 'N';
		}
		else if (train.dir === 'N' && (plateau_case_type === Type_de_case.Rail_vertical || plateau_case_type === Type_de_case.Rail_droite_vers_bas || plateau_case_type === Type_de_case.Rail_haut_vers_droite)) {
			deplacer_locomotive(train, prochain_x, prochain_y);
			if (plateau_case_type === Type_de_case.Rail_droite_vers_bas)
				train.dir = 'O';
			else if (plateau_case_type === Type_de_case.Rail_haut_vers_droite)
				train.dir = 'E';
		}
		else if (train.dir === 'O' && (plateau_case_type === Type_de_case.Rail_horizontal || plateau_case_type === Type_de_case.Rail_bas_vers_droite || plateau_case_type === Type_de_case.Rail_haut_vers_droite)) {
			deplacer_locomotive(train, prochain_x, prochain_y);
			if (plateau_case_type === Type_de_case.Rail_bas_vers_droite)
				train.dir = 'N';
			else if (plateau_case_type === Type_de_case.Rail_haut_vers_droite)
				train.dir = 'S';
		}
		else if (train.dir === 'S' && (plateau_case_type === Type_de_case.Rail_vertical || plateau_case_type === Type_de_case.Rail_droite_vers_haut || plateau_case_type === Type_de_case.Rail_bas_vers_droite)) {
			deplacer_locomotive(train, prochain_x, prochain_y);
			if (plateau_case_type === Type_de_case.Rail_droite_vers_haut)
				train.dir = 'O';
			else if (plateau_case_type === Type_de_case.Rail_bas_vers_droite)
				train.dir = 'E';
		}
		else {
			console.log(`\n\n🚨 Train : ${type_train(train)} est entré en collision avec '${plateau_case_type.nom}' ! (📍 Coordonnées : [${prochain_x}, ${prochain_y}])`);
			non_train(train);
			dessine_plateau(contexte, plateau);
			trains = trains.filter(item => item !== train);
			console.log(`☑️📝--> Nombre total de Trains : ${trains.length}\n`);
			clearInterval(intervalle);
			intervalles = intervalles.filter(item => item !== intervalle);
		}
		dessine_plateau(contexte, plateau);
		dessine_tous_trains(contexte);
		dessine_eclairage(contexte, eclairage);
	}
}

function deplacer_locomotive(train, prochain_x, prochain_y) {
	let lst_train_coord = train.lst_coord;
	lst_train_coord.unshift([prochain_x, prochain_y]);
	lst_train_coord.pop();

	non_train(train);
	train.cases[lst_train_coord[0][0]][lst_train_coord[0][1]] = 1;
	for (let i = 1; i <= train.nb_wagon; i++)
		train.cases[lst_train_coord[i][0]][lst_train_coord[i][1]] = 0;

	train.loc_x = prochain_x;
	train.loc_y = prochain_y;
}

function commencer_demplacement(contexte, plateau, train) {
	let intervalle = setInterval(() => {
		deplacer_train(contexte, intervalle, plateau, train);
    }, TEMPS_INTERVALLE);
	intervalles.push(intervalle);
}
//   -->  ***********************************************************************
/*************************************************************************************************/


/****************************************    Auditeurs    ****************************************/
function auditeur_bouton_click(evenement) {
	// bouton_img_click -> notre bouton qui a été choisi
	bouton_img_click = evenement.target;
    boutons_imgs.forEach((img) => {
        if (img !== bouton_img_click) {
            img.disabled = false; 								// Activer tous les autres boutons
            img.classList.remove("disabled"); 					// Supprimer la classe "disabled"
        }
    });
    bouton_img_click.disabled = !bouton_img_click.disabled; 	// Basculer l'état désactivé
    bouton_img_click.classList.add("disabled"); 				// Basculer la classe "disabled"
}

function auditeur_dehors_canvas_click(evenement, canvas) {
    // Ensure canvas is a valid element
    if (canvas && typeof canvas.getBoundingClientRect === 'function') {
        // Get the bounding rectangle of the canvas
        const rect = canvas.getBoundingClientRect();
		let element_click = evenement.target;
		if (element_click.tagName.toLowerCase() !== "input" || element_click.getAttribute("type").toLowerCase() !== "image") {
			// Check if the click is outside the canvas
			if (evenement.clientX < rect.left || evenement.clientX > rect.right ||
				evenement.clientY < rect.top || evenement.clientY > rect.bottom) {
				boutons_imgs.forEach(button => {
					button.disabled = false;
					button.classList.remove("disabled");
				});
				bouton_img_click = null;
			}
		}
    }
}

function auditeur_eclairage(evenement, contexte, plateau, eclairage, trains) {
	// Ajuster la position du curseur de la souris à l'aide du canevas
	const rect = canvas.getBoundingClientRect();
	const souris_x_canvas = evenement.clientX - rect.left;
	const souris_y_canvas = evenement.clientY - rect.top;

	// Trouver les coordonnées de la souris sur laquelle se trouve le curseur de la souris
	const case_x = Math.floor(souris_x_canvas / LARGEUR_CASE);
	const case_y = Math.floor(souris_y_canvas / HAUTEUR_CASE);

	// Réinitialiser toutes les cases d'éclairage à false
	eclairage_false(eclairage);

	// Activer la case d'éclairage sur laquelle se trouve le curseur de la souris
	if (souris_x_canvas >= 0 && souris_x_canvas < LARGEUR_TOTAL && souris_y_canvas >= 0 && souris_y_canvas < HAUTEUR_TOTAL) {
		eclairage.cases[case_x][case_y] = true;
		dessine_plateau(contexte, plateau);
		dessine_eclairage(contexte, eclairage);
		trains.forEach((train_ieme) => {dessine_train(contexte, train_ieme);});
	}
	else {
		eclairage_false(eclairage);
		dessine_plateau(contexte, plateau);
		dessine_eclairage(contexte, eclairage);
		trains.forEach((train_ieme) => {dessine_train(contexte, train_ieme);});
	}
}

function auditeur_plateau_click(evenement, contexte, plateau) {
	const rect = canvas.getBoundingClientRect();
	const souris_x_canvas = evenement.clientX - rect.left;
	const souris_y_canvas = evenement.clientY - rect.top;

	// Obtenez les coordonnées de la cellule où se trouve le curseur de la souris
	const case_x = Math.floor(souris_x_canvas / LARGEUR_CASE);
	const case_y = Math.floor(souris_y_canvas / HAUTEUR_CASE);

    if (bouton_img_click !== null) {
        if (check_bouton_train(bouton_img_click) === 0) {
            // console.log("Bouton a un type non-train  -->  " + bouton_img_click.src);
            auditeur_plateau_non_train_click(bouton_img_click, contexte, plateau, case_x, case_y);
        }
        else {
            // console.log("Bouton a un type train  -->  " + bouton_img_click.src);
            auditeur_plateau_train_click(bouton_img_click, contexte, plateau, case_x, case_y);
        }
		// bouton_img_click = null;
    }
    else
        console.log(`\n\n⚠️ Bouton non sélectionné`);
}

function auditeur_plateau_non_train_click(bouton_img_click, contexte, plateau, case_x, case_y) {
    console.log(`\n\n✨📍 Coordonnées de la Souris au Clic (canvas)  --> Case_X : ${case_x}, Case_Y : ${case_y}`);
	if (check_click_plateau_non_train(bouton_img_click, case_x, case_y, trains)) {
		plateau.cases[case_x][case_y] = type_bouton(bouton_img_click.id);
		dessine_plateau(contexte, plateau);
		trains.forEach((train_ieme) => {dessine_train(contexte, train_ieme);});
	}
}

function auditeur_plateau_train_click(bouton_img_click, contexte, plateau, case_x, case_y) {
	let train_pretendant;
	if (bouton_img_click.id === "bouton_train_1")
		train_pretendant = new Train(0, 'E', case_x, case_y);
	else if (bouton_img_click.id === "bouton_train_2" && check_wagon_place("bouton_train_2", case_x))
		train_pretendant = new Train(1, 'E', case_x, case_y);
	else if (bouton_img_click.id === "bouton_train_4" && check_wagon_place("bouton_train_4", case_x))
		train_pretendant = new Train(3, 'E', case_x, case_y);
	else if (bouton_img_click.id === "bouton_train_6" && check_wagon_place("bouton_train_6", case_x))
		train_pretendant = new Train(5, 'E', case_x, case_y);
	else
		return false;

	if (check_position_statique(plateau, trains, train_pretendant)) {
		trains.push(train_pretendant);
		console.log(`\n\n✔️ ➕Ajouter un nouveau Train : ${type_train(train_pretendant)}.\n\n☑️📝 --> Nombre total de Trains : ${trains.length}\n`);
		// dessine_plateau(contexte, plateau);
		// trains.forEach((train_ieme) => {dessine_train(contexte, train_ieme);});
		dessine_tous_trains(contexte);
		// clearInterval(intervalle);
		commencer_demplacement(contexte, plateau, train_pretendant);
	}
}

function auditeur_bouton_pause(evenement) {
	bouton_pause = evenement.target;
	if (bouton_pause.innerText === "⏸️ Pause") {
		bouton_pause.innerText = "▶️ Redémarrer";
		console.log(`\n\n⛔ Le bouton '⏸️ Pause' a été enfoncé. 🛑 Circulation bloquée !`);
	}
	else {
		bouton_pause.innerText = "⏸️ Pause";
		console.log(`\n\n⚡ Le bouton '▶️ Redémarrer' a été enfoncé. ✅ Circulation a repris !`);
	}
	drapeau_pause = !drapeau_pause;
}
/*************************************************************************************************/


/****************************************    Plateau Initial    ****************************************/
//  -->  Ne pas modifier le plateau initial
function cree_plateau_initial(plateau) {
	// Circuit
	plateau.cases[12][7] = Type_de_case.Rail_horizontal;
	plateau.cases[13][7] = Type_de_case.Rail_horizontal;
	plateau.cases[14][7] = Type_de_case.Rail_horizontal;
	plateau.cases[15][7] = Type_de_case.Rail_horizontal;
	plateau.cases[16][7] = Type_de_case.Rail_horizontal;
	plateau.cases[17][7] = Type_de_case.Rail_horizontal;
	plateau.cases[18][7] = Type_de_case.Rail_horizontal;
	plateau.cases[19][7] = Type_de_case.Rail_droite_vers_haut;
	plateau.cases[19][6] = Type_de_case.Rail_vertical;
	plateau.cases[19][5] = Type_de_case.Rail_droite_vers_bas;
	plateau.cases[12][5] = Type_de_case.Rail_horizontal;
	plateau.cases[13][5] = Type_de_case.Rail_horizontal;
	plateau.cases[14][5] = Type_de_case.Rail_horizontal;
	plateau.cases[15][5] = Type_de_case.Rail_horizontal;
	plateau.cases[16][5] = Type_de_case.Rail_horizontal;
	plateau.cases[17][5] = Type_de_case.Rail_horizontal;
	plateau.cases[18][5] = Type_de_case.Rail_horizontal;
	plateau.cases[11][5] = Type_de_case.Rail_haut_vers_droite;
	plateau.cases[11][6] = Type_de_case.Rail_vertical;
	plateau.cases[11][7] = Type_de_case.Rail_bas_vers_droite;

	// Segment isolé à gauche
	plateau.cases[0][7] = Type_de_case.Rail_horizontal;
	plateau.cases[1][7] = Type_de_case.Rail_horizontal;
	plateau.cases[2][7] = Type_de_case.Rail_horizontal;
	plateau.cases[3][7] = Type_de_case.Rail_horizontal;
	plateau.cases[4][7] = Type_de_case.Rail_horizontal;
	plateau.cases[5][7] = Type_de_case.Eau;
	plateau.cases[6][7] = Type_de_case.Rail_horizontal;
	plateau.cases[7][7] = Type_de_case.Rail_horizontal;

	// Plan d'eau
	for (let x = 22; x <= 27; x++)
		for (let y = 2; y <= 5; y++)
			plateau.cases[x][y] = Type_de_case.Eau;

	// Segment isolé à droite
	plateau.cases[22][8] = Type_de_case.Rail_horizontal;
	plateau.cases[23][8] = Type_de_case.Rail_horizontal;
	plateau.cases[24][8] = Type_de_case.Rail_horizontal;
	plateau.cases[25][8] = Type_de_case.Rail_horizontal;
	plateau.cases[26][8] = Type_de_case.Rail_bas_vers_droite;
	plateau.cases[27][8] = Type_de_case.Rail_horizontal;
	plateau.cases[28][8] = Type_de_case.Rail_horizontal;
	plateau.cases[29][8] = Type_de_case.Rail_horizontal;

	// TCHOU
	plateau.cases[3][10] = Type_de_case.Eau;
	plateau.cases[4][10] = Type_de_case.Eau;
	plateau.cases[4][11] = Type_de_case.Eau;
	plateau.cases[4][12] = Type_de_case.Eau;
	plateau.cases[4][13] = Type_de_case.Eau;
	plateau.cases[4][13] = Type_de_case.Eau;
	plateau.cases[5][10] = Type_de_case.Eau;

	plateau.cases[7][10] = Type_de_case.Eau;
	plateau.cases[7][11] = Type_de_case.Eau;
	plateau.cases[7][12] = Type_de_case.Eau;
	plateau.cases[7][13] = Type_de_case.Eau;
	plateau.cases[8][10] = Type_de_case.Eau;
	plateau.cases[9][10] = Type_de_case.Eau;
	plateau.cases[8][13] = Type_de_case.Eau;
	plateau.cases[9][13] = Type_de_case.Eau;

	plateau.cases[11][10] = Type_de_case.Eau;
	plateau.cases[11][11] = Type_de_case.Eau;
	plateau.cases[11][12] = Type_de_case.Eau;
	plateau.cases[11][13] = Type_de_case.Eau;
	plateau.cases[12][11] = Type_de_case.Eau;
	plateau.cases[13][10] = Type_de_case.Eau;
	plateau.cases[13][11] = Type_de_case.Eau;
	plateau.cases[13][12] = Type_de_case.Eau;
	plateau.cases[13][13] = Type_de_case.Eau;

	plateau.cases[15][10] = Type_de_case.Eau;
	plateau.cases[15][11] = Type_de_case.Eau;
	plateau.cases[15][12] = Type_de_case.Eau;
	plateau.cases[15][13] = Type_de_case.Eau;
	plateau.cases[16][10] = Type_de_case.Eau;
	plateau.cases[16][13] = Type_de_case.Eau;
	plateau.cases[17][10] = Type_de_case.Eau;
	plateau.cases[17][11] = Type_de_case.Eau;
	plateau.cases[17][12] = Type_de_case.Eau;
	plateau.cases[17][13] = Type_de_case.Eau;

	plateau.cases[19][10] = Type_de_case.Eau;
	plateau.cases[19][11] = Type_de_case.Eau;
	plateau.cases[19][12] = Type_de_case.Eau;
	plateau.cases[19][13] = Type_de_case.Eau;
	plateau.cases[20][13] = Type_de_case.Eau;
	plateau.cases[21][10] = Type_de_case.Eau;
	plateau.cases[21][11] = Type_de_case.Eau;
	plateau.cases[21][12] = Type_de_case.Eau;
	plateau.cases[21][13] = Type_de_case.Eau;
}
/*******************************************************************************************************/


/****************************************    Fonction Principale    ****************************************/
function tchou() {
	console.log("✅🎉 Tchou, attention au départ 🚆🚇🚅!");
	//  -->  Variables DOM
	canvas = document.getElementById("simulateur");
	contexte = document.getElementById("simulateur").getContext("2d");

	//  -->  Position de la Souris
	// document.addEventListener("mousemove", (evenement) => {
	// 	souris_coord.x = evenement.clientX;
	// 	souris_coord.y = evenement.clientY;
	// 	console.log(`\n\n📍 Coordonnées de la Souris : (${souris_coord.x}, ${souris_coord.y})`);
	// });

	//  -->  Position de la Souris au Clic
	document.addEventListener("click", (evenement) => {
		// console.log(`\n\n📍 Coordonnées de la Souris au Clic : (${evenement.clientX}, ${evenement.clientY})`);
		auditeur_dehors_canvas_click(evenement, canvas);
	});

	let plateau = new Plateau();							// Création du plateau
	cree_plateau_initial(plateau);
	dessine_plateau(contexte, plateau); 					// Dessine le plateau

	// let eclairage = new Eclairage();
	eclairage = new Eclairage();

	// Travaillons avec les boutons d'image
	boutons_imgs = document.querySelectorAll("input");    	// boutons_imgs.length = 12
    boutons_imgs.forEach(
        (img) => {
            img.addEventListener("click", (evenement) => {
                auditeur_bouton_click(evenement);
            });
        }
    );

	// Travaillons avec le bouton pause
	bouton_pause = document.getElementById("bouton_pause");
	bouton_pause.innerText = "⏸️ Pause"
	bouton_pause.addEventListener("click", (evenement) => {
		auditeur_bouton_pause(evenement);
	});

	// Mettre en surbrillance la cellule où se trouve le curseur
	document.addEventListener("mousemove", (evenement) => {
		auditeur_eclairage(evenement, contexte, plateau, eclairage, trains);
	});

	// Sélectionnez la cellule où se trouve le curseur et où le clic a été effectué
	canvas.addEventListener("click", (evenement) => {
		auditeur_plateau_click(evenement, contexte, plateau);
	});
}
/***********************************************************************************************************/


/****************************************    Programme Principal    ****************************************/
//  -->  Rien à modifier ici
window.addEventListener("load", () => {
	// Appel à la fonction principale
	tchou();
});
/***********************************************************************************************************/