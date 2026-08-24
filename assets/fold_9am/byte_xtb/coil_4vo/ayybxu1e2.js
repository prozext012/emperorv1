
    function formatRupiah(n) {
        n = Number(n) || 0;
        return 'Rp ' + Math.round(n).toLocaleString('id-ID');
    }
    window.formatRupiah = formatRupiah;

    function makeDesc(sections) {
        return sections.map(s => {
            if (s.type === 'heading') return `<span class="desc-heading">${s.text}</span>`;
            if (s.type === 'paragraph') return `<span class="desc-paragraph"${s.bold ? ' style="font-weight:800;"' : ''}>${s.text}</span>`;
            if (s.type === 'tagline') return `<span class="desc-tagline">${s.text}</span>`;
            if (s.type === 'divider') return `<span class="desc-divider"></span>`;
            if (s.type === 'cta') return `<span class="desc-cta">${s.text}</span>`;
            if (s.type === 'list') return `<ul class="desc-list">${s.items.map(i=>`<li>${i}</li>`).join('')}</ul>`;
            if (s.type === 'image') return `<img src="${s.src}" alt="Foto produk" loading="lazy" decoding="async" style="width:100%;border-radius:12px;margin:8px 0;display:block;" />`;
            return '';
        }).join('');
    }

    let products = {};
    window.products = products;
    window.productKeyToId = {};
    Object.keys(products).forEach(id => { window.productKeyToId[products[id].key] = id; });
    const productGrid = document.getElementById('productGrid');

    function normalizeGridPriceLabel(label) {
        if (!label) return '';
        label = String(label).trim();
        if (/^mulai/i.test(label)) {
            const rest = label.replace(/^mulai\s*/i, '').trim();
            return /^rp/i.test(rest) ? rest : ('Rp ' + rest);
        }
        return label;
    }
    function renderProductGrid() {
        if (!productGrid) return;
        const ids = Object.keys(products).sort((a, b) => (products[a].order ?? 999) - (products[b].order ?? 999));
        productGrid.innerHTML = ids.map(id => {
            const p = products[id];
            const thumb = (p.mainImages && p.mainImages[0]) || '';
            const priceHtml = p.priceOld
                ? `<span class="product-price-old">${p.priceOld}</span><span class="product-price">${p.price}</span>`
                : `<span class="product-price">${normalizeGridPriceLabel(p.gridPriceLabel || p.price || '')}</span>`;
            return `
                <div class="product-card" data-product="${id}">
                    <img src="${thumb}" alt="${p.name}" loading="lazy" decoding="async" />
                    <div class="product-info">
                        <div class="product-name">${p.name}</div>
                        <div class="product-price-wrap">${priceHtml}</div>
                        <div class="product-desc">${p.gridShortDesc || ''}</div>
                    </div>
                </div>
            `;
        }).join('');
    }
    window.renderProductGrid = renderProductGrid;
    renderProductGrid();

    function renderNotifTickerV1(messages) {
        const wrap = document.getElementById('notifTickerV1');
        const inner = document.getElementById('notifTickerInner');
        if (!wrap || !inner) return;
        const list = (messages || []).map(t => (t || '').trim()).filter(Boolean);
        if (list.length === 0) {
            wrap.style.display = 'none';
            inner.classList.remove('run');
            inner.innerHTML = '';
            return;
        }
        wrap.style.display = 'flex';

        const setHtml = list.map(t => `<span class="notif-ticker-msg">${t.replace(/</g, '&lt;')}</span><span class="notif-ticker-divider"></span>`).join('');
        inner.innerHTML = setHtml + setHtml;
        inner.classList.remove('run');
        requestAnimationFrame(() => {
            const oneSetWidth = inner.scrollWidth / 2;
            const speedPxPerSecond = 55;
            const duration = Math.max(8, oneSetWidth / speedPxPerSecond);
            inner.style.animationDuration = duration + 's';
            inner.classList.add('run');
        });
    }
    window.renderNotifTickerV1 = renderNotifTickerV1;
    const pageProduct = document.getElementById('pageProduct');
    const pagePayment = document.getElementById('pagePayment');
    const pageNotif = document.getElementById('pageNotif');
    const btnBackNotif = document.getElementById('btnBackNotif');
    const mainContainer = document.getElementById('mainContainer');
    const btnBackProduct = document.getElementById('btnBackProduct');
    const btnBackPayment = document.getElementById('btnBackPayment');
    const btnBeliSekarang = document.getElementById('btnBeliSekarang');
    const btnBeliPrice = document.getElementById('btnBeliPrice');

    const detailTitle = document.getElementById('detailTitle');
    const detailPrice = document.getElementById('detailPrice');
    const detailPriceOld = document.getElementById('detailPriceOld');
    const detailDesc = document.getElementById('detailDesc');
    const galleryScroll = document.getElementById('galleryScroll');

    const paymentQrisImg = document.getElementById('paymentQrisImg');
