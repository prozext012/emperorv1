// ===== HELPER: FORMAT RUPIAH =====
    function formatRupiah(n) {
        n = Number(n) || 0;
        return 'Rp ' + Math.round(n).toLocaleString('id-ID');
    }
    window.formatRupiah = formatRupiah;

    // ===== HELPER: BUAT HTML DESKRIPSI =====
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

    // ===== DATA PRODUK (fallback default, bisa dioverride dari Firestore lewat firebase.js) =====
    let products = {
        1: {
            key: "apk-jam",
            order: 0,
            gridShortDesc: "Widget jam estetik buat HP kamu",
            name: "APK Widget Jam",
            price: "Rp 500",
            priceOld: "Rp 1.999",
            pricePayment: "Rp 550",
            adminFee: 50,
            type: "digital",
            qris: "https://i.ibb.co.com/23wpZQfn/IMG-20260702-121127-628.jpg",
            addon: {
                name: "Wallpaper Kaya Aku",
                price: 500,
                priceLabel: "Rp 500",
                img: "https://i.ibb.co.com/ZpftJz0J/WALLPAPER-YANG-AKU-PAKE-YAH-20260711-085443-0000.png",
                desc: "Wallpaper estetik pilihan yang aku pakai",
                qrisCombo: "https://i.ibb.co.com/7JrkgP9b/IMG-20260710-181634-982.jpg",
                priceCombo: 1000,
                priceComboPayment: "Rp 1.100",
                adminFeeCombo: 100
            },
            testimoni: [
                { nama: "Pembeli 1",  img: "https://i.ibb.co.com/1J0VmFw9/IMG-20260710-182323-507.jpg" },
                { nama: "Pembeli 2",  img: "https://i.ibb.co.com/xSGJKTWF/IMG-20260710-182353-008.jpg" },
                { nama: "Pembeli 3",  img: "https://i.ibb.co.com/ym388RmY/IMG-20260710-182444-954.jpg" },
                { nama: "Pembeli 4",  img: "https://i.ibb.co.com/9mpz0kwN/IMG-20260710-182507-305.jpg" },
                { nama: "Pembeli 5",  img: "https://i.ibb.co.com/QjzhTXC1/IMG-20260710-182529-021.jpg" },
                { nama: "Pembeli 6",  img: "https://i.ibb.co.com/TBLGXHKR/IMG-20260710-182544-870.jpg" },
                { nama: "Pembeli 7",  img: "https://i.ibb.co.com/kVLK16SP/IMG-20260710-182605-318.jpg" },
                { nama: "Pembeli 8",  img: "https://i.ibb.co.com/6RNz91Zv/IMG-20260710-182625-762.jpg" },
                { nama: "Pembeli 9",  img: "https://i.ibb.co.com/JwRrkGyF/IMG-20260710-182658-357.jpg" },
                { nama: "Pembeli 10", img: "https://i.ibb.co.com/WNFn6XB9/IMG-20260710-182716-521.jpg" }
            ],
            mainImages: [
                "https://i.ibb.co.com/FSDJ1pT/Link-apk-jam-20260630-113614-0000.png",
                "https://i.ibb.co.com/h1tBdFSc/Link-apk-jam-20260630-113614-0001.png"
            ],
            gallery: [
                "https://i.ibb.co.com/rK0HfDH7/Screenshot-20260630-112210.jpg",
                "https://i.ibb.co.com/RpH9qvPf/Screenshot-20260630-112225.jpg",
                "https://i.ibb.co.com/MDGTvzZL/Screenshot-20260630-112233.jpg",
                "https://i.ibb.co.com/chGMfwc9/Screenshot-20260630-112239.jpg",
                "https://i.ibb.co.com/tTP3KqQB/Screenshot-20260630-112249.jpg",
                "https://i.ibb.co.com/tp18V090/Screenshot-20260630-112258.jpg"
            ],
            descSections: [
                { type: 'paragraph', text: 'Buat kalian yang sering nanya APK widget jam nya yang keren di mana — ini dia jawabannya 😘' },
                { type: 'divider' },
                { type: 'heading', text: 'APA YANG KAMU DAPAT' },
                { type: 'list', items: [
                    'APK widget jam estetik siap pakai',
                    'Tampilan home screen langsung jadi keren',
                    'Berbagai pilihan desain jam yang bisa dikustomisasi',
                    'Ringan dan tidak membebani HP'
                ]},
                { type: 'divider' },
                { type: 'heading', text: 'KENAPA WAJIB PUNYA?' },
                { type: 'paragraph', text: 'Home screen yang biasa-biasa aja itu membosankan. Dengan widget jam premium ini, tampilan HP kamu langsung beda dari yang lain. Harga segini buat hasil yang langsung keliatan — worth it banget.' },
                { type: 'divider' },
                { type: 'cta', text: '⚡ Sekali bayar, langsung punya. Tanpa langganan, tanpa biaya tambahan.' }
            ]
        },
        2: {
            key: "ig",
            order: 3,
            gridShortDesc: "Dari 100 – 1.000 followers",
            gridPriceLabel: "Mulai 3.000",
            name: "Followers IG",
            price: "Mulai 3.000",
            priceOld: null,
            type: "instagram",
            testimoni: [
                { nama: "Pembeli 1", img: "https://i.ibb.co.com/yFpCBP5h/IMG-20260710-184434-523.jpg" }
            ],
            mainImages: [
                "https://i.ibb.co.com/kgPd0L6q/100-FOLOWERS-3-K-20260715-184840-0002.png",
                "https://i.ibb.co.com/SwFHYw8m/100-FOLOWERS-3-K-20260715-184840-0003.png"
            ],
            gallery: [
                "https://i.ibb.co.com/B598xnf6/Screenshot-20260702-115854.jpg",
                "https://i.ibb.co.com/yjg3zBV/Screenshot-20260702-115920.jpg",
                "https://i.ibb.co.com/LdYqjhWT/Screenshot-20260715-183559.jpg",
                "https://i.ibb.co.com/7N6LnjRR/Screenshot-20260715-183548.jpg",
                "https://i.ibb.co.com/N2FTVc3b/Screenshot-20260715-183543.jpg"
            ],
            // QRIS dan harga per jumlah followers — JANGAN KETUKAR (INI KHUSUS IG)
            followerData: {
                100:  { price: 'Rp 3.000',  pricePayment: 'Rp 3.100',  qris: 'https://i.ibb.co.com/xK19DV5G/IMG-20260702-120934-860.jpg' },
                200:  { price: 'Rp 5.000',  pricePayment: 'Rp 5.100',  qris: 'https://i.ibb.co.com/hRqcb2LS/IMG-20260702-171434-132.jpg' },
                300:  { price: 'Rp 7.000',  pricePayment: 'Rp 7.100',  qris: 'https://i.ibb.co.com/dwVT1LP7/IMG-20260702-171907-062.jpg' },
                400:  { price: 'Rp 9.000',  pricePayment: 'Rp 9.100',  qris: 'https://i.ibb.co.com/QFwycW1h/IMG-20260702-172322-550.jpg' },
                500:  { price: 'Rp 10.000', pricePayment: 'Rp 10.100', qris: 'https://i.ibb.co.com/VcPvHT7Y/IMG-20260702-WA0022.jpg' },
                600:  { price: 'Rp 12.000', pricePayment: 'Rp 12.100', qris: 'https://i.ibb.co.com/0pTcWtGk/IMG-20260702-173043-973.jpg' },
                700:  { price: 'Rp 14.000', pricePayment: 'Rp 14.100', qris: 'https://i.ibb.co.com/FkM9sBcw/IMG-20260702-173251-600.jpg' },
                800:  { price: 'Rp 16.000', pricePayment: 'Rp 16.100', qris: 'https://i.ibb.co.com/QFSbtFbm/IMG-20260702-173442-576.jpg' },
                900:  { price: 'Rp 18.000', pricePayment: 'Rp 18.100', qris: 'https://i.ibb.co.com/8nzMxJTN/IMG-20260702-173558-726.jpg' },
                1000: { price: 'Rp 20.000', pricePayment: 'Rp 20.100', qris: 'https://i.ibb.co.com/1JtqP5Hb/IMG-20260702-173715-389.jpg' }
            },
            descSections: [
                { type: 'paragraph', text: 'Pengen akun Instagram kamu keliatan lebih kredibel dan ramai? Tambah followers sekarang dengan harga terjangkau dan proses cepat 🔥' },
                { type: 'divider' },
                { type: 'heading', text: 'KEUNGGULAN' },
                { type: 'list', items: [
                    'Proses cepat, langsung masuk ke akun kamu',
                    'Aman, tidak perlu kasih password',
                    'Pilih sendiri jumlah yang kamu inginkan',
                    'Mulai dari 100 sampai 1.000 followers'
                ]},
                { type: 'divider' },
                { type: 'heading', text: 'CARA PESAN' },
                { type: 'list', items: [
                    'Pilih jumlah followers yang kamu mau',
                    'Masukkan username Instagram kamu',
                    'Bayar sesuai nominal',
                    'Kirim bukti ke WhatsApp admin'
                ]},
                { type: 'divider' },
                { type: 'cta', text: '⚡ Satu langkah buat akunmu makin stand out.' }
            ]
        },
        3: {
            key: "ebook",
            order: 2,
            gridShortDesc: "2.000+ e-book premium, sekali beli",
            name: "2.000+ Buku Digital Premium",
            price: "Rp 5.000",
            priceOld: "Rp 10.000",
            pricePayment: "Rp 5.500",
            adminFee: 500,
            type: "digital",
            qris: "https://i.ibb.co.com/vvXzscCx/IMG-20260702-165849-384.jpg",
            mainImages: [
                "https://i.ibb.co.com/PsWRYXD2/AIRetouch-20260702-163825169.jpg",
                "https://i.ibb.co.com/bjhqvjpr/AIRetouch-20260702-163853045.jpg"
            ],
            gallery: [
                "https://i.ibb.co.com/nNpvPQFs/Screenshot-20260702-164802.jpg",
                "https://i.ibb.co.com/SDwk1P0W/Screenshot-20260702-164740.jpg",
                "https://i.ibb.co.com/B5y7Hz7d/Screenshot-20260702-164851.jpg",
                "https://i.ibb.co.com/ccGJ90xf/Screenshot-20260702-164847.jpg",
                "https://i.ibb.co.com/W4CjPR41/Screenshot-20260702-164842.jpg",
                "https://i.ibb.co.com/jZHH7X3F/Screenshot-20260702-164836.jpg",
                "https://i.ibb.co.com/Mx750N0j/Screenshot-20260702-164930.jpg",
                "https://i.ibb.co.com/Ld9tzT1h/Screenshot-20260702-164752.jpg",
                "https://i.ibb.co.com/fYB3x9W1/Screenshot-20260702-164925.jpg"
            ],
            descSections: [
                { type: 'tagline', text: 'BUNDLE MEGA 2000+ E-Book Premium | Perpustakaan Digital Terlengkap' },
                { type: 'paragraph', text: 'Bukan sekedar kumpulan buku. Ini adalah investasi pengetahuan terbesar yang pernah kamu lakukan dengan harga yang tidak akan kamu sangka.' },
                { type: 'paragraph', text: 'Ribuan judul. Semua genre. Satu harga.' },
                { type: 'divider' },
                { type: 'heading', text: 'APA YANG KAMU DAPATKAN' },
                { type: 'paragraph', text: 'Lebih dari 2.000 e-book dari berbagai kategori yang sudah dikurasi secara lengkap:' },
                { type: 'list', items: [
                    'AI & Teknologi — keterampilan yang paling dicari',
                    'Bisnis & Kewirausahaan — dari ide sampai bisnis',
                    'Crypto & Forex — pahami investasi dari dasarnya',
                    'Pola Pikir & Peningkatan Diri — bangun versi terbaikmu',
                    'Psikologi — kenali dirimu dan orang lain',
                    'Novel & Manga — hiburan berkualitas',
                    'Koleksi Lengkap Tere Liye — semua karya',
                    'Hukum — referensi penting yang selalu relevan',
                    'Islami & Pengembangan Spiritual — untuk jiwa',
                    'Persiapan UTBK & SKD/SKB — belajar lebih efektif',
                    'Motivasi & Kutipan — untuk hari-harimu'
                ]},
                { type: 'divider' },
                { type: 'heading', text: 'MENGAPA INI LAYAK BANGET?' },
                { type: 'paragraph', text: 'Coba hitung sendiri — kalau satu buku fisik rata-rata Rp80.000, maka 2.000 buku bernilai lebih dari Rp160.000.000. Kamu bisa mendapatkan semuanya hari ini dengan harga yang jauh, jauh lebih terjangkau.' },
                { type: 'list', items: [
                    'Lebih dari 2.000 judul siap diakses',
                    'Format digital, tidak perlu menunggu pengiriman',
                    'Bisa dibaca di HP, tablet, maupun laptop',
                    'Cocok untuk semua kalangan',
                    'Tidak ada biaya tambahan, tidak ada langganan',
                    'Sekali beli, selamanya milikmu'
                ]},
                { type: 'divider' },
                { type: 'heading', text: 'SIAPA YANG COCOK BELI INI?' },
                { type: 'paragraph', text: 'Kamu yang sedang berjuang lulus ujian. Kamu yang ingin membangun bisnis tapi belum tahu harus mulai dari mana. Kamu yang membutuhkan bacaan berkualitas tapi tidak mau mengeluarkan banyak uang. Kamu yang ingin terus berkembang tapi waktunya terbatas.' },
                { type: 'paragraph', text: 'Semua ada di sini. Dalam satu paket.' },
                { type: 'divider' },
                { type: 'cta', text: '⚡ Jangan tunda lagi. Setiap hari tanpa ilmu baru adalah hari yang terlewat begitu saja. Dapatkan MEGA BUNDLE 2000+ E-Book sekarang dan mulai perjalanan terbaikmu hari ini.' }
            ]
        },
        4: {
            key: "tiktok",
            order: 1,
            gridShortDesc: "Dari 100 – 1.000 followers",
            gridPriceLabel: "Mulai 6.000",
            name: "Followers TikTok",
            price: "Mulai 6.000",
            priceOld: null,
            type: "tiktok",
            testimoni: [],
            mainImages: [
                "https://i.ibb.co.com/4w9qCX8R/100-FOLOWERS-3-K-20260715-184840-0000.png",
                "https://i.ibb.co.com/cXpMchH6/100-FOLOWERS-3-K-20260715-184840-0001.png"
            ],
            gallery: [
                "https://i.ibb.co.com/vC50VBk7/Screenshot-20260715-193223.jpg",
                "https://i.ibb.co.com/Lhhz530G/Screenshot-20260715-175015.jpg",
                "https://i.ibb.co.com/9m6fXWY4/Screenshot-20260715-175006.jpg",
                "https://i.ibb.co.com/S4QWpGrS/Screenshot-20260715-174956.jpg"
            ],
            // QRIS KHUSUS TIKTOK — JANGAN KETUKAR DENGAN IG
            followerData: {
                100:  { price: 'Rp 6.000',  pricePayment: 'Rp 6.100',  qris: 'https://i.ibb.co.com/RpN5QNZT/IMG-20260715-190402-037.jpg' },
                200:  { price: 'Rp 12.000', pricePayment: 'Rp 12.100', qris: 'https://i.ibb.co.com/5Wc0sC3S/IMG-20260715-190630-120.jpg' },
                300:  { price: 'Rp 18.000', pricePayment: 'Rp 18.100', qris: 'https://i.ibb.co.com/MkGG64c9/IMG-20260715-190728-340.jpg' },
                400:  { price: 'Rp 24.000', pricePayment: 'Rp 24.100', qris: 'https://i.ibb.co.com/b5nwDXgR/IMG-20260715-190828-089.jpg' },
                500:  { price: 'Rp 30.000', pricePayment: 'Rp 30.100', qris: 'https://i.ibb.co.com/ymfSJ6xd/IMG-20260715-190926-861.jpg' },
                600:  { price: 'Rp 36.000', pricePayment: 'Rp 36.100', qris: 'https://i.ibb.co.com/fV62zCjY/IMG-20260715-191036-590.jpg' },
                700:  { price: 'Rp 42.000', pricePayment: 'Rp 42.100', qris: 'https://i.ibb.co.com/BXJ2J2x/IMG-20260715-191128-153.jpg' },
                800:  { price: 'Rp 48.000', pricePayment: 'Rp 48.100', qris: 'https://i.ibb.co.com/Vptc7LDS/IMG-20260715-191227-913.jpg' },
                900:  { price: 'Rp 54.000', pricePayment: 'Rp 54.100', qris: 'https://i.ibb.co.com/hxgHYwqs/IMG-20260715-191320-930.jpg' },
                1000: { price: 'Rp 60.000', pricePayment: 'Rp 60.100', qris: 'https://i.ibb.co.com/jkFYwBVB/IMG-20260715-191432-690.jpg' }
            },
            descSections: [
                { type: 'paragraph', text: 'Mau akun TikTok kamu makin ramai dan terlihat lebih credible? Tambah followers sekarang dengan harga terjangkau dan proses cepat 🎵🔥' },
                { type: 'divider' },
                { type: 'heading', text: 'KEUNGGULAN' },
                { type: 'list', items: [
                    'Proses cepat, langsung masuk ke akun TikTok kamu',
                    'Aman, tidak perlu kasih password',
                    'Pilih sendiri jumlah yang kamu inginkan',
                    'Mulai dari 100 sampai 1.000 followers'
                ]},
                { type: 'divider' },
                { type: 'heading', text: 'CARA PESAN' },
                { type: 'list', items: [
                    'Pilih jumlah followers yang kamu mau',
                    'Masukkan username TikTok kamu',
                    'Bayar sesuai nominal',
                    'Kirim bukti ke WhatsApp admin'
                ]},
                { type: 'divider' },
                { type: 'cta', text: '⚡ Satu langkah buat konten kamu makin dilihat banyak orang.' }
            ]
        }
    };
    window.products = products;
    window.productKeyToId = {};
    Object.keys(products).forEach(id => { window.productKeyToId[products[id].key] = id; });
    const productGrid = document.getElementById('productGrid');
    function renderProductGrid() {
        if (!productGrid) return;
        const ids = Object.keys(products).sort((a, b) => (products[a].order ?? 999) - (products[b].order ?? 999));
        productGrid.innerHTML = ids.map(id => {
            const p = products[id];
            const thumb = (p.mainImages && p.mainImages[0]) || '';
            const priceHtml = p.priceOld
                ? `<span class="product-price-old">${p.priceOld}</span><span class="product-price">${p.price}</span>`
                : `<span class="product-price">${p.gridPriceLabel || p.price || ''}</span>`;
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

    // ===== NOTIFIKASI V1: teks berjalan kanan ke kiri, nyambung terus antar pesan =====
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
        // digandakan 2x biar pas geser -50% posisinya nyambung mulus jadi kelihatan gak pernah putus
        const setHtml = list.map(t => `<span class="notif-ticker-msg">${t.replace(/</g, '&lt;')}</span><span class="notif-ticker-divider"></span>`).join('');
        inner.innerHTML = setHtml + setHtml;
        inner.classList.remove('run');
        requestAnimationFrame(() => {
            const oneSetWidth = inner.scrollWidth / 2;
            const speedPxPerSecond = 55; // kecepatan sedang
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

    // Elemen halaman pembayaran (dinamis)
    const paymentQrisImg = document.getElementById('paymentQrisImg');
    const qrisPriceText = document.getElementById('qrisPriceText');
    const btnDownloadQris = document.getElementById('btnDownloadQris');

    // Slider
    const slideTrack = document.getElementById('slideTrack');
    const sliderIndicators = document.getElementById('sliderIndicators');

    let currentProductId = null;
    let currentSlide = 0;
    let totalSlides = 0;

    // ===== FUNGSI SLIDER =====
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
        // update indicators
        const dots = sliderIndicators.querySelectorAll('span');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    // ===== SWIPE / GESER FOTO UTAMA =====
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

    // Dukungan drag mouse juga (kalau dibuka lewat browser desktop)
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

    // ===== BUKA DETAIL PRODUK =====
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

        // Harga coret
        if (data.priceOld) {
            detailPriceOld.textContent = data.priceOld;
            detailPriceOld.style.display = 'inline';
        } else {
            detailPriceOld.style.display = 'none';
        }

        // Deskripsi terstruktur (HTML)
        detailDesc.innerHTML = makeDesc(data.descSections);

        // Update halaman pembayaran - hanya untuk produk digital (bukan instagram)
        if (data.type !== 'instagram') {
            paymentQrisImg.src = data.qris;
            qrisPriceText.textContent = data.pricePayment;
            btnDownloadQris.href = data.qris;
            // Admin fee text dinamis
            const qrisAdminText = document.getElementById('qrisAdminText');
            if (qrisAdminText && data.adminFee) {
                qrisAdminText.textContent = `${data.adminFee}+ biaya admin`;
            }
        }

        // Isi gallery
        galleryScroll.innerHTML = '';
        (data.gallery || []).forEach(url => {
            const img = document.createElement('img');
            img.src = url;
            img.alt = 'Foto produk';
            galleryScroll.appendChild(img);
        });

        // Render testimoni (data lokal + data dari website notifikasi via Firestore)
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

    // ===== TAMPILKAN HALAMAN UTAMA =====
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

    // ===== TAMPILKAN HALAMAN NOTIFIKASI =====
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

    // ===== TAMPILKAN HALAMAN PRODUK =====
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

    // ===== TAMPILKAN HALAMAN PEMBAYARAN =====
    function showPaymentPage() {
        pagePayment.classList.add('active');
        pageProduct.classList.remove('active');
        pageNotif.classList.remove('active');
        pagePayment.scrollTop = 0;
        btnBackPayment.classList.remove('hidden');
        if (fabWa) fabWa.style.display = 'flex';
        if (window.__trackPageView) window.__trackPageView('Pembayaran: ' + (currentProductId && products[currentProductId] ? products[currentProductId].name : ''));
    }

    // ===== BUKA PEMBAYARAN =====
    const btnBuktiWa = document.getElementById('btnBuktiWa');
    const waNumber = '6282129051447';

    function openPayment() {
        // Set pesan WA sesuai produk
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

    // ===== SCROLL ANIMASI BACK BUTTON (PRODUK) =====
    pageProduct.addEventListener('scroll', function() {
        const scrollY = this.scrollTop;
        // Sembunyikan btn back setelah scroll melewati tinggi foto slider
        const sliderH = detailSlider ? detailSlider.offsetHeight : 300;
        if (scrollY > sliderH * 0.6) {
            btnBackProduct.classList.add('hidden');
        } else {
            btnBackProduct.classList.remove('hidden');
        }
    });

    // ===== SCROLL ANIMASI BACK BUTTON (PAYMENT) =====
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

    // ===== ELEMEN BOTTOM SHEET METODE PEMBAYARAN =====
    const sheetOverlay = document.getElementById('sheetOverlay');
    const paymentMethodSheet = document.getElementById('paymentMethodSheet');
    const sheetMethodView = document.getElementById('sheetMethodView');
    const sheetLoadingView = document.getElementById('sheetLoadingView');
    const btnLanjutkanPayment = document.getElementById('btnLanjutkanPayment');
    const methodOptions = document.querySelectorAll('.method-option:not(.disabled)');

    function openMethodSheet() {
        // reset pilihan & tampilan tiap kali sheet dibuka
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

        // Tampilkan animasi loading dengan text QRIS
        const loadingLabel = document.getElementById('sheetLoadingLabel');
        if (loadingLabel) loadingLabel.textContent = 'Menyiapkan QRIS Pembayaran...';

        sheetMethodView.style.display = 'none';
        sheetLoadingView.classList.add('active');

        // Jalankan progress bar
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                const fill = document.getElementById('sheetProgressFill');
                if (fill) fill.classList.add('run');
            });
        });

        setTimeout(function() {
            // Reset progress
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

    // ===== EVENT =====
    if (productGrid) {
        productGrid.addEventListener('click', function (e) {
            const card = e.target.closest('.product-card');
            if (card) openProduct(card.dataset.product);
        });
    }

    // Tombol kembali cuma minta browser mundur satu langkah.
    // Tampilan yang sebenarnya selalu diatur lewat popstate di bawah,
    // jadi urutan halaman utama -> produk -> pembayaran selalu konsisten,
    // baik lewat tombol di halaman maupun tombol back browser/HP.
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

    // ===== ADDON SHEET LOGIC =====
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

    function openAddonSheet() {
        const data = products[1];
        const addon = data.addon;
        addonSelected = false;
        addonCard.classList.remove('selected');
        addonCardImg.src = addon.img;
        addonCardName.textContent = addon.name;
        addonCardDesc.textContent = addon.desc;
        addonCardPrice.textContent = '+' + addon.priceLabel;
        const basePrice = 500;
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
        const total = addonSelected ? addon.priceCombo : 500;
        addonTotalValue.textContent = formatRp(total);
        btnLanjutkanAddon.textContent = `Lanjutkan • ${formatRp(total)}`;
    });

    addonSheetOverlay.addEventListener('click', closeAddonSheet);

    btnLanjutkanAddon.addEventListener('click', function() {
        const data = products[1];
        const addon = data.addon;
        // Set QRIS dan harga di payment page sesuai pilihan
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

    // ===== DOWNLOAD QRIS LANGSUNG KE GALERI =====
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

    // ===== SHEET INPUT IG =====
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

            // Ambil data dari produk yang sedang aktif (IG atau TikTok)
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

        // Simpan data untuk pesan WA
        window._igOrderData = {
            username: igUsernameInput.value.trim(),
            followers: selectedFollowers,
            price: tier.pricePayment,
            platform: platformName
        };

        // Set data ke halaman pembayaran
        paymentQrisImg.src = tier.qris;
        qrisPriceText.textContent = tier.pricePayment;
        btnDownloadQris.href = tier.qris;

        // Tampilkan loading - sembunyikan view isi
        igInputView.style.display = 'none';
        igLoadingView.classList.add('active');

        // Jalankan progress bar setelah 1 frame (biar transisi smooth)
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                const fill = document.getElementById('igProgressFill');
                if (fill) fill.classList.add('run');
            });
        });

        setTimeout(function() {
            // Tutup IG sheet TANPA memunculkan lagi igInputView dulu
            igSheetOverlay.classList.remove('active');
            igInputSheet.classList.remove('active');

            // Buka method sheet setelah animasi tutup selesai (300ms)
            setTimeout(function() {
                // Reset IG sheet (hidden, biar next open bersih)
                igInputView.style.display = '';
                igLoadingView.classList.remove('active');
                const fill = document.getElementById('igProgressFill');
                if (fill) fill.classList.remove('run');

                openMethodSheet();
            }, 320);
        }, 2000);
    });

    // Guard back button: tutup IG sheet dulu kalau lagi kebuka
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

// ================================================================
// ===== FITUR STATUS (STORY VIEWER) =====
// ================================================================
(function () {
    // Template gradasi buat status teks — ID harus sama persis dengan yang ada di apk admin
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
    let segGeneration = 0; // dinaikkan tiap ganti status, biar event dari status lama (video/gambar) diabaikan

    // ===== CACHE MEDIA STATUS — biar gak loading ulang tiap buka lagi / ganti status =====
    const STATUS_CACHE_NAME = 'status-media-cache-v1';
    const statusMediaReady = new Set(); // url yang sudah pasti siap tampil (dari cache atau baru selesai load)
    const statusSrcCache = new Map(); // url asli -> blob url (kalau berhasil dicache lewat Cache Storage)

    function getStatusMediaSrc(url) {
        return new Promise((resolve) => {
            if (!url) { resolve(url); return; }
            // Foto status disimpan sebagai base64 (data:...) langsung di dokumen Firestore —
            // itu sudah siap pakai di memori, jadi TIDAK perlu di-fetch lagi ke Cache Storage.
            // Sebelumnya semua jenis media (termasuk base64) dipaksa lewat fetch+blob+cache,
            // padahal buat base64 itu cuma nambah proses konversi yang bikin loading kerasa
            // lebih lama, apalagi di HP yang baru pertama kali buka (belum ada cache).
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

    // ===== VIDEO: cek cache dulu (instan, gak makan kuota kalau udah pernah nonton),
    // kalau belum ada baru stream langsung + simpan ke cache di belakang layar =====
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
            // Video TIDAK di-preload lewat blob (itu yang bikin berat/lama).
            // Cukup pancing browser mulai buffering sendiri di background lewat
            // elemen <video> tersembunyi, biarkan mekanisme streaming bawaan browser yang jalan.
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
        // PENTING: bar yang sedang berjalan punya inline style transition (dari startProgress),
        // yang prioritasnya lebih tinggi dari class CSS. Kalau cuma ganti class tanpa reset
        // inline style, transisi lama tetap jalan pelan-pelan sampai penuh/kosong (bug lama).
        // Makanya di sini transition dipaksa 'none' dulu SEBELUM ganti width, biar perubahannya instan.
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
            // paksa reflow biar browser "menerima" perubahan instan sebelum style lain menimpa lagi
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

        // preload status berikutnya di belakang layar, biar begitu lanjut udah siap
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

            // Cek cache dulu — kalau video ini sudah pernah ditonton, langsung pakai
            // itu (instan, TANPA kuota lagi). Kalau belum ada, baru stream dari URL asli
            // (cepat, gak perlu nunggu download penuh) sambil disimpan ke cache di
            // belakang layar buat nonton berikutnya.
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
        // PENTING: requestAnimationFrame di bawah ini baru jalan di frame berikutnya.
        // Kalau di antara sekarang dan frame itu user keburu pindah status (maju/mundur),
        // showSegment() sudah mereset bar ini duluan — makanya generasi status (myGen) harus
        // dicek dulu sebelum benar-benar menjalankan animasinya, biar gak "menimpa" reset
        // yang sudah terjadi (ini penyebab bug bar status sebelumnya lanjut keisi lagi
        // padahal seharusnya langsung kosong pas mundur).
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

    // ===== OVERLAY CENTANG SUKSES TERKIRIM =====
    const statusSentOverlay = document.getElementById('statusSentOverlay');
    let sentOverlayTimer = null;
    function showSentOverlay() {
        if (!statusSentOverlay) return;
        statusSentOverlay.classList.remove('show');
        void statusSentOverlay.offsetWidth; // reset animasi kalau dipanggil beruntun
        statusSentOverlay.classList.add('show');
        clearTimeout(sentOverlayTimer);
        sentOverlayTimer = setTimeout(() => statusSentOverlay.classList.remove('show'), 1000);
    }
    window.__statusShowSentOverlay = showSentOverlay;

    // ===== KIRIM PESAN TEKS / TOGGLE MIC<->SEND =====
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

    // ===== TOMBOL STIKER: buka/tutup popover quick emoji =====
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

    // ===== KOMPOSER MENGAMBANG DI ATAS KEYBOARD =====
    // Cuma status-bottom-bar yang harus naik ngikutin keyboard, konten status (foto/video)
    // di belakangnya harus tetap diam di tempat, gak boleh ikut kekompres/naik.
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
        // Reset input & ikon LANGSUNG (gak nunggu hasil kirim), biar selalu ada respon instan pas diklik.
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

    // ===== EMOJI CEPAT =====
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

    // ===== LIKE (LOVE) =====
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

    // ===== SHARE =====
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

    // ===== KOMPRESI GAMBAR KE BASE64 (dipakai buat kirim foto balasan) =====
    function fileToCompressedBase64(file, maxWidth, quality) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = () => reject(new Error('Gagal membaca file gambar.'));
            reader.onload = (e) => {
                const img = new Image();
                img.onerror = () => reject(new Error('Gagal memuat gambar.'));
                img.onload = () => {
                    let w = img.width, h = img.height;
                    if (w > maxWidth) { h = Math.round(h * (maxWidth / w)); w = maxWidth; }
                    const canvas = document.createElement('canvas');
                    canvas.width = w; canvas.height = h;
                    canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                    resolve(canvas.toDataURL('image/jpeg', quality));
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    // Firestore membatasi 1 dokumen maksimal ~1MB, jadi base64 foto harus jauh di bawah itu
    // (sisa buat field lain). Kalau kompresi pertama masih kegedean, coba turunkan lagi
    // bertahap (bukan langsung gagal) — ini yang bikin foto sering "gagal terkirim" sebelumnya.
    const STATUS_IMG_MAX_BASE64 = 650000;
    function compressUntilFits(file, attempts) {
        const step = attempts[0];
        if (!step) return Promise.reject(new Error('Foto terlalu besar'));
        return fileToCompressedBase64(file, step.w, step.q).then(base64 => {
            if (base64.length > STATUS_IMG_MAX_BASE64) {
                if (attempts.length > 1) return compressUntilFits(file, attempts.slice(1));
                return Promise.reject(new Error('Foto terlalu besar'));
            }
            return base64;
        });
    }

    function handlePickedImage(file) {
        if (!file) return;
        pauseProgress();
        const list = window.__statusData || [];
        const current = list[statusIndex];
        compressUntilFits(file, [
            { w: 900, q: 0.7 },
            { w: 700, q: 0.55 },
            { w: 500, q: 0.4 }
        ]).then(base64 => {
            if (!window.__sendPesanMasuk) {
                showToast('Koneksi belum siap, coba lagi sebentar');
                resumeProgress();
                return;
            }
            window.__sendPesanMasuk({ type: 'image', img: base64, statusId: current ? current.id : null })
                .then(() => showSentOverlay())
                .catch(() => showToast('Gagal mengirim foto, coba lagi'));
            resumeProgress();
        }).catch(() => { showToast('Ukuran foto terlalu besar, coba foto lain'); resumeProgress(); });
    }

    statusBtnCamera.addEventListener('click', () => statusCameraCapture.click());
    statusBtnGallery.addEventListener('click', () => statusGalleryPick.click());
    statusCameraCapture.addEventListener('change', function () { handlePickedImage(this.files[0]); this.value = ''; });
    statusGalleryPick.addEventListener('change', function () { handlePickedImage(this.files[0]); this.value = ''; });

    // ===== REKAM PESAN SUARA =====
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
            // Base64 bikin ukurannya membengkak ~33%, jadi batas blob mentah harus jauh
            // di bawah limit dokumen Firestore (1MB) biar gak gagal kirim.
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

    // Guard tombol back: tutup status viewer, KECUALI kalau baru balik dari sub-halaman
    // (misal notifikasi) yang dibuka dari dalam status — status-nya harus tetap kebuka.
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
