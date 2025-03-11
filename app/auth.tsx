// app/auth.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../context/authContext/AuthProvider";

const AuthScreen = () => {
  const router = useRouter();
  const { login, register, anonymousLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor ingresa un email y una contraseña.");
      return;
    }

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password);
      }
      router.push("/dashboard");
    } catch (error: any) {
      Alert.alert("Error", getErrorMessage(error.code));
    }
  };

  const handleAnonymousLogin = async () => {
    try {
      await anonymousLogin();
      router.push("/dashboard");
    } catch (error) {
      Alert.alert("Error", "No se pudo acceder de forma anónima.");
    }
  };

  const getErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case "auth/invalid-email":
        return "Formato de email inválido.";
      case "auth/user-not-found":
        return "Usuario no encontrado.";
      case "auth/wrong-password":
        return "Contraseña incorrecta.";
      case "auth/email-already-in-use":
        return "Este email ya está registrado.";
      case "auth/weak-password":
        return "La contraseña debe tener al menos 6 caracteres.";
      default:
        return "Ocurrió un error. Inténtalo de nuevo.";
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? "Login" : "Register"}</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Email" 
        keyboardType="email-address" 
        autoCapitalize="none"
        value={email} 
        onChangeText={setEmail} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Password" 
        secureTextEntry 
        value={password} 
        onChangeText={setPassword} 
      />
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleAuth}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>{isLogin ? "Login" : "Register"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
        <Text style={styles.switchText}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <Text style={styles.underlineText}>{isLogin ? "Sign up" : "Sign in"}</Text>
        </Text>
      </TouchableOpacity>



      <TouchableOpacity style={styles.anonButton} onPress={handleAnonymousLogin}>
        <Text style={styles.anonText}>Ingresar como Anónimo</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#343541" },
  title: { fontSize: 24, color: "#fff", marginBottom: 20 },
  input: { width: "80%", padding: 12, backgroundColor: "#444", color: "#fff", borderRadius: 8, marginBottom: 10 },
  button: { backgroundColor: "#00b894", padding: 12, borderRadius: 8, width: "80%", alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 18 },
  switchText: { color: "#ddd", marginTop: 15 },
  anonButton: { marginTop: 20, backgroundColor: "#555", padding: 12, borderRadius: 8, width: "80%", alignItems: "center" },
  anonText: { color: "#fff", fontSize: 16 },
  underlineText: {
    textDecorationLine: 'underline',
    color: '#00b894', // Optional: Change color to highlight the text
    fontWeight: 'bold', // Optional: Make it bold
  },
});

export default AuthScreen;