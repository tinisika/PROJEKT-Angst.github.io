// ==================================================
// ELEMENTE
// ==================================================

const playButton = document.getElementById("playButton");

const startScreen = document.querySelector(".start-screen");
const videoScreen = document.querySelector(".video-screen");

const film = document.getElementById("film");
const videoSource = film.querySelector("source");

const volumeButton = document.getElementById("volumeButton");
const volumeSlider = document.getElementById("volumeSlider");

const repeatButton = document.getElementById("repeatButton");
const skipButton = document.getElementById("skipButton");

const choiceButtons = document.getElementById("choiceButtons");
const choiceA = document.getElementById("choiceA");
const choiceB = document.getElementById("choiceB");

const startMusic = document.getElementById("startMusic");

const creditsScreen = document.getElementById("creditsScreen");
const creditsVideo = document.getElementById("creditsVideo");
const creditsMusic = document.getElementById("creditsMusic");

const homeButton = document.getElementById("homeButton");


// ==================================================
// AKTUELLER SCHRITT
// ==================================================
//
// 1 = Wahl 1
// 2 = Wahl 2
// 3 = Wahl 3
// 4 = Wahl 4
// 5 = Wahl 5
// 6 = Hinausgehen / Bleiben
// 7 = Finale / Spiel beendet
//

let nextChoice = 1;


// ==================================================
// SPEICHERUNG DER ERSTEN 5 WAHLEN
// ==================================================

let playerChoices = [];


// ==================================================
// 6. WAHL
// ==================================================

let finalChoice = null;


// ==================================================
// TEXTE DER WAHLEN
// ==================================================
//
// WICHTIG:
//
// Die Antworten wurden nur in A/B
// vertauscht.
//
// Der Inhalt und die Bedeutung bleiben gleich.
//
// ==================================================

const choicesText = {

    // Wahl 1
    1: {
        A: "Tür öffnen",
        B: "Tür nicht öffnen"
    },

    // Wahl 2
    2: {
        A: "Nicht fernsehen",
        B: "Fernsehen"
    },

    // Wahl 3
    3: {
        A: "Nach einem Ausgang suchen",
        B: "Sich verstecken"
    },

    // Wahl 4
    4: {
        A: "Die Kamera zerstören",
        B: "Die Kamera stehen lassen"
    },

    // Wahl 5
    5: {
        A: "Dem Mann vertrauen",
        B: "Dem Mann nicht vertrauen"
    },

    // Wahl 6
    6: {
        A: "Hinausgehen",
        B: "Bleiben"
    }

};


// ==================================================
// WELCHER BUTTON IST DER GUTE WEG?
// ==================================================
//
// Das bedeutet NICHT, dass A grundsätzlich gut ist.
//
// Hier wird für jede Wahl einzeln festgelegt,
// welcher Button die gute Entscheidung ist.
//
// Wahl 1 → A = gut
// Wahl 2 → A = gut
// Wahl 3 → B = gut
// Wahl 4 → B = gut
// Wahl 5 → A = gut
//
// ==================================================

const goodChoices = {

    1: "A",
    2: "A",
    3: "B",
    4: "B",
    5: "A"

};


// ==================================================
// PLAY
// ==================================================

playButton.addEventListener("click", function () {

    startScreen.style.display = "none";

    videoScreen.style.display = "flex";

    startMusic.pause();

    film.currentTime = 0;

    film.volume = Number(volumeSlider.value);

    film.play();

});


// ==================================================
// STARTMUSIK
// ==================================================

window.addEventListener("load", function () {

    startMusic.volume = Number(volumeSlider.value);

    startMusic.play().catch(function () {});

});


// Falls Autoplay blockiert wird
document.addEventListener("click", function startMusicAfterClick() {

    if (
        startScreen.style.display !== "none" &&
        startMusic.paused
    ) {

        startMusic.play().catch(function () {});

    }

}, { once: true });


// ==================================================
// LAUTSTÄRKE BUTTON
// ==================================================

volumeButton.addEventListener("click", function () {

    if (volumeSlider.style.display === "block") {

        volumeSlider.style.display = "none";

    } else {

        volumeSlider.style.display = "block";

    }

});


// ==================================================
// LAUTSTÄRKE
// ==================================================

volumeSlider.addEventListener("input", function () {

    const volume = Number(volumeSlider.value);

    film.volume = volume;

    creditsVideo.volume = volume;

    startMusic.volume = volume;

    creditsMusic.volume = volume;

});


// ==================================================
// SKIP — TESTBUTTON
// ==================================================

skipButton.addEventListener("click", function () {

    film.currentTime = film.duration;

});


// ==================================================
// AUSWAHL ANZEIGEN
// ==================================================

function showChoice(number) {

    choiceA.textContent = choicesText[number].A;

    choiceB.textContent = choicesText[number].B;

    choiceButtons.style.display = "flex";

}


// ==================================================
// BUTTON A
// ==================================================

choiceA.addEventListener("click", function () {

    makeChoice("A");

});


// ==================================================
// BUTTON B
// ==================================================

choiceB.addEventListener("click", function () {

    makeChoice("B");

});


// ==================================================
// WAHL VERARBEITEN
// ==================================================

function makeChoice(choice) {


    // ==================================================
    // WAHL 1–5
    // ==================================================

    if (nextChoice <= 5) {

        // Wahl speichern
        playerChoices.push(choice);

        console.log(
            "Wahl " + nextChoice + ": " + choice
        );


        // Aktuelle Szenennummer speichern
        const sceneNumber = nextChoice;


        // Zur nächsten Wahl
        nextChoice++;


        // Buttons verstecken
        choiceButtons.style.display = "none";

        repeatButton.style.display = "none";


        // ==================================================
        // NÄCHSTES VIDEO
        // ==================================================
        //
        // 1A.mp4
        // 1B.mp4
        // 2A.mp4
        // 2B.mp4
        // usw.
        //

        videoSource.src =
            "vidosiki/" +
            sceneNumber +
            choice +
            ".mp4";


        film.load();

        film.currentTime = 0;

        film.play();

        return;
    }


    // ==================================================
    // WAHL 6
    // ==================================================

    if (nextChoice === 6) {

        /*
            Die sechste Wahl wird NICHT
            in playerChoices gespeichert.

            Sie entscheidet nur:

            A = Hinausgehen
            B = Bleiben
        */

        finalChoice = choice;

        console.log(
            "Wahl 6: " + finalChoice
        );


        // Spiel ist beendet
        nextChoice = 7;


        choiceButtons.style.display = "none";

        repeatButton.style.display = "none";


        // Passendes Finale starten
        playEnding();

    }

}


// ==================================================
// GOOD / BAD BERECHNEN
// ==================================================

function getResult() {

    let goodAnswers = 0;


    /*
        Nur die ersten 5 Entscheidungen
        werden ausgewertet.
    */

    for (let i = 0; i < playerChoices.length; i++) {

        const choiceNumber = i + 1;

        const playerChoice = playerChoices[i];

        const goodChoice = goodChoices[choiceNumber];


        if (playerChoice === goodChoice) {

            goodAnswers++;

        }

    }


    console.log(
        "Gute Entscheidungen: " + goodAnswers
    );


    // 3, 4 oder 5 gute Entscheidungen
    if (goodAnswers >= 3) {

        return "GOOD";

    }


    // 0, 1 oder 2 gute Entscheidungen
    return "BAD";

}


// ==================================================
// FINALE
// ==================================================

function playEnding() {

    const result = getResult();

    let endingFile = "";


    // ==================================================
    // GOOD
    // ==================================================

    if (result === "GOOD") {

        // Good + Hinausgehen
        if (finalChoice === "A") {

            endingFile = "1GA.mp4";

        }


        // Good + Bleiben
        if (finalChoice === "B") {

            endingFile = "2GB.mp4";

        }

    }


    // ==================================================
    // BAD
    // ==================================================

    if (result === "BAD") {

        // Bad + Hinausgehen
        if (finalChoice === "A") {

            endingFile = "1BA.mp4";

        }


        // Bad + Bleiben
        if (finalChoice === "B") {

            endingFile = "2BB.mp4";

        }

    }


    console.log("Ergebnis: " + result);

    console.log(
        "6. Wahl: " + finalChoice
    );

    console.log(
        "Finale: " + endingFile
    );


    // Sicherheitsprüfung
    if (endingFile === "") {

        console.error(
            "FEHLER: Kein Finale gefunden!"
        );

        return;

    }


    // ==================================================
    // FINALE STARTEN
    // ==================================================

    videoScreen.style.display = "flex";

    choiceButtons.style.display = "none";

    repeatButton.style.display = "none";


    videoSource.src =
        "vidosiki/" + endingFile;


    film.load();

    film.currentTime = 0;

    film.play();

}


// ==================================================
// VIDEO BEENDET
// ==================================================

film.addEventListener("ended", function () {


    // ==================================================
    // FINALE BEENDET
    // ==================================================

    if (nextChoice === 7) {

        startCredits();

        return;

    }


    // ==================================================
    // NORMALE SZENE BEENDET
    // ==================================================

    repeatButton.style.display = "flex";

    showChoice(nextChoice);

});


// ==================================================
// REPEAT
// ==================================================

repeatButton.addEventListener("click", function () {

    film.currentTime = 0;

    repeatButton.style.display = "none";

    choiceButtons.style.display = "none";

    film.play();

});


// ==================================================
// TITEL
// ==================================================

function startCredits() {

    videoScreen.style.display = "none";

    creditsScreen.style.display = "flex";

    homeButton.style.display = "none";


    // Musik
    creditsMusic.currentTime = 0;

    creditsMusic.volume =
        Number(volumeSlider.value);

    creditsMusic.play();


    // Video
    creditsVideo.currentTime = 0;

    creditsVideo.volume =
        Number(volumeSlider.value);

    creditsVideo.play();

}


// ==================================================
// TITEL ENDE
// ==================================================

creditsVideo.addEventListener("ended", function () {

    homeButton.style.display = "flex";

});


// ==================================================
// HOME
// ==================================================

homeButton.addEventListener("click", function () {

    // Musik stoppen
    creditsMusic.pause();

    creditsMusic.currentTime = 0;


    // Titelseite verstecken
    creditsScreen.style.display = "none";

    homeButton.style.display = "none";


    // Startseite
    startScreen.style.display = "flex";


    // ==================================================
    // ALLES ZURÜCKSETZEN
    // ==================================================

    nextChoice = 1;

    playerChoices = [];

    finalChoice = null;


    // Anfangsvideo
    videoSource.src =
        "vidosiki/nachalo.mp4";

    film.load();

    film.currentTime = 0;


    // Buttons verstecken
    choiceButtons.style.display = "none";

    repeatButton.style.display = "none";


    // Startmusik
    startMusic.currentTime = 0;

    startMusic.volume =
        Number(volumeSlider.value);

    startMusic.play();

});