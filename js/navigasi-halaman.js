    function renderTestimoniSection(productId) {
        const data = products[productId];
        const testimoniSection = document.getElementById('testimoniSection');
        const testimoniList = document.getElementById('testimoniList');
        const testimoniTitle = document.getElementById('testimoniTitle');
        const testimoniLimit = document.getElementById('testimoniLimit');

        const extra = (window.getExtraTestimoni ? window.getExtraTestimoni(productId) : []);
        const list = (data.testimoni || []).concat(extra);

        if (list.length > 0) {
            testimoniSection.style.display = '';
            testimoniTitle.textContent = `Testimoni Pelanggan (${list.length})`;
            testimoniLimit.textContent = `hanya menampilkan ${list.length}`;
            testimoniList.innerHTML = '';
            list.forEach(t => {
                const stars = t.stars || 5;
                const namaLabel = (t.productLabel || data.name).toUpperCase();
                const item = document.createElement('div');
                item.className = 'testimoni-item';
                item.innerHTML = `
                    <div class="testimoni-user">
                        <div class="testimoni-avatar">
                            <svg viewBox="0 0 24 24"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
                        </div>
                        <div>
                            <div class="testimoni-nama"><span style="color:#aaa;font-weight:600;">Produk : </span><span style="color:var(--green);font-weight:800;">${namaLabel}</span></div>
                            <div class="testimoni-stars">${'⭐'.repeat(stars)}</div>
                        </div>
                    </div>
                    <img class="testimoni-foto" src="${t.img}" alt="Testimoni" loading="lazy" />
                `;
                testimoniList.appendChild(item);
            });
        } else {
            testimoniSection.style.display = 'none';
        }
    }

    function openProduct(productId, opts) {
        const data = products[productId];
        if (!data) return;
        opts = opts || {};

        currentProductId = productId;

        detailTitle.textContent = data.name;
        detailPrice.textContent = data.price;
        const isSocial = data.type === 'instagram' || data.type === 'tiktok';
        btnBeliPrice.textContent = isSocial ? `Mulai ${data.price.replace('Mulai ', '')}` : data.price;

        if (data.priceOld) {
            detailPriceOld.textContent = data.priceOld;
            detailPriceOld.style.display = 'inline';
        } else {
            detailPriceOld.style.display = 'none';
        }

        detailDesc.innerHTML = makeDesc(data.descSections);

        if (data.type !== 'instagram') {
            paymentQrisImg.src = data.qris;
            qrisPriceText.textContent = data.pricePayment;
            btnDownloadQris.href = data.qris;

            const qrisAdminText = document.getElementById('qrisAdminText');
            if (qrisAdminText && data.adminFee) {
                qrisAdminText.textContent = `biaya admin +${data.adminFee}`;
            }
        }

        galleryScroll.innerHTML = '';
        (data.gallery || []).forEach(url => {
            const img = document.createElement('img');
            img.src = url;
            img.alt = 'Foto produk';
            galleryScroll.appendChild(img);
        });

        renderTestimoniSection(productId);
        if (window.onTestimoniUpdate) {
            window.onTestimoniUpdate(function () {
                if (currentProductId === productId) renderTestimoniSection(productId);
            });
        }

        buildSlider(data.mainImages || []);
        showProductPage();
        if (window.__trackPageView) window.__trackPageView('Produk: ' + data.name);

        const slug = data.slug || data.key || productId;
        const url = '/detail/' + encodeURIComponent(slug);
        const state = { page: 'product', productId: productId };
        if (opts.pushUrl === false) {
            history.replaceState(state, '', url);
        } else {
            history.pushState(state, '', url);
        }
    }
    window.openProduct = openProduct;

    const fabWa = document.getElementById('fabWa');

    function showMain() {
        pagePayment.classList.remove('active');
        pageProduct.classList.remove('active');
        pageNotif.classList.remove('active');
        mainContainer.style.display = 'block';
        document.body.style.overflow = '';
        currentProductId = null;
        if (fabWa) fabWa.style.display = 'flex';
        if (location.pathname !== '/') history.replaceState({ page: 'main' }, '', '/');
    }

    function showNotifPage() {
        mainContainer.style.display = 'none';
        pageProduct.classList.remove('active');
        pagePayment.classList.remove('active');
        pageNotif.classList.add('active');
        pageNotif.scrollTop = 0;
        document.body.style.overflow = 'hidden';
        if (fabWa) fabWa.style.display = 'none';
        if (window.renderNotifPage) window.renderNotifPage();
        if (window.markNotifSeen) window.markNotifSeen();
    }

    function openNotifPage() {
        showNotifPage();
        history.pushState({ page: 'notif' }, '');
        if (window.__unlockNotifSound) window.__unlockNotifSound();
        if (window.hideNotifOverlay) window.hideNotifOverlay();
    }
    if (btnBackNotif) btnBackNotif.addEventListener('click', () => history.back());

    function showProductPage() {
        mainContainer.style.display = 'none';
        pageProduct.classList.add('active');
        pagePayment.classList.remove('active');
        pageNotif.classList.remove('active');
        document.body.style.overflow = 'hidden';
        pageProduct.scrollTop = 0;
        btnBackProduct.classList.remove('hidden');
        if (fabWa) fabWa.style.display = 'none';
    }

