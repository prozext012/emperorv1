
    import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
    import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager, collection, onSnapshot, query, orderBy, doc, setDoc, addDoc, updateDoc, arrayUnion, deleteDoc, getDocs, where, increment, writeBatch, limit } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

    const CLOUDINARY_CLOUD_NAME = 'ywdax4aj';
    const CLOUDINARY_UPLOAD_PRESET = 'statusMedia';
    function resizeFileToDataUrl(file, maxWidth = 1000, quality = 0.75) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = () => reject(new Error('Gagal membaca file gambar.'));
            reader.onload = (e) => {
                const img = new Image();
                img.onerror = () => reject(new Error('Gagal memuat gambar.'));
                img.onload = () => {
                    let { width, height } = img;
                    if (width > maxWidth) { height = Math.round(height * (maxWidth / width)); width = maxWidth; }
                    const canvas = document.createElement('canvas');
                    canvas.width = width; canvas.height = height;
                    canvas.getContext('2d').drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/jpeg', quality));
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }
    function dataUrlToBlob(dataUrl) {
        const [meta, b64] = dataUrl.split(',');
        const mime = meta.match(/:(.*?);/)[1];
        const bin = atob(b64);
        const arr = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
        return new Blob([arr], { type: mime });
    }
    async function uploadBlobToCloudinary(blob) {
        const formData = new FormData();
        formData.append('file', blob);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
            method: 'POST',
            body: formData
        });
        if (!res.ok) {
            let msg = 'Upload gambar ke Cloudinary gagal.';
            try { const errData = await res.json(); if (errData.error && errData.error.message) msg = errData.error.message; } catch (e) {}
            throw new Error(msg);
        }
        const data = await res.json();
        return data.secure_url;
    }

    async function uploadImageIfAny(file, maxWidth = 1000, quality = 0.75) {
        if (!file) return '';
        const dataUrl = await resizeFileToDataUrl(file, maxWidth, quality);
        return uploadBlobToCloudinary(dataUrlToBlob(dataUrl));
    }
    window.__uploadImageToCloudinary = uploadImageIfAny;

    const firebaseConfig = {
        apiKey: "AIzaSyAYoOQXd-C8Nf11H1u1WJhjxBwchV7Uhwc",
        authDomain: "dixzstore-bbb02.firebaseapp.com",
        projectId: "dixzstore-bbb02",
        storageBucket: "dixzstore-bbb02.firebasestorage.app",
        messagingSenderId: "30280369252",
        appId: "1:30280369252:web:9cec081528f736a2284b71"
    };

    const fbApp = initializeApp(firebaseConfig);

    let db;
    try {
        db = initializeFirestore(fbApp, {
            localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
        });
    } catch (e) {

        db = initializeFirestore(fbApp, {});
    }

    const PRODUCT_LIST = [
        { id: 1, key: 'apk-jam', name: 'APK Widget Jam' },
        { id: 2, key: 'ig', name: 'Followers IG' },
        { id: 3, key: 'ebook', name: '2.000+ Buku Digital Premium' },
        { id: 4, key: 'tiktok', name: 'Followers TikTok' }
    ];
    PRODUCT_LIST.forEach(p => {
        setDoc(doc(db, 'productMeta', String(p.id)), p).catch(() => {});
    });

    onSnapshot(doc(db, 'settings', 'status'), (snap) => {
        const online = snap.exists() ? (snap.data().online !== false) : true;
        const badge = document.querySelector('.online-badge');
        if (badge) {
            badge.querySelector('span').textContent = online ? 'Online' : 'Offline';
            badge.style.borderColor = 'var(--dark)';
            badge.querySelector('.online-dot').style.background = online ? 'var(--green)' : 'var(--soft-red)';
        }
    });

    function applyProfileToDom(p) {
        if (!p) return;
        if (p.avatar) {
            const el = document.getElementById('profileAvatarImg'); if (el) { el.style.display = ''; el.src = p.avatar; }
            const fav = document.getElementById('dynamicFavicon'); if (fav) fav.href = p.avatar;
        }
        if (p.banner) { const el = document.getElementById('profileCoverImg'); if (el) { el.style.display = ''; el.src = p.banner; } }
        if (p.nama) { const el = document.getElementById('profileNameText'); if (el) el.textContent = p.nama; }
        if (p.bio) { const el = document.getElementById('profileBioText'); if (el) el.textContent = p.bio; }
        if (p.whatsapp) {
            window.__waNumber = p.whatsapp;
            const fab = document.getElementById('fabWa');
            if (fab) {
                fab.href = `https://wa.me/${p.whatsapp}?text=${encodeURIComponent('p, min')}`;
                fab.style.display = '';
            }
            document.dispatchEvent(new CustomEvent('waNumberReady', { detail: p.whatsapp }));
        }
    }

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

    window.__notifData = [];

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
    onSnapshot(query(collection(db, 'notifikasi'), orderBy('createdAt', 'desc'), limit(200)), (snap) => {
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

    window.markNotifSeen = function () {
        try { localStorage.setItem('seenNotifIds', JSON.stringify(window.__notifData.map(n => n.id))); } catch (e) {}
        updateNotifBadges();
    };

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

    let pendingNotifSpeech = null;
    function tryPlayNotifSound(pesan) {
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
    function applyStatusRing() {
        const active = window.__statusData.length > 0;
        document.querySelectorAll('.avatar-ring').forEach(el => el.classList.toggle('has-status', active));
    }

    function checkDeepLinkStatus() {
        if (window.__statusDeepLinkHandled) return;
        const m = location.pathname.match(/^\/status\/([^/]+)\/?$/);
        if (!m) { window.__statusDeepLinkHandled = true; return; }
        const statusId = decodeURIComponent(m[1]);
        const list = window.__statusData || [];
        const idx = list.findIndex(s => s.id === statusId);
        if (idx >= 0 && window.openStatusViewer) {
            window.__statusDeepLinkHandled = true;
            window.openStatusViewer(idx, { pushUrl: false });
        }
        // Kalau status belum ketemu (data belum sampai dari Firestore atau sudah
        // kedaluwarsa), biarkan dicoba lagi di pemanggilan berikutnya.
    }

    try {
        const cachedStatus = JSON.parse(localStorage.getItem('cachedStatusData') || 'null');
        if (Array.isArray(cachedStatus)) {
            const now0 = Date.now();
            window.__statusData = cachedStatus.filter(s => !s.expiresAt || s.expiresAt > now0);
            applyStatusRing();
            checkDeepLinkStatus();
        }
    } catch (e) {}
    onSnapshot(collection(db, 'statuses'), (snap) => {
        const now = Date.now();
        const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        window.__statusData = all.filter(s => !s.expiresAt || s.expiresAt > now).sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
        applyStatusRing();
        try { localStorage.setItem('cachedStatusData', JSON.stringify(all)); } catch (e) {}
        if (window.__onStatusDataReady) window.__onStatusDataReady();
        checkDeepLinkStatus();
    });

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

    function getDeviceNameFallback() {
        const ua = navigator.userAgent || '';
        if (/iPhone/i.test(ua)) return 'iPhone';
        if (/iPad/i.test(ua)) return 'iPad';
        const androidMatch = ua.match(/Android[^;]*;\s*([^;)]+?)(?:\s+Build\/|\))/i);
        if (androidMatch && androidMatch[1]) {
            let model = androidMatch[1].trim().replace(/\bwv\b/gi, '').trim();
            if (model && !/^K$/i.test(model)) return model;
        }
        if (/Android/i.test(ua)) return 'Android';
        if (/Windows/i.test(ua)) return 'Windows';
        if (/Macintosh/i.test(ua)) return 'Mac';
        if (/Linux/i.test(ua)) return 'Linux';
        return 'Tidak diketahui';
    }
    async function getDeviceName() {
        try {
            if (navigator.userAgentData && navigator.userAgentData.getHighEntropyValues) {
                const info = await navigator.userAgentData.getHighEntropyValues(['model', 'platform']);
                if (info.model && info.model.trim()) return info.model.trim();
                if (info.platform) return info.platform;
            }
        } catch (e) {}
        return getDeviceNameFallback();
    }
    window.__deviceNamePromise = Promise.race([
        getDeviceName(),
        new Promise(resolve => setTimeout(() => resolve(getDeviceNameFallback()), 3000))
    ]);

    (function visitorTracking() {
        const deviceId = window.__visitorId;

        let isNew = false;
        try {
            if (!localStorage.getItem('everVisited')) {
                isNew = true;
                localStorage.setItem('everVisited', '1');
            }
        } catch (e) {}

        const sessionRef = doc(collection(db, 'visitorSessions'));
        const now = Date.now();

        setDoc(sessionRef, {
            deviceId,
            device: getDeviceNameFallback(),
            masuk: now,
            keluar: null,
            status: 'online',
            lastSeen: now,
            isNew
        }).catch(e => console.log('[visitor] gagal catat sesi:', e));

        const nowD = new Date(now);
        const dateKey = nowD.getFullYear() + '-' + String(nowD.getMonth() + 1).padStart(2, '0') + '-' + String(nowD.getDate()).padStart(2, '0');
        const hourKey = String(nowD.getHours());
        setDoc(doc(db, 'dailyStats', dateKey), { visits: increment(1) }, { merge: true }).catch(() => {});
        setDoc(doc(db, 'stats', 'summary'), {
            totalVisitsAllTime: increment(1),
            [`hourly.${hourKey}`]: increment(1),
            ...(isNew ? { totalNewVisitorsAllTime: increment(1) } : {})
        }, { merge: true }).catch(() => {});

        window.__deviceNamePromise.then(name => {
            if (name && name !== getDeviceNameFallback()) {
                updateDoc(sessionRef, { device: name }).catch(() => {});
            }
        }).catch(() => {});

        const heartbeatId = setInterval(() => {
            updateDoc(sessionRef, { status: 'online', lastSeen: Date.now() }).catch(() => {});
        }, 20000);

        function markOffline() {
            updateDoc(sessionRef, { status: 'offline', keluar: Date.now(), lastSeen: Date.now() }).catch(() => {});
        }
        window.addEventListener('pagehide', markOffline);
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') markOffline();
            else updateDoc(sessionRef, { status: 'online', lastSeen: Date.now() }).catch(() => {});
        });

        window.__trackPageView = function (label) {
            if (!label) return;
            addDoc(collection(db, 'visitorPageViews'), { deviceId, page: label, ts: Date.now() }).catch(() => {});

            const safeKey = String(label).replace(/[.$/[\]#]/g, '_');
            setDoc(doc(db, 'stats', 'summary'), { [`pageCounts.${safeKey}`]: increment(1) }, { merge: true }).catch(() => {});
        };
        window.__trackPageView('Beranda');
    })();

    async function deleteOldDocs(collectionName, field, cutoff) {
        try {
            const snap = await getDocs(query(collection(db, collectionName), where(field, '<', cutoff), limit(400)));
            if (snap.empty) return 0;
            const batch = writeBatch(db);
            snap.forEach(d => batch.delete(d.ref));
            await batch.commit();
            return snap.size;
        } catch (e) {
            console.log(`[cleanup] gagal bersihin ${collectionName}:`, e);
            return 0;
        }
    }
    async function runDailyCleanup() {
        const now = Date.now();
        const H = 3600000;
        await Promise.all([
            deleteOldDocs('statuses', 'expiresAt', now),
            deleteOldDocs('visitorSessions', 'masuk', now - 24 * H),
            deleteOldDocs('pesanMasuk', 'createdAt', now - 24 * H),
            deleteOldDocs('notifikasi', 'createdAt', now - 48 * H),
            deleteOldDocs('visitorPageViews', 'ts', now - 24 * H)
        ]);
    }
    (function scheduleCleanup() {
        try {
            const THROTTLE = 3 * 3600000;
            const last = Number(localStorage.getItem('lastCleanupRun') || 0);
            if (Date.now() - last < THROTTLE) return;
            localStorage.setItem('lastCleanupRun', String(Date.now()));

            setTimeout(() => { runDailyCleanup().catch(() => {}); }, 4000);
        } catch (e) {}
    })();

    window.__recordStatusView = function (statusId) {
        if (!statusId) return;
        updateDoc(doc(db, 'statuses', statusId), { viewedBy: arrayUnion(window.__visitorId) }).catch(() => {});
    };

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

    const productKeyMap = { 1: 'apk-jam', 2: 'ig', 3: 'ebook', 4: 'tiktok' };
    const productNameMap = { 'apk-jam': 'APK Widget Jam', 'ig': 'Followers IG', 'ebook': '2.000+ Buku Digital Premium', 'tiktok': 'Followers TikTok' };
    window.__testimoniData = {};
    window.__testimoniUpdateCbs = [];
    window.onTestimoniUpdate = function (cb) { window.__testimoniUpdateCbs.push(cb); };
    window.getExtraTestimoni = function (productDbId) {
        const key = productKeyMap[productDbId];

        const own = (window.__testimoniData[key] || [])
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

    function formatRp(n) {
        n = Number(n) || 0;
        return 'Rp ' + Math.round(n).toLocaleString('id-ID');
    }

    function checkDeepLinkProduct() {
        if (window.__deepLinkHandled) return;
        const m = location.pathname.match(/^\/detail\/([^/]+)(?:\/([^/]+))?\/?$/);
        if (!m) { window.__deepLinkHandled = true; return; }
        const slug = decodeURIComponent(m[1]);
        const sub = m[2] ? decodeURIComponent(m[2]) : null;
        const id = window.productKeyToId && window.productKeyToId[slug];
        if (!id || !window.products[id]) {
            // Produk belum ketemu (data belum sampai dari Firestore), coba lagi
            // di pemanggilan berikutnya (saat snapshot berikutnya datang).
            return;
        }
        window.__deepLinkHandled = true;
        window.openProduct(id, { pushUrl: false });
        if (sub === 'tambahan' && window.openAddonSheet) {
            window.openAddonSheet({ pushUrl: false });
        } else if (sub === 'metode' && window.openMethodSheet) {
            window.openMethodSheet({ pushUrl: false });
        } else if (sub === 'pembayaran' && window.openPayment) {
            window.openPayment({ pushUrl: false });
        }
    }

    try {
        const cachedProducts = JSON.parse(localStorage.getItem('cachedProducts') || 'null');
        if (cachedProducts && window.products) {
            Object.keys(cachedProducts).forEach(id => { window.products[id] = cachedProducts[id]; });
            if (window.renderProductGrid) window.renderProductGrid();
            checkDeepLinkProduct();
        }
    } catch (e) {}
    onSnapshot(collection(db, 'products'), { includeMetadataChanges: true }, (snap) => {
        if (!window.products) return;

        if (!snap.metadata.fromCache) window.__productsSyncedFromServer = true;
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
                if (d.followerData) {
                    const fd = {};
                    Object.keys(d.followerData).forEach(qty => {
                        const row = d.followerData[qty] || {};
                        fd[qty] = {
                            price: formatRp(row.price),
                            pricePayment: formatRp((row.price || 0) + 100),
                            qris: row.qris || ''
                        };
                    });
                    p.followerData = fd;

                    if (fd[100]) p.gridPriceLabel = fd[100].price;
                    else p.gridPriceLabel = d.gridPriceLabel || existing.gridPriceLabel;
                } else {
                    p.gridPriceLabel = d.gridPriceLabel || existing.gridPriceLabel;
                }
                p.price = p.gridPriceLabel || existing.price || '';
                p.priceOld = null;
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
        checkDeepLinkProduct();
    });
