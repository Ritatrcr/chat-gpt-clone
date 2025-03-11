// app/_layout.tsx
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemeProvider } from "@react-navigation/native";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { DataProvider } from "@/context/dataContext/DataContext";
import { AuthProvider } from "@/context/authContext/AuthProvider";

export default function Layout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <DataProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="splash" options={{ title: "Loading" }} />
              <Stack.Screen name="firstScreen" options={{ title: "Welcome" }} />
              <Stack.Screen name="auth" options={{ title: "Authentication" }} />
              <Stack.Screen name="dashboard" options={{ title: "Chats" }} />
              <Stack.Screen name="conversation" options={{ title: "Chat" }} />
            </Stack>
          </ThemeProvider>
        </GestureHandlerRootView>
      </DataProvider>
    </AuthProvider>
  );
}
