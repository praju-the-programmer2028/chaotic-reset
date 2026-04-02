// ===============================
// THE CHAOTIC RESET
// ===============================
// This is a web-based computational poetry/game
// Users explore familiar environments that degrade over time
// The system reveals hidden chaos, tying to "poetic, uncertain"
// Inspiration: dystopian novels (Lord of the Flies, Fahrenheit 451)
// and interactive games (Roblox, slither.io)

// ---------- Starting Screen ----------

// Current phase: intro, select, or play
let phase = "intro";

// Typing effect for intro text
let typed = "";
let intro = "every story needs a setting"; // opening poetic line
let introIndex = 0; // tracks which character to show next

// Menu settings for user to select
let settings = ["HOME", "BEACH", "FOREST", "CONCERT"];
let selected = null; // tracks currently selected setting

// Counts clicks/shuffles to control degradation
let shuffleCount = 0;
let degradation = 0; // tracks visual/word decay across environments

// ---------- Word Generation ----------

// Words that float and appear over time to create chaos/poetry
let poemWords = ["error", "repeat", "memory", "signal", "lost"];
let floatingWords = []; // stores active words

// ---------- Setup ----------

function setup() {
  createCanvas(windowWidth, windowHeight); // full-window canvas
  textFont("monospace"); // monospace font gives dystopian feel
  textAlign(CENTER, CENTER); // center all text on screen
}

// ---------- Draw Loop ----------

function draw() {
  // Handle each phase of the experience

  if (phase === "intro") {
    background(0, 40); // dark background with fade effect
    drawIntro(); // show the typing intro text
  }

  if (phase === "select") {
    background(0, 40); // fade effect behind menu
    drawSelect(); // show setting choices
  }

  if (phase === "play") {
    drawPlay(); // render current environment
    drawBackButton(); // always show back button
  }

  drawPoetry(); // render floating words in all settings except FOREST (handled differently)
}

// ---------- Intro Screen ----------

function drawIntro() {
  fill(180, 50, 255); // purple for poetic effect
  textSize(40);

  // typing effect: add one character every few frames
  if (frameCount % 4 === 0 && introIndex < intro.length) {
    typed += intro[introIndex];
    introIndex++;
  }

  text(typed, width / 2, height / 2); // draw typed line

  // move to selection menu once typing finishes
  if (introIndex === intro.length && frameCount > 215) {
    phase = "select";
  }
}

// ---------- Selection Screen ----------

function drawSelect() {
  textSize(20);

  // Draw each setting button
  for (let i = 0; i < settings.length; i++) {
    let y = height / 2 - 150 + i * 45; // vertical spacing

    fill(200); // light button color
    rectMode(CENTER); // draw rectangle from center
    rect(width / 2, y, 220, 40); // button rectangle

    fill(0); // black text
    text(settings[i], width / 2, y); // button label
  }

  // Instruction text encouraging exploration
  fill(200, 180, 255);
  textSize(16);
  text("Keep clicking inside to discover a hidden reality!", width / 2, height / 2 + 110);
}

// ---------- Main Play Screen ----------

function drawPlay() {

  // ---------- GENERAL BACKGROUND ----------
  if (selected !== "BEACH") {
    let c = max(255 - degradation, 60); // fade to dark grey with clicks
    background(c, c, c); 
  }

  // ---------- BEACH ENVIRONMENT ----------
  if (selected === "BEACH") {

    let nightFade = constrain(degradation / 350, 0, 1); // tracks day → night

    // interpolate colors for sky fade
    let r = lerp(159, 40, nightFade);
    let g = lerp(167, 0, nightFade);
    let b = lerp(237, 70, nightFade);

    background(r, g, b);

    drawSun(nightFade); // sun → moon transition
    drawWaves();        // draw moving ocean waves

    // Draw palm trees; reduce number as degradation increases
    if (degradation < 150) {
      drawPalmTree(90, height + 20);
      drawPalmTree(267, height + 20);
      drawPalmTree(430, height + 20);
    } else {
      drawPalmTree(267, height + 20); // only one tree remains
    }

    // Add jellyfish after high degradation
    if (degradation > 260) drawJellyfish();
  }

  // ---------- FOREST ENVIRONMENT ----------
  if (selected === "FOREST") {
    for (let i = 0; i < 40; i++) {
      stroke(0, 120, 0); // green for trees
      line(i * 40, height, i * 40, height - random(100, 300)); // tree lines
    }

    // Add fog / visual degradation over time
    if (degradation > 120) {
      fill(0, 0, 150, 120); // semi-transparent blue overlay
      rect(0, height - 150, width, 150);
    }
  }

  // ---------- HOME ENVIRONMENT ----------
  if (selected === "HOME") {
    fill(150 - degradation / 3); // fade the rectangle as world degrades
    rect(width / 2, height / 2, 300, 200);
  }

  // ---------- CONCERT ENVIRONMENT ----------
  if (selected === "CONCERT") {
    fill(0, degradation > 120 ? 255 : 0, 0); // red text after degradation
    text(degradation > 120 ? "MATRIX" : "LIGHTS ON", width / 2, height / 2);
  }

  // ---------- DISPLAY CURRENT SETTING ----------
  fill(255);
  textSize(28);
  text(selected, width / 2, 60);
}

// ---------- Sun → Moon Transition ----------

function drawSun(nightFade) {

  let oscillate = sin(frameCount * 0.05); // subtle oscillation

  // sun color changes slightly over time
  let sunR = lerp(255, 255, oscillate);
  let sunG = lerp(140, 220, (oscillate + 1) / 2);
  let sunB = lerp(0, 50, (oscillate + 1) / 2);

  // moon color
  let moonR = 230;
  let moonG = 230;
  let moonB = 255;

  // final color interpolated between sun and moon
  let finalR = lerp(sunR, moonR, nightFade);
  let finalG = lerp(sunG, moonG, nightFade);
  let finalB = lerp(sunB, moonB, nightFade);

  fill(finalR, finalG, finalB);
  stroke(finalR, finalG, finalB);
  strokeWeight(8);

  circle(109, 108, 150); // sun/moon shape
}

// ---------- Waves ----------

function drawWaves() {
  noStroke();

  for (let y = height - 80; y < height; y += 4) {
    let inter = map(y, height - 80, height, 0, 1);

    // gradient fill for waves
    fill(
      lerp(47, 20, inter),
      lerp(120, 60, inter),
      lerp(204, 150, inter)
    );

    beginShape();

    for (let x = 0; x <= width; x += 20) {
      let wave = sin(frameCount * 0.06 + x * 0.03) * 13; // wave motion
      vertex(x, y + wave);
    }

    vertex(width, height); // close shape
    vertex(0, height);
    endShape(CLOSE);
  }
}

// ---------- Palm Tree ----------

function drawPalmTree(baseX, baseY) {
  fill("#8b5a00"); // brown trunk
  noStroke();
  rect(baseX, baseY - 94, 20, 140); // tree trunk

  let topX = baseX + 10;
  let topY = baseY - 140;
  let sway = sin(frameCount * 0.05) * 0.45; // swaying leaves

  fill("#255A0E"); // green leaves

  for (let i = 0; i < 4; i++) {
    push();
    translate(topX, topY);
    rotate(i * HALF_PI + sway); // rotate each leaf
    ellipse(0, -45, 40, 85); // leaf shape
    pop();
  }
}

// ---------- Jellyfish ----------

function drawJellyfish() {
  for (let i = 0; i < 3; i++) {

    let x = width * (0.25 + i * 0.25) + sin(frameCount * 0.02 + i) * 20;
    let y = height - 60 + sin(frameCount * 0.04 + i) * 10;

    fill(160, 230, 255, 160); // translucent jellyfish
    noStroke();
    ellipse(x, y, 20, 14); // jellyfish body

    stroke(160, 230, 255, 120); // tentacles
    for (let t = -6; t <= 6; t += 6) {
      line(x + t, y + 6, x + t, y + 20);
    }
  }
}

// ---------- Back Button ----------

function drawBackButton() {
  let bx = width - 50;
  let by = 40;

  fill(255);
  stroke(0);
  strokeWeight(2);
  circle(bx, by, 35); // white circle for button

  noStroke();
  fill(0);
  triangle(bx - 5, by, bx + 5, by - 6, bx + 5, by + 6); // arrow
}

// ---------- Poetry Words ----------

function generateWord() {
  // pick a random word and place it somewhere
  floatingWords.push({
    text: random(poemWords),
    x: random(width),
    y: random(height),
    alpha: 255 // starts fully visible
  });
}

function drawPoetry() {
  for (let w of floatingWords) {
    fill(200, 50, 255, w.alpha); // purple words
    text(w.text, w.x, w.y);

    if (selected === "FOREST") {
      w.alpha -= 2; // slower fade in forest for eerie effect
    } else {
      w.alpha -= 3; // faster fade for other settings
    }
  }

  // remove words that are fully faded
  floatingWords = floatingWords.filter(w => w.alpha > 0);
}

// ---------- Mouse Interaction ----------

function mousePressed() {

  // Check if user clicked back button
  if (phase === "play" && dist(mouseX, mouseY, width - 50, 40) < 18) {
    phase = "select";
    degradation = 0; // reset degradation
    floatingWords = []; // clear words
    return;
  }

  // Handle selection menu clicks
  if (phase === "select") {
    for (let i = 0; i < settings.length; i++) {
      let y = height / 2 - 150 + i * 50;

      if (mouseY > y - 20 && mouseY < y + 20) {
        selected = settings[i];
        phase = "play"; // move to play mode
      }
    }

  } else if (phase === "play") {
    shuffleWorld(); // generate chaos on each click
  }
}

// ---------- Shuffle / Degradation ----------

function shuffleWorld() {
  shuffleCount++; // count clicks
  degradation += random(10, 20); // increase degradation with some variation
  generateWord(); // spawn a poetic word
}
