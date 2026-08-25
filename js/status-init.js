
    function closeStatusViewerIfOpen() {
        if (window.__closeStatusViewer && pageStatus && pageStatus.classList.contains('active')) {
            window.__closeStatusViewer();
        }
    }
    function closeAddonSheetIfOpen() {
        if (window.closeAddonSheet && addonSheet && addonSheet.classList.contains('active')) {
            window.closeAddonSheet();
        }
    }
    function closeMethodSheetIfOpen() {
        if (window.closeMethodSheet && paymentMethodSheet && paymentMethodSheet.classList.contains('active')) {
            window.closeMethodSheet();
        }
    }

    window.addEventListener('popstate', function(e) {
        if (igInputSheet && igInputSheet.classList.contains('active')) {
            closeIGSheet();
            history.pushState(e.state || { page: 'product' }, '');
            return;
        }

        const state = e.state;
        const kind = state && state.page;

        if (kind !== 'status') closeStatusViewerIfOpen();
        if (kind !== 'addon') closeAddonSheetIfOpen();
        if (kind !== 'method') closeMethodSheetIfOpen();

        if (kind === 'payment') {
            showPaymentPage();
        } else if (kind === 'method') {
            if (state.productId && state.productId !== currentProductId && window.openProduct) {
                window.openProduct(state.productId, { pushUrl: false });
            } else {
                showProductPage();
            }
            if (window.openMethodSheet) window.openMethodSheet({ pushUrl: false });
        } else if (kind === 'addon') {
            if (state.productId && state.productId !== currentProductId && window.openProduct) {
                window.openProduct(state.productId, { pushUrl: false });
            } else {
                showProductPage();
            }
            if (window.openAddonSheet) window.openAddonSheet({ pushUrl: false });
        } else if (kind === 'product') {
            if (state.productId && state.productId !== currentProductId && window.openProduct) {
                window.openProduct(state.productId, { pushUrl: false });
            } else {
                showProductPage();
            }
        } else if (kind === 'notif') {
            showNotifPage();
        } else if (kind === 'status') {
            const list = window.__statusData || [];
            if (list.length && window.openStatusViewer) {
                let idx = 0;
                if (state.statusId) {
                    const found = list.findIndex(s => s.id === state.statusId);
                    if (found >= 0) idx = found;
                }
                window.openStatusViewer(idx, { pushUrl: false });
            } else {
                showMain();
            }
        } else {
            showMain();
        }
    });

    console.log('✅ Toko Andika siap!');
