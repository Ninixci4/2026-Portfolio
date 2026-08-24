(function () {
    /** Set to false for Web3Forms-only contact submissions (no Firestore). Admin dashboard still uses Firebase when configured. */
    const SAVE_CONTACT_TO_FIRESTORE = true;

    const FIREBASE_CONFIG = {
        apiKey: "AIzaSyA2gssNGiK2SgK_U8KTvQaMEZvCDTyRR0Y",
        authDomain: "nicia-portfolio.firebaseapp.com",
        projectId: "nicia-portfolio",
        storageBucket: "nicia-portfolio.firebasestorage.app",
        messagingSenderId: "437447128793",
        appId: "1:437447128793:web:c281f6bc3a7faf816e70c8"
    };

    function isConfigured() {
        return Object.values(FIREBASE_CONFIG).every((value) => typeof value === 'string' && !value.startsWith('YOUR_FIREBASE_'));
    }

    function getDb() {
        if (!window.firebase || !window.firebase.apps) return null;
        if (!isConfigured()) return null;

        if (!window.firebase.apps.length) {
            window.firebase.initializeApp(FIREBASE_CONFIG);
        }
        return window.firebase.firestore();
    }

    async function saveInquiry(payload) {
        const db = getDb();
        if (!db) {
            throw new Error('Inquiry service is not configured. Add your Firebase config in src/scripts/inquiry-service.js');
        }

        const data = {
            fullName: payload.fullName || '',
            email: payload.email || '',
            subject: payload.subject || '',
            message: payload.message || '',
            status: 'new',
            source: 'portfolio-contact-form',
            createdAt: window.firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: window.firebase.firestore.FieldValue.serverTimestamp()
        };

        return db.collection('contactMessages').add(data);
    }

    window.InquiryService = {
        saveInquiry,
        getDb,
        saveContactToFirestore: SAVE_CONTACT_TO_FIRESTORE
    };
})();
