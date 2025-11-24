import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAnalytics, isSupported } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js';

const firebaseConfig = {
    apiKey: 'AIzaSyCQN5aEANuBCW9MT-ThipxrjgmC-cKO6Ko',
    authDomain: 'lebronrtired.firebaseapp.com',
    projectId: 'lebronrtired',
    storageBucket: 'lebronrtired.firebasestorage.app',
    messagingSenderId: '328450641088',
    appId: '1:328450641088:web:6a26582e347752daeaf125',
    measurementId: 'G-NN8VHR32QS'
};

const firebaseApp = initializeApp(firebaseConfig);
let analyticsInstance = null;

let analyticsReadyResolver;
const analyticsReadyPromise = new Promise((resolve) => {
    analyticsReadyResolver = resolve;
});

isSupported()
    .then((supported) => {
        if (!supported) {
            console.warn('当前环境不支持 Firebase Analytics。');
            analyticsReadyResolver(null);
            return null;
        }

        analyticsInstance = getAnalytics(firebaseApp);

        window.firebaseApp = firebaseApp;
        window.firebaseAnalytics = analyticsInstance;
        analyticsReadyResolver(analyticsInstance);
        return analyticsInstance;
    })
    .catch((error) => {
        console.error('Firebase Analytics 初始化失败:', error);
        analyticsReadyResolver(null);
    });

export function getFirebaseApp() {
    return firebaseApp;
}

export function getFirebaseAnalytics() {
    return analyticsInstance;
}

export { analyticsReadyPromise };

