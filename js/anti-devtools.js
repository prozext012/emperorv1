/* ==========================================================================
   ANTI-DEVTOOLS (PROTEKSI DASAR)
   --------------------------------------------------------------------------
   PENTING - baca ini dulu:
   Semua trik di file ini jalan di sisi BROWSER (client-side). Ini hanya
   mempersulit orang awam/iseng untuk buka Inspect Element / DevTools, BUKAN
   sistem keamanan yang benar-benar kebal. Orang yang cukup paham teknis
   tetap bisa membypassnya. Jangan taruh data rahasia (API key sensitif,
   dsb) dengan mengandalkan proteksi ini saja.

   CARA GANTI TEKS PERINGATAN:
   Edit isi teks di bagian CONFIG di bawah ini. Tidak perlu mengubah bagian
   lain dari file ini.
   ========================================================================== */

window.ANTI_DEVTOOLS_CONFIG = {
    // Nyalakan/matikan seluruh proteksi ini
    enabled: true,

    // Blokir klik kanan (context menu / "Inspect")
    blockRightClick: true,

    // Blokir shortcut keyboard pembuka DevTools (F12, Ctrl+Shift+I/J/C, Ctrl+U, dst)
    blockShortcuts: true,

    // Deteksi kalau DevTools kebuka (ukuran window, timing debugger, console trick)
    detectDevTools: true,

    // Matikan bisa select teks & drag gambar di halaman
    disableTextSelect: true,

    // Tampilkan warning custom besar di console (buat orang yang paham console)
    showConsoleWarning: true,

    // ===== TEKS YANG BISA KAMU GANTI SENDIRI =====
    // Judul overlay peringatan saat DevTools kedetect terbuka
    overlayTitle: '⚠️ Peringatan',

    // Isi pesan overlay peringatan
    overlayMessage: 'Untuk keamanan, DevTools / Inspect Element tidak diizinkan di halaman ini. Silakan tutup DevTools untuk melanjutkan.',

    // Judul pesan besar yang muncul di tab Console browser
    consoleWarningTitle: 'STOP!',

    // Isi pesan di tab Console browser
    consoleWarningMessage: 'Ini adalah fitur milik "Andika Store". Jangan menempel/menjalankan kode apa pun di sini atas permintaan pihak lain, itu bisa berisiko untuk akun atau data Anda.'
};

(function () {
    const CFG = window.ANTI_DEVTOOLS_CONFIG;
    if (!CFG || !CFG.enabled) return;

    /* ---------- 1. Blokir klik kanan ---------- */
    if (CFG.blockRightClick) {
        document.addEventListener('contextmenu', function (e) {
            e.preventDefault();
        });
    }

    /* ---------- 2. Blokir shortcut keyboard ---------- */
    if (CFG.blockShortcuts) {
        document.addEventListener('keydown', function (e) {
            const key = (e.key || '').toUpperCase();
            const blockedCombo =
                key === 'F12' ||
                ((e.ctrlKey || e.metaKey) && e.shiftKey && ['I', 'J', 'C', 'K'].includes(key)) ||
                ((e.ctrlKey || e.metaKey) && key === 'U') ||
                ((e.ctrlKey || e.metaKey) && key === 'S');
            if (blockedCombo) {
                e.preventDefault();
                e.stopPropagation();
            }
        }, true);
    }

    /* ---------- 3. Matikan select teks & drag gambar ---------- */
    if (CFG.disableTextSelect) {
        const style = document.createElement('style');
        style.textContent = `
            body {
                -webkit-user-select: none;
                -moz-user-select: none;
                user-select: none;
            }
            input, textarea, [contenteditable="true"] {
                -webkit-user-select: text;
                -moz-user-select: text;
                user-select: text;
            }
            img { -webkit-user-drag: none; user-drag: none; }
        `;
        document.head.appendChild(style);
        document.addEventListener('dragstart', function (e) {
            if (e.target.tagName === 'IMG') e.preventDefault();
        });
    }

    /* ---------- 4. Warning custom di tab Console ---------- */
    if (CFG.showConsoleWarning) {
        let consoleWarningPrinted = false;
        function printConsoleWarning() {
            if (consoleWarningPrinted) return;
            consoleWarningPrinted = true;
            console.log(
                '%c' + CFG.consoleWarningTitle,
                'color:#e74c3c; font-size:48px; font-weight:900; text-shadow: 2px 2px 0 #000;'
            );
            console.log(
                '%c' + CFG.consoleWarningMessage,
                'color:#1a2f52; font-size:16px; font-weight:600;'
            );
        }
        // Kalau teksnya sudah diatur dari web admin (settings/antiDevtools di
        // Firestore, di-load oleh firabase.js), tunggu sinyal itu dulu supaya
        // yang tampil adalah teks terbaru. Kalau dalam 2 detik belum ada
        // sinyal (mis. firabase.js belum sempat load), tetap tampilkan
        // dengan teks default di CONFIG supaya proteksi tidak macet nunggu.
        document.addEventListener('antidevtools-config-ready', printConsoleWarning, { once: true });
        setTimeout(printConsoleWarning, 2000);
    }

    /* ---------- 5. Deteksi DevTools terbuka ---------- */
    if (!CFG.detectDevTools) return;

    let overlayEl = null;
    let overlayTitleEl = null;
    let overlayMsgEl = null;
    let isBlocking = false;

    function buildOverlay() {
        if (overlayEl) return overlayEl;
        overlayEl = document.createElement('div');
        overlayEl.id = 'antiDevtoolsOverlay';
        overlayEl.style.cssText = `
            position: fixed; inset: 0; z-index: 999999;
            background: #0b0c10; color: #fff;
            display: none; align-items: center; justify-content: center;
            flex-direction: column; text-align: center; padding: 32px;
            font-family: 'Inter', sans-serif;
        `;
        overlayTitleEl = document.createElement('div');
        overlayTitleEl.style.cssText = 'font-size:2.2rem; font-weight:900; margin-bottom:14px;';
        overlayMsgEl = document.createElement('div');
        overlayMsgEl.style.cssText = 'font-size:1rem; max-width:420px; line-height:1.6; color:#cbd5e1;';
        overlayEl.appendChild(overlayTitleEl);
        overlayEl.appendChild(overlayMsgEl);
        document.body.appendChild(overlayEl);
        return overlayEl;
    }

    function showBlock() {
        buildOverlay();
        // Selalu ambil teks terbaru dari CFG (bisa saja baru saja di-update
        // oleh firabase.js dari data yang diisi lewat web admin).
        overlayTitleEl.textContent = CFG.overlayTitle;
        overlayMsgEl.textContent = CFG.overlayMessage;
        if (isBlocking) return;
        isBlocking = true;
        overlayEl.style.display = 'flex';
        document.documentElement.style.overflow = 'hidden';
    }

    function hideBlock() {
        if (!isBlocking) return;
        isBlocking = false;
        if (overlayEl) overlayEl.style.display = 'none';
        document.documentElement.style.overflow = '';
    }

    // Teknik 1: selisih ukuran window (efektif untuk DevTools yang "docked")
    function checkBySize() {
        const threshold = 160;
        const widthDiff = window.outerWidth - window.innerWidth;
        const heightDiff = window.outerHeight - window.innerHeight;
        return widthDiff > threshold || heightDiff > threshold;
    }

    // Teknik 2: timing statement `debugger`
    // (kalau DevTools terbuka & "Pause on debugger" aktif/di-trace, statement ini
    // akan menahan eksekusi cukup lama dan kelihatan dari selisih waktunya)
    function checkByDebuggerTiming() {
        const t0 = performance.now();
        // eslint-disable-next-line no-debugger
        debugger;
        const t1 = performance.now();
        return (t1 - t0) > 100;
    }

    // Teknik 3: getter pada properti objek yang cuma "dibaca" saat console
    // benar-benar meng-inspect object (console panel devtools terbuka)
    let consoleTrickTriggered = false;
    const consoleTrickTarget = new Image();
    Object.defineProperty(consoleTrickTarget, 'id', {
        get() {
            consoleTrickTriggered = true;
        }
    });

    function checkByConsoleTrick() {
        consoleTrickTriggered = false;
        console.log('%c', consoleTrickTarget);
        console.clear();
        return consoleTrickTriggered;
    }

    function runDetection() {
        const detected = checkBySize() || checkByDebuggerTiming() || checkByConsoleTrick();
        if (detected) {
            showBlock();
        } else {
            hideBlock();
        }
    }

    setInterval(runDetection, 1000);
})();
