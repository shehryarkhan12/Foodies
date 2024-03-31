import { initializeApp } from 'firebase/app';

// Initialize Firebase
const firebaseConfig = {
  apiKey:"AIzaSyAWAc_ERFMBdWUuVCz7RcCqqEmqyc5RCTs",
  authDomain:"analog-patrol-402721.firebase.com",
  projectId:"analog-patrol-402721",
  storageBucket:"analog-patrol-402721.appspot.com",
  messagingSenderId:"464353221720",
  appId:"1:464353221720:android:95205273447e1737f0fe2d"
};

const app = initializeApp(firebaseConfig);
export default app;