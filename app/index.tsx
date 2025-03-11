import React, { useEffect } from 'react';
import { View, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

const SplashScreen = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/firstScreen');
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/logo_letters.png')} style={styles.image} />
      <ActivityIndicator size="large" color="#fff" style={styles.loader} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#343541',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  loader: {
    marginTop: 20,
  },
});

export default SplashScreen;
