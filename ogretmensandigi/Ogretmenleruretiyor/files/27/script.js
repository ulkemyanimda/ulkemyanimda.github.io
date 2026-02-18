const alfabe = "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ";
let selectedLetter = null;
let score = 0;

// Harflere göre renk dağılımı (Modern ve Renkli bir görünüm için)
const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5', '#9B59B6', '#3498DB', '#E67E22'];

function speak(text) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'tr-TR';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
}

function init() {
    const audioList = document.getElementById('audioList');
    const cardGrid = document.getElementById('cardGrid');

    audioList.innerHTML = "";
    cardGrid.innerHTML = "";

    alfabe.split("").forEach((harf, index) => {
        // Sol Menü Butonları
        const btn = document.createElement('button');
        btn.className = 'audio-btn';
        btn.innerHTML = `<span>🔊</span> ${harf} Harfi`;
        btn.onclick = () => {
            selectedLetter = harf;
            document.querySelectorAll('.audio-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById('currentQuestion').innerText = `${harf} harfi hangisi?`;
            speak(harf);
        };
        audioList.appendChild(btn);

        // Sağ Kartlar (Görsel yerine Yüksek Çözünürlüklü Tasarımsal Harf)
        const card = document.createElement('div');
        card.className = 'card';
        
        // Rastgele ama sabit renk seçimi
        const color = colors[index % colors.length];

        card.innerHTML = `
            <div class="letter-badge" style="
                height: 120px; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                background: linear-gradient(135deg, ${color}22, ${color}44);
                border-radius: 15px;
                border: 2px solid ${color};
            ">
                <span style="
                    font-size: 5rem; 
                    font-weight: 800; 
                    color: ${color};
                    text-shadow: 2px 2px 0px rgba(255,255,255,0.5);
                ">${harf}</span>
            </div>
        `;

        card.onclick = () => {
            if (!selectedLetter) {
                speak("Önce sol taraftan bir harf seçmelisin Çiğdem!");
                return;
            }

            if (harf === selectedLetter) {
                card.classList.add('correct');
                score += 10;
                document.getElementById('score').innerText = score;
                speak(`Harika! Bu ${harf} harfi.`);
                setTimeout(() => card.classList.remove('correct'), 1000);
            } else {
                card.classList.add('wrong');
                speak("Hayır, tekrar dene!");
                setTimeout(() => card.classList.remove('wrong'), 500);
            }
        };
        cardGrid.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', init);