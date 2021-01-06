import React, { useRef, useState } from 'react';
import './App.css';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
// import 'firebase/analytics';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyBjedV6OWSVtCdkFiHsS3sdwfOV1AgaAIU",
  authDomain: "chat-app-w-react-firebase.firebaseapp.com",
  projectId: "chat-app-w-react-firebase",
  storageBucket: "chat-app-w-react-firebase.appspot.com",
  messagingSenderId: "93481197568",
  appId: "1:93481197568:web:21cd69921b4b3055edf8e5"

})

const auth = firebase.auth();
const firestore = firebase.firestore();
// const analytics = firebase.analytics();


function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header className="AppHeaderBackground">
   
        <h1>DeviChat</h1>
        <SignOut />
      </header>

      <section>
      {user ? <ChatRoom /> : <SignIn />}
      </section>

    </div>
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>
    
      <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
      <div className= "signin_ptag">
        <p> You will be watched human! 
        Don't violate the TOS!</p>
        </div>
    </>
  )

}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Click Me to Leave Hell!</button>
  )
}


function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (<>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>

    </main>

    <form onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Humans! Let's Talk!" />

      <button type="submit" disabled={!formValue}><span class="material-icons">  chat  </span></button>

    </form>
  </>)
}


function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL || ("./assets/incubus.jpg")} />
      <p>{text}</p>
    </div>
  </>)
}


export default App;