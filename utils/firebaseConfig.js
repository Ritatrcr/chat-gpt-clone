// utils/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const FirebaseConfig = {
  apiKey: "AIzaSyDa2s2M4NLIKSUu7w88deMILQqEcoIcIzI",
  authDomain: "chat-dam-14763.firebaseapp.com",
  projectId: "chat-dam-14763",
  storageBucket: "chat-dam-14763.firebasestorage.app",
  messagingSenderId: "990684813535",
  appId: "1:990684813535:web:d4a9345d7c6a0735bef16a",
  measurementId: "G-7LX6DJ5SNB"
};

const app = initializeApp(FirebaseConfig);
export const db = getFirestore(app);




export const getChats = async () => {
  try {
    const chatCollection = collection(db, "chats");
    const chatSnapshot = await getDocs(chatCollection);
    return chatSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
  } catch (error) {
    console.error("Error fetching chats:", error);
    return [];
  }
};

export const auth = getAuth(app);
