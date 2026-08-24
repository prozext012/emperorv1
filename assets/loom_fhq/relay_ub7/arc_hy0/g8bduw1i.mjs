import { addDoc, arrayUnion, collection, doc, onSnapshot, updateDoc } from "./../../../pivot_isd/mesh_7rt/sync_yb2/gate_alz/pivot_i48/m530cho6.mjs";
import { db } from "./../../../vault_eos/node_egw/sync_9ro/wuy077b8.mjs";


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

    export function formatRp(n) {
        n = Number(n) || 0;
        return 'Rp ' + Math.round(n).toLocaleString('id-ID');
    }

    try {
        const cachedProducts = JSON.parse(localStorage.getItem('cachedProducts') || 'null');
        if (cachedProducts && window.products) {
            Object.keys(cachedProducts).forEach(id => { window.products[id] = cachedProducts[id]; });
            if (window.renderProductGrid) window.renderProductGrid();
        }
    } catch (e) {}
