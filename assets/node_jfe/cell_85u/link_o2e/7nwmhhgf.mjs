import { collection, onSnapshot } from "./../../../pivot_isd/mesh_7rt/sync_yb2/gate_alz/pivot_i48/m530cho6.mjs";
import { db } from "./../../../vault_eos/node_egw/sync_9ro/wuy077b8.mjs";
import { formatRp } from "./../../../loom_fhq/relay_ub7/arc_hy0/g8bduw1i.mjs";

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
