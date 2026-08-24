import { addDoc, collection, doc, getDocs, increment, limit, query, setDoc, updateDoc, where, writeBatch } from "./../../../../pivot_isd/mesh_7rt/sync_yb2/gate_alz/pivot_i48/m530cho6.mjs";
import { db } from "./../../../../vault_eos/node_egw/sync_9ro/wuy077b8.mjs";
import { getDeviceNameFallback } from "./../../../../pivot_c4k/unit_k3e/loom_zs9/gate_n5x/frame_k73/jv4dcsne.mjs";

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
