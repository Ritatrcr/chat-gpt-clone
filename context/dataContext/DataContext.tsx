// context/DataContext.tsx
import { Message } from "@/interfaces/AppInterfaces";
import { db } from "../../utils/firebaseConfig";
import { addDoc, collection, getDocs, updateDoc, query, where, doc } from "firebase/firestore/lite";
import { createContext, useState } from "react";
import { useAuth } from "../authContext/AuthProvider";

interface DataContextProps {
    chats: Message[];
    createChat: (text: string, messages: Message[]) => Promise<string | undefined>;
    updateChat: (id: string, messages: Message[]) => Promise<void>;
    getChats: () => Promise<void>;
}

// Crear contexto
export const DataContext = createContext({} as DataContextProps);

// Componente Provider
export const DataProvider = ({ children }: any) => {
    const [chats, setChats] = useState([] as Message[]);
    const { user } = useAuth(); // Obtener usuario autenticado

    const createChat = async (text: string, messages: Message[]) => {
        if (!user) return; // Evitar crear chats sin usuario autenticado

        try {
            const textSplit = text.split(" ");
            const response = await addDoc(collection(db, "chats"), {
                title: textSplit.slice(0, 5).join(" "),
                created_at: new Date(),
                messages,
                user: user.uid, // Guardar el UID del usuario autenticado
            });
            return response.id;
        } catch (error) {
            console.log("Error: ", { error });
        }
    };

    const updateChat = async (id: string, messages: Message[]) => {
        try {
            const chatRef = doc(db, "chats", id);
            await updateDoc(chatRef, { messages });
        } catch (error) {
            console.log({ error });
        }
    };

    const getChats = async () => {
        if (!user) return; // Asegurar que hay un usuario autenticado

        try {
            const q = query(collection(db, "chats"), where("user", "==", user.uid)); // Filtrar por usuario
            const querySnapshot = await getDocs(q);
            const newChats = querySnapshot.docs.map(doc => ({
                ...(doc.data() as Message),
                id: doc.id
            }));
            setChats(newChats);
        } catch (error) {
            console.log({ error });
        }
    };

    return (
        <DataContext.Provider value={{ chats, createChat, updateChat, getChats }}>
            {children}
        </DataContext.Provider>
    );
};
