import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc } from 'firebase/firestore/lite';

const loginForm = document.querySelector('.page-header__login-form');
const loginButton = loginForm.querySelector('.login-button');
const userBlock = document.querySelector('.page-header__user');
const name = userBlock.querySelector('.page-header__name');
const userBG = document.querySelector('.board__back-user-name');
const firebaseConfig = {
  apiKey: "AIzaSyCBehvUdJ1Sww5gcdv4yBRRpetngqVoFiY",
  authDomain: "board-3a7c6.firebaseapp.com",
  projectId: "board-3a7c6",
  storageBucket: "board-3a7c6.appspot.com",
  messagingSenderId: "457479426554",
  appId: "1:457479426554:web:f1b1ea86d33b6ff9f95443",
  measurementId: "G-5SZC6Y976H"
};
const app = initializeApp(firebaseConfig);
const database = getFirestore(app);
let activeUserBase;

if (sessionStorage.loginState === undefined) {
  sessionStorage.loginState = false;
}

checkLogin();

async function login() {
  const userName = loginForm.querySelector('.user-name');
  const userPass = loginForm.querySelector('.user-password');
  const users = await getData(database);
  const user = findUser(users, userName.value);

  if (user instanceof Error) {
    alert('No such user');
    return
  }

  const allowLogin = checkPassword(user, userPass.value);

  if (allowLogin) {
    sessionStorage.loginState = true;
    sessionStorage.user = userName.value;
    setLoggedInView(userName.value);
    document.location.reload();
  } else {
    alert('Wrong password');
  }
}

async function getData(db) {
  const users = collection(db, 'users');
  const list = await getDocs(users).then(snap => snap.docs.map(doc => doc.data()));
  return list;
}

function findUser(users, name) {
  for (let i of users) {
    if (i.name === name) {
      return i;
    }
  }

  return new Error('Wrong user name');
}

function checkPassword(user, pass) {
  return user.password === pass ? true : false;
}

function setLoggedInView(user) {
  userBlock.style.display = "inline-block";
  name.innerHTML = user;
  loginForm.style.display = 'none';
  userBG.innerHTML = user;
  activeUserBase = doc(database, 'users', user);
}

function checkLogin() {
  if (sessionStorage.loginState === 'true') setLoggedInView(sessionStorage.user);
}

loginButton.addEventListener('click', login);

export { activeUserBase, getData, findUser, database };