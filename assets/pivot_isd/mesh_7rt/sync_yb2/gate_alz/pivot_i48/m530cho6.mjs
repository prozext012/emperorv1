import { initializeApp } from "../../../../../_mocksdk/app.js";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager, collection, onSnapshot, query, orderBy, doc, setDoc, addDoc, updateDoc, arrayUnion, deleteDoc, getDocs, where, increment, writeBatch, limit } from "../../../../../_mocksdk/firestore.js";
export { addDoc, arrayUnion, collection, doc, getDocs, increment, initializeFirestore, limit, onSnapshot, orderBy, persistentLocalCache, persistentMultipleTabManager, query, setDoc, updateDoc, where, writeBatch };


    const CLOUDINARY_CLOUD_NAME = 'ywdax4aj';
    const CLOUDINARY_UPLOAD_PRESET = 'statusMedia';
    function resizeFileToDataUrl(file, maxWidth = 1000, quality = 0.75) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = () => reject(new Error('Gagal membaca file gambar.'));
            reader.onload = (e) => {
                const img = new Image();
                img.onerror = () => reject(new Error('Gagal memuat gambar.'));
                img.onload = () => {
                    let { width, height } = img;
                    if (width > maxWidth) { height = Math.round(height * (maxWidth / width)); width = maxWidth; }
                    const canvas = document.createElement('canvas');
                    canvas.width = width; canvas.height = height;
                    canvas.getContext('2d').drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/jpeg', quality));
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }
    function dataUrlToBlob(dataUrl) {
        const [meta, b64] = dataUrl.split(',');
        const mime = meta.match(/:(.*?);/)[1];
        const bin = atob(b64);
        const arr = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
        return new Blob([arr], { type: mime });
    }
    async function uploadBlobToCloudinary(blob) {
        const formData = new FormData();
        formData.append('file', blob);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
            method: 'POST',
            body: formData
        });
        if (!res.ok) {
            let msg = 'Upload gambar ke Cloudinary gagal.';
            try { const errData = await res.json(); if (errData.error && errData.error.message) msg = errData.error.message; } catch (e) {}
            throw new Error(msg);
        }
        const data = await res.json();
        return data.secure_url;
    }

    async function uploadImageIfAny(file, maxWidth = 1000, quality = 0.75) {
        if (!file) return '';
        const dataUrl = await resizeFileToDataUrl(file, maxWidth, quality);
        return uploadBlobToCloudinary(dataUrlToBlob(dataUrl));
    }
    window.__uploadImageToCloudinary = uploadImageIfAny;

    const firebaseConfig = {
        apiKey: "AIzaSyAYoOQXd-C8Nf11H1u1WJhjxBwchV7Uhwc",
        authDomain: "dixzstore-bbb02.firebaseapp.com",
        projectId: "dixzstore-bbb02",
        storageBucket: "dixzstore-bbb02.firebasestorage.app",
        messagingSenderId: "30280369252",
        appId: "1:30280369252:web:9cec081528f736a2284b71"
    };

    export const fbApp = initializeApp(firebaseConfig);
