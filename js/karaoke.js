// Datos de la letra sincronizada (tiempos en segundos) - Auto-ajustable
const songLyrics = [
    { time: 9.5, text: "Mis acciones son tan simples" },
    { time: 14, text: "Quiero ser quien siempre te cuide" },
    { time: 18, text: "Del infierno y su gente" },
    { time: 22, text: "Que maltratan almas inocentes" },
    { time: 27, text: "Estoy contento aquí a su lado" },
    { time: 31, text: "No entiendo nada que no sea cuidarlo" },
    { time: 35, text: "Me siento alegre de tenerte" },
    { time: 39, text: "Quiero cuidarte hasta la muerte" },
    { time: 44, text: "Mi amor es tan sencillo" },
    { time: 48, text: "En este infierno seré tu amigo" },
    { time: 52, text: "Mi sacrificio no es suficiente" },
    { time: 56, text: "Para cuidarte hasta la muerte" },
    { time: 61, text: "Auu" },
    { time: 63, text: "Hasta la muerte" },
    { time: 66, text: "Auuu" },
    { time: 68, text: "Hasta la muerte" },
    { time: 72, text: "Es tan simple el sentimiento" },
    { time: 76, text: "En mi mente tu eres el primero" },
    { time: 80, text: "Lo que pienso es irrelevante" },
    { time: 84, text: "Solo se que somos deambulantes" },
    { time: 89, text: "En esta vida tan agresiva" },
    { time: 93, text: "Me has motivado a seguir con vida" },
    { time: 97, text: "Y lo que siento es irrelevante" },
    { time: 101, text: "Solo que soy tu acompañante" },
    { time: 106, text: "Mi amor es tan sencillo" },
    { time: 110, text: "En este infierno seré tu amigo" },
    { time: 114, text: "Mi sacrificio no es suficiente" },
    { time: 118, text: "Para cuidarte hasta la muerte" },
    { time: 123, text: "Auu" },
    { time: 125, text: "Hasta la muerte" },
    { time: 128, text: "Auuu" },
    { time: 130, text: "Hasta la muerte" },
    { time: 133, text: "Auuu" },
    { time: 135, text: "Hasta la muerte" },
    { time: 138, text: "Auuu" },
    { time: 140, text: "Hasta la muerte" },
    { time: 144, text: "Quiero ser" },
    { time: 146, text: "Quien te cuide" },
    { time: 148, text: "Quiero ser" },
    { time: 150, text: "Quien te cuide" },
    { time: 152, text: "Quiero ser" },
    { time: 154, text: "Quien te cuide" },
    { time: 156, text: "Quiero ser" },
    { time: 158, text: "Quiero ser..." },
    { time: 162, text: "Mi amor es tan sencillo" },
    { time: 166, text: "En este infierno seré tu amigo" },
    { time: 170, text: "Mi sacrificio no es suficiente" },
    { time: 174, text: "Para cuidarte hasta la muerte" },
    { time: 179, text: "Auu" },
    { time: 181, text: "Hasta la muerte" },
    { time: 184, text: "Auuu" },
    { time: 186, text: "Hasta la muerte" },
    { time: 189, text: "Auuu" },
    { time: 191, text: "Hasta la muerte" },
    { time: 194, text: "Auuu" },
    { time: 196, text: "Hasta la muerte" }
];

// Inicializar sistema de karaoke
async function initKaraoke() {
    lyricsData = [...songLyrics];
    currentLyricIndex = 0;
    lyricsStartTime = Date.now();
    
    const lyricsDisplay = document.getElementById('lyricsDisplay');
    lyricsDisplay.style.display = 'block';
    
    // Intentar cargar timing de palabras
    const hasWordTiming = await loadWordTimings();
    
    if (!hasWordTiming) {
        // Mostrar las primeras 3 líneas (modo normal)
        updateLyricsDisplay();
    }
}

// Actualizar display de letras
function updateLyricsDisplay() {
    if (!backgroundMusic || !lyricsData.length) return;
    
    const currentTime = backgroundMusic.currentTime + syncOffset;
    
    // Mostrar tiempo actual si está en modo sync
    if (syncMode) {
        document.getElementById('timeDisplay').textContent = `Tiempo: ${currentTime.toFixed(1)}s | Offset: ${syncOffset.toFixed(1)}s`;
    }
    
    // Encontrar la línea actual
    let activeIndex = -1;
    for (let i = 0; i < lyricsData.length; i++) {
        if (currentTime >= lyricsData[i].time) {
            activeIndex = i;
        } else {
            break;
        }
    }
    
    // Actualizar display con 3 líneas: anterior, actual, siguiente
    const lyric0 = document.getElementById('lyric0');
    const lyric1 = document.getElementById('lyric1');
    const lyric2 = document.getElementById('lyric2');
    
    // Limpiar clases
    [lyric0, lyric1, lyric2].forEach(el => {
        el.className = 'lyric-line';
        el.textContent = '';
    });
    
    if (activeIndex >= 0) {
        // Línea anterior (si existe)
        if (activeIndex > 0) {
            lyric0.textContent = lyricsData[activeIndex - 1].text;
            lyric0.classList.add('lyric-past');
        }
        
        // Línea actual
        lyric1.textContent = lyricsData[activeIndex].text;
        lyric1.classList.add('lyric-active');
        
        // Línea siguiente (si existe)
        if (activeIndex + 1 < lyricsData.length) {
            lyric2.textContent = lyricsData[activeIndex + 1].text;
        }
    } else if (lyricsData.length > 0) {
        // Mostrar la primera línea si aún no ha comenzado
        lyric1.textContent = lyricsData[0].text;
    }
}

// Alternar modo de sincronización
function toggleSyncMode() {
    syncMode = !syncMode;
    markingMode = syncMode;
    
    const timeDisplay = document.getElementById('timeDisplay');
    const syncControls = document.getElementById('syncControls');
    const markingInfo = document.getElementById('markingInfo');
    
    if (syncMode) {
        timeDisplay.style.display = 'block';
        syncControls.style.display = 'block';
        markingInfo.style.display = 'block';
        resetMarks();
    } else {
        timeDisplay.style.display = 'none';
        syncControls.style.display = 'none';
        markingInfo.style.display = 'none';
    }
}

// Marcar tiempo de línea actual
function markLyric() {
    if (!markingMode || !backgroundMusic) return;
    
    const currentTime = backgroundMusic.currentTime;
    markedTimes.push(currentTime);
    currentMarkIndex++;
    
    updateMarkingInfo();
    console.log(`Marcado: "${songLyrics[markedTimes.length - 1]?.text}" en ${currentTime.toFixed(2)}s`);
}

// Resetear marcas
function resetMarks() {
    markedTimes = [];
    currentMarkIndex = 0;
    updateMarkingInfo();
}

// Actualizar info de marcado
function updateMarkingInfo() {
    const currentText = songLyrics[markedTimes.length]?.text || 'Completado';
    const markedCount = markedTimes.length;
    const totalCount = songLyrics.length;
    
    document.getElementById('currentLyricText').textContent = currentText;
    document.getElementById('markedCount').textContent = markedCount;
    document.getElementById('totalCount').textContent = totalCount;
}

// Guardar tiempos marcados
function saveTiming() {
    if (markedTimes.length === 0) return;
    
    console.log('=== TIEMPOS SINCRONIZADOS ===');
    console.log('Copia este código en karaoke.js:');
    console.log('const songLyrics = [');
    
    for (let i = 0; i < Math.min(markedTimes.length, songLyrics.length); i++) {
        const time = markedTimes[i].toFixed(1);
        const text = songLyrics[i].text;
        console.log(`    { time: ${time}, text: "${text}" },`);
    }
    
    console.log('];');
    console.log('===============================');
    
    // Aplicar tiempos inmediatamente
    for (let i = 0; i < Math.min(markedTimes.length, songLyrics.length); i++) {
        songLyrics[i].time = markedTimes[i];
    }
    
    alert('Tiempos guardados! Revisa la consola para el código.');
}

// Ocultar karaoke
function hideKaraoke() {
    const lyricsDisplay = document.getElementById('lyricsDisplay');
    lyricsDisplay.style.display = 'none';
}