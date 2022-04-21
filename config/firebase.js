import  firebase  from 'firebase/compat';
import firestore from 'firebase/firestore';
import config from '../config'

const firebaseConfig = {
    apiKey: config.apiKey,
    authDomain: config.authDomain,
    projectId: config.projectId,
    storageBucket: config.storageBucket,
    messagingSenderId: config.messagingSenderId,
    appId: config.appId,
    measurementId: config.measurementId
};

firebase.initializeApp(firebaseConfig);

firebase.firestore();

const auth = firebase.auth()

export default firebase;
export {auth};