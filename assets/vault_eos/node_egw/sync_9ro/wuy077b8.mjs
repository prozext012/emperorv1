import { collection, doc, fbApp, initializeFirestore, onSnapshot, orderBy, persistentLocalCache, persistentMultipleTabManager, query, setDoc } from "./../../../pivot_isd/mesh_7rt/sync_yb2/gate_alz/pivot_i48/m530cho6.mjs";


    export let db;
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
        if (p.avatar) { const el = document.getElementById('profileAvatarImg'); if (el) el.src = p.avatar; }
        if (p.banner) { const el = document.getElementById('profileCoverImg'); if (el) el.src = p.banner; }
        if (p.nama) { const el = document.getElementById('profileNameText'); if (el) el.textContent = p.nama; }
        if (p.bio) { const el = document.getElementById('profileBioText'); if (el) el.textContent = p.bio; }
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
    export function getSeenNotifIds() {
        try { return JSON.parse(localStorage.getItem('seenNotifIds') || '[]'); }
        catch (e) { return []; }
    }
