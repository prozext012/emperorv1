
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
