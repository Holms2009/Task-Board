import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';

const loginButton = document.querySelector('.login-button');
const userAvatar = document.querySelector('.user');

const config = {
  apiKey: "AIzaSyCBehvUdJ1Sww5gcdv4yBRRpetngqVoFiY",
  authDomain: "board-3a7c6.firebaseapp.com",
  projectId: "board-3a7c6",
  storageBucket: "board-3a7c6.appspot.com",
  messagingSenderId: "457479426554",
  appId: "1:457479426554:web:f1b1ea86d33b6ff9f95443",
  measurementId: "G-5SZC6Y976H"
};

const app = initializeApp(config);
const db = getFirestore(app);


async function getData() {
  const users = collection(db, 'users');
  const snap = await getDocs(users);
  const list = snap.docs.map(doc => doc.data());

  console.log(list)
}

loginButton.addEventListener('click', login);

function login() {
  const userName = document.querySelector('.user-name');
  const userPass = document.querySelector('.user-password');
  getData();

  userAvatar.style.display = "inline-block";
  userAvatar.innerHTML = `Пользователь ${userName.value} вошел`;
}