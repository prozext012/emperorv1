// ===== FIREBASE (Firestore) — buat notifikasi & testimoni realtime =====
    import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
    import { getFirestore, collection, onSnapshot, query, orderBy, doc, setDoc } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

    const firebaseConfig = {
        apiKey: "AIzaSyDztQD-U1k8Oz1Vnw7z3yUKzSzSP0RN1vg",
        authDomain: "kasir-warung-c9479.firebaseapp.com",
        projectId: "kasir-warung-c9479",
        storageBucket: "kasir-warung-c9479.firebasestorage.app",
        messagingSenderId: "765164639630",
        appId: "1:765164639630:web:f7f4fefd1753bfc0e080df",
        measurementId: "G-739VXW44QZ"
    };

    const fbApp = initializeApp(firebaseConfig);
    const db = getFirestore(fbApp);

    // ----- Daftar produk didaftarkan otomatis ke Firestore, biar web admin selalu ikut update -----
    const PRODUCT_LIST = [
        { id: 1, key: 'apk-jam', name: 'APK Widget Jam' },
        { id: 2, key: 'ig', name: 'Followers IG' },
        { id: 3, key: 'ebook', name: '2.000+ Buku Digital Premium' },
        { id: 4, key: 'tiktok', name: 'Followers TikTok' }
    ];
    PRODUCT_LIST.forEach(p => {
        setDoc(doc(db, 'productMeta', String(p.id)), p).catch(() => {});
    });

    // ----- Status Online/Offline (dikontrol dari website admin) -----
    // Nilai default dipakai cuma kalau dokumen statusnya belum pernah dibuat di Firestore.
    onSnapshot(doc(db, 'settings', 'status'), (snap) => {
        const online = snap.exists() ? (snap.data().online !== false) : true;
        const badge = document.querySelector('.online-badge');
        if (badge) {
            badge.querySelector('span').textContent = online ? 'Online' : 'Offline';
            badge.style.borderColor = 'var(--dark)';
            badge.querySelector('.online-dot').style.background = online ? 'var(--green)' : 'var(--soft-red)';
            badge.classList.remove('skeleton-loading'); // baru ditampilkan setelah data status beneran datang
        }
    });

    // ----- Profil (foto profil, banner, nama, bio) — bisa diedit dari website admin -----
    // Nilai default di bawah cuma dipakai kalau dokumen profil di Firestore belum ada / field-nya kosong,
    // supaya profil tetap ke-render meski web admin belum pernah dipakai buat isi data.
    const DEFAULT_PROFILE = {
        avatar: 'https://i.ibb.co.com/0p557jrm/AIRetouch-20260711-091531075.png',
        banner: 'https://i.ibb.co.com/0jKfN0b5/AIRetouch-20260711-091601391.png',
        nama: 'Andika',
        bio: 'nama saya Andika, saya mecoba untuk mengumpulkan uang dari internet, jangan lupa dukung aku 🙏'
    };
    onSnapshot(doc(db, 'settings', 'profile'), (snap) => {
        const p = snap.exists() ? snap.data() : {};
        const avatarEl = document.getElementById('profileAvatarImg');
        const bannerEl = document.getElementById('profileCoverImg');
        const namaEl = document.getElementById('profileNameText');
        const bioEl = document.getElementById('profileBioText');
        if (avatarEl) { avatarEl.src = p.avatar || DEFAULT_PROFILE.avatar; avatarEl.classList.remove('skeleton-loading'); }
        if (bannerEl) { bannerEl.src = p.banner || DEFAULT_PROFILE.banner; bannerEl.classList.remove('skeleton-loading'); }
        if (namaEl) { namaEl.textContent = p.nama || DEFAULT_PROFILE.nama; namaEl.classList.remove('skeleton-loading'); }
        if (bioEl) { bioEl.textContent = p.bio || DEFAULT_PROFILE.bio; bioEl.classList.remove('skeleton-loading'); }
    });

    // ----- Badge jumlah notifikasi belum dibaca -----
    window.__notifData = [];
    function getSeenNotifIds() {
        try { return JSON.parse(localStorage.getItem('seenNotifIds') || '[]'); }
        catch (e) { return []; }
    }
    function updateNotifBadges() {
        const seen = getSeenNotifIds();
        const unread = window.__notifData.filter(n => seen.indexOf(n.id) === -1).length;
        document.querySelectorAll('.notif-count-badge').forEach(el => {
            if (unread > 0) {
                el.textContent = unread > 99 ? '99+' : String(unread);
                el.style.display = 'flex';
            } else {
                el.style.display = 'none';
            }
        });
    }
    onSnapshot(query(collection(db, 'notifikasi'), orderBy('createdAt', 'desc')), (snap) => {
        window.__notifData = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        updateNotifBadges();
        renderNotifPage();
    });

    function formatWaktuNotif(ts) {
        if (!ts) return '';
        const d = new Date(ts);
        const now = new Date();
        const startOfDay = x => new Date(x.getFullYear(), x.getMonth(), x.getDate());
        const diffHari = Math.round((startOfDay(now) - startOfDay(d)) / 86400000);
        const jam = d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');
        if (diffHari <= 0) return `hari ini ${jam}`;
        if (diffHari === 1) return `kemarin ${jam}`;
        return `${diffHari} hari yang lalu ${jam}`;
    }

    function renderNotifPage() {
        const listEl = document.getElementById('notifPageList');
        const emptyEl = document.getElementById('notifEmptyState');
        if (!listEl) return;
        listEl.innerHTML = '';
        if (window.__notifData.length === 0) {
            if (emptyEl) emptyEl.style.display = 'block';
            return;
        }
        if (emptyEl) emptyEl.style.display = 'none';
        window.__notifData.forEach(d => {
            const card = document.createElement('div');
            card.className = 'notif-page-card';
            card.innerHTML = `
                ${d.img ? `<img src="${d.img}" alt="Notifikasi" loading="lazy" />` : ''}
                <div class="notif-page-body">
                    <div class="notif-page-desc">${(d.desc || '').replace(/</g, '&lt;')}</div>
                    <div class="notif-page-time">${formatWaktuNotif(d.createdAt)}</div>
                </div>
            `;
            listEl.appendChild(card);
        });
    }

    // Dipanggil pas halaman notifikasi dibuka: tandai semua sudah dibaca
    window.markNotifSeen = function () {
        try { localStorage.setItem('seenNotifIds', JSON.stringify(window.__notifData.map(n => n.id))); } catch (e) {}
        updateNotifBadges();
    };

    // ----- Overlay preview notifikasi terbaru (muncul 1 detik setelah buka web, sekali per sesi) -----
    // Dibarengi bunyi notifikasi + suara membacakan isi pesannya.
    window.hideNotifOverlay = function () {
        try { sessionStorage.setItem('notifOverlaySeen', '1'); } catch (e) {}
        const el = document.getElementById('notifOverlayPreview');
        if (el) el.classList.remove('show');
        try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch (e) {}
    };

    // Browser umumnya blokir suara/bunyi otomatis sebelum ada interaksi user sama sekali di tab ini.
    // Jadi begitu user sentuh/klik/scroll pertama kali, kita "buka kunci" audio context supaya
    // kalau overlay muncul duluan (sebelum sempat disentuh), suaranya tetap bisa jalan.
    let audioCtx = null;
    let audioUnlocked = false;
    function unlockAudio() {
        if (audioUnlocked) return;
        try {
            audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === 'suspended') audioCtx.resume();
            audioUnlocked = true;
        } catch (e) {}
    }
    ['pointerdown', 'touchstart', 'keydown'].forEach(evt => {
        document.addEventListener(evt, unlockAudio, { once: true, passive: true });
    });

    // Bunyi "ding" notifikasi, dibuat langsung pakai Web Audio API (gak butuh file suara terpisah).
    // Return: total durasi bunyinya (ms), dipakai buat nunda suara pembaca pesan supaya gak numpuk.
    function playNotifBeep() {
        const NOTE_GAP = 0.12, NOTE_LEN = 0.4;
        const notes = [880, 1320];
        try {
            audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === 'suspended') audioCtx.resume();
            const now = audioCtx.currentTime;
            notes.forEach((freq, i) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'sine';
                osc.frequency.value = freq;
                const start = now + i * NOTE_GAP;
                gain.gain.setValueAtTime(0, start);
                gain.gain.linearRampToValueAtTime(0.22, start + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);
                osc.connect(gain).connect(audioCtx.destination);
                osc.start(start);
                osc.stop(start + NOTE_LEN);
            });
        } catch (e) { console.warn('Gagal memutar bunyi notifikasi:', e); }
        return Math.round(((notes.length - 1) * NOTE_GAP + NOTE_LEN) * 1000);
    }

    // Suara membacakan isi pesan notifikasi (text-to-speech bawaan browser).
    function speakNotifText(text) {
        if (!text || !('speechSynthesis' in window)) return;
        try {
            window.speechSynthesis.cancel();
            const utter = new SpeechSynthesisUtterance(text);
            utter.lang = 'id-ID';
            utter.rate = 1;
            utter.pitch = 1;
            window.speechSynthesis.speak(utter);
        } catch (e) { console.warn('Gagal membacakan notifikasi:', e); }
    }

    function maybeShowNotifOverlay() {
        try { if (sessionStorage.getItem('notifOverlaySeen')) return; } catch (e) {}
        if (!window.__notifData || window.__notifData.length === 0) return;
        const el = document.getElementById('notifOverlayPreview');
        if (!el) return;
        const latest = window.__notifData[0];
        el.querySelector('.notif-overlay-latest').textContent = 'Terbaru ' + formatWaktuNotif(latest.createdAt);
        el.querySelector('.notif-overlay-text').textContent = latest.desc || '';
        el.classList.add('show');
        const beepDuration = playNotifBeep();
        setTimeout(() => speakNotifText(latest.desc || ''), beepDuration);
    }
    window.addEventListener('load', () => setTimeout(maybeShowNotifOverlay, 1000));

    // ----- Testimoni tambahan dari website notifikasi (ditampilkan silang ke SEMUA produk) -----
    const productKeyMap = { 1: 'apk-jam', 2: 'ig', 3: 'ebook', 4: 'tiktok' };
    const productNameMap = { 'apk-jam': 'APK Widget Jam', 'ig': 'Followers IG', 'ebook': '2.000+ Buku Digital Premium', 'tiktok': 'Followers TikTok' };
    window.__testimoniData = {};
    window.__testimoniUpdateCbs = [];
    window.onTestimoniUpdate = function (cb) { window.__testimoniUpdateCbs.push(cb); };
    window.getExtraTestimoni = function (productDbId) {
        const key = productKeyMap[productDbId];
        // testimoni "legacy" = hasil import data lama, sudah tampil lewat data.testimoni bawaan produknya sendiri,
        // jadi di sini dilewati biar gak dobel — tapi tetap ikut kalau posisinya jadi testimoni "pinjaman" produk lain.
        const own = (window.__testimoniData[key] || []).filter(t => !t.legacy)
            .map(t => ({ ...t, productLabel: productNameMap[key] }));
        const borrowed = [];
        Object.keys(window.__testimoniData).forEach(k => {
            if (k === key) return;
            (window.__testimoniData[k] || []).forEach(t => borrowed.push({ ...t, productLabel: productNameMap[k] || k }));
        });
        return own.concat(borrowed);
    };
    onSnapshot(collection(db, 'testimoni'), (snap) => {
        const grouped = {};
        snap.forEach(docSnap => {
            const d = docSnap.data();
            const key = d.productId;
            if (!key) return;
            if (!grouped[key]) grouped[key] = [];
            grouped[key].push({ id: docSnap.id, nama: d.nama || '', img: d.img || '', stars: d.stars || 5, createdAt: d.createdAt || 0, legacy: !!d.legacy });
        });
        Object.keys(grouped).forEach(k => grouped[k].sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0)));
        window.__testimoniData = grouped;
        window.__testimoniUpdateCbs.forEach(fn => fn());
    });
