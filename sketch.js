// ===============================
// THE CHAOTIC RESET
// ===============================

// ---------- Starting Screen ----------

let phase = "intro";
let typed = "";
let intro = "every story needs a setting";
let introIndex = 0;

let settings = ["HOME", "BEACH", "FOREST", "CONCERT"];
let selected = null;

let shuffleCount = 0;
let degradation = 0;

// ---------- Word Generation ----------

let poemWords = ["error", "repeat", "memory", "signal", "lost"];
let floatingWords = [];

// ---------- Setup ----------

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("monospace");
  textAlign(CENTER, CENTER);
}

// ---------- Draw Loop ----------

function draw() {

  if (phase === "intro") {
    background(0, 40);
    drawIntro();
  }

  if (phase === "select") {
    background(0, 40);
    drawSelect();
  }

  if (phase === "play") {
    drawPlay();
    drawBackButton(); // always draw button
  }

  drawPoetry(); // unified word floating for all settings except FOREST
}

// ---------- Intro ----------

function drawIntro() {
  fill(180, 50, 255);
  textSize(40);

  if (frameCount % 4 === 0 && introIndex < intro.length) {
    typed += intro[introIndex];
    introIndex++;
  }

  text(typed, width / 2, height / 2);

  if (introIndex === intro.length && frameCount > 215) {
    phase = "select";
  }
}

// ---------- Selection ----------

function drawSelect() {
  textSize(20);

  for (let i = 0; i < settings.length; i++) {
    let y = height / 2 - 150 + i * 45;

    fill(200);
    rectMode(CENTER);
    rect(width / 2, y, 220, 40);

    fill(0);
    text(settings[i], width / 2, y);
  }

  // ---------- Updated hint line ----------
  fill(200, 180, 255);
  textSize(16);
  text("Keep clicking inside to discover a hidden reality!", width / 2, height / 2 + 110);
}

// ---------- Main Play ----------

function drawPlay() {

  // ---------- BACKGROUND ----------
  if (selected !== "BEACH") {
    let c = max(255 - degradation, 60);
    background(c, c, c); 
  }

  // ---------- BEACH ----------
  if (selected === "BEACH") {

    let nightFade = constrain(degradation / 350, 0, 1);

    let r = lerp(159, 40, nightFade);
    let g = lerp(167, 0, nightFade);
    let b = lerp(237, 70, nightFade);

    background(r, g, b);

    drawSun(nightFade);
    drawWaves();

    // 3 trees initially, 1 after degradation
    if (degradation < 150) {
      drawPalmTree(90, height + 20);
      drawPalmTree(267, height + 20);
      drawPalmTree(430, height + 20);
    } else {
      drawPalmTree(267, height + 20);
    }

    if (degradation > 260) drawJellyfish();
  }

  // ---------- FOREST ---------- (restored snippet)
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

  // ---------- HOME ----------
  if (selected === "HOME") {
    fill(150 - degradation / 3);
    rect(width / 2, height / 2, 300, 200);
  }

  // ---------- CONCERT ----------
  if (selected === "CONCERT") {
    fill(0, degradation > 120 ? 255 : 0, 0);
    text(degradation > 120 ? "MATRIX" : "LIGHTS ON", width / 2, height / 2);
  }

  // ---------- FORCE WHITE SETTING LABEL ----------
  fill(255);
  textSize(28);
  text(selected, width / 2, 60);
}

// ---------- Sun → Moon ----------

function drawSun(nightFade) {

  let oscillate = sin(frameCount * 0.05);

  let sunR = lerp(255, 255, oscillate);
  let sunG = lerp(140, 220, (oscillate + 1) / 2);
  let sunB = lerp(0, 50, (oscillate + 1) / 2);

  let moonR = 230;
  let moonG = 230;
  let moonB = 255;

  let finalR = lerp(sunR, moonR, nightFade);
  let finalG = lerp(sunG, moonG, nightFade);
  let finalB = lerp(sunB, moonB, nightFade);

  fill(finalR, finalG, finalB);
  stroke(finalR, finalG, finalB);
  strokeWeight(8);

  circle(109, 108, 150);
}

// ---------- Waves ----------

function drawWaves() {

  noStroke();

  for (let y = height - 80; y < height; y += 4) {

    let inter = map(y, height - 80, height, 0, 1);

    fill(
      lerp(47, 20, inter),
      lerp(120, 60, inter),
      lerp(204, 150, inter)
    );

    beginShape();

    for (let x = 0; x <= width; x += 20) {
      let wave = sin(frameCount * 0.06 + x * 0.03) * 13;
      vertex(x, y + wave);
    }

    vertex(width, height);
    vertex(0, height);
    endShape(CLOSE);
  }
}

// ---------- Palm Tree ----------

function drawPalmTree(baseX, baseY) {

  fill("#8b5a00");
  noStroke();
  rect(baseX, baseY - 94, 20, 140);

  let topX = baseX + 10;
  let topY = baseY - 140;
  let sway = sin(frameCount * 0.05) * 0.45;

  fill("#255A0E");

  for (let i = 0; i < 4; i++) {
    push();
    translate(topX, topY);
    rotate(i * HALF_PI + sway);
    ellipse(0, -45, 40, 85);
    pop();
  }
}

// ---------- Jellyfish ----------

function drawJellyfish() {

  for (let i = 0; i < 3; i++) {

    let x = width * (0.25 + i * 0.25) +
            sin(frameCount * 0.02 + i) * 20;

    let y = height - 60 +
            sin(frameCount * 0.04 + i) * 10;

    fill(160, 230, 255, 160);
    noStroke();
    ellipse(x, y, 20, 14);

    stroke(160, 230, 255, 120);

    for (let t = -6; t <= 6; t += 6) {
      line(x + t, y + 6, x + t, y + 20);
    }
  }
}

// ---------- Back Button (circle + arrow) ----------

function drawBackButton() {

  let bx = width - 50;
  let by = 40;

  fill(255);
  stroke(0);
  strokeWeight(2);
  circle(bx, by, 35);

  noStroke();
  fill(0);
  triangle(bx - 5, by, bx + 5, by - 6, bx + 5, by + 6);
}

// ---------- Poetry (slightly faster fade for non-FOREST) ----------

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

    if (selected === "FOREST") {
      fill(200, 50, 255, w.alpha);
      text(w.text, w.x, w.y);
      w.alpha -= 2;
    } else {
      fill(200, 50, 255, w.alpha);
      text(w.text, w.x, w.y);
      w.alpha -= 3; // slightly faster fade
    }
  }

  floatingWords = floatingWords.filter(w => w.alpha > 0);
}

// ---------- Mouse ----------

function mousePressed() {

  // Back button detection
  if (phase === "play" &&
      dist(mouseX, mouseY, width - 50, 40) < 18) {

    phase = "select";
    degradation = 0;
    floatingWords = [];
    return;
  }

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

// ---------- Shuffle ----------

function shuffleWorld() {
  shuffleCount++;
  degradation += random(10, 20); // slower degradation for more clicks
  generateWord();
}
