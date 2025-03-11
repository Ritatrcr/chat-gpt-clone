import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Modal, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { signOut, User } from "firebase/auth";
import { db } from "../utils/firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/authContext/AuthProvider";

const Dashboard = () => {
  const router = useRouter();
  const { user, logout } = useAuth(); // Se obtiene user y logout desde el contexto
  const [chats, setChats] = useState<{ id: string; title: string }[]>([]);
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [selectedChat, setSelectedChat] = useState<{ id: string; title: string } | null>(null);
  const [newChatTitle, setNewChatTitle] = useState<string>("");

  // Obtener la inicial del usuario autenticado
  const getInitial = () => {
    if (user?.email) return user.email[0].toUpperCase();
    return "?";
  };

  // Cargar los chats del usuario autenticado
  useEffect(() => {
    const fetchChats = async () => {
      if (!user) return;
      try {
        const q = query(collection(db, "chats"), where("user", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const chatsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as { id: string; title: string }[];
        setChats(chatsList);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchChats();
  }, [user]);

  // Crear un nuevo chat
  const handleCreateChat = async () => {
    if (!user) {
      Alert.alert("Error", "Debes iniciar sesión para crear un chat.");
      return;
    }

    const response = await addDoc(collection(db, "chats"), {
      title: "New Chat",
      created_at: new Date(),
      user: user.uid,
      messages: [],
    });

    setChats([{ id: response.id, title: "New Chat" }, ...chats]); // Agregar chat arriba
  };

  // Editar un chat
  const handleEditChat = async () => {
    if (!selectedChat || !newChatTitle.trim()) return;
    try {
      const chatRef = doc(db, "chats", selectedChat.id);
      await updateDoc(chatRef, { title: newChatTitle });

      // Actualizar la lista de chats localmente
      setChats(chats.map(chat => (chat.id === selectedChat.id ? { ...chat, title: newChatTitle } : chat)));

      setEditModalVisible(false);
      Alert.alert("Éxito", "El nombre del chat ha sido actualizado.");
    } catch (error) {
      console.error("Error updating chat:", error);
      Alert.alert("Error", "No se pudo actualizar el chat.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Botón de Nuevo Chat */}
      <TouchableOpacity style={styles.newChatButton} onPress={handleCreateChat}>
        <Ionicons name="chatbubble-outline" size={20} color="#fff" />
        <Text style={styles.newChatText}>New Chat +</Text>
      </TouchableOpacity>

      {/* Lista de Chats */}
      <ScrollView style={styles.chatList}>
        {chats.map(chat => (
          <View key={chat.id} style={styles.chatItemContainer}>
            <TouchableOpacity style={styles.chatItem} onPress={() => router.push(`/conversation?chatId=${chat.id}`)}>
              <Text style={styles.chatText}>{chat.title}</Text>
            </TouchableOpacity>

            {/* Botón de Opciones (⋮) */}
            <TouchableOpacity
              style={styles.optionsButton}
              onPress={() => {
                setSelectedChat(chat);
                setNewChatTitle(chat.title);
                setEditModalVisible(true);
              }}
            >
              <Ionicons name="ellipsis-vertical" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Perfil del usuario en la parte inferior */}
      <View style={styles.userContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitial()}</Text>
        </View>
        <Text style={styles.userEmail}>{user?.email || "Anónimo"}</Text>

        {/* Botón de menú ⋮ */}
        <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)} style={styles.menuButton}>
          <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Menú desplegable en la parte inferior */}
      {menuVisible && (
        <View style={styles.dropdownMenu}>
          
          <TouchableOpacity
            style={styles.menuItem}
            onPress={async () => {
              setMenuVisible(false);
              await logout();
              router.replace("/auth");
            }}
          >
            <Ionicons name="log-out-outline" size={20} color="red" />
            <Text style={[styles.menuText, { color: "red" }]}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* MODAL PARA EDITAR CHAT */}
      <Modal visible={editModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Rename Chat</Text>
            <TextInput
              style={styles.input}
              value={newChatTitle}
              onChangeText={setNewChatTitle}
              placeholder="Nuevo nombre"
              placeholderTextColor="#aaa"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={() => setEditModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={handleEditChat}>
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// 📌 Estilos
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#343541", padding: 20 },
  newChatButton: { flexDirection: "row", alignItems: "center", paddingVertical: 35 },
  newChatText: { color: "#fff", fontSize: 18, marginLeft: 10, fontWeight: "bold" },
  chatList: { marginTop: 10 },
  chatItemContainer: { flexDirection: "row", alignItems: "center", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "rgba(246, 242, 242, 0.12)" },
  chatItem: { flex: 1 },
  chatText: { color: "#fff", fontSize: 16 },
  optionsButton: { padding: 10 },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: "#222", padding: 20, borderRadius: 10, width: "80%" },
  modalTitle: { color: "#fff", fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  input: { backgroundColor: "#333", color: "#fff", padding: 10, borderRadius: 8, marginBottom: 10 },
  modalButtons: { flexDirection: "row", justifyContent: "flex-end" },
  modalButton: { padding: 10 },
  modalButtonText: { color: "#fff", fontSize: 16 },
  userContainer: { flexDirection: "row", alignItems: "center", marginTop: 20, borderTopWidth: 1, borderTopColor: "rgba(246, 242, 242, 0.12)", paddingTop: 10 },
  avatar: { backgroundColor: "#444", padding: 20, borderRadius: 50, width: 50, height: 50, alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#fff", fontSize: 20 },
  userEmail: { color: "#fff", fontSize: 16, marginLeft: 10 },
  menuButton: { marginLeft: "auto" },
  dropdownMenu: { backgroundColor: "#343531", padding: 10, flexDirection: "row", position: "absolute", top:780, right: 15, borderRadius: 10 },
  menuItem: { flexDirection: "row", alignItems: "center", marginRight: 20 },
  menuText: { color: "#fff", fontSize: 16 },

});

export default Dashboard;
