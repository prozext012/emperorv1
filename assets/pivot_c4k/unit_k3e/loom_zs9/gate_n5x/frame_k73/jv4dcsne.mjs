import { collection, onSnapshot } from "./../../../../../pivot_isd/mesh_7rt/sync_yb2/gate_alz/pivot_i48/m530cho6.mjs";
import { db } from "./../../../../../vault_eos/node_egw/sync_9ro/wuy077b8.mjs";
import { applyStatusRing } from "./../../../../../sync_u7g/pivot_vc6/arc_8s7/shard_ob8/loom_586/ybm6nyj0.mjs";

    onSnapshot(collection(db, 'statuses'), (snap) => {
        const now = Date.now();
        const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        window.__statusData = all.filter(s => !s.expiresAt || s.expiresAt > now).sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
        applyStatusRing();
        try { localStorage.setItem('cachedStatusData', JSON.stringify(all)); } catch (e) {}
        if (window.__onStatusDataReady) window.__onStatusDataReady();
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

    export function getDeviceNameFallback() {
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

