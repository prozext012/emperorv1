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
