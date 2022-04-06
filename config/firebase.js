import  firebase  from 'firebase/compat';
import firestore from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCvI83PTRVappg6O9-c5cTXyPv9qy5bX50",
    authDomain: "sporta-47292.firebaseapp.com",
    projectId: "sporta-47292",
    storageBucket: "sporta-47292.appspot.com",
    messagingSenderId: "524060733251",
    appId: "1:524060733251:web:c2e17c6d417ba85ccd09f6",
    measurementId: "G-S75K31GBVC"
};

firebase.initializeApp(firebaseConfig);

firebase.firestore();

const auth = firebase.auth()

export default firebase;
export {auth};