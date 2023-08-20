import './App.css';
import React, { useRef, useState } from 'react';
// import firebase from 'firebase/app';
// import 'firebase/firestore';  // firestore database
// import 'firebase/auth'; // user authentication 
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import {useAuthState} from 'react-firebase-hooks/auth';

import {useCollectionData} from 'react-firebase-hooks/firestore';


// create a firebase project from firebase site.
// we allow users to sign in with google account. 
// Go to authentication tab and enable goodgle sign-in
// Go to cloud firestore tab and enable the database.
// Add a new web app to our project it gives you a javascript object that identifies your project
// paste this in firebase initializeApp as below.


firebase.initializeApp({
  apiKey: "AIzaSyDG8wZtG8PC1JlzWGna6UknPqQ7FbcF4eQ",
  authDomain: "chat-application-b3999.firebaseapp.com",
  projectId: "chat-application-b3999",
  storageBucket: "chat-application-b3999.appspot.com",
  messagingSenderId: "405797077163",
  appId: "1:405797077163:web:ffea91703756875912f7ee",
  measurementId: "G-8P6PM67KF9"
})

const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {

  const [user] = useAuthState(auth); // if user is logged in it returns an object
  // which has user id,email and other info. 
  // when logged out user object is null.

  return (
    <div className="App">
      <header>
      <h1>
        <span role="img" aria-label="Fire">🔥</span>
        <span role="img" aria-label="Chat">💬</span>
        <span role="img" aria-label="Heart">❤️</span>
      </h1>
        <h2>Chat application</h2>
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
      <h1 style={{color:'white'}} >Welcome to tech talks!!</h1>
      <h3 style={{textAlign:"center",color:'white',margin:'-5px'}}>Share your perspective on the Technology in future..</h3>
    </>
  )

}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}


// function ChatRoom() {
//   const dummy = useRef();
//   const messagesRef = firestore.collection('messages');
//   const query = messagesRef.orderBy('createdAt').limit(25);

//   const [messages] = useCollectionData(query, { idField: 'id' });

//   const [formValue, setFormValue] = useState('');


//   const sendMessage = async (e) => {
//     e.preventDefault();

//     const { uid, photoURL } = auth.currentUser;

//     await messagesRef.add({
//       text: formValue,
//       createdAt: firebase.firestore.FieldValue.serverTimestamp(),
//       uid,
//       photoURL
//     })

//     setFormValue('');
//     dummy.current.scrollIntoView({ behavior: 'smooth' });
//   }

//   return (<>
//     <main>

//       {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

//       <span ref={dummy}></span>

//     </main>

//     <form onSubmit={sendMessage}>

//       <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />

//       <button type="submit" disabled={!formValue}>
//         <span role="img" aria-label="Send">🕊️</span>
//       </button>


//     </form>
//   </>)
// }

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
    });

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <>
      <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
        <span ref={dummy}></span>
      </main>
      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />
        <button type="submit" disabled={!formValue}>
          <span role="img" aria-label="Send">🕊️</span>
        </button>
      </form>
    </>
  );
}



function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
    <img src={photoURL || 'https://placekitten.com/50/50'} alt="User Avatar" />

      <p>{text}</p>
    </div>
  </>)
}


export default App;
