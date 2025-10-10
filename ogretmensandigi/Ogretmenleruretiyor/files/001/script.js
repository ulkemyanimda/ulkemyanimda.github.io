document.addEventListener('DOMContentLoaded', () => {
    // Görsel dosyalarını ve karşılık gelen metinleri tanımla
    const gameData = [
        { text: "Merhaba", image: "MERHABA.jpg" },
        { text: "Nasılsın?", image: "NASILSIN.jpg" },
        { text: "Günaydın", image: "GÜNAYDIN.jpg" },
        { text: "İyi geceler", image: "İYİ GECELER.jpg" },
        { text: "Afiyet olsun", image: "AFİYET OLSUN.jpg" },
        { text: "Eline sağlık", image: "ELİNE SAĞLIK.jpg" },
        { text: "Sıhhatler olsun", image: "SIHHATLER OLSUN.jpg" },
        { text: "Geçmiş olsun", image: "GEÇMİŞ OLSUN.jpg" },
        { text: "Çok yaşa", image: "ÇOK YAŞA.jpg" },
        { text: "İyi dersler", image: "İYİ DERSLER.jpg" }
    ];

    // HTML elementlerini seç
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const endScreen = document.getElementById('end-screen');

    const startButton = document.getElementById('start-button');
    const restartButton = document.getElementById('restart-button');
    const playSoundButton = document.getElementById('play-sound-button');

    const scoreDisplay = document.getElementById('score');
    const timerDisplay = document.getElementById('timer');
    const finalScoreDisplay = document.getElementById('final-score');

    const choice1 = document.getElementById('choice1');
    const choice2 = document.getElementById('choice2');
    const feedback = document.getElementById('feedback');

    // Oyun değişkenleri
    let score = 0;
    let timer;
    let timeLeft = 60;
    let currentCorrectAnswer = null;
    let timerInterval;
    let isClickable = true;

    // Tarayıcının konuşma sentezi özelliğini kullanarak metni seslendirir
    function speak(text) {
        // Eski mesajları iptal et
        window.speechSynthesis.cancel(); 
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'tr-TR'; // Dili Türkçe olarak ayarla
        utterance.rate = 0.9; // Konuşma hızını ayarla
        window.speechSynthesis.speak(utterance);
    }

    // Yeni bir tur başlatır
    function nextRound() {
        isClickable = true;
        feedback.textContent = '';
        feedback.className = '';
        choice1.style.borderColor = 'transparent';
        choice2.style.borderColor = 'transparent';

        // Rastgele bir doğru cevap seç
        const availableData = [...gameData];
        const correctIndex = Math.floor(Math.random() * availableData.length);
        currentCorrectAnswer = availableData.splice(correctIndex, 1)[0];

        // Rastgele bir yanlış cevap seç (doğru cevaptan farklı olmalı)
        const wrongIndex = Math.floor(Math.random() * availableData.length);
        const wrongAnswer = availableData[wrongIndex];

        // Görselleri rastgele bir sırayla yerleştir
        if (Math.random() > 0.5) {
            choice1.src = currentCorrectAnswer.image;
            choice1.dataset.answer = currentCorrectAnswer.text;
            choice2.src = wrongAnswer.image;
            choice2.dataset.answer = wrongAnswer.text;
        } else {
            choice1.src = wrongAnswer.image;
            choice1.dataset.answer = wrongAnswer.text;
            choice2.src = currentCorrectAnswer.image;
            choice2.dataset.answer = currentCorrectAnswer.text;
        }

        // Doğru cevabın sesini çal
        speak(currentCorrectAnswer.text);
    }
    
    // Cevabı kontrol eder
    function checkAnswer(selectedAnswer) {
        if (!isClickable) return;
        isClickable = false;

        if (selectedAnswer === currentCorrectAnswer.text) {
            score += 10;
            feedback.textContent = 'Doğru!';
            feedback.className = 'correct';
            scoreDisplay.textContent = `Puan: ${score}`;
        } else {
            feedback.textContent = 'Yanlış!';
            feedback.className = 'incorrect';
        }

        // 1.5 saniye sonra yeni tura geç
        setTimeout(nextRound, 1500);
    }

    // Zamanlayıcıyı günceller
    function updateTimer() {
        timeLeft--;
        timerDisplay.textContent = `Süre: ${timeLeft}`;
        if (timeLeft <= 0) {
            endGame();
        }
    }

    // Oyunu başlatır
    function startGame() {
        score = 0;
        timeLeft = 60;
        scoreDisplay.textContent = `Puan: ${score}`;
        timerDisplay.textContent = `Süre: ${timeLeft}`;
        
        startScreen.classList.remove('active');
        endScreen.classList.remove('active');
        gameScreen.classList.add('active');

        timerInterval = setInterval(updateTimer, 1000);
        nextRound();
    }
    
    // Oyunu bitirir
    function endGame() {
        clearInterval(timerInterval);
        gameScreen.classList.remove('active');
        endScreen.classList.add('active');
        finalScoreDisplay.textContent = `Toplam Puanın: ${score}`;
    }

    // Olay dinleyicileri
    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', startGame);
    
    choice1.addEventListener('click', () => checkAnswer(choice1.dataset.answer));
    choice2.addEventListener('click', () => checkAnswer(choice2.dataset.answer));

    playSoundButton.addEventListener('click', () => {
        if (currentCorrectAnswer) {
            speak(currentCorrectAnswer.text);
        }
    });
});