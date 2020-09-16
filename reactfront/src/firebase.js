import firebase from 'firebase';

const config = {
    apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
	authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
	databaseURL: process.env.REACT_APP_FIREBASE_DB_URL,
	projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
	storageBucket: process.env.REACT_APP_FIREBASE_STORAGE,
	messagingSenderId: process.env.REACT_APP_FIREBASE_MSG_ID,
	appId: process.env.REACT_APP_FIREBASE_APP_ID,
	measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
}
firebase.initializeApp(config);

const Firebase = firebase
export default Firebase

