import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { FIREBASE_CONFIG } from "../config";
// firebase.initializeApp(FIREBASE_CONFIG);
// const FireBaseStorage = firebase.storage();
// console.log(firebase.storage());
// export default FireBaseStorage;
const app = initializeApp(FIREBASE_CONFIG);
const storage = getStorage(app);
const FireBaseStorage = storage;

export default FireBaseStorage;
