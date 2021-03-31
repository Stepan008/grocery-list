import firebase from 'firebase'
const config = {
    apiKey: "AIzaSyBZRmqw1mdPbRXJufnFILDWbYw-fZ_mnP0",
    authDomain: "grocery-list-9aa4e.firebaseapp.com",
    projectId: "grocery-list-9aa4e",
    storageBucket: "grocery-list-9aa4e.appspot.com",
    messagingSenderId: "375248520673",
    appId: "1:375248520673:web:0bfe04409697e22ecfbea0",
    measurementId: "G-LXN64P03SN"
};

firebase.initializeApp(config);
export default firebase;