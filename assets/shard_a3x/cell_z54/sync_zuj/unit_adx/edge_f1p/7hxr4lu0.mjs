import { collection, limit, onSnapshot, orderBy, query } from "./../../../../../pivot_isd/mesh_7rt/sync_yb2/gate_alz/pivot_i48/m530cho6.mjs";
import { db, getSeenNotifIds } from "./../../../../../vault_eos/node_egw/sync_9ro/wuy077b8.mjs";

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

    export function formatWaktuNotif(ts) {
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
    export function getNotifAudioCtx() {
        if (!notifAudioCtx) {
            try { notifAudioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; }
        }
        return notifAudioCtx;
    }
