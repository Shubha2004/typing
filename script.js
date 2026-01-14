const quoteDisplay = document.getElementById('quote-display');
const quoteInput = document.getElementById('quote-input');
const timerElement = document.getElementById('timer');
const wpmElement = document.getElementById('wpm');
const accuracyElement = document.getElementById('accuracy');
const restartBtn = document.getElementById('restart');

let timeLeft = 60;
let timerRunning = false;
let timerId;
let startTime;
let totalChars = 0;
let errors = 0;

// Hardcoded quotes (expand as needed)
const quotes = [
    "The quick brown fox jumps over the lazy dog.",
    "Practice makes perfect in all things you do.",
    "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    "Life is what happens when you're busy making other plans.",
    "The only way to do great work is to love what you do."
];

function getRandomQuote() {
    return quotes[Math.floor(Math.random() * quotes.length)];
}

function renderNewQuote() {
    const quote = getRandomQuote();
    quoteDisplay.innerHTML = '';
    quote.split('').forEach(char => {
        const span = document.createElement('span');
        span.textContent = char;
        quoteDisplay.appendChild(span);
    });
    quoteInput.value = '';
    quoteInput.focus();
    totalChars = 0;
    errors = 0;
}

function startTimer() {
    if (!timerRunning) {
        timerRunning = true;
        startTime = new Date();
        timerId = setInterval(() => {
            timeLeft--;
            timerElement.textContent = timeLeft;
            if (timeLeft <= 0) {
                endTest();
            }
        }, 1000);
    }
}

function updateStats() {
    const timeElapsed = (new Date() - startTime) / 60000; // in minutes
    const wpm = Math.round((totalChars / 5) / timeElapsed) || 0;
    const accuracy = Math.round(((totalChars - errors) / totalChars) * 100) || 100;
    wpmElement.textContent = wpm;
    accuracyElement.textContent = accuracy;
}

function endTest() {
    clearInterval(timerId);
    quoteInput.disabled = true;
    updateStats();
    alert(`Test over!\nWPM: ${wpmElement.textContent}\nAccuracy: ${accuracyElement.textContent}%`);
}

quoteInput.addEventListener('input', () => {
    startTimer();
    const quoteSpans = quoteDisplay.querySelectorAll('span');
    const inputValue = quoteInput.value;
    totalChars = inputValue.length;

    let hasError = false;
    quoteSpans.forEach((span, index) => {
        const char = inputValue[index];
        if (char == null) {
            span.classList.remove('correct', 'incorrect');
        } else if (char === span.textContent) {
            span.classList.add('correct');
            span.classList.remove('incorrect');
        } else {
            span.classList.add('incorrect');
            span.classList.remove('correct');
            hasError = true;
        }
    });

    if (hasError) errors++;
    updateStats();

    // End if quote is fully typed
    if (inputValue.length === quoteDisplay.textContent.length) {
        endTest();
    }
});

// Prevent copy-paste for fair testing
quoteInput.addEventListener('paste', (e) => e.preventDefault());

restartBtn.addEventListener('click', () => {
    clearInterval(timerId);
    timeLeft = 60;
    timerElement.textContent = timeLeft;
    timerRunning = false;
    quoteInput.disabled = false;
    wpmElement.textContent = '0';
    accuracyElement.textContent = '100';
    renderNewQuote();
});

// Initial setup
renderNewQuote();