import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/storage';

const firebaseConfig = {
    apiKey: 'AIzaSyBSEx2-ykPTb70keLZh3LAuDtQT2VyCsco',
    authDomain: 'evencloud-26d32.firebaseapp.com',
    databaseURL: 'https://evencloud-26d32.firebaseio.com',
    projectId: 'evencloud-26d32',
    storageBucket: 'evencloud-26d32.appspot.com',
    messagingSenderId: '599725599274',
    appId: '1:599725599274:web:8f9a716ca577fc72a1f153',
    measurementId: 'G-VSJNQ5LYK5'
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

export { auth, firebase as default };
