// ===============================
// THE CHAOTIC LOOP
// ===============================

// ---------- GLOBAL STATE ----------
let phase = "intro";
let typed = "";
let intro = "every story needs a setting";
let introIndex = 0;

let settings = ["BEACH", "FOREST", "CONCERT", "PARK", "HOME", "FICTIONAL"];
let selected = null;

let shuffleCount = 0;
let degradation = 0;

// ---------- POETRY ----------
let poemWords = ["error", "repeat", "memory", "signal", "lost"];
let floatingWords = [];

// ---------- SETUP ----------
function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("monospace");
  textAlign(CENTER, CENTER);
}

// ---------- DRAW LOOP ----------
function draw() {
  background(0, 40);

  if (phase === "intro") drawIntro();
  if (phase === "select") drawSelect();
  if (phase === "play") drawPlay();
}

// ---------- INTRO ----------
function drawIntro() {
  fill(180, 50, 255);
  textSize(40);

  if (frameCount % 4 === 0 && introIndex < intro.length) {
    typed += intro[introIndex];
    introIndex++;
  }

  text(typed, width / 2, height / 2);

  if (introIndex === intro.length && frameCount > 200) {
    phase = "select";
  }
}

// ---------- SETTING SELECT ----------
function drawSelect() {
  textSize(20);

  for (let i = 0; i < settings.length; i++) {
    let y = height / 2 - 150 + i * 50;

    fill(200);
    rectMode(CENTER);
    rect(width / 2, y, 220, 40);

    fill(0);
    text(settings[i], width / 2, y);
  }
}

// ---------- GAMEPLAY ----------
function drawPlay() {
  let c = max(255 - degradation, 60);
  background(c, c, c);

  fill(0);
  textSize(28);
  text(selected, width / 2, 60);

  // ENVIRONMENTS
  if (selected === "FOREST") {
    for (let i = 0; i < 40; i++) {
      stroke(0, 120, 0);
      line(i * 40, height, i * 40, height - random(100, 300));
    }
    if (degradation > 120) {
      fill(0, 0, 150, 120);
      rect(0, height - 150, width, 150);
    }
  }

  if (selected === "HOME") {
    fill(150 - degradation / 3);
    rect(width / 2, height / 2, 300, 200);
  }

  if (selected === "CONCERT") {
    fill(0, degradation > 120 ? 255 : 0, 0);
    text(degradation > 120 ? "MATRIX" : "LIGHTS ON", width / 2, height / 2);
  }

  drawPoetry();
}

// ---------- POETRY ----------
function generateWord() {
  floatingWords.push({
    text: random(poemWords),
    x: random(width),
    y: random(height),
    alpha: 255
  });
}

function drawPoetry() {
  for (let w of floatingWords) {
    fill(200, 50, 255, w.alpha);
    text(w.text, w.x, w.y);
    w.alpha -= 2;
  }
}

// ---------- INTERACTION ----------
function mousePressed() {
  if (phase === "select") {
    for (let i = 0; i < settings.length; i++) {
      let y = height / 2 - 150 + i * 50;
      if (mouseY > y - 20 && mouseY < y + 20) {
        selected = settings[i];
        phase = "play";
      }
    }
  } else if (phase === "play") {
    shuffleWorld();
  }
}

// ---------- SHUFFLE ----------
function shuffleWorld() {
  shuffleCount++;
  degradation += random(20, 40);
  generateWord();
}

// ---------- RESIZE ----------
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

