
const chordPatterns = {
  'C-Major': { frets: [0, 3, 2, 0, 1, 0], fingers: ['x', '3', '2', '0', '1', '0'] },
  'C-Minor': { frets: [-1, 3, 1, 0, 1, 3], fingers: ['x', '3', '1', '0', '1', '4'] },
  'C-7': { frets: [0, 3, 2, 3, 1, 0], fingers: ['x', '3', '2', '4', '1', '0'] },
  'C-Major7': { frets: [0, 3, 2, 0, 0, 0], fingers: ['x', '3', '2', '0', '0', '0'] },
  'C-Minor7': { frets: [-1, 3, 1, 3, 1, 3], fingers: ['x', '3', '1', '4', '1', '4'] },
  'C-Dim': { frets: [-1, 3, 1, 2, 1, 2], fingers: ['x', '4', '1', '3', '1', '2'] },
  'C-Aug': { frets: [-1, 3, 2, 1, 1, 0], fingers: ['x', '4', '3', '2', '1', '0'] },
  'C-Sus4': { frets: [-1, 3, 3, 0, 1, 1], fingers: ['x', '3', '4', '0', '1', '1'] },
  'C-Sus2': { frets: [-1, 3, 0, 0, 1, 3], fingers: ['x', '3', '0', '0', '1', '4'] },
  
  'G-Major': { frets: [3, 2, 0, 0, 0, 3], fingers: ['3', '2', '0', '0', '0', '4'] },
  'G-Minor': { frets: [3, 1, 0, 0, 3, 3], fingers: ['3', '1', '0', '0', '3', '4'] },
  'G-7': { frets: [3, 2, 0, 0, 0, 1], fingers: ['3', '2', '0', '0', '0', '1'] },
  'G-Major7': { frets: [3, 2, 0, 0, 0, 2], fingers: ['3', '2', '0', '0', '0', '4'] },
  'G-Minor7': { frets: [3, 1, 0, 0, 3, 1], fingers: ['3', '1', '0', '0', '4', '1'] },
  
  'D-Major': { frets: [-1, -1, 0, 2, 3, 2], fingers: ['x', 'x', '0', '1', '3', '2'] },
  'D-Minor': { frets: [-1, -1, 0, 2, 3, 1], fingers: ['x', 'x', '0', '2', '3', '1'] },
  'D-7': { frets: [-1, -1, 0, 2, 1, 2], fingers: ['x', 'x', '0', '2', '1', '3'] },
  'D-Major7': { frets: [-1, -1, 0, 2, 2, 2], fingers: ['x', 'x', '0', '1', '1', '1'] },
  
  'A-Major': { frets: [-1, 0, 2, 2, 2, 0], fingers: ['x', '0', '1', '2', '3', '0'] },
  'A-Minor': { frets: [-1, 0, 2, 2, 1, 0], fingers: ['x', '0', '2', '3', '1', '0'] },
  'A-7': { frets: [-1, 0, 2, 0, 2, 0], fingers: ['x', '0', '2', '0', '3', '0'] },
  'A-Major7': { frets: [-1, 0, 2, 1, 2, 0], fingers: ['x', '0', '2', '1', '3', '0'] },
  
  'E-Major': { frets: [0, 2, 2, 1, 0, 0], fingers: ['0', '2', '3', '1', '0', '0'] },
  'E-Minor': { frets: [0, 2, 2, 0, 0, 0], fingers: ['0', '2', '3', '0', '0', '0'] },
  'E-7': { frets: [0, 2, 0, 1, 0, 0], fingers: ['0', '2', '0', '1', '0', '0'] },
  'E-Major7': { frets: [0, 2, 1, 1, 0, 0], fingers: ['0', '2', '1', '3', '0', '0'] },
  
  // Bar chord variations
  'F-Major': { frets: [1, 3, 3, 2, 1, 1], fingers: ['1', '3', '3', '2', '1', '1'], barre: { fret: 1, strings: [0, 4, 5] } },
  'F-Minor': { frets: [1, 3, 3, 1, 1, 1], fingers: ['1', '3', '3', '1', '1', '1'], barre: { fret: 1, strings: [0, 3, 4, 5] } },
  'F-7': { frets: [1, 3, 1, 2, 1, 1], fingers: ['1', '3', '1', '2', '1', '1'], barre: { fret: 1, strings: [0, 4, 5] } },
  'F-Major7': { frets: [1, 3, 3, 2, 1, 0], fingers: ['1', '3', '3', '2', '1', '0'], barre: { fret: 1, strings: [0, 4, 5] } },
  
  'B-Major': { frets: [-1, 2, 4, 4, 4, 2], fingers: ['x', '1', '2', '3', '4', '1'], barre: { fret: 2, strings: [1, 5] } },
  'B-Minor': { frets: [2, 3, 4, 4, 3, 2], fingers: ['1', '2', '3', '4', '2', '1'], barre: { fret: 2, strings: [0, 5] } },
  'B-7': { frets: [2, 4, 2, 4, 3, 2], fingers: ['1', '3', '1', '4', '2', '1'], barre: { fret: 2, strings: [0, 5] } },
  'B-Major7': { frets: [2, 4, 4, 4, 3, 2], fingers: ['1', '3', '3', '3', '2', '1'], barre: { fret: 2, strings: [0, 5] } },
  
  'F#-Major': { frets: [2, 4, 4, 3, 2, 2], fingers: ['1', '3', '3', '2', '1', '1'], barre: { fret: 2, strings: [0, 4, 5] } },
  'F#-Minor': { frets: [2, 4, 4, 2, 2, 2], fingers: ['1', '3', '3', '1', '1', '1'], barre: { fret: 2, strings: [0, 3, 4, 5] } },
  
  'C#-Major': { frets: [4, 6, 6, 6, 6, 4], fingers: ['1', '3', '3', '3', '3', '1'], barre: { fret: 4, strings: [0, 1, 2, 3, 4, 5] } },
  'C#-Minor': { frets: [4, 5, 6, 6, 5, 4], fingers: ['1', '2', '3', '4', '2', '1'], barre: { fret: 4, strings: [0, 5] } },
};

const strings = ['E', 'A', 'D', 'G', 'B', 'e'];
const availableChords = Object.keys(chordPatterns);

let currentQuestion = 0;
let score = 0;
let currentChordKey = '';
let selectedAnswer = null;
let questionsAsked = [];

function renderChordDiagram(chordKey, containerId) {
  const currentChord = chordPatterns[chordKey];
  const container = document.getElementById(containerId);
  
  // Determine starting fret based on barre chord
  let startingFret = 0;
  let hasBarre = false;
  if (currentChord.barre) {
    startingFret = currentChord.barre.fret;
    hasBarre = true;
  }

  let html = `
    <div class="diagram-wrapper">
      <div class="diagram">
        <div class="string-labels">
          ${strings.map(s => `<div class="string-label">${s}</div>`).join('')}
        </div>
        <div class="fretboard-container">
          <div class="fret-numbers">
  `;

  // Generate visible frets
  const fretRange = [];
  if (hasBarre) {
    // For bar chords, show 5 frets starting from the barre position
    for (let i = 0; i < 5; i++) {
      fretRange.push(startingFret + i);
    }
  } else {
    // For regular chords, show frets 1-5
    for (let i = 1; i <= 5; i++) {
      fretRange.push(i);
    }
  }

  // Display fret numbers
  fretRange.forEach((fretNum) => {
    html += `<div>${fretNum}</div>`;
  });

  html += `
          </div>
          <div class="fretboard">
  `;

  // Render each visible fret
  fretRange.forEach((fretNum, fretIdx) => {
    html += '<div class="fret">';
    
    // Add barre bar if this is the barre fret (for bar chords)
    if (hasBarre && fretNum === startingFret) {
      // Calculate barre bar position and width based on which strings have the barre
      const barreStrings = currentChord.barre.strings;
      const minString = Math.min(...barreStrings);
      const maxString = Math.max(...barreStrings);
      const barreWidth = (maxString - minString + 1) * 48; // 48px = 3rem width per string position
      const barreLeft = minString * 48;
      
      html += `<div class="barre-bar" style="left: ${barreLeft}px; width: ${barreWidth}px;"></div>`;
    }

    for (let stringIndex = 0; stringIndex < 6; stringIndex++) {
      const chordFret = currentChord.frets[stringIndex];
      html += '<div class="string-position">';
      html += '<div class="string-line"></div>';
      
      // Show finger dot if this string is played at this fret
      if (chordFret === fretNum && fretNum > 0) {
        html += `
          <div class="finger-dot">
            ${currentChord.fingers[stringIndex]}
          </div>
        `;
      }
      // Show barre dot for strings on the barre
      else if (hasBarre && fretNum === startingFret && currentChord.barre.strings.includes(stringIndex)) {
        html += `<div class="barre-dot">${currentChord.fingers[stringIndex]}</div>`;
      }
      
      // Show open string marker at the first fret position (appears above due to absolute positioning)
      if (chordFret === 0 && fretNum === fretRange[0]) {
        html += '<div class="open-string">O</div>';
      }
      
      // Show muted string marker at the first fret position (appears above due to absolute positioning)
      if (chordFret === -1 && fretNum === fretRange[0]) {
        html += '<div class="muted-string">×</div>';
      }
      
      html += '</div>';
    }
    html += '</div>';
  });

  html += `
          </div>
        </div>
        <div style="display: flex; justify-content: flex-end; margin-top: .5rem; padding-right: 0.25rem;">
        </div>
        <div class="legend">
          <div class="legend-item">
            <div class="legend-dot-open"></div>
            <span>Open</span>
          </div>
          <div class="legend-item">
            <div class="legend-dot-fret"></div>
            <span>Fret</span>
          </div>
          <div class="legend-item">
            <span style="color: #dc2626; font-size: 1.25rem; font-weight: bold;">×</span>
            <span>Muted</span>
          </div>
          <div class="legend-item">
            <div class="legend-dot-barre"></div>
            <span>Barre</span>
          </div>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;
}

function getRandomChords(count) {
  const chords = [];
  const availableSet = new Set(availableChords);
  
  while (chords.length < count && availableSet.size > 0) {
    const randomIndex = Math.floor(Math.random() * availableChords.length);
    const chord = availableChords[randomIndex];
    
    if (!questionsAsked.includes(chord)) {
      chords.push(chord);
      questionsAsked.push(chord);
    }
  }
  
  return chords;
}

function displayQuestion() {
  if (currentQuestion === 0) {
    questionsAsked = [];
  }
  
  if (currentQuestion < 4) {
    if (questionsAsked.length === currentQuestion) {
      const newChords = getRandomChords(1);
      currentChordKey = newChords[0];
    } else {
      currentChordKey = questionsAsked[currentQuestion];
    }
    
    renderChordDiagram(currentChordKey, 'assessmentDiagram');
    displayOptions();
    clearFeedback();
    updateProgressBar();
    selectedAnswer = null;
    enableOptions();
  }
}

function displayOptions() {
  const options = document.querySelectorAll('.option-btn');
  
  // Get correct answer and 3 random wrong answers
  const correctChord = currentChordKey;
  const wrongChords = availableChords.filter(c => c !== correctChord);
  const selectedWrong = [];
  
  for (let i = 0; i < 3; i++) {
    const randomWrong = wrongChords[Math.floor(Math.random() * wrongChords.length)];
    if (!selectedWrong.includes(randomWrong)) {
      selectedWrong.push(randomWrong);
    }
  }
  
  // Create answer array with correct answer randomly placed
  const answerArray = [correctChord, ...selectedWrong];
  const shuffled = answerArray.sort(() => Math.random() - 0.5);
  
  // Store the correct answer index for validation
  const correctIndex = shuffled.indexOf(correctChord);
  
  options.forEach((btn, index) => {
    btn.textContent = shuffled[index];
    btn.setAttribute('data-chord', shuffled[index]);
    btn.setAttribute('data-correct', index === correctIndex);
    btn.onclick = () => selectOption(btn);
  });
}

function selectOption(button) {
  if (selectedAnswer !== null) return; // Prevent multiple answers
  
  disableOptions();
  selectedAnswer = button.getAttribute('data-chord');
  const isCorrect = button.getAttribute('data-correct') === 'true';
  
  button.classList.add(isCorrect ? 'correct' : 'incorrect');
  
  if (isCorrect) {
    score++;
    showFeedback('Correct! 🎉', 'correct');
    playChordSound();
  } else {
    const correctChord = document.querySelector('[data-correct="true"]');
    correctChord.classList.add('correct');
    showFeedback(`Wrong! The correct answer is ${currentChordKey}`, 'incorrect');
  }
  
  setTimeout(() => {
    currentQuestion++;
    if (currentQuestion < 4) {
      displayQuestion();
    } else {
      showResults();
    }
  }, 2000);
}

function showFeedback(message, type) {
  const container = document.getElementById('feedbackContainer');
  container.innerHTML = `<div class="feedback ${type}">${message}</div>`;
}

function clearFeedback() {
  document.getElementById('feedbackContainer').innerHTML = '';
}

function disableOptions() {
  document.querySelectorAll('.option-btn').forEach(btn => {
    btn.disabled = true;
  });
}

function enableOptions() {
  document.querySelectorAll('.option-btn').forEach(btn => {
    btn.disabled = false;
    btn.classList.remove('correct', 'incorrect');
  });
}

function updateProgressBar() {
  const progressPercentage = ((currentQuestion) / 4) * 100;
  document.getElementById('progressFill').style.width = progressPercentage + '%';
  document.getElementById('currentQuestion').textContent = currentQuestion + 1;
}

function playChordSound() {
  // Placeholder for sound playback
  // When you add audio files, use:
  // const audio = new Audio(`../assets/sounds/${currentChordKey}.mp3`);
  // audio.play();
  console.log(`Playing sound for ${currentChordKey}`);
}

function showResults() {
  const percentage = Math.round((score / 4) * 100);
  document.getElementById('scoreDisplay').textContent = `${score}/4`;
  document.getElementById('percentageDisplay').textContent = `${percentage}%`;
  
  let message = '';
  if (score === 4) {
    message = 'Perfect! You\'re a chord master!';
  } else if (score >= 3) {
    message = 'Great job! You\'re getting the hang of it!';
  } else if (score >= 2) {
    message = 'Good effort! Keep practicing!';
  } else {
    message = 'Keep practicing! You\'ll improve!';
  }
  
  document.getElementById('resultMessage').textContent = message;
  
  switchScreen('resultsScreen');
}

function switchScreen(screenId) {
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });
  document.getElementById(screenId).classList.add('active');
}

function resetAssessment() {
  currentQuestion = 0;
  score = 0;
  selectedAnswer = null;
  questionsAsked = [];
  switchScreen('startScreen');
}

// Event listeners
document.getElementById('startBtn').addEventListener('click', () => {
  switchScreen('assessmentScreen');
  displayQuestion();
});

document.getElementById('restartBtn').addEventListener('click', () => {
  resetAssessment();
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  switchScreen('startScreen');
});
