import { getNotifAudioCtx } from "./../../../../../shard_a3x/cell_z54/sync_zuj/unit_adx/edge_f1p/7hxr4lu0.mjs";

    function playNotifSound() {
        const ctx = getNotifAudioCtx();
        if (!ctx) return;
        const now = ctx.currentTime;

        const notes = [
            { freq: 1046.5, start: 0, dur: 0.24 },
            { freq: 1318.5, start: 0.1, dur: 0.28 },
            { freq: 1568.0, start: 0.2, dur: 0.36 }
        ];
        notes.forEach(n => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.value = n.freq;
            gain.gain.setValueAtTime(0.0001, now + n.start);
            gain.gain.exponentialRampToValueAtTime(0.22, now + n.start + 0.015);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + n.start + n.dur);
            osc.connect(gain); gain.connect(ctx.destination);
            osc.start(now + n.start);
            osc.stop(now + n.start + n.dur + 0.02);

            const shimmer = ctx.createOscillator();
            const shimmerGain = ctx.createGain();
            shimmer.type = 'sine';
            shimmer.frequency.value = n.freq * 2;
            shimmerGain.gain.setValueAtTime(0.0001, now + n.start);
            shimmerGain.gain.exponentialRampToValueAtTime(0.05, now + n.start + 0.015);
            shimmerGain.gain.exponentialRampToValueAtTime(0.0001, now + n.start + n.dur * 0.8);
            shimmer.connect(shimmerGain); shimmerGain.connect(ctx.destination);
            shimmer.start(now + n.start);
            shimmer.stop(now + n.start + n.dur + 0.02);
        });
    }

    let ttsVoices = [];
    function refreshTtsVoices() { try { ttsVoices = window.speechSynthesis.getVoices() || []; } catch (e) {} }
    if ('speechSynthesis' in window) {
        refreshTtsVoices();
        window.speechSynthesis.onvoiceschanged = refreshTtsVoices;
    }
    function speakNotifText(text) {
        if (!text || !('speechSynthesis' in window)) return;
        try {
            window.speechSynthesis.cancel();
            window.speechSynthesis.resume();
            const utter = new SpeechSynthesisUtterance(text);
            const idVoice = ttsVoices.find(v => v.lang && v.lang.toLowerCase().indexOf('id') === 0);
            if (idVoice) { utter.voice = idVoice; utter.lang = idVoice.lang; }
            else { utter.lang = 'id-ID'; }
            utter.rate = 1;
            window.speechSynthesis.speak(utter);
        } catch (e) { console.log('[notif-sound] gagal mainin suara TTS:', e); }
    }

    function playSoundAndSpeak(pesan) {
        playNotifSound();
        speakNotifText(pesan);
    }

    export let pendingNotifSpeech = null;
    export function tryPlayNotifSound(pesan) {
        const ctx = getNotifAudioCtx();
        if (!ctx || ctx.state !== 'running') {
            console.log('[notif-sound] diblokir browser (autoplay policy), nunggu sentuhan pertama di layar...');
            pendingNotifSpeech = pesan;
            if (ctx) ctx.resume().catch(() => {});
            return;
        }
        console.log('[notif-sound] main langsung');
        playSoundAndSpeak(pesan);
    }
    function retryPendingNotifSound() {
        const ctx = getNotifAudioCtx();
        if (ctx && ctx.state !== 'running') ctx.resume().catch(() => {});
        if (pendingNotifSpeech) {
            console.log('[notif-sound] mainin sound+suara yang ketunda tadi (habis sentuhan pertama)');
            const pesan = pendingNotifSpeech;
            pendingNotifSpeech = null;
            playSoundAndSpeak(pesan);
        }
    }
    ['click', 'touchstart', 'keydown'].forEach(evt => {
        document.addEventListener(evt, retryPendingNotifSound, { once: true, capture: true });
    });
    window.__unlockNotifSound = retryPendingNotifSound;

