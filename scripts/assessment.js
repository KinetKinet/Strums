import { fetchChordLibrary } from './chord-data-api.js';

const strings = ['E', 'A', 'D', 'G', 'B', 'e'];

let chordPatterns = {};
let availableChords = [];

let currentQuestion = 0;
let score = 0;
let currentChordKey = '';
let selectedAnswer = null;
let questionsAsked = [];

function renderChordDiagram(chordKey, containerId) {
  const currentChord = chordPatterns[chordKey];
  const container = document.getElementById(containerId);
  if (!currentChord || !container) return;

  let startingFret = 0;
  let hasBarre = false;
  if (currentChord.barre && typeof currentChord.barre.fret === 'number') {
    startingFret = currentChord.barre.fret;
    hasBarre = Array.isArray(currentChord.barre.strings) && currentChord.barre.strings.length > 0;
  }

  let html = `
    <div class="diagram-wrapper">
      <div class="diagram">
        <div class="string-labels">
          ${strings.map((s) => `<div class="string-label">${s}</div>`).join('')}
        </div>
        <div class="fretboard-container">
          <div class="fret-numbers">
  `;

  const fretRange = [];
  if (hasBarre) {
    for (let i = 0; i < 5; i += 1) {
      fretRange.push(startingFret + i);
    }
  } else {
    for (let i = 1; i <= 5; i += 1) {
      fretRange.push(i);
    }
  }

  fretRange.forEach((fretNum) => {
    html += `<div>${fretNum}</div>`;
  });

  html += `
          </div>
          <div class="fretboard">
  `;

  fretRange.forEach((fretNum) => {
    html += '<div class="fret">';

    if (hasBarre && fretNum === startingFret) {
      const barreStrings = currentChord.barre.strings;
      const minString = Math.min(...barreStrings);
      const maxString = Math.max(...barreStrings);
      const barreWidth = (maxString - minString + 1) * 48;
      const barreLeft = minString * 48;

      html += `<div class="barre-bar" style="left: ${barreLeft}px; width: ${barreWidth}px;"></div>`;
    }

    for (let stringIndex = 0; stringIndex < 6; stringIndex += 1) {
      const chordFret = currentChord.frets[stringIndex];
      html += '<div class="string-position">';
      html += '<div class="string-line"></div>';

      if (chordFret === fretNum && fretNum > 0) {
        html += `
          <div class="finger-dot">
            ${currentChord.fingers[stringIndex]}
          </div>
        `;
      } else if (hasBarre && fretNum === startingFret && currentChord.barre.strings.includes(stringIndex)) {
        html += `<div class="barre-dot">${currentChord.fingers[stringIndex]}</div>`;
      }

      if (chordFret === 0 && fretNum === fretRange[0]) {
        html += '<div class="open-string">O</div>';
      }

      if (chordFret === -1 && fretNum === fretRange[0]) {
        html += '<div class="muted-string">x</div>';
      }

      html += '</div>';
    }
    html += '</div>';
  });

  html += `
          </div>
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
            <span style="color: #dc2626; font-size: 1.25rem; font-weight: bold;">x</span>
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
  while (chords.length < count && availableChords.length > 0) {
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

  const correctChord = currentChordKey;
  const wrongChords = availableChords.filter((c) => c !== correctChord);
  const selectedWrong = [];

  while (selectedWrong.length < 3 && wrongChords.length > selectedWrong.length) {
    const randomWrong = wrongChords[Math.floor(Math.random() * wrongChords.length)];
    if (!selectedWrong.includes(randomWrong)) {
      selectedWrong.push(randomWrong);
    }
  }

  const answerArray = [correctChord, ...selectedWrong];
  const shuffled = answerArray.sort(() => Math.random() - 0.5);
  const correctIndex = shuffled.indexOf(correctChord);

  options.forEach((btn, index) => {
    btn.textContent = shuffled[index] || '';
    btn.setAttribute('data-chord', shuffled[index] || '');
    btn.setAttribute('data-correct', String(index === correctIndex));
    btn.onclick = () => selectOption(btn);
  });
}

function selectOption(button) {
  if (selectedAnswer !== null) return;

  disableOptions();
  selectedAnswer = button.getAttribute('data-chord');
  const isCorrect = button.getAttribute('data-correct') === 'true';

  button.classList.add(isCorrect ? 'correct' : 'incorrect');

  if (isCorrect) {
    score += 1;
    showFeedback('Correct!', 'correct');
    playChordSound();
  } else {
    const correctChord = document.querySelector('[data-correct="true"]');
    if (correctChord) {
      correctChord.classList.add('correct');
    }
    showFeedback(`Wrong! The correct answer is ${currentChordKey}`, 'incorrect');
  }

  setTimeout(() => {
    currentQuestion += 1;
    if (currentQuestion < 4) {
      displayQuestion();
    } else {
      showResults();
    }
  }, 2000);
}

function showFeedback(message, type) {
  const container = document.getElementById('feedbackContainer');
  if (container) {
    container.innerHTML = `<div class="feedback ${type}">${message}</div>`;
  }
}

function clearFeedback() {
  const container = document.getElementById('feedbackContainer');
  if (container) {
    container.innerHTML = '';
  }
}

function disableOptions() {
  document.querySelectorAll('.option-btn').forEach((btn) => {
    btn.disabled = true;
  });
}

function enableOptions() {
  document.querySelectorAll('.option-btn').forEach((btn) => {
    btn.disabled = false;
    btn.classList.remove('correct', 'incorrect');
  });
}

function updateProgressBar() {
  const progressPercentage = (currentQuestion / 4) * 100;
  const progressFill = document.getElementById('progressFill');
  const currentQuestionEl = document.getElementById('currentQuestion');

  if (progressFill) {
    progressFill.style.width = `${progressPercentage}%`;
  }
  if (currentQuestionEl) {
    currentQuestionEl.textContent = String(currentQuestion + 1);
  }
}

function playChordSound() {
  console.log(`Playing sound for ${currentChordKey}`);
}

function showResults() {
  const percentage = Math.round((score / 4) * 100);
  const scoreDisplay = document.getElementById('scoreDisplay');
  const percentageDisplay = document.getElementById('percentageDisplay');
  const resultMessage = document.getElementById('resultMessage');

  if (scoreDisplay) scoreDisplay.textContent = `${score}/4`;
  if (percentageDisplay) percentageDisplay.textContent = `${percentage}%`;

  let message = '';
  if (score === 4) {
    message = 'Perfect! You are a chord master!';
  } else if (score >= 3) {
    message = 'Great job! You are getting the hang of it!';
  } else if (score >= 2) {
    message = 'Good effort! Keep practicing!';
  } else {
    message = 'Keep practicing! You will improve!';
  }

  if (resultMessage) {
    resultMessage.textContent = message;
  }

  switchScreen('resultsScreen');
}

function switchScreen(screenId) {
  document.querySelectorAll('.screen').forEach((screen) => {
    screen.classList.remove('active');
  });
  const target = document.getElementById(screenId);
  if (target) {
    target.classList.add('active');
  }
}

function resetAssessment() {
  currentQuestion = 0;
  score = 0;
  selectedAnswer = null;
  questionsAsked = [];
  switchScreen('startScreen');
}

function showDataLoadError(message) {
  const startScreen = document.getElementById('startScreen');
  if (!startScreen) return;

  startScreen.innerHTML = `
    <div class="start-content">
      <h2>Assessment</h2>
      <p>${message}</p>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', async () => {
  if (!document.getElementById('assessmentScreen')) {
    return;
  }

  try {
    const data = await fetchChordLibrary();
    chordPatterns = data.chordPatterns;
    availableChords = data.availableChords;

    if (availableChords.length < 4) {
      showDataLoadError('Not enough chord data found in the database to run the assessment.');
      return;
    }

    const startBtn = document.getElementById('startBtn');
    const restartBtn = document.getElementById('restartBtn');

    if (startBtn) {
      startBtn.addEventListener('click', () => {
        switchScreen('assessmentScreen');
        displayQuestion();
      });
    }

    if (restartBtn) {
      restartBtn.addEventListener('click', resetAssessment);
    }

    switchScreen('startScreen');
  } catch (error) {
    console.error(error);
    showDataLoadError('Unable to load assessment data from the database.');
  }
});
