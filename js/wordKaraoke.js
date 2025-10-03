// Sistema de karaoke palabra por palabra
let wordTimings = null;
let currentWordIndex = 0;

// Cargar datos de sincronización de palabras
async function loadWordTimings() {
    try {
        const response = await fetch('lyrics-timing.json');
        wordTimings = await response.json();
        return true;
    } catch (error) {
        console.log('No se encontró archivo de timing, usando sistema manual');
        return false;
    }
}

// Actualizar karaoke palabra por palabra
function updateWordKaraoke() {
    if (!wordTimings || !backgroundMusic) return;
    
    const currentTime = backgroundMusic.currentTime;
    
    // Encontrar palabra actual
    let activeWordIndex = -1;
    for (let i = 0; i < wordTimings.words.length; i++) {
        if (currentTime >= wordTimings.words[i].start && currentTime <= wordTimings.words[i].end) {
            activeWordIndex = i;
            break;
        }
    }
    
    // Actualizar display
    displayWordKaraoke(activeWordIndex);
}

// Mostrar karaoke con palabras resaltadas
function displayWordKaraoke(activeIndex) {
    const lyricsDisplay = document.getElementById('lyricsDisplay');
    if (!lyricsDisplay || !wordTimings) return;
    
    let html = '';
    
    for (let i = 0; i < wordTimings.words.length; i++) {
        const word = wordTimings.words[i];
        let className = 'word';
        
        if (i < activeIndex) {
            className += ' word-past';
        } else if (i === activeIndex) {
            className += ' word-active';
        }
        
        html += `<span class="${className}">${word.text}</span> `;
        
        // Salto de línea al final de cada línea
        if (word.lineEnd) {
            html += '<br>';
        }
    }
    
    lyricsDisplay.innerHTML = html;
}

// Generar archivo de timing desde marcado manual
function exportWordTiming() {
    if (markedTimes.length === 0) return;
    
    const words = [];
    let wordId = 0;
    
    for (let i = 0; i < Math.min(markedTimes.length, songLyrics.length); i++) {
        const line = songLyrics[i];
        const lineWords = line.text.split(' ');
        const lineStart = markedTimes[i];
        const lineEnd = markedTimes[i + 1] || lineStart + 4;
        const wordDuration = (lineEnd - lineStart) / lineWords.length;
        
        lineWords.forEach((word, index) => {
            words.push({
                id: wordId++,
                text: word,
                start: lineStart + (index * wordDuration),
                end: lineStart + ((index + 1) * wordDuration),
                lineEnd: index === lineWords.length - 1
            });
        });
    }
    
    const timingData = { words };
    
    console.log('=== ARCHIVO LYRICS-TIMING.JSON ===');
    console.log(JSON.stringify(timingData, null, 2));
    console.log('==================================');
    
    // Descargar archivo
    const blob = new Blob([JSON.stringify(timingData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lyrics-timing.json';
    a.click();
}