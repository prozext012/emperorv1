import { formatWaktuNotif } from "./../../../../../shard_a3x/cell_z54/sync_zuj/unit_adx/edge_f1p/7hxr4lu0.mjs";
import { pendingNotifSpeech, tryPlayNotifSound } from "./../../../../../proc_xop/arc_na2/trunk_5fm/cell_nju/loom_rfk/61mm4mmp.mjs";

    try {
        if (location.search.indexOf('resetnotif') !== -1) sessionStorage.removeItem('notifOverlaySeen');
    } catch (e) {}
    window.resetNotifOverlay = function () {
        try { sessionStorage.removeItem('notifOverlaySeen'); } catch (e) {}
    };
    window.hideNotifOverlay = function () {
        try { sessionStorage.setItem('notifOverlaySeen', '1'); } catch (e) {}
        document.querySelectorAll('.notif-overlay-preview').forEach(el => el.classList.remove('show'));
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        pendingNotifSpeech = null;
    };
    const pageLoadTs = Date.now();
    let notifOverlayDone = false;
    let notifOverlayTimer = null;
    function renderNotifOverlayNow() {
        if (notifOverlayDone) { console.log('[notif-overlay] sudah pernah jalan, dilewati'); return; }
        try {
            if (sessionStorage.getItem('notifOverlaySeen')) {
                console.log('[notif-overlay] gak ditampilkan: sesi ini udah pernah buka halaman notifikasi. Tambahin ?resetnotif di URL buat tes ulang.');
                notifOverlayDone = true; return;
            }
        } catch (e) {}
        if (!window.__notifData || window.__notifData.length === 0) {
            console.log('[notif-overlay] belum ada data notifikasi dari server (atau memang belum ada notifikasi sama sekali).');
            return;
        }

        const els = document.querySelectorAll('.notif-overlay-preview:not(#notifOverlayPreviewStatus)');
        if (!els.length) { console.log('[notif-overlay] elemen overlay gak ketemu di halaman — pastikan index.html yang dipakai versi terbaru.'); return; }
        notifOverlayDone = true;
        const latest = window.__notifData[0];
        const pesan = latest.desc || '';
        els.forEach(el => {
            el.querySelector('.notif-overlay-latest').textContent = 'Terbaru ' + formatWaktuNotif(latest.createdAt);
            el.querySelector('.notif-overlay-text').textContent = pesan;
            el.classList.add('show');
        });
        console.log('[notif-overlay] tampil:', pesan);
        tryPlayNotifSound(pesan);
    }

    function scheduleNotifOverlay() {
        if (notifOverlayDone) return;
        if (notifOverlayTimer) clearTimeout(notifOverlayTimer);
        const elapsed = Date.now() - pageLoadTs;
        const minFirstWait = Math.max(0, 150 - elapsed);
        const settleDelay = 400;
        const maxTotalWait = 2500;
        const wait = Math.min(Math.max(minFirstWait, settleDelay), Math.max(minFirstWait, maxTotalWait - elapsed));
        notifOverlayTimer = setTimeout(renderNotifOverlayNow, wait);
    }
    window.addEventListener('load', scheduleNotifOverlay);

    window.__onNotifDataReady = scheduleNotifOverlay;

    window.__statusData = [];
    export function applyStatusRing() {
        const active = window.__statusData.length > 0;
        document.querySelectorAll('.avatar-ring').forEach(el => el.classList.toggle('has-status', active));
    }

    try {
        const cachedStatus = JSON.parse(localStorage.getItem('cachedStatusData') || 'null');
        if (Array.isArray(cachedStatus)) {
            const now0 = Date.now();
            window.__statusData = cachedStatus.filter(s => !s.expiresAt || s.expiresAt > now0);
            applyStatusRing();
        }
    } catch (e) {}
