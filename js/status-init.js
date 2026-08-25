
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
            if (state.productId && state.productId !== currentProductId && window.openProduct) {
                window.openProduct(state.productId, { pushUrl: false });
            } else {
                showProductPage();
            }
        } else if (state && state.page === 'notif') {
            showNotifPage();
        } else {
            showMain();
        }
    });

    console.log('✅ Toko Andika siap!');

