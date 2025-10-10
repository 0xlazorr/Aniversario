document.addEventListener('DOMContentLoaded', () => {
    const modals = {
        secretHeart: document.getElementById('secret-heart-modal'),
        secretWord: document.getElementById('secret-word-modal'),
        daysCounter: document.getElementById('days-counter-modal'),
        quizSuccess: document.getElementById('quiz-success-modal'),
        quizFeedback: document.getElementById('quiz-feedback-modal'),
        quizFail: document.getElementById('quiz-fail-modal'),
    };

    function openModal(modal) {
        if (!modal) return;
        modal.classList.remove('opacity-0', 'pointer-events-none');
        modal.querySelector('div:first-child').classList.remove('scale-95');
    }

    function closeModal(modal) {
        if (!modal) return;
        modal.classList.add('opacity-0');
        modal.querySelector('div:first-child').classList.add('scale-95');
        setTimeout(() => modal.classList.add('pointer-events-none'), 300);
    }

    document.getElementById('secret-heart').addEventListener('click', () => openModal(modals.secretHeart));
    document.getElementById('secret-word-journey').addEventListener('click', () => openModal(modals.secretWord));
    document.getElementById('days-counter-trigger').addEventListener('click', () => {
        const anniversaryDate = new Date(2024, 10, 26);
        const today = new Date();
        const differenceInTime = today.getTime() - anniversaryDate.getTime();
        const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
        document.getElementById('days-count').textContent = differenceInDays.toLocaleString();
        openModal(modals.daysCounter);
    });

    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', e => {
            if (e.target === modal) closeModal(modal);
        });
    });
    document.querySelectorAll('.close-modal-btn').forEach(btn => {
        btn.addEventListener('click', () => closeModal(btn.closest('.modal')));
    });

    // --- Countdown Timer Logic ---
    const countdownDate = new Date("Nov 26, 2025 00:00:00").getTime();
    const countdownTimer = setInterval(function () {
        const now = new Date().getTime();
        const distance = countdownDate - now;
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        document.getElementById("days").innerText = days < 0 ? 0 : days;
        document.getElementById("hours").innerText = hours < 0 ? 0 : hours;
        document.getElementById("minutes").innerText = minutes < 0 ? 0 : minutes;
        document.getElementById("seconds").innerText = seconds < 0 ? 0 : seconds;
        if (distance < 0) {
            clearInterval(countdownTimer);
            const countdownSection = document.getElementById("countdown-section");
            countdownSection.innerHTML = `<h2 class="font-title text-2xl text-rose-700">Happy Anniversary! ❤️</h2>`;
            countdownSection.classList.add('py-4');
        }
    }, 1000);

    // --- Audio Player Logic ---
    const audioPlayer = document.getElementById('audio-player');
    const songTitle = document.getElementById('song-title');

    if (audioPlayer && songTitle) {
        audioPlayer.addEventListener('play', () => {
            const source = audioPlayer.querySelector('source');
            if (source) {
                let filename = decodeURIComponent(source.src.split('/').pop());
                filename = filename.substring(0, filename.lastIndexOf('.')) || filename;
                songTitle.textContent = `Now Playing: ${filename}`;
            }
        });

        const clearSongTitle = () => {
            songTitle.textContent = '';
        };

        audioPlayer.addEventListener('pause', clearSongTitle);
        audioPlayer.addEventListener('ended', clearSongTitle);
    }

    // --- Quiz Logic ---
    const submitQuizBtn = document.getElementById('submit-quiz');
    let quizTrials = 0;
    const maxTrials = 3;

    const correctAnswers = { q1: 'a', q2: 'c', q3: 'd', q4: 'b', q5: 'c' };
    const wrongAnswerFeedback = {
        q1: "I thought you were gonna say 'You'. Give it another thought baby😉",
        q2: "That's a beautiful song, but is it my special song?",
        q3: "Something I have never called you !",
        q4: "I keep telling you all the time 🤦‍♂️!",
        q5: "Really?, my favourite animal??."
    };
    const totalQuestions = Object.keys(correctAnswers).length;

    submitQuizBtn.addEventListener('click', () => {
        let wrongFeedbackMessages = [];
        let allAnswered = true;

        for (let i = 1; i <= totalQuestions; i++) {
            const qName = `q${i}`;
            const selected = document.querySelector(`input[name="${qName}"]:checked`);
            if (!selected) {
                allAnswered = false;
                break;
            }
            if (selected.value !== correctAnswers[qName]) {
                wrongFeedbackMessages.push(wrongAnswerFeedback[qName]);
            }
        }

        const feedbackListContainer = document.getElementById('quiz-feedback-list-container');
        feedbackListContainer.innerHTML = ''; // Clear previous feedback

        if (!allAnswered) {
            feedbackListContainer.innerHTML = '<p class="text-center">Please answer all the questions!</p>';
            document.getElementById('quiz-tries-left').textContent = "";
            openModal(modals.quizFeedback);
            return;
        }

        if (wrongFeedbackMessages.length === 0) {
            openModal(modals.quizSuccess);
        } else {
            quizTrials++;
            if (quizTrials >= maxTrials) {
                openModal(modals.quizFail);
                submitQuizBtn.disabled = true;
                submitQuizBtn.classList.add('opacity-50', 'cursor-not-allowed');
                submitQuizBtn.textContent = 'Quiz Locked';
            } else {
                const ul = document.createElement('ul');
                ul.className = 'space-y-3';
                wrongFeedbackMessages.forEach(msg => {
                    const li = document.createElement('li');
                    li.className = 'flex items-start text-left p-3 bg-rose-50 rounded-lg text-sm text-gray-700';
                    li.innerHTML = `
                                <svg class="w-5 h-5 text-red-400 mr-3 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                                </svg>
                                <span>${msg}</span>
                            `;
                    ul.appendChild(li);
                });
                feedbackListContainer.appendChild(ul);
                const trialsLeft = maxTrials - quizTrials;
                document.getElementById('quiz-tries-left').textContent = `You have ${trialsLeft} ${trialsLeft === 1 ? 'try' : 'tries'} left.`;
                openModal(modals.quizFeedback);
            }
        }
    });
});