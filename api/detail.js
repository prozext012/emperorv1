// api/detail.js
// Fungsi ini "dilewati" tiap ada yang buka /detail/:slug atau /detail/:slug/:sub
// (lihat rewrites di vercel.json).
//
// - Kalau yang buka itu BOT preview link (WhatsApp, Telegram, Facebook, dll),
//   fungsi ini balikin HTML ringan berisi og:image/og:title sesuai produknya.
// - Kalau yang buka itu ORANG BENERAN (browser biasa), fungsi ini balikin
//   index.html asli apa adanya, jadi pengalaman pengguna sama sekali gak berubah.

const PROJECT_ID = 'dixzstore-bbb02';
const API_KEY = 'AIzaSyAYoOQXd-C8Nf11H1u1WJhjxBwchV7Uhwc';
const DEFAULT_IMAGE = 'https://res.cloudinary.com/ywdax4aj/image/upload/v1787585940/ns8glapixpepn732afdy.jpg';
const SITE_NAME = 'Andika Store';

const BOT_UA_PATTERN = /whatsapp|telegrambot|facebookexternalhit|facebot|twitterbot|linkedinbot|slackbot|discordbot|pinterest|redditbot|skypeuripreview|vkshare|line\/|embedly|quora link preview|w3c_validator|google-pagerenderer|bot/i;

function escapeHtml(str) {
    return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function formatRp(n) {
    n = Number(n) || 0;
    return 'Rp ' + Math.round(n).toLocaleString('id-ID');
}

function fsNum(field) {
    if (!field) return 0;
    if (field.integerValue !== undefined) return Number(field.integerValue);
    if (field.doubleValue !== undefined) return Number(field.doubleValue);
    return 0;
}

// Sama persis dengan fungsi slugify di js/produk-grid.js, supaya slug yang
// dicocokkan di sini selalu konsisten dengan slug yang dipakai untuk bikin
// link produk di web utama.
function slugify(str) {
    return String(str || '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

async function fetchAllProducts() {
    const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents:runQuery?key=${API_KEY}`;
    const body = {
        structuredQuery: {
            from: [{ collectionId: 'products' }]
        }
    };
    const resp = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Kunci API dibatasi khusus domain kita (HTTP referrer restriction),
            // jadi request server-to-server ini perlu "mengaku" datang dari domain itu.
            'Referer': 'https://dixz-vip.vercel.app/'
        },
        body: JSON.stringify(body)
    });
    if (!resp.ok) return [];
    const data = await resp.json();
    if (!Array.isArray(data)) return [];
    return data.filter(d => d.document).map(d => d.document);
}

function docToProduct(docEntry) {
    const fields = docEntry.fields || {};
    const getStr = (f) => (fields[f] && fields[f].stringValue) || '';
    const getArr = (f) => {
        const av = fields[f] && fields[f].arrayValue && fields[f].arrayValue.values;
        return Array.isArray(av) ? av.map(v => v.stringValue).filter(Boolean) : [];
    };

    const type = getStr('type') || 'digital';
    const images = getArr('images');
    const gallery = getArr('gallery');
    const key = getStr('key');
    const name = getStr('name');

    let price = '';
    if (type === 'digital') {
        price = (getStr('priceMode') === 'coret')
            ? formatRp(fsNum(fields.priceSale))
            : formatRp(fsNum(fields.priceNormal));
    } else {
        // instagram / tiktok: pakai label harga grid kalau ada (misal "Mulai Rp 5.000")
        price = getStr('gridPriceLabel');
    }

    return {
        // Slug produk: sama seperti di frontend, pakai key kalau ada, kalau tidak pakai name.
        slug: slugify(key || name),
        name: name || SITE_NAME,
        price,
        image: images[0] || gallery[0] || DEFAULT_IMAGE
    };
}

async function fetchProductBySlug(slug) {
    const docs = await fetchAllProducts();
    const products = docs.map(docToProduct);
    return products.find(p => p.slug === slug) || null;
}

function buildBotHtml({ title, description, image, url }) {
    return `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8" />
<title>${escapeHtml(title)}</title>
<meta property="og:type" content="product" />
<meta property="og:site_name" content="${escapeHtml(SITE_NAME)}" />
<meta property="og:title" content="${escapeHtml(title)}" />
<meta property="og:description" content="${escapeHtml(description)}" />
<meta property="og:image" content="${escapeHtml(image)}" />
<meta property="og:url" content="${escapeHtml(url)}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${escapeHtml(title)}" />
<meta name="twitter:description" content="${escapeHtml(description)}" />
<meta name="twitter:image" content="${escapeHtml(image)}" />
</head>
<body></body>
</html>`;
}

module.exports = async (req, res) => {
    const ua = req.headers['user-agent'] || '';
    const isBot = BOT_UA_PATTERN.test(ua);
    const slug = req.query && req.query.slug;
    const host = req.headers.host;
    const protocol = (req.headers['x-forwarded-proto'] || 'https');
    const fullUrl = `${protocol}://${host}${req.url}`;

    if (isBot && slug) {
        try {
            const product = await fetchProductBySlug(decodeURIComponent(slug));
            if (product) {
                const html = buildBotHtml({
                    title: `${product.name} — ${SITE_NAME}`,
                    description: product.price
                        ? `${product.name} tersedia di ${SITE_NAME} mulai ${product.price}. Klik untuk lihat detail & cara pembelian.`
                        : `${product.name} tersedia di ${SITE_NAME}. Klik untuk lihat detail & cara pembelian.`,
                    image: product.image,
                    url: fullUrl
                });
                res.setHeader('Content-Type', 'text/html; charset=utf-8');
                res.status(200).send(html);
                return;
            }
        } catch (e) {
            // Kalau ada error apapun, lanjut ke bawah: tampilkan situs normal saja.
        }
    }

    // Pengunjung biasa (atau produk tidak ketemu): tampilkan situs asli apa adanya.
    try {
        const resp = await fetch(`${protocol}://${host}/index.html`);
        const html = await resp.text();
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.status(200).send(html);
    } catch (e) {
        res.status(500).send('Internal Server Error');
    }
};
