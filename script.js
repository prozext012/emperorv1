
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
    const qrisPriceText = document.getElementById('qrisPriceText');
    const btnDownloadQris = document.getElementById('btnDownloadQris');

    const slideTrack = document.getElementById('slideTrack');
    const sliderIndicators = document.getElementById('sliderIndicators');

    let currentProductId = null;
    let currentSlide = 0;
    let totalSlides = 0;

    function buildSlider(images) {
        slideTrack.innerHTML = '';
        sliderIndicators.innerHTML = '';
        totalSlides = images.length;
        currentSlide = 0;

        images.forEach((url) => {
            const img = document.createElement('img');
            img.src = url;
            img.alt = 'Foto produk';
            img.draggable = false;
            slideTrack.appendChild(img);
        });

        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('span');
            if (i === 0) dot.classList.add('active');
            dot.dataset.index = i;
            dot.addEventListener('click', function(e) {
                e.stopPropagation();
                goToSlide(parseInt(this.dataset.index));
            });
            sliderIndicators.appendChild(dot);
        }

        updateSlider();
    }

    function goToSlide(index) {
        if (index < 0) index = 0;
        if (index >= totalSlides) index = totalSlides - 1;
        currentSlide = index;
        updateSlider();
    }

    function updateSlider() {
        const offset = -currentSlide * 100;
        slideTrack.style.transform = `translateX(${offset}%)`;

        const dots = sliderIndicators.querySelectorAll('span');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    let touchStartX = 0;
    let touchCurrentX = 0;
    let isSwiping = false;

    slideTrack.addEventListener('touchstart', function(e) {
        if (totalSlides <= 1) return;
        touchStartX = e.touches[0].clientX;
        touchCurrentX = touchStartX;
        isSwiping = true;
        slideTrack.style.transition = 'none';
    }, { passive: true });

    slideTrack.addEventListener('touchmove', function(e) {
        if (!isSwiping) return;
        touchCurrentX = e.touches[0].clientX;
        let diff = touchCurrentX - touchStartX;
        if (currentSlide === 0 && diff > 0) diff = 0;
        if (currentSlide === totalSlides - 1 && diff < 0) diff = 0;
        const offset = -currentSlide * 100 + (diff / slideTrack.offsetWidth) * 100;
        slideTrack.style.transform = `translateX(${offset}%)`;
    }, { passive: true });

    slideTrack.addEventListener('touchend', function() {
        if (!isSwiping) return;
        isSwiping = false;
        slideTrack.style.transition = '';

        const diff = touchCurrentX - touchStartX;
        const threshold = slideTrack.offsetWidth * 0.15;

        if (diff > threshold && currentSlide > 0) {
            goToSlide(currentSlide - 1);
        } else if (diff < -threshold && currentSlide < totalSlides - 1) {
            goToSlide(currentSlide + 1);
        } else {
            updateSlider();
        }
        touchStartX = 0;
        touchCurrentX = 0;
    });

    let mouseDownX = 0;
    let isMouseDragging = false;

    slideTrack.addEventListener('mousedown', function(e) {
        if (totalSlides <= 1) return;
        mouseDownX = e.clientX;
        isMouseDragging = true;
        slideTrack.style.transition = 'none';
    });

    window.addEventListener('mousemove', function(e) {
        if (!isMouseDragging) return;
        let diff = e.clientX - mouseDownX;
        if (currentSlide === 0 && diff > 0) diff = 0;
        if (currentSlide === totalSlides - 1 && diff < 0) diff = 0;
        const offset = -currentSlide * 100 + (diff / slideTrack.offsetWidth) * 100;
        slideTrack.style.transform = `translateX(${offset}%)`;
    });

    window.addEventListener('mouseup', function(e) {
        if (!isMouseDragging) return;
        isMouseDragging = false;
        slideTrack.style.transition = '';

        const diff = e.clientX - mouseDownX;
        const threshold = slideTrack.offsetWidth * 0.15;

        if (diff > threshold && currentSlide > 0) {
            goToSlide(currentSlide - 1);
        } else if (diff < -threshold && currentSlide < totalSlides - 1) {
            goToSlide(currentSlide + 1);
        } else {
            updateSlider();
        }
    });

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

    function openProduct(productId) {
        const data = products[productId];
        if (!data) return;

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
                qrisAdminText.textContent = `${data.adminFee}+ biaya admin`;
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
        history.pushState({ page: 'product' }, '');
    }

    const fabWa = document.getElementById('fabWa');

    function showMain() {
        pagePayment.classList.remove('active');
        pageProduct.classList.remove('active');
        pageNotif.classList.remove('active');
        mainContainer.style.display = 'block';
        document.body.style.overflow = '';
        currentProductId = null;
        if (fabWa) fabWa.style.display = 'flex';
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

    function showPaymentPage() {
        pagePayment.classList.add('active');
        pageProduct.classList.remove('active');
        pageNotif.classList.remove('active');
        pagePayment.scrollTop = 0;
        btnBackPayment.classList.remove('hidden');
        if (fabWa) fabWa.style.display = 'flex';
        if (window.__trackPageView) window.__trackPageView('Pembayaran: ' + (currentProductId && products[currentProductId] ? products[currentProductId].name : ''));
    }

    const btnBuktiWa = document.getElementById('btnBuktiWa');
    const waNumber = '6282129051447';

    function openPayment() {

        let waText;
        const isSocialProduct = products[currentProductId] && (products[currentProductId].type === 'instagram' || products[currentProductId].type === 'tiktok');
        if (isSocialProduct && window._igOrderData) {
            const d = window._igOrderData;
            waText = `Halo min, saya mau order:\n\nPlatform   : ${d.platform}\nusername   : ${d.username}\njumlah fol : ${d.followers} followers\nharga         : ${d.price}\n\n(Bukti transfer terlampir)`;
        } else {
            const prodName = products[currentProductId] ? products[currentProductId].name : 'Produk';
            waText = `Halo min, saya mau kirim bukti transaksi untuk:\n\nProduk : ${prodName}\n\n(Bukti transfer terlampir)`;
        }

        const instr4 = document.getElementById('paymentInstr4');
        if (instr4) {
            const namaUntukInstr = products[currentProductId] ? products[currentProductId].name : 'Produk';
            instr4.textContent = namaUntukInstr + ' dikirim lewat WA';
        }

        if (btnBuktiWa) {
            btnBuktiWa.href = `https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`;
        }

        showPaymentPage();
        history.pushState({ page: 'payment' }, '');
    }

    pageProduct.addEventListener('scroll', function() {
        const scrollY = this.scrollTop;

        const sliderH = detailSlider ? detailSlider.offsetHeight : 300;
        if (scrollY > sliderH * 0.6) {
            btnBackProduct.classList.add('hidden');
        } else {
            btnBackProduct.classList.remove('hidden');
        }
    });

    pagePayment.addEventListener('scroll', function() {
        const scrollY = this.scrollTop;
        const btnNotifPaymentEl = document.getElementById('btnNotifPayment');
        if (scrollY > 80) {
            btnBackPayment.classList.add('hidden');
            if (btnNotifPaymentEl) btnNotifPaymentEl.classList.add('hidden');
        } else {
            btnBackPayment.classList.remove('hidden');
            if (btnNotifPaymentEl) btnNotifPaymentEl.classList.remove('hidden');
        }
    });

    const sheetOverlay = document.getElementById('sheetOverlay');
    const paymentMethodSheet = document.getElementById('paymentMethodSheet');
    const sheetMethodView = document.getElementById('sheetMethodView');
    const sheetLoadingView = document.getElementById('sheetLoadingView');
    const btnLanjutkanPayment = document.getElementById('btnLanjutkanPayment');
    const methodOptions = document.querySelectorAll('.method-option:not(.disabled)');

    function openMethodSheet() {

        if (!window.__productsSyncedFromServer) {
            showToast('Menyinkronkan harga terbaru, coba lagi sebentar...');
            let tries = 0;
            const waitSync = setInterval(() => {
                tries++;
                if (window.__productsSyncedFromServer) {
                    clearInterval(waitSync);
                    openMethodSheet();
                } else if (tries > 20) {
                    clearInterval(waitSync);
                    showToast('Koneksi lambat, coba refresh halaman');
                }
            }, 500);
            return;
        }

        methodOptions.forEach(o => o.classList.remove('selected'));
        btnLanjutkanPayment.disabled = true;
        sheetMethodView.style.display = '';
        sheetLoadingView.classList.remove('active');

        sheetOverlay.classList.add('active');
        paymentMethodSheet.classList.add('active');
    }

    function closeMethodSheet() {
        sheetOverlay.classList.remove('active');
        paymentMethodSheet.classList.remove('active');
    }

    methodOptions.forEach(opt => {
        opt.addEventListener('click', function() {
            methodOptions.forEach(o => o.classList.remove('selected'));
            this.classList.add('selected');
            btnLanjutkanPayment.disabled = false;
        });
    });

    sheetOverlay.addEventListener('click', closeMethodSheet);

    btnLanjutkanPayment.addEventListener('click', function() {
        if (this.disabled) return;

        const loadingLabel = document.getElementById('sheetLoadingLabel');
        if (loadingLabel) loadingLabel.textContent = 'Menyiapkan QRIS Pembayaran...';

        sheetMethodView.style.display = 'none';
        sheetLoadingView.classList.add('active');

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                const fill = document.getElementById('sheetProgressFill');
                if (fill) fill.classList.add('run');
            });
        });

        setTimeout(function() {

            const fill = document.getElementById('sheetProgressFill');
            if (fill) fill.classList.remove('run');

            closeMethodSheet();

            setTimeout(function() {
                sheetMethodView.style.display = '';
                sheetLoadingView.classList.remove('active');
                openPayment();
            }, 320);
        }, 2000);
    });

    if (productGrid) {
        productGrid.addEventListener('click', function (e) {
            const card = e.target.closest('.product-card');
            if (card) openProduct(card.dataset.product);
        });
    }

    btnBackProduct.addEventListener('click', () => history.back());
    btnBeliSekarang.addEventListener('click', function() {
        const data = products[currentProductId];
        if (!data) return;
        if (data.type === 'instagram') {
            openIGSheet('instagram');
        } else if (data.type === 'tiktok') {
            openIGSheet('tiktok');
        } else if (currentProductId == 1 && data.addon) {
            openAddonSheet();
        } else {
            openMethodSheet();
        }
    });

    const addonSheetOverlay = document.getElementById('addonSheetOverlay');
    const addonSheet = document.getElementById('addonSheet');
    const addonSheetView = document.getElementById('addonSheetView');
    const addonLoadingView = document.getElementById('addonLoadingView');
    const addonCard = document.getElementById('addonCard');
    const addonCardImg = document.getElementById('addonCardImg');
    const addonCardName = document.getElementById('addonCardName');
    const addonCardDesc = document.getElementById('addonCardDesc');
    const addonCardPrice = document.getElementById('addonCardPrice');
    const addonTotalValue = document.getElementById('addonTotalValue');
    const btnLanjutkanAddon = document.getElementById('btnLanjutkanAddon');
    let addonSelected = false;

    function formatRp(n) {
        return 'Rp ' + n.toLocaleString('id-ID');
    }

    function parseRpToNumber(str) {
        return Number(String(str || '').replace(/[^\d]/g, '')) || 0;
    }

    function openAddonSheet() {
        const data = products[1];
        const addon = data.addon;
        addonSelected = false;
        addonCard.classList.remove('selected');
        addonCardImg.src = addon.img;
        addonCardName.textContent = addon.name;
        addonCardDesc.textContent = addon.desc;
        addonCardPrice.textContent = '+' + addon.priceLabel;
        const basePrice = parseRpToNumber(data.price);
        addonTotalValue.textContent = formatRp(basePrice);
        btnLanjutkanAddon.textContent = `Lanjutkan • ${formatRp(basePrice)}`;
        addonSheetView.style.display = '';
        addonLoadingView.classList.remove('active');
        const fill = document.getElementById('addonProgressFill');
        if (fill) fill.classList.remove('run');
        addonSheetOverlay.classList.add('active');
        addonSheet.classList.add('active');
    }

    function closeAddonSheet() {
        addonSheetOverlay.classList.remove('active');
        addonSheet.classList.remove('active');
    }

    addonCard.addEventListener('click', function() {
        addonSelected = !addonSelected;
        addonCard.classList.toggle('selected', addonSelected);
        const data = products[1];
        const addon = data.addon;
        const basePrice = parseRpToNumber(data.price);
        const total = addonSelected ? addon.priceCombo : basePrice;
        addonTotalValue.textContent = formatRp(total);
        btnLanjutkanAddon.textContent = `Lanjutkan • ${formatRp(total)}`;
    });

    addonSheetOverlay.addEventListener('click', closeAddonSheet);

    btnLanjutkanAddon.addEventListener('click', function() {
        const data = products[1];
        const addon = data.addon;

        if (addonSelected) {
            paymentQrisImg.src = addon.qrisCombo;
            qrisPriceText.textContent = addon.priceComboPayment;
            btnDownloadQris.href = addon.qrisCombo;
            const qrisAdminText = document.getElementById('qrisAdminText');
            if (qrisAdminText) qrisAdminText.textContent = `${addon.adminFeeCombo}+ biaya admin`;
        } else {
            paymentQrisImg.src = data.qris;
            qrisPriceText.textContent = data.pricePayment;
            btnDownloadQris.href = data.qris;
            const qrisAdminText = document.getElementById('qrisAdminText');
            if (qrisAdminText) qrisAdminText.textContent = `${data.adminFee}+ biaya admin`;
        }

        addonSheetView.style.display = 'none';
        addonLoadingView.classList.add('active');
        requestAnimationFrame(() => requestAnimationFrame(() => {
            const fill = document.getElementById('addonProgressFill');
            if (fill) fill.classList.add('run');
        }));

        setTimeout(function() {
            closeAddonSheet();
            setTimeout(function() {
                addonSheetView.style.display = '';
                addonLoadingView.classList.remove('active');
                const fill = document.getElementById('addonProgressFill');
                if (fill) fill.classList.remove('run');
                openMethodSheet();
            }, 320);
        }, 2000);
    });
    btnBackPayment.addEventListener('click', () => history.back());

    if (btnDownloadQris) {
        btnDownloadQris.addEventListener('click', async function(e) {
            e.preventDefault();
            const url = this.getAttribute('href');
            if (!url) return;
            try {
                const res = await fetch(url, { mode: 'cors' });
                if (!res.ok) throw new Error('Gagal mengambil gambar');
                const blob = await res.blob();
                const blobUrl = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'QRIS-DixzVip.jpg';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(blobUrl);
            } catch (err) {
                window.open(url, '_blank');
            }
        });
    }

    const igSheetOverlay = document.getElementById('igSheetOverlay');
    const igInputSheet = document.getElementById('igInputSheet');
    const igInputView = document.getElementById('igInputView');
    const igLoadingView = document.getElementById('igLoadingView');
    const igUsernameInput = document.getElementById('igUsernameInput');
    const igFollowersBtns = document.querySelectorAll('.ig-followers-btn');
    const igPriceDisplay = document.getElementById('igPriceDisplay');
    const btnLanjutkanIG = document.getElementById('btnLanjutkanIG');

    let selectedFollowers = null;

    function openIGSheet(platform) {
        const platformName = platform === 'tiktok' ? 'TikTok' : 'Instagram';
        const igSheetTitle = document.getElementById('igSheetTitle');
        const igUsernameLabel = document.getElementById('igUsernameLabel');
        if (igSheetTitle) igSheetTitle.textContent = `Detail Pesanan ${platformName}`;
        if (igUsernameLabel) igUsernameLabel.textContent = `Username ${platformName}`;

        igUsernameInput.value = '';
        igUsernameInput.placeholder = `@username_${platform === 'tiktok' ? 'tiktok' : 'kamu'}`;
        igFollowersBtns.forEach(b => b.classList.remove('selected'));
        igPriceDisplay.textContent = 'Pilih jumlah dulu';
        igPriceDisplay.style.color = '#aaa';
        btnLanjutkanIG.disabled = true;
        selectedFollowers = null;
        igInputView.style.display = '';
        igLoadingView.classList.remove('active');

        igSheetOverlay.classList.add('active');
        igInputSheet.classList.add('active');
    }

    function closeIGSheet() {
        igSheetOverlay.classList.remove('active');
        igInputSheet.classList.remove('active');
    }

    igSheetOverlay.addEventListener('click', closeIGSheet);

    igFollowersBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            igFollowersBtns.forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            selectedFollowers = parseInt(this.dataset.amount);

            const data = products[currentProductId];
            if (!data || !data.followerData) return;
            const tier = data.followerData[selectedFollowers];
            if (!tier) return;
            igPriceDisplay.textContent = tier.price;
            igPriceDisplay.style.color = 'var(--green)';

            checkIGReady();
        });
    });

    igUsernameInput.addEventListener('input', checkIGReady);

    function checkIGReady() {
        const usernameOk = igUsernameInput.value.trim().length > 0;
        const followersOk = selectedFollowers !== null;
        btnLanjutkanIG.disabled = !(usernameOk && followersOk);
    }

    btnLanjutkanIG.addEventListener('click', function() {
        if (this.disabled) return;

        const data = products[currentProductId];
        const tier = data.followerData[selectedFollowers];
        const platformName = data.type === 'tiktok' ? 'TikTok' : 'Instagram';

        window._igOrderData = {
            username: igUsernameInput.value.trim(),
            followers: selectedFollowers,
            price: tier.pricePayment,
            platform: platformName
        };

        paymentQrisImg.src = tier.qris;
        qrisPriceText.textContent = tier.pricePayment;
        btnDownloadQris.href = tier.qris;

        igInputView.style.display = 'none';
        igLoadingView.classList.add('active');

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                const fill = document.getElementById('igProgressFill');
                if (fill) fill.classList.add('run');
            });
        });

        setTimeout(function() {

            igSheetOverlay.classList.remove('active');
            igInputSheet.classList.remove('active');

            setTimeout(function() {

                igInputView.style.display = '';
                igLoadingView.classList.remove('active');
                const fill = document.getElementById('igProgressFill');
                if (fill) fill.classList.remove('run');

                openMethodSheet();
            }, 320);
        }, 2000);
    });

    window.addEventListener('popstate', function(e) {
        if (igInputSheet && igInputSheet.classList.contains('active')) {
            closeIGSheet();
            history.pushState(e.state || { page: 'product' }, '');
            return;
        }
        if (paymentMethodSheet.classList.contains('active')) {
            closeMethodSheet();
            history.pushState(e.state || { page: 'product' }, '');
            return;
        }
        const state = e.state;
        if (state && state.page === 'payment') {
            showPaymentPage();
        } else if (state && state.page === 'product') {
            showProductPage();
        } else if (state && state.page === 'notif') {
            showNotifPage();
        } else {
            showMain();
        }
    });

    console.log('✅ Toko Andika siap!');

(function () {

    const STATUS_TEXT_TEMPLATES = {
        t1: 'linear-gradient(135deg,#4b6cb7,#182848)',
        t2: 'linear-gradient(135deg,#ff5f6d,#ffc371)',
        t3: 'linear-gradient(135deg,#11998e,#38ef7d)',
        t4: 'linear-gradient(135deg,#8e2de2,#4a00e0)',
        t5: 'linear-gradient(135deg,#f7971e,#ffd200)',
        t6: 'linear-gradient(135deg,#232526,#414345)'
    };

    const pageStatus = document.getElementById('pageStatus');
    if (!pageStatus) return;

    const statusProgressRow = document.getElementById('statusProgressRow');
    const statusHeaderAvatar = document.getElementById('statusHeaderAvatar');
    const statusHeaderName = document.getElementById('statusHeaderName');
    const statusHeaderTime = document.getElementById('statusHeaderTime');
    const statusHeaderClose = document.getElementById('statusHeaderClose');
    const statusBottomBar = document.getElementById('statusBottomBar');
    const statusMediaWrap = document.getElementById('statusMediaWrap');
    const statusTapLeft = document.getElementById('statusTapLeft');
    const statusTapRight = document.getElementById('statusTapRight');
    const statusReplyInput = document.getElementById('statusReplyInput');
    const statusBtnCamera = document.getElementById('statusBtnCamera');
    const statusBtnGallery = document.getElementById('statusBtnGallery');
    const statusBtnMicSend = document.getElementById('statusBtnMicSend');
    const statusMicIcon = document.getElementById('statusMicIcon');
    const statusSendIcon = document.getElementById('statusSendIcon');
    const statusBtnLike = document.getElementById('statusBtnLike');
    const statusBtnShare = document.getElementById('statusBtnShare');
    const statusReplyRow = document.querySelector('.status-reply-row');
    const statusVoiceRecording = document.getElementById('statusVoiceRecording');
    const statusVoiceDel = document.getElementById('statusVoiceDel');
    const statusVoiceSend = document.getElementById('statusVoiceSend');
    const statusVoiceTime = document.getElementById('statusVoiceTime');
    const statusCameraCapture = document.getElementById('statusCameraCapture');
    const statusGalleryPick = document.getElementById('statusGalleryPick');
    const statusToast = document.getElementById('statusToast');
    const statusEmojiQuick = document.getElementById('statusEmojiQuick');

    let statusIndex = 0;
    let statusPaused = false;
    let statusHoldTimer = null;
    let currentSegDuration = 5000;
    let currentSegElapsed = 0;
    let currentSegStartTs = 0;
    let advanceTimer = null;
    let segGeneration = 0;

    const STATUS_CACHE_NAME = 'status-media-cache-v1';
    const statusMediaReady = new Set();
    const statusSrcCache = new Map();

    function getStatusMediaSrc(url) {
        return new Promise((resolve) => {
            if (!url) { resolve(url); return; }

            if (url.startsWith('data:')) { statusMediaReady.add(url); resolve(url); return; }
            if (statusSrcCache.has(url)) { statusMediaReady.add(url); resolve(statusSrcCache.get(url)); return; }
            if (!window.caches) { resolve(url); return; }
            caches.open(STATUS_CACHE_NAME).then(cache => {
                cache.match(url).then(resp => {
                    if (resp) return resp;
                    return fetch(url).then(fresh => {
                        if (fresh && fresh.ok) cache.put(url, fresh.clone());
                        return fresh;
                    });
                }).then(resp => resp.blob()).then(blob => {
                    const blobUrl = URL.createObjectURL(blob);
                    statusSrcCache.set(url, blobUrl);
                    statusMediaReady.add(url);
                    resolve(blobUrl);
                }).catch(() => resolve(url));
            }).catch(() => resolve(url));
        });
    }

    function getVideoFromCache(url) {
        return new Promise((resolve) => {
            if (!url || !window.caches) { resolve(null); return; }
            caches.open(STATUS_CACHE_NAME).then(cache => {
                cache.match(url).then(resp => {
                    if (!resp) { resolve(null); return; }
                    resp.blob().then(blob => {
                        const blobUrl = URL.createObjectURL(blob);
                        statusMediaReady.add(url);
                        resolve(blobUrl);
                    }).catch(() => resolve(null));
                }).catch(() => resolve(null));
            }).catch(() => resolve(null));
        });
    }

    function cacheVideoInBackground(url) {
        if (!url || !window.caches) return;
        caches.open(STATUS_CACHE_NAME).then(cache => {
            cache.match(url).then(existing => {
                if (existing) { statusMediaReady.add(url); return; }
                fetch(url).then(fresh => {
                    if (fresh && fresh.ok) {
                        cache.put(url, fresh.clone());
                        statusMediaReady.add(url);
                    }
                }).catch(() => {});
            });
        }).catch(() => {});
    }

    function preloadStatusMedia(data) {
        if (!data || !data.mediaUrl) return;
        if (data.type === 'video') {

            if (window.__statusVideoPreloadEl) {
                try { window.__statusVideoPreloadEl.src = ''; } catch (e) {}
            }
            const pre = document.createElement('video');
            pre.preload = 'auto';
            pre.muted = true;
            pre.style.display = 'none';
            pre.src = data.mediaUrl;
            window.__statusVideoPreloadEl = pre;
            return;
        }
        if (statusMediaReady.has(data.mediaUrl)) return;
        getStatusMediaSrc(data.mediaUrl).catch(() => {});
    }

    function createLoadingOverlay() {
        const ov = document.createElement('div');
        ov.className = 'status-media-loading';
        ov.innerHTML = '<div class="status-media-spinner"></div>';
        return ov;
    }

    function showToast(msg) {
        statusToast.textContent = msg;
        statusToast.classList.add('show');
        setTimeout(() => statusToast.classList.remove('show'), 1800);
    }
    window.__statusShowToast = showToast;

    function formatStatusTime(ts) {
        if (!ts) return '';
        const diffMin = Math.max(0, Math.round((Date.now() - ts) / 60000));
        if (diffMin < 1) return 'Baru saja';
        if (diffMin < 60) return diffMin + ' mnt lalu';
        const diffJam = Math.round(diffMin / 60);
        if (diffJam < 24) return diffJam + ' jam lalu';
        return Math.round(diffJam / 24) + ' hari lalu';
    }

    function renderProgressRow() {
        const list = window.__statusData || [];
        statusProgressRow.innerHTML = list.map(() => '<div class="status-progress-seg"><div class="status-progress-fill"></div></div>').join('');
    }

    function segFillEl(i) {
        const segs = statusProgressRow.querySelectorAll('.status-progress-seg');
        return segs[i] ? segs[i].querySelector('.status-progress-fill') : null;
    }

    function markSegsBefore(i) {

        const segs = statusProgressRow.querySelectorAll('.status-progress-fill');
        segs.forEach((el, idx) => {
            el.style.transition = 'none';
            if (idx < i) {
                el.style.width = '100%';
                el.classList.remove('run');
                el.classList.add('filled');
            } else if (idx > i) {
                el.style.width = '0%';
                el.classList.remove('run', 'filled');
            }

            void el.offsetWidth;
        });
    }

    function clearMedia() {
        const vid = window.__statusCurrentVideo;
        if (vid) {
            try {
                vid.pause();
                vid.removeAttribute('src');
                vid.load();
            } catch (e) {}
            window.__statusCurrentVideo = null;
        }
        statusMediaWrap.querySelectorAll('.status-media-img, .status-media-video, .status-media-text, .status-media-caption, .status-media-loading').forEach(el => el.remove());
    }

    function stopAdvanceTimer() {
        if (advanceTimer) { clearTimeout(advanceTimer); advanceTimer = null; }
    }

    function goNext() {
        stopAdvanceTimer();
        const list = window.__statusData || [];
        if (statusIndex < list.length - 1) {
            statusIndex++;
            showSegment(statusIndex);
        } else {
            closeStatusViewer();
        }
    }

    function goPrev() {
        stopAdvanceTimer();
        const list = window.__statusData || [];
        if (statusIndex > 0) {
            statusIndex--;
            showSegment(statusIndex);
        } else {
            showSegment(statusIndex);
        }
    }

    function showSegment(i) {
        const list = window.__statusData || [];
        const data = list[i];
        if (!data) { closeStatusViewer(); return; }
        if (data.id && window.__recordStatusView) window.__recordStatusView(data.id);
        stopAdvanceTimer();
        clearMedia();
        markSegsBefore(i);
        segGeneration++;
        const myGen = segGeneration;

        statusHeaderAvatar.src = document.getElementById('profileAvatarImg') ? document.getElementById('profileAvatarImg').src : '';
        statusHeaderName.textContent = document.getElementById('profileNameText') ? document.getElementById('profileNameText').textContent : '';
        statusHeaderTime.textContent = formatStatusTime(data.createdAt);

        const fill = segFillEl(i);

        preloadStatusMedia(list[i + 1]);

        if (data.type === 'image') {
            const loadingOv = createLoadingOverlay();
            const img = document.createElement('img');
            img.className = 'status-media-img';
            statusMediaWrap.insertBefore(img, statusTapLeft);
            statusMediaWrap.insertBefore(loadingOv, statusTapLeft);
            const alreadyReady = statusMediaReady.has(data.mediaUrl);
            if (!alreadyReady) img.classList.add('is-loading');
            getStatusMediaSrc(data.mediaUrl).then(src => {
                if (myGen !== segGeneration) return;
                img.src = src;
                const start = () => {
                    if (myGen !== segGeneration) return;
                    img.classList.remove('is-loading');
                    loadingOv.remove();
                    currentSegDuration = 5000;
                    startProgress(fill, currentSegDuration);
                    if (data.caption) addCaption(data.caption);
                };
                if (img.complete) start(); else img.addEventListener('load', start, { once: true });
            });
        } else if (data.type === 'video') {
            const loadingOv = createLoadingOverlay();
            const vid = document.createElement('video');
            vid.className = 'status-media-video';
            vid.autoplay = true;
            vid.playsInline = true;
            vid.muted = false;
            statusMediaWrap.insertBefore(vid, statusTapLeft);
            statusMediaWrap.insertBefore(loadingOv, statusTapLeft);
            window.__statusCurrentVideo = vid;
            const alreadyReady = statusMediaReady.has(data.mediaUrl);
            if (!alreadyReady) vid.classList.add('is-loading');

            vid.addEventListener('loadedmetadata', () => {
                if (myGen !== segGeneration) return;
                currentSegDuration = (vid.duration && isFinite(vid.duration) ? vid.duration * 1000 : 8000);
                startProgress(fill, currentSegDuration);
            });
            vid.addEventListener('canplay', () => {
                if (myGen !== segGeneration) return;
                statusMediaReady.add(data.mediaUrl);
                vid.classList.remove('is-loading');
                loadingOv.remove();
            }, { once: true });
            vid.addEventListener('waiting', () => {
                if (myGen !== segGeneration) return;
                vid.classList.add('is-loading');
                if (!statusMediaWrap.contains(loadingOv)) statusMediaWrap.insertBefore(loadingOv, statusTapLeft);
            });
            vid.addEventListener('playing', () => {
                if (myGen !== segGeneration) return;
                vid.classList.remove('is-loading');
                loadingOv.remove();
            });
            vid.addEventListener('ended', () => { if (myGen === segGeneration) goNext(); });
            if (data.caption) addCaption(data.caption);

            getVideoFromCache(data.mediaUrl).then(cachedSrc => {
                if (myGen !== segGeneration) return;
                if (cachedSrc) {
                    vid.src = cachedSrc;
                } else {
                    vid.src = data.mediaUrl;
                    cacheVideoInBackground(data.mediaUrl);
                }
                vid.load();
                vid.play().catch(() => {});
            });
        } else {
            const box = document.createElement('div');
            box.className = 'status-media-text';
            box.style.background = STATUS_TEXT_TEMPLATES[data.template] || STATUS_TEXT_TEMPLATES.t1;
            box.textContent = data.text || '';
            statusMediaWrap.insertBefore(box, statusTapLeft);
            currentSegDuration = 5000;
            startProgress(fill, currentSegDuration);
        }
    }

    function addCaption(text) {
        const cap = document.createElement('div');
        cap.className = 'status-media-caption';
        cap.textContent = text;
        statusMediaWrap.insertBefore(cap, statusTapLeft);
    }

    function startProgress(fillEl, durationMs) {
        stopAdvanceTimer();
        if (!fillEl) { advanceTimer = setTimeout(goNext, durationMs); return; }
        fillEl.classList.remove('filled');
        fillEl.style.transition = 'none';
        fillEl.style.width = '0%';
        currentSegDuration = durationMs;
        currentSegElapsed = 0;
        currentSegStartTs = Date.now();
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                fillEl.style.transition = `width ${durationMs}ms linear`;
                fillEl.style.width = '100%';
            });
        });
        advanceTimer = setTimeout(goNext, durationMs);
    }

    function pauseProgress() {
        if (statusPaused) return;
        statusPaused = true;
        stopAdvanceTimer();
        const fill = segFillEl(statusIndex);
        if (fill) {
            const computedWidth = getComputedStyle(fill).width;
            const wrapWidth = fill.parentElement.offsetWidth;
            const pct = wrapWidth ? (parseFloat(computedWidth) / wrapWidth) * 100 : 0;
            fill.style.transition = 'none';
            fill.style.width = pct + '%';
            currentSegElapsed = (pct / 100) * currentSegDuration;
        }
        if (window.__statusCurrentVideo) window.__statusCurrentVideo.pause();
    }

    function resumeProgress() {
        if (!statusPaused) return;
        statusPaused = false;
        const remaining = Math.max(300, currentSegDuration - currentSegElapsed);
        const fill = segFillEl(statusIndex);

        const myGen = segGeneration;
        if (fill) {
            requestAnimationFrame(() => {
                if (myGen !== segGeneration) return;
                fill.style.transition = `width ${remaining}ms linear`;
                fill.style.width = '100%';
            });
        }
        advanceTimer = setTimeout(() => {
            if (myGen !== segGeneration) return;
            goNext();
        }, remaining);
        if (window.__statusCurrentVideo) window.__statusCurrentVideo.play().catch(() => {});
    }

    window.openStatusViewer = function () {
        const list = window.__statusData || [];
        if (!list.length) return;
        statusIndex = 0;
        renderProgressRow();
        pageStatus.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (window.markStatusHeaderNotif) window.markStatusHeaderNotif();
        showSegment(0);
        history.pushState({ page: 'status' }, '');
    };

    function closeStatusViewer() {
        segGeneration++;
        stopAdvanceTimer();
        clearMedia();
        window.__statusCurrentVideo = null;
        pageStatus.classList.remove('active');
        document.body.style.overflow = '';
        stopComposerViewportWatch();
        statusReplyInput.blur();
        if (history.state && history.state.page === 'status') history.back();
    }
    window.__closeStatusViewer = closeStatusViewer;
    window.__statusPauseForOverlay = pauseProgress;

    statusHeaderClose.addEventListener('click', closeStatusViewer);

    statusTapRight.addEventListener('click', goNext);
    statusTapLeft.addEventListener('click', goPrev);

    [statusTapLeft, statusTapRight].forEach(zone => {
        zone.addEventListener('touchstart', pauseProgress, { passive: true });
        zone.addEventListener('touchend', resumeProgress, { passive: true });
        zone.addEventListener('mousedown', pauseProgress);
        zone.addEventListener('mouseup', resumeProgress);
    });

    const statusSentOverlay = document.getElementById('statusSentOverlay');
    let sentOverlayTimer = null;
    function showSentOverlay() {
        if (!statusSentOverlay) return;
        statusSentOverlay.classList.remove('show');
        void statusSentOverlay.offsetWidth;
        statusSentOverlay.classList.add('show');
        clearTimeout(sentOverlayTimer);
        sentOverlayTimer = setTimeout(() => statusSentOverlay.classList.remove('show'), 1000);
    }
    window.__statusShowSentOverlay = showSentOverlay;

    function updateMicSendIcon() {
        const hasText = statusReplyInput.value.trim().length > 0;
        statusMicIcon.style.display = hasText ? 'none' : '';
        statusSendIcon.style.display = hasText ? '' : 'none';
        statusReplyRow.classList.toggle('is-typing', hasText);
    }
    statusReplyInput.addEventListener('input', updateMicSendIcon);
    statusReplyInput.addEventListener('focus', pauseProgress);
    statusReplyInput.addEventListener('blur', resumeProgress);
    statusReplyInput.addEventListener('focus', () => statusReplyRow.classList.add('is-focused'));
    statusReplyInput.addEventListener('blur', () => {
        if (!statusReplyInput.value.trim()) statusReplyRow.classList.remove('is-focused');
    });

    const statusBtnSticker = document.getElementById('statusBtnSticker');
    if (statusBtnSticker && statusEmojiQuick) {
        statusBtnSticker.addEventListener('click', function (e) {
            e.stopPropagation();
            statusEmojiQuick.classList.toggle('show');
        });
        document.addEventListener('click', function (e) {
            if (!statusEmojiQuick.classList.contains('show')) return;
            if (e.target === statusBtnSticker || statusBtnSticker.contains(e.target)) return;
            if (statusEmojiQuick.contains(e.target)) return;
            statusEmojiQuick.classList.remove('show');
        });
    }

    function updateComposerViewportPosition() {
        if (!window.visualViewport || !statusBottomBar) return;
        const vv = window.visualViewport;
        const keyboardGap = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
        if (keyboardGap > 60) {
            statusBottomBar.classList.add('kb-floating');
            statusBottomBar.style.bottom = keyboardGap + 'px';
        } else {
            statusBottomBar.classList.remove('kb-floating');
            statusBottomBar.style.bottom = '';
        }
    }
    function startComposerViewportWatch() {
        if (!window.visualViewport) return;
        updateComposerViewportPosition();
        window.visualViewport.addEventListener('resize', updateComposerViewportPosition);
        window.visualViewport.addEventListener('scroll', updateComposerViewportPosition);
    }
    function stopComposerViewportWatch() {
        if (!window.visualViewport) return;
        window.visualViewport.removeEventListener('resize', updateComposerViewportPosition);
        window.visualViewport.removeEventListener('scroll', updateComposerViewportPosition);
        if (statusBottomBar) {
            statusBottomBar.classList.remove('kb-floating');
            statusBottomBar.style.bottom = '';
        }
    }
    statusReplyInput.addEventListener('focus', startComposerViewportWatch);
    statusReplyInput.addEventListener('blur', stopComposerViewportWatch);

    function sendTextReply() {
        const text = statusReplyInput.value.trim();
        if (!text) return;
        const list = window.__statusData || [];
        const current = list[statusIndex];

        statusReplyInput.value = '';
        updateMicSendIcon();
        if (window.__sendPesanMasuk) {
            window.__sendPesanMasuk({ type: 'text', text: text, statusId: current ? current.id : null })
                .then(() => showSentOverlay())
                .catch(() => showToast('Gagal mengirim pesan, coba lagi'));
        } else {
            showToast('Koneksi belum siap, coba lagi sebentar');
        }
    }

    if (statusEmojiQuick) {
        statusEmojiQuick.querySelectorAll('span').forEach(span => {
            span.addEventListener('click', function () {
                const emoji = this.dataset.emoji;
                const list = window.__statusData || [];
                const current = list[statusIndex];
                if (statusEmojiQuick) statusEmojiQuick.classList.remove('show');
                if (window.__sendPesanMasuk) {
                    window.__sendPesanMasuk({ type: 'emoji', text: emoji, statusId: current ? current.id : null })
                        .then(() => showSentOverlay())
                        .catch(() => showToast('Gagal mengirim reaksi, coba lagi'));
                }
            });
        });
    }

    let statusLiked = false;
    statusBtnLike.addEventListener('click', function () {
        statusLiked = !statusLiked;
        this.classList.toggle('liked', statusLiked);
        if (statusLiked) {
            const list = window.__statusData || [];
            const current = list[statusIndex];
            if (window.__sendPesanMasuk) {
                window.__sendPesanMasuk({ type: 'emoji', text: '❤️', statusId: current ? current.id : null })
                    .then(() => showToast('Kamu menyukai status ini'))
                    .catch(() => {});
            }
        }
    });

    statusBtnShare.addEventListener('click', function () {
        const shareUrl = location.href.split('#')[0].split('?')[0];
        if (navigator.share) {
            navigator.share({ title: document.title, url: shareUrl }).catch(() => {});
        } else if (navigator.clipboard) {
            navigator.clipboard.writeText(shareUrl).then(() => showToast('Link disalin')).catch(() => showToast('Gagal menyalin link'));
        } else {
            showToast('Berbagi tidak didukung di browser ini');
        }
    });

    function handlePickedImage(file) {
        if (!file) return;
        pauseProgress();
        const list = window.__statusData || [];
        const current = list[statusIndex];
        if (!window.__uploadImageToCloudinary) {
            showToast('Koneksi belum siap, coba lagi sebentar');
            resumeProgress();
            return;
        }
        window.__uploadImageToCloudinary(file, 900, 0.7).then(url => {
            if (!window.__sendPesanMasuk) {
                showToast('Koneksi belum siap, coba lagi sebentar');
                resumeProgress();
                return;
            }
            window.__sendPesanMasuk({ type: 'image', img: url, statusId: current ? current.id : null })
                .then(() => showSentOverlay())
                .catch(() => showToast('Gagal mengirim foto, coba lagi'));
            resumeProgress();
        }).catch(() => { showToast('Gagal mengunggah foto, coba lagi'); resumeProgress(); });
    }

    statusBtnCamera.addEventListener('click', () => statusCameraCapture.click());
    statusBtnGallery.addEventListener('click', () => statusGalleryPick.click());
    statusCameraCapture.addEventListener('change', function () { handlePickedImage(this.files[0]); this.value = ''; });
    statusGalleryPick.addEventListener('change', function () { handlePickedImage(this.files[0]); this.value = ''; });

    let mediaRecorder = null;
    let recordedChunks = [];
    let recordStartTs = 0;
    let recordTimerInterval = null;

    function formatRecordTime(ms) {
        const s = Math.floor(ms / 1000);
        const mm = Math.floor(s / 60);
        const ss = s % 60;
        return mm + ':' + String(ss).padStart(2, '0');
    }

    function startRecording() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            showToast('Perekaman suara tidak didukung di browser ini');
            return;
        }
        pauseProgress();
        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
            recordedChunks = [];
            try {
                mediaRecorder = new MediaRecorder(stream);
            } catch (e) {
                showToast('Gagal memulai rekaman');
                resumeProgress();
                return;
            }
            mediaRecorder.ondataavailable = (e) => { if (e.data && e.data.size > 0) recordedChunks.push(e.data); };
            mediaRecorder.onstop = () => { stream.getTracks().forEach(t => t.stop()); };
            mediaRecorder.start();
            recordStartTs = Date.now();
            statusReplyRow.style.display = 'none';
            statusVoiceRecording.classList.add('active');
            statusBtnMicSend.classList.add('recording');
            statusVoiceTime.textContent = '0:00';
            recordTimerInterval = setInterval(() => {
                statusVoiceTime.textContent = formatRecordTime(Date.now() - recordStartTs);
                if (Date.now() - recordStartTs > 60000) stopRecordingAndSend(false);
            }, 250);
        }).catch(() => {
            showToast('Akses mikrofon ditolak');
            resumeProgress();
        });
    }

    function resetRecordingUI() {
        clearInterval(recordTimerInterval);
        statusReplyRow.style.display = '';
        statusVoiceRecording.classList.remove('active');
        statusBtnMicSend.classList.remove('recording');
        resumeProgress();
    }

    function stopRecordingAndSend(send) {
        if (!mediaRecorder || mediaRecorder.state === 'inactive') { resetRecordingUI(); return; }
        mediaRecorder.addEventListener('stop', function onStop() {
            mediaRecorder.removeEventListener('stop', onStop);
            if (!send) { resetRecordingUI(); return; }
            const blob = new Blob(recordedChunks, { type: 'audio/webm' });

            if (blob.size > 650000) {
                showToast('Rekaman terlalu panjang, coba lebih singkat');
                resetRecordingUI();
                return;
            }
            const reader = new FileReader();
            reader.onload = () => {
                const list = window.__statusData || [];
                const current = list[statusIndex];
                if (window.__sendPesanMasuk) {
                    window.__sendPesanMasuk({ type: 'voice', audio: reader.result, statusId: current ? current.id : null })
                        .then(() => showSentOverlay())
                        .catch(() => showToast('Gagal mengirim pesan suara, coba lagi'));
                }
                resetRecordingUI();
            };
            reader.readAsDataURL(blob);
        });
        mediaRecorder.stop();
    }

    statusBtnMicSend.addEventListener('click', function () {
        const hasText = statusReplyInput.value.trim().length > 0;
        if (hasText) { sendTextReply(); return; }
        startRecording();
    });
    statusVoiceSend.addEventListener('click', () => stopRecordingAndSend(true));
    statusVoiceDel.addEventListener('click', () => stopRecordingAndSend(false));

    window.addEventListener('popstate', function (e) {
        if (pageStatus.classList.contains('active')) {
            const state = e.state;
            if (state && state.page === 'status') { resumeProgress(); return; }
            segGeneration++;
            stopAdvanceTimer();
            clearMedia();
            window.__statusCurrentVideo = null;
            pageStatus.classList.remove('active');
            document.body.style.overflow = '';
            stopComposerViewportWatch();
            statusReplyInput.blur();
        }
    });
})();
