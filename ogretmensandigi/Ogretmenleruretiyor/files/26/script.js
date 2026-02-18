const gameData = [
    { id: 1, title: "GÜNEŞ", proverb: "Güneş girmeyen eve doktor girer.", img: "https://img.icons8.com/color/144/sun--v1.png" },
    { id: 2, title: "GÜL", proverb: "Gülü seven dikenine katlanır.", img: "https://img.icons8.com/color/144/rose.png" },
    { id: 3, title: "TAVŞAN", proverb: "Dağ dağa küsmüş, tavşanın haberi olmamış.", img: "https://img.icons8.com/color/144/rabbit.png" },
	{ id: 4, title: "ARABA", proverb: "Araba devrilince yol gösteren çok olur.", img: "https://img.icons8.com/color/144/car.png" },
    { id: 5, title: "KALEM", proverb: "Kalem kılıçtan keskindir.", img: "https://img.icons8.com/color/144/pencil.png" },
    { id: 6, title: "BALIK", proverb: "Balık baştan kokar.", img: "https://img.icons8.com/color/144/fish.png" },
];

let selectedId = null;
let score = 0;

function speakText(text) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'tr-TR';
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
}

function init() {
    const audioList = document.getElementById('audioList');
    const cardGrid = document.getElementById('cardGrid');
    
    audioList.innerHTML = "";
    cardGrid.innerHTML = "";

    gameData.forEach(item => {
        const btn = document.createElement('button');
        btn.className = 'audio-btn';
        btn.innerHTML = `<span>🔊</span> Atasözü ${item.id}`;
        btn.onclick = () => {
            selectedId = item.id;
            document.querySelectorAll('.audio-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById('currentQuestion').innerText = item.proverb;
            speakText(item.proverb);
        };
        audioList.appendChild(btn);

        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${item.img}" alt="${item.title}">
            <div class="card-title">${item.title}</div>
        `;
        card.onclick = () => {
            if (!selectedId) return speakText("Önce bir atasözü seçin!");
            if (item.id === selectedId) {
                card.classList.add('correct');
                score += 10;
                document.getElementById('score').innerText = score;
                speakText("Tebrikler! Doğru cevap.");
                setTimeout(() => card.classList.remove('correct'), 1000);
            } else {
                card.classList.add('wrong');
                speakText("Bu değil, tekrar dene.");
                setTimeout(() => card.classList.remove('wrong'), 500);
            }
        };
        cardGrid.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', init);