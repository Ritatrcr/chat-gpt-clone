import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, Keyboard } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { db } from "../utils/firebaseConfig"; 
import { Message } from '@/interfaces/AppInterfaces';

const GEMINI_API_KEY = 'AIzaSyD1g_xcZdmCOfch5P7yi5MQ2bg6l-zayME';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;



const Conversation = () => {
  const router = useRouter();
  const { chatId } = useLocalSearchParams();
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);


  // 🔹 Cargar mensajes al iniciar la conversación
  useEffect(() => {
    const loadMessagesFromFirestore = async () => {
      if (!chatId) return;
      try {
        const chatRef = doc(db, "chats", chatId as string);
        const chatSnap = await getDoc(chatRef);
        if (chatSnap.exists()) {
          setMessages(chatSnap.data()?.message || []);
        }
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    };

    loadMessagesFromFirestore();
  }, [chatId]);

  // 🔹 Guardar mensajes en Firestore
  const saveMessageToFirestore = async (userMessage: string, botMessage: string) => {
    if (!chatId) return;
    try {
      const chatRef = doc(db, "chats", chatId as string);
      await updateDoc(chatRef, {
        message: arrayUnion(
          { role: "user", text: userMessage },
          { role: "bot", text: botMessage }
        )
      });
    } catch (error) {
      console.error("Error saving messages:", error);
    }
  };

  // 🔹 Obtener respuesta del bot y guardar en Firestore
  const getResponse = async () => {
    if (!message.trim()) return; // Evita mensajes vacíos
    try {
      setIsLoading(true);
      const userMessage = message;
      setMessage(''); // Limpiar input
      Keyboard.dismiss(); // Cierra el teclado

      // 🔹 Actualizar el estado con el mensaje del usuario y "Generando respuesta..."
      setMessages(prev => [
        ...prev,
        { role: 'user', text: userMessage },
        { role: 'bot', text: "Generando respuesta..." }
      ]);

      // 🔹 Enviar el mensaje a la API de Gemini
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userMessage }] }]
        })
      });

      const data = await response.json();
      const botMessage = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response received.';

      // 🔹 Reemplazar "Generando respuesta..." con la respuesta real
      setMessages(prev => [
        ...prev.slice(0, -1), // Elimina "Generando respuesta..."
        { role: 'bot', text: botMessage }
      ]);

      await saveMessageToFirestore(userMessage, botMessage); // Guardar en Firestore

    } catch (error) {
      console.error("Error fetching API:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Image source={require('../assets/images/logo.png')} style={styles.logo} />
      </View>

      <ScrollView style={styles.chatContainer}>
        {messages.map((msg, index) => (
          <View key={index} style={[styles.messageBubble, msg.role === 'user' ? styles.userMessage : styles.botMessage]}>
            <Text style={styles.messageText}>{msg.text}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input} 
          placeholder="Type a message..." 
          placeholderTextColor="#aaa"
          value={message}
          onChangeText={setMessage}
          onSubmitEditing={getResponse} // 🔹 Enviar mensaje al presionar Enter
          returnKeyType="send"
        />
        <TouchableOpacity style={styles.sendButton} onPress={getResponse}>
          <Image source={require('../assets/images/send.png')} style={styles.sendIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#343541',
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  backButton: {
    paddingVertical: 10,
    paddingRight: 15,
  },
  backText: {
    color: '#fff',
    fontSize: 18,
  },
  logo: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginLeft: 'auto',
    marginRight: 20,
  },
  chatContainer: {
    flex: 1,
    padding: 15,
  },
  messageBubble: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#00b894',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#444',
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#444',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#2b2b3b',
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: '#444',
  },
  sendButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: '#00b894',
    borderRadius: 10,
  },
  sendIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
});

export default Conversation;
