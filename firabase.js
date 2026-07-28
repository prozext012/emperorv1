// ===== FIREBASE (Firestore) — buat notifikasi & testimoni realtime =====
    import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
    import { getFirestore, collection, onSnapshot, query, orderBy, doc, setDoc, addDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

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
    onSnapshot(doc(db, 'settings', 'status'), (snap) => {
        const online = snap.exists() ? (snap.data().online !== false) : true;
        const badge = document.querySelector('.online-badge');
        if (badge) {
            badge.querySelector('span').textContent = online ? 'Online' : 'Offline';
            badge.style.borderColor = 'var(--dark)';
            badge.querySelector('.online-dot').style.background = online ? 'var(--green)' : 'var(--soft-red)';
        }
    });

    // ----- Profil (foto profil, banner, nama, bio) — bisa diedit dari website admin -----
    function applyProfileToDom(p) {
        if (!p) return;
        if (p.avatar) { const el = document.getElementById('profileAvatarImg'); if (el) el.src = p.avatar; }
        if (p.banner) { const el = document.getElementById('profileCoverImg'); if (el) el.src = p.banner; }
        if (p.nama) { const el = document.getElementById('profileNameText'); if (el) el.textContent = p.nama; }
        if (p.bio) { const el = document.getElementById('profileBioText'); if (el) el.textContent = p.bio; }
    }
    // Tampilkan dulu versi yang tersimpan di HP (kalau ada), jadi gak perlu nunggu server duluan —
    // ini yang bikin sebelumnya sempat kelihatan data lama dulu baru beberapa detik kemudian berubah.
    try {
        const cachedProfile = localStorage.getItem('cachedProfile');
        if (cachedProfile) applyProfileToDom(JSON.parse(cachedProfile));
    } catch (e) {}
    onSnapshot(doc(db, 'settings', 'profile'), (snap) => {
        if (!snap.exists()) return;
        const p = snap.data();
        applyProfileToDom(p);
        try { localStorage.setItem('cachedProfile', JSON.stringify(p)); } catch (e) {}
    });

    // ----- Notifikasi V1 (teks berjalan di atas grid produk) -----
    try {
        const cachedTickerV1 = JSON.parse(localStorage.getItem('cachedNotifTickerV1') || 'null');
        if (Array.isArray(cachedTickerV1) && window.renderNotifTickerV1) {
            window.renderNotifTickerV1(cachedTickerV1.map(n => n.text));
        }
    } catch (e) {}
    onSnapshot(query(collection(db, 'notifikasiV1'), orderBy('createdAt', 'asc')), (snap) => {
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        window.__notifTickerV1Data = list;
        if (window.renderNotifTickerV1) window.renderNotifTickerV1(list.map(n => n.text));
        try { localStorage.setItem('cachedNotifTickerV1', JSON.stringify(list)); } catch (e) {}
    });

    // ----- Badge jumlah notifikasi belum dibaca -----
    window.__notifData = [];
    // Tampilkan dulu versi tersimpan di HP (kalau ada) — biar badge/overlay gak nunggu server dulu.
    try {
        const cachedNotif = JSON.parse(localStorage.getItem('cachedNotifikasi') || 'null');
        if (Array.isArray(cachedNotif)) window.__notifData = cachedNotif;
    } catch (e) {}
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
    updateNotifBadges();
    renderNotifPage();
    onSnapshot(query(collection(db, 'notifikasi'), orderBy('createdAt', 'desc')), (snap) => {
        window.__notifData = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        updateNotifBadges();
        renderNotifPage();
        try { localStorage.setItem('cachedNotifikasi', JSON.stringify(window.__notifData)); } catch (e) {}
        if (window.__onNotifDataReady) window.__onNotifDataReady();
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

    // ----- Sound notifikasi modern (disintesis langsung, gak perlu file audio) -----
    let notifAudioCtx = null;
    function getNotifAudioCtx() {
        if (!notifAudioCtx) {
            try { notifAudioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; }
        }
        return notifAudioCtx;
    }
    function playNotifSound() {
        const ctx = getNotifAudioCtx();
        if (!ctx) return;
        const now = ctx.currentTime;
        // Chime 3 nada naik (C6-E6-G6) + lapisan "shimmer" oktaf di atas biar kesannya lebih modern & lembut
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
    // Suara TTS butuh daftar voice yang terinstall di HP-nya; daftar ini kadang baru siap async,
    // jadi disiapin & disegarkan tiap ada perubahan, biar pas dipakai udah pasti ada isinya.
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
            window.speechSynthesis.resume(); // workaround bug: kadang antrian TTS browser "ngunci" sendiri
            const utter = new SpeechSynthesisUtterance(text);
            const idVoice = ttsVoices.find(v => v.lang && v.lang.toLowerCase().indexOf('id') === 0);
            if (idVoice) { utter.voice = idVoice; utter.lang = idVoice.lang; }
            else { utter.lang = 'id-ID'; }
            utter.rate = 1;
            window.speechSynthesis.speak(utter);
        } catch (e) { console.log('[notif-sound] gagal mainin suara TTS:', e); }
    }
    // Sound + suara dijalankan BARENGAN (bukan sound dulu baru nunggu selesai baru suara) —
    // soalnya kalau ada jeda/delay di antaranya, browser (terutama iPhone) nganggep itu udah
    // "kelewat lama" dari sentuhan user dan tetep nge-block audionya.
    function playSoundAndSpeak(pesan) {
        playNotifSound();
        speakNotifText(pesan);
    }

    // Kalau pas overlay muncul browser masih nge-block audio otomatis (belum ada sentuhan
    // sama sekali di halaman), sound/suara ditunda dan langsung dimainkan begitu user
    // pertama kali sentuh/klik apa aja di halaman.
    let pendingNotifSpeech = null;
    function tryPlayNotifSound(pesan) {
        const ctx = getNotifAudioCtx();
        if (!ctx || ctx.state !== 'running') {
            console.log('[notif-sound] diblokir browser (autoplay policy), nunggu sentuhan pertama di layar...');
            pendingNotifSpeech = pesan; // selalu siapin fallback duluan, apapun yang terjadi ke resume()
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

    // ----- Overlay preview notifikasi terbaru (muncul 1 detik setelah buka web & data siap, sekali per sesi) -----
    // Kalau URL dibuka dengan ?resetnotif (misal pas testing), status "udah dilihat" direset dulu.
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
    function showNotifOverlayNow() {
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
        // #notifOverlayPreviewStatus sengaja dikecualikan: overlay preview notifikasi
        // gak boleh nongol di ikon lonceng halaman status, cukup di tempat lain.
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
        const remaining = Math.max(0, 150 - (Date.now() - pageLoadTs));
        setTimeout(showNotifOverlayNow, remaining);
    }
    window.addEventListener('load', scheduleNotifOverlay);
    // dipanggil lagi tiap data notifikasi terbaru dari Firestore nyampe —
    // jaga-jaga kalau koneksinya lambat dan data belum ada pas detik pertama tadi.
    window.__onNotifDataReady = scheduleNotifOverlay;

    // ----- STATUS (story) — dikontrol dari apk admin, tampil sebagai bingkai avatar di web utama -----
    window.__statusData = [];
    function applyStatusRing() {
        const active = window.__statusData.length > 0;
        document.querySelectorAll('.avatar-ring').forEach(el => el.classList.toggle('has-status', active));
    }
    // Tampilkan dulu status yang tersimpan di HP (kalau ada) — biar bingkai langsung nyala
    // begitu web dibuka, gak perlu nunggu balesan dari server dulu.
    try {
        const cachedStatus = JSON.parse(localStorage.getItem('cachedStatusData') || 'null');
        if (Array.isArray(cachedStatus)) {
            const now0 = Date.now();
            window.__statusData = cachedStatus.filter(s => !s.expiresAt || s.expiresAt > now0);
            applyStatusRing();
        }
    } catch (e) {}
    onSnapshot(collection(db, 'statuses'), (snap) => {
        const now = Date.now();
        const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        window.__statusData = all.filter(s => !s.expiresAt || s.expiresAt > now).sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
        applyStatusRing();
        try { localStorage.setItem('cachedStatusData', JSON.stringify(all)); } catch (e) {}
        if (window.__onStatusDataReady) window.__onStatusDataReady();
    });

    // ----- Identitas pengunjung anonim (dipakai buat kirim balasan status ke apk admin) -----
    function getVisitorId() {
        try {
            let id = localStorage.getItem('visitorId');
            if (!id) {
                id = 'v_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
                localStorage.setItem('visitorId', id);
            }
            return id;
        } catch (e) { return 'v_anon_' + Date.now(); }
    }
    function getVisitorName() {
        try {
            let nama = localStorage.getItem('visitorName');
            if (!nama) {
                nama = 'Pengunjung' + Math.floor(1000 + Math.random() * 9000);
                localStorage.setItem('visitorName', nama);
            }
            return nama;
        } catch (e) { return 'Pengunjung' + Math.floor(1000 + Math.random() * 9000); }
    }
    window.__visitorId = getVisitorId();
    window.__visitorName = getVisitorName();

    // ----- Deteksi nama perangkat HP dari User Agent (contoh: "Tecno", "Samsung", "iPhone") -----
    function getDeviceName() {
        const ua = navigator.userAgent || '';
        // iPhone / iPad / iOS
        if (/iPhone/i.test(ua)) return 'iPhone';
        if (/iPad/i.test(ua)) return 'iPad';
        // Android: biasanya ada pola "Android 13; NAMA_MODEL)" atau "Android 13; NAMA_MODEL Build/"
        const androidMatch = ua.match(/Android[^;]*;\s*([^;)]+?)(?:\s+Build\/|\))/i);
        if (androidMatch && androidMatch[1]) {
            let model = androidMatch[1].trim();
            // Buang kata generik yang kadang nyempil di string model
            model = model.replace(/\bwv\b/gi, '').trim();
            if (model && !/^K$/i.test(model)) return model;
        }
        if (/Android/i.test(ua)) return 'Android';
        if (/Windows/i.test(ua)) return 'Windows';
        if (/Macintosh/i.test(ua)) return 'Mac';
        if (/Linux/i.test(ua)) return 'Linux';
        return 'Tidak diketahui';
    }
    window.__deviceName = getDeviceName();

    // ================================================================
    // ===== FITUR DATA PENGUNJUNG (sesi masuk/keluar, online, page view) =====
    // ================================================================
    (function visitorTracking() {
        const deviceId = window.__visitorId;
        // pengunjung baru vs lama: ditandai per-device di HP ini, sekali seumur hidup device tsb
        let isNew = false;
        try {
            if (!localStorage.getItem('everVisited')) {
                isNew = true;
                localStorage.setItem('everVisited', '1');
            }
        } catch (e) {}

        const sessionRef = doc(collection(db, 'visitorSessions'));
        const now = Date.now();
        let sessionSaved = false;
        setDoc(sessionRef, {
            deviceId,
            device: window.__deviceName,
            masuk: now,
            keluar: null,
            status: 'online',
            lastSeen: now,
            isNew
        }).then(() => { sessionSaved = true; }).catch(e => console.log('[visitor] gagal catat sesi:', e));

        // heartbeat: nandain sesi masih online, tiap 20 detik
        const heartbeatId = setInterval(() => {
            if (!sessionSaved) return;
            updateDoc(sessionRef, { status: 'online', lastSeen: Date.now() }).catch(() => {});
        }, 20000);

        function markOffline() {
            if (!sessionSaved) return;
            updateDoc(sessionRef, { status: 'offline', keluar: Date.now(), lastSeen: Date.now() }).catch(() => {});
        }
        window.addEventListener('pagehide', markOffline);
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') markOffline();
            else if (sessionSaved) updateDoc(sessionRef, { status: 'online', lastSeen: Date.now() }).catch(() => {});
        });

        // ----- Catat halaman/produk yang dibuka (buat statistik "paling sering dibuka") -----
        window.__trackPageView = function (label) {
            if (!label) return;
            addDoc(collection(db, 'visitorPageViews'), { deviceId, page: label, ts: Date.now() }).catch(() => {});
        };
        window.__trackPageView('Beranda');
    })();

    // ----- Catat penayangan status per-device (jangan dobel kalau device sama nonton ulang) -----
    window.__recordStatusView = function (statusId) {
        if (!statusId) return;
        updateDoc(doc(db, 'statuses', statusId), { viewedBy: arrayUnion(window.__visitorId) }).catch(() => {});
    };

    // ----- Kirim pesan balasan status (masuk ke koleksi pesanMasuk, dibaca di apk admin) -----
    window.__sendPesanMasuk = function (payload) {
        const data = {
            visitorId: window.__visitorId,
            visitorName: window.__visitorName,
            type: payload.type,
            createdAt: Date.now()
        };
        if (payload.text) data.text = payload.text;
        if (payload.img) data.img = payload.img;
        if (payload.audio) data.audio = payload.audio;
        if (payload.statusId) data.statusId = payload.statusId;
        return addDoc(collection(db, 'pesanMasuk'), data);
    };

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

    // ----- Sinkron data produk (nama/foto/harga/deskripsi/QRIS/tambahan) dari website admin -----
    function formatRp(n) {
        n = Number(n) || 0;
        return 'Rp ' + Math.round(n).toLocaleString('id-ID');
    }
    // Tampilkan dulu versi produk yang tersimpan di HP (kalau ada), biar gak nunggu server dulu —
    // ini yang bikin sebelumnya produk baru sempat "hilang" pas refresh terus muncul lagi beberapa saat kemudian.
    try {
        const cachedProducts = JSON.parse(localStorage.getItem('cachedProducts') || 'null');
        if (cachedProducts && window.products) {
            Object.keys(cachedProducts).forEach(id => { window.products[id] = cachedProducts[id]; });
            if (window.renderProductGrid) window.renderProductGrid();
        }
    } catch (e) {}
    onSnapshot(collection(db, 'products'), (snap) => {
        if (!window.products) return; // script.js belum siap
        let changed = false;
        snap.forEach(docSnap => {
            const d = docSnap.data();
            const id = docSnap.id;
            const existing = window.products[id] || {};
            const p = { ...existing };
            p.key = d.key || existing.key;
            p.name = d.name || existing.name;
            p.order = (d.order !== undefined) ? d.order : (existing.order ?? 999);
            p.gridShortDesc = d.gridShortDesc || '';
            if (d.images && d.images.length) p.mainImages = d.images;
            p.gallery = d.gallery || existing.gallery || [];
            if (d.descBlocks) p.descSections = d.descBlocks;
            p.type = d.type || existing.type || 'digital';

            if (p.type === 'digital') {
                p.adminFee = d.adminFee || 0;
                if (d.priceMode === 'coret') {
                    p.priceOld = formatRp(d.priceOriginal);
                    p.price = formatRp(d.priceSale);
                    p.pricePayment = formatRp((d.priceSale || 0) + (d.adminFee || 0));
                } else {
                    p.priceOld = null;
                    p.price = formatRp(d.priceNormal);
                    p.pricePayment = formatRp((d.priceNormal || 0) + (d.adminFee || 0));
                }
                if (d.qris) p.qris = d.qris;
                if (d.addon) {
                    const a = d.addon;
                    p.addon = {
                        name: a.name || '',
                        img: (a.images && a.images[0]) || '',
                        desc: a.desc || '',
                        price: a.priceNormal || 0,
                        priceLabel: formatRp(a.priceNormal),
                        priceCombo: a.priceComboSale || (a.priceNormal || 0),
                        priceComboPayment: formatRp((a.priceComboSale || a.priceNormal || 0) + (a.adminFeeCombo || 0)),
                        adminFeeCombo: a.adminFeeCombo || 0,
                        qrisCombo: a.qrisCombo || p.qris
                    };
                } else if (d.addon === null) {
                    delete p.addon;
                }
            } else {
                p.gridPriceLabel = d.gridPriceLabel || existing.gridPriceLabel;
            }
            window.products[id] = p;
            changed = true;
        });
        if (changed) {
            try {
                const cacheObj = {};
                snap.forEach(docSnap => { cacheObj[docSnap.id] = window.products[docSnap.id]; });
                localStorage.setItem('cachedProducts', JSON.stringify(cacheObj));
            } catch (e) {}
        }
        if (changed && window.renderProductGrid) window.renderProductGrid();
    });
