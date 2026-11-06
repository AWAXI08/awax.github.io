
const arena = document.querySelector("#arena");
const fighter1 = document.querySelector("#fighter1");
const fighter2 = document.querySelector("#fighter2");

const gameMode = document.querySelector("#gameMode");
const startMode = document.querySelector("#startMode");

// Mode sélectionné
let modeJeu = "pvp";

// Temps de la dernière attaque automatique
let derniereAttaqueIA1 = 0;
let derniereAttaqueIA2 = 0;

const image1 = fighter1.querySelector("img");
const image2 = fighter2.querySelector("img");

// Animation actuelle de chaque combattant
let animation1 = "idle";
let animation2 = "idle";

// Numéro de l'image affichée
let frame1 = 1;
let frame2 = 1;

// Temps de la dernière action
let dernierMouvement1 = 0;
let dernierMouvement2 = 0;

// Durée pendant laquelle une attaque reste visible
let attaqueJusqua1 = 0;
let attaqueJusqua2 = 0;

const health1 = document.querySelector("#health1");
const health2 = document.querySelector("#health2");
const bar1 = document.querySelector("#bar1");
const bar2 = document.querySelector("#bar2");
const message = document.querySelector("#message");
const restart = document.querySelector("#restart");

// Variables du jeu
let position1 = 80;
let position2 = 0;

let vie1 = 100;
let vie2 = 100;

let combatTermine = false;
let saute1 = false;
let saute2 = false;

// Préparer l'arène
arena.style.position = "relative";

fighter1.style.position = "absolute";
fighter2.style.position = "absolute";

fighter1.style.bottom = "20px";
fighter2.style.bottom = "20px";

// Placer les joueurs au début
function positionsDepart() {
    position1 = 80;
    position2 = Math.max(0, arena.clientWidth - 150);
}

// Afficher les positions
function afficherPositions() {
    fighter1.style.left = position1 + "px";
    fighter2.style.left = position2 + "px";
}

// Afficher les points de vie

function afficherVies() {

    // Afficher les nombres
    health1.textContent = vie1;
    health2.textContent = vie2;

    // Modifier la longueur des barres
    bar1.style.width = vie1 + "%";
    bar2.style.width = vie2 + "%";

    // Modifier les couleurs selon la vie restante
    bar1.style.background =
        vie1 > 50 ? "#22c55e" :
        vie1 > 20 ? "#eab308" : "#ef4444";

    bar2.style.background =
        vie2 > 50 ? "#22c55e" :
        vie2 > 20 ? "#eab308" : "#ef4444";
}

// Vérifier la distance entre les joueurs
function joueursProches() {
    return Math.abs(position1 - position2) < 110;
}

// Animation des attaques
function animationAttaque(attaquant, victime, touche) {

    attaquant.classList.add("attack");

    setTimeout(function() {
        attaquant.classList.remove("attack");
    }, 150);

    if (touche) {
        victime.classList.add("hit");

        setTimeout(function() {
            victime.classList.remove("hit");
        }, 200);
    }
}

// Vérifier la victoire
function verifierVictoire() {

    if (vie1 === 0) {
        combatTermine = true;
        message.textContent = "🏆 JOUEUR 2 A GAGNÉ !";
    }

    if (vie2 === 0) {
        combatTermine = true;
        message.textContent = "🏆 JOUEUR 1 A GAGNÉ !";
    }
}

// Attaque du joueur 1
function attaqueJoueur1() {
    
if (combatTermine) return;
attaqueJusqua1 = Date.now() + 450;

  const touche = joueursProches();

    animationAttaque(fighter1, fighter2, touche);

    if (touche) {
        vie2 = Math.max(0, vie2 - 10);
        message.textContent = "Joueur 1 touche Joueur 2 !";
        afficherVies();
        verifierVictoire();
    } else {
        message.textContent = "Joueur 1 est trop loin !";
    }
}

// Attaque du joueur 2
function attaqueJoueur2() {

    if (combatTermine) return;
attaqueJusqua2 = Date.now() + 450;
    const touche = joueursProches();

    animationAttaque(fighter2, fighter1, touche);

    if (touche) {
        vie1 = Math.max(0, vie1 - 10);
        message.textContent = "Joueur 2 touche Joueur 1 !";
        afficherVies();
        verifierVictoire();
    } else {
        message.textContent = "Joueur 2 est trop loin !";
    }
}

// Fonction de saut
function sauter(joueur) {

    if (combatTermine) return;

    if (joueur === 1 && saute1) return;
    if (joueur === 2 && saute2) return;

    const combattant = joueur === 1 ? fighter1 : fighter2;

    if (joueur === 1) saute1 = true;
    if (joueur === 2) saute2 = true;

    let hauteur = 20;
    let vitesse = 16;

    const animation = setInterval(function() {

        hauteur += vitesse;
        vitesse -= 1;

        combattant.style.bottom = Math.max(20, hauteur) + "px";

        if (hauteur <= 20) {
            clearInterval(animation);

            combattant.style.bottom = "20px";

            if (joueur === 1) saute1 = false;
            if (joueur === 2) saute2 = false;
        }

    }, 20);
}

// Commandes du clavier
document.addEventListener("keydown", function(event) {

    const touche = event.key.toLowerCase();

const controleJoueur1 = modeJeu !== "eve";
const controleJoueur2 = modeJeu === "pvp";

    // Empêcher le défilement avec les flèches
    if (touche.startsWith("arrow")) {
        event.preventDefault();
    }

    if (combatTermine) return;

    const largeur = arena.clientWidth;
    const taille = 110;

    
// Déplacements du joueur 1
if (controleJoueur1 && touche === "q") {
    position1 -= 15;
    dernierMouvement1 = Date.now();
    image1.style.transform = "scaleX(-1)";
}

if (touche === "d") {
    position1 += 15;
    dernierMouvement1 = Date.now();
    image1.style.transform = "scaleX(1)";
}

// Déplacements du joueur 2
if (touche === "arrowleft") {
    position2 -= 15;
    dernierMouvement2 = Date.now();
    image2.style.transform = "scaleX(-1)";
}

if (touche === "arrowright") {
    position2 += 15;
    dernierMouvement2 = Date.now();
    image2.style.transform = "scaleX(1)";
}


    // Empêcher les joueurs de sortir de l'arène
    position1 = Math.max(0, Math.min(position1, largeur - taille));
    position2 = Math.max(0, Math.min(position2, largeur - taille));

    afficherPositions();

    // Attaques
    if (touche === "f" && !event.repeat) {
        attaqueJoueur1();
    }

    if (touche === "enter" && !event.repeat) {
        attaqueJoueur2();
    }

    // Sauts
    if (touche === "z" && !event.repeat) {
        sauter(1);
    }

    if (touche === "arrowup" && !event.repeat) {
        sauter(2);
    }
});

// Bouton Recommencer
restart.addEventListener("click", function() {

    vie1 = 100;
    vie2 = 100;

    combatTermine = false;

attaqueJusqua1 = 0;
attaqueJusqua2 = 0;

dernierMouvement1 = 0;
dernierMouvement2 = 0;

changerAnimation(1, "idle");
changerAnimation(2, "idle");

frame1 = 1;
frame2 = 1;

image1.src = "assets/fighter1/idle_1.png";
image2.src = "assets/fighter2/idle_1.png";

    positionsDepart();

// Changer l'animation d'un combattant
function changerAnimation(joueur, nouvelleAnimation) {

    if (joueur === 1) {
        if (animation1 !== nouvelleAnimation) {
            animation1 = nouvelleAnimation;
            frame1 = 1;
        }
    } else {
        if (animation2 !== nouvelleAnimation) {
            animation2 = nouvelleAnimation;
            frame2 = 1;
        }
    }
}

// Faire défiler les images des personnages
setInterval(function() {

    frame1 = frame1 % 4 + 1;
    frame2 = frame2 % 4 + 1;

    image1.src = "assets/fighter1/" +
        animation1 + "_" + frame1 + ".png";

    image2.src = "assets/fighter2/" +
        animation2 + "_" + frame2 + ".png";

}, 120);

// Choisir l'animation selon l'action
setInterval(function() {

    const maintenant = Date.now();

    // Joueur 1
    if (maintenant < attaqueJusqua1) {
        changerAnimation(1, "attack");
    } else if (saute1) {
        changerAnimation(1, "jump");
    } else if (maintenant - dernierMouvement1 < 160) {
        changerAnimation(1, "walk");
    } else {
        changerAnimation(1, "idle");
    }

    // Joueur 2
    if (maintenant < attaqueJusqua2) {
        changerAnimation(2, "attack");
    } else if (saute2) {
        changerAnimation(2, "jump");
    } else if (maintenant - dernierMouvement2 < 160) {
        changerAnimation(2, "walk");
    } else {
        changerAnimation(2, "idle");
    }

}, 40);

    fighter1.classList.remove("attack", "hit");
    fighter2.classList.remove("attack", "hit");

    message.textContent = "Nouveau combat !";

    afficherVies();
    afficherPositions();
});

// Initialisation du jeu
positionsDepart();
afficherVies();
afficherPositions();

// Intelligence artificielle des combattants
function jouerIA(joueur) {

    if (combatTermine) return;

    const maintenant = Date.now();

    const maPosition = joueur === 1 ? position1 : position2;
    const positionAdversaire = joueur === 1 ? position2 : position1;

    const distance = Math.abs(maPosition - positionAdversaire);

    // Se rapprocher de l'adversaire
    if (distance > 75) {

        const direction = positionAdversaire > maPosition ? 1 : -1;
        const nouvellePosition = maPosition + direction * 8;

        const maximum = Math.max(0, arena.clientWidth - 110);
        const positionLimitee = Math.max(0, Math.min(nouvellePosition, maximum));

        if (joueur === 1) {
            position1 = positionLimitee;
            dernierMouvement1 = maintenant;
            image1.style.transform = direction === 1 ? "scaleX(1)" : "scaleX(-1)";
        } else {
            position2 = positionLimitee;
            dernierMouvement2 = maintenant;
            image2.style.transform = direction === 1 ? "scaleX(1)" : "scaleX(-1)";
        }

        afficherPositions();
    }

    // Attaquer quand l'adversaire est proche
    if (distance < 100) {

        if (joueur === 1 && maintenant - derniereAttaqueIA1 > 900) {
            attaqueJoueur1();
            derniereAttaqueIA1 = maintenant;
        }

        if (joueur === 2 && maintenant - derniereAttaqueIA2 > 900) {
            attaqueJoueur2();
            derniereAttaqueIA2 = maintenant;
        }
    }

    // Sauter de temps en temps
    if (Math.random() < 0.015) {
        sauter(joueur);
    }
}

// Actualiser les décisions de l'IA
setInterval(function() {

    if (modeJeu === "pve") {
        jouerIA(2);
    }

    if (modeJeu === "eve") {
        jouerIA(1);
        jouerIA(2);
    }

}, 80);

startMode.addEventListener("click", function() {

    // Récupérer le mode choisi
    modeJeu = gameMode.value;

    // Remettre les vies à 100
    vie1 = 100;
    vie2 = 100;

    // Réinitialiser le combat
    combatTermine = false;
    positionsDepart();

    // Réinitialiser les attaques automatiques
    derniereAttaqueIA1 = 0;
    derniereAttaqueIA2 = 0;

    attaqueJusqua1 = 0;
    attaqueJusqua2 = 0;

    dernierMouvement1 = 0;
    dernierMouvement2 = 0;

    changerAnimation(1, "idle");
    changerAnimation(2, "idle");

    afficherVies();
    afficherPositions();

    if (modeJeu === "pvp") {
        message.textContent = "Mode Joueur contre Joueur !";
    }

    if (modeJeu === "pve") {
        message.textContent = "Mode Joueur contre Ordinateur !";
    }

    if (modeJeu === "eve") {
        message.textContent = "Mode Ordinateur contre Ordinateur !";
    }
});

/* =====================================
   MANETTE PS5 - BLAZE (JOUEUR 2)
===================================== */

let manetteAttaquePrecedente = false;
let manetteSautPrecedent = false;

function lireManette() {

    // Lire les manettes connectées
    const manettes = navigator.getGamepads
        ? navigator.getGamepads()
        : [];

    const manette = Array.from(manettes).find(
        m => m !== null
    );

    // La manette contrôle Blaze uniquement en PvP
    if (manette && modeJeu === "pvp" && !combatTermine) {

        // Joystick gauche : axe horizontal
        const axeHorizontal = manette.axes[0] || 0;

        // Déplacement à gauche
        if (axeHorizontal < -0.25) {
            position2 -= 5;
            dernierMouvement2 = Date.now();
            image2.style.transform = "scaleX(-1)";
        }

        // Déplacement à droite
        if (axeHorizontal > 0.25) {
            position2 += 5;
            dernierMouvement2 = Date.now();
            image2.style.transform = "scaleX(1)";
        }

        // Empêcher Blaze de sortir de l'arène
        position2 = Math.max(
            0,
            Math.min(position2, arena.clientWidth - 110)
        );

        afficherPositions();

        // Croix (X) : saut
        const boutonSaut = Boolean(
            manette.buttons[0]?.pressed
        );

        if (boutonSaut && !manetteSautPrecedent) {
            sauter(2);
        }

        manetteSautPrecedent = boutonSaut;

        // Carré : attaque
        const boutonAttaque = Boolean(
            manette.buttons[2]?.pressed
        );

        if (boutonAttaque && !manetteAttaquePrecedente) {
            attaqueJoueur2();
        }

        manetteAttaquePrecedente = boutonAttaque;

    } else {
        manetteSautPrecedent = false;
        manetteAttaquePrecedente = false;
    }

    // Répéter la lecture pour des mouvements fluides
    requestAnimationFrame(lireManette);
}

// Démarrer la détection de la manette
requestAnimationFrame(lireManette);
