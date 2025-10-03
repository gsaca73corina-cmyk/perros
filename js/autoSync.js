// Sistema de sincronización automática basado en tempo
let audioContext = null;
let analyser = null;
let dataArray = null;
let beatDetector = null;
let tempoDetected = false;
let avgTempo = 0;
let beatTimes = [];
let autoSyncActive = false;

// Inicializar análisis de audio
function initAudioAnalysis() {
    if (!backgroundMusic) return false;
    
    try {
        // Solo crear contexto si no existe
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        // Reanudar contexto si está suspendido
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        
        const source = audioContext.createMediaElementSource(backgroundMusic);
        analyser = audioContext.createAnalyser();
        
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        
        analyser.fftSize = 2048;
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        
        beatDetector = new BeatDetector();
        autoSyncActive = true;
        
        console.log('Análisis de audio iniciado');
        return true;
    } catch (error) {
        console.log('No se pudo inicializar análisis de audio:', error);
        // Continuar sin auto-sync si falla
        autoSyncActive = false;
        return false;
    }
}

// Detector de beats simple
class BeatDetector {
    constructor() {
        this.lastBeat = 0;
        this.threshold = 0.3;
        this.minInterval = 300; // ms mínimo entre beats
        this.energyHistory = [];
        this.maxHistory = 43; // ~1 segundo a 43fps
    }
    
    detectBeat(audioData) {
        const now = Date.now();
        
        // Calcular energía total
        let energy = 0;
        for (let i = 0; i < audioData.length; i++) {
            energy += audioData[i] * audioData[i];
        }
        energy = Math.sqrt(energy / audioData.length);
        
        // Mantener historial de energía
        this.energyHistory.push(energy);
        if (this.energyHistory.length > this.maxHistory) {
            this.energyHistory.shift();
        }
        
        // Calcular promedio de energía
        const avgEnergy = this.energyHistory.reduce((a, b) => a + b, 0) / this.energyHistory.length;
        
        // Detectar beat si energía supera umbral y ha pasado tiempo mínimo
        if (energy > avgEnergy * (1 + this.threshold) && 
            now - this.lastBeat > this.minInterval) {
            this.lastBeat = now;
            return true;
        }
        
        return false;
    }
}

// Actualizar análisis de audio
function updateAudioAnalysis() {
    if (!autoSyncActive || !analyser || !backgroundMusic.currentTime) return;
    
    analyser.getByteFrequencyData(dataArray);
    
    // Detectar beats
    if (beatDetector.detectBeat(dataArray)) {
        const currentTime = backgroundMusic.currentTime;
        beatTimes.push(currentTime);
        
        // Calcular tempo cada 8 beats
        if (beatTimes.length >= 8) {
            calculateTempo();
            if (!tempoDetected) {
                adjustLyricsToTempo();
                tempoDetected = true;
            }
        }
    }
}

// Calcular tempo promedio
function calculateTempo() {
    if (beatTimes.length < 4) return;
    
    const intervals = [];
    for (let i = 1; i < beatTimes.length; i++) {
        intervals.push(beatTimes[i] - beatTimes[i-1]);
    }
    
    // Filtrar intervalos extremos
    intervals.sort((a, b) => a - b);
    const filtered = intervals.slice(
        Math.floor(intervals.length * 0.2), 
        Math.floor(intervals.length * 0.8)
    );
    
    const avgInterval = filtered.reduce((a, b) => a + b, 0) / filtered.length;
    avgTempo = 60 / avgInterval; // BPM
    
    console.log(`Tempo detectado: ${avgTempo.toFixed(1)} BPM`);
}

// Ajustar letras al tempo detectado
function adjustLyricsToTempo() {
    if (!avgTempo || avgTempo < 60 || avgTempo > 200) return;
    
    // Calcular intervalo base según tempo
    const baseInterval = 60 / avgTempo * 4; // 4 beats por línea aproximadamente
    
    // Ajustar tiempos de letras
    for (let i = 0; i < songLyrics.length; i++) {
        const newTime = 9.5 + (i * baseInterval);
        songLyrics[i].time = newTime;
    }
    
    console.log('Letras ajustadas automáticamente al tempo');
}

// Sistema de sincronización adaptativa
function adaptiveSync() {
    if (!backgroundMusic || !tempoDetected) return;
    
    const currentTime = backgroundMusic.currentTime;
    
    // Encontrar la línea más cercana al tiempo actual
    let closestIndex = 0;
    let minDiff = Math.abs(songLyrics[0].time - currentTime);
    
    for (let i = 1; i < songLyrics.length; i++) {
        const diff = Math.abs(songLyrics[i].time - currentTime);
        if (diff < minDiff) {
            minDiff = diff;
            closestIndex = i;
        }
    }
    
    // Si hay una diferencia significativa, ajustar gradualmente
    if (minDiff > 0.5 && minDiff < 2.0) {
        const adjustment = (currentTime - songLyrics[closestIndex].time) * 0.1;
        
        // Aplicar ajuste a las líneas siguientes
        for (let i = closestIndex; i < songLyrics.length; i++) {
            songLyrics[i].time += adjustment;
        }
    }
}

// Inicializar auto-sync cuando la música comience
function startAutoSync() {
    // Solo iniciar si la música está reproduciéndose
    if (!backgroundMusic || backgroundMusic.paused) {
        console.log('Inicia la música primero');
        return;
    }
    
    if (initAudioAnalysis()) {
        // Resetear variables
        beatTimes = [];
        tempoDetected = false;
        avgTempo = 0;
        
        console.log('Auto-sync iniciado - detectando tempo...');
    } else {
        console.log('Auto-sync no disponible, usa sincronización manual');
    }
}