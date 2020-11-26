import { FirebaseApp as app, FirebaseAuth as auth, FirebaseFirestore as firestore } from './../firebase'
import React from 'react';

// may be a good idea to make the current conversation a const variable here, and reference it directly in the functions instead of as param

// firebase contains the messages in a single collection (table) with conversation name, text, creation date and time, user id and user PP URL
export function getMessages(convName) {
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.where('conv_name', '==', convName).orderBy('createdAt').limitToLast(200);
  const [messages] = useCollectionData(query, {idField: 'id'});
  return messages
}

// can be improved, but needs context on front usage
export function sendMessageOnConv(message, convName) {
  const messagesRef = firestore.collection('messages');
  const { uid, photoURL } = auth.currentUser;
  await messagesRef.add({
    conv_name: convName,
    text: message,
    createdAt: firestore.FieldValue.serverTimestamp(),
    uid,
    photoURL
  });
}

/*
example use:
<main>
  {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
  <span ref={dummy}></span>
</main>
*/
export function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} />
      <p>{text}</p>
    </div>
  )
}
