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

    function openPayment(opts) {

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
            const waNumber = window.__waNumber || '';
            if (waNumber) {
                btnBuktiWa.href = `https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`;
            } else {
                btnBuktiWa.removeAttribute('href');
            }
        }

        showPaymentPage();

        opts = opts || {};
        const data = products[currentProductId];
        const slug = (data && (data.slug || data.key)) || currentProductId;
        const url = '/detail/' + encodeURIComponent(slug) + '/pembayaran';
        const state = { page: 'payment', productId: currentProductId };
        if (opts.pushUrl === false) {
            history.replaceState(state, '', url);
        } else {
            history.pushState(state, '', url);
        }
    }
    window.openPayment = openPayment;

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

    function openMethodSheet(opts) {
        opts = opts || {};

        if (!window.__productsSyncedFromServer) {
            showToast('Menyinkronkan harga terbaru, coba lagi sebentar...');
            let tries = 0;
            const waitSync = setInterval(() => {
                tries++;
                if (window.__productsSyncedFromServer) {
                    clearInterval(waitSync);
                    openMethodSheet(opts);
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

        const data = products[currentProductId];
        const slug = (data && (data.slug || data.key)) || currentProductId;
        const url = '/detail/' + encodeURIComponent(slug) + '/metode';
        const state = { page: 'method', productId: currentProductId };
        if (opts.pushUrl === false) {
            history.replaceState(state, '', url);
        } else {
            history.pushState(state, '', url);
        }
    }
    window.openMethodSheet = openMethodSheet;

    function closeMethodSheet() {
        sheetOverlay.classList.remove('active');
        paymentMethodSheet.classList.remove('active');
    }
    window.closeMethodSheet = closeMethodSheet;

    methodOptions.forEach(opt => {
        opt.addEventListener('click', function() {
            methodOptions.forEach(o => o.classList.remove('selected'));
            this.classList.add('selected');
            btnLanjutkanPayment.disabled = false;
        });
    });

    sheetOverlay.addEventListener('click', function() {
        if (history.state && history.state.page === 'method') history.back();
        else closeMethodSheet();
    });

