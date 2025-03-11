import React, { useState } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

const states = [
  {
    title: 'Welcome to ChatGPT',
    subtitle: 'Ask anything, get your answer',
    icon: require('../assets/images/sol.png'),
    sectionTitle: 'Examples',
    cards: [
      '“Explain quantum computing in simple terms”',
      '“Got any creative ideas for a 10 year old’s birthday?”',
      '“How do I make an HTTP request in Javascript?”',
    ],
  },
  {
    title: 'Welcome to ChatGPT',
    subtitle: 'Ask anything, get your answer',
    icon: require('../assets/images/capabilities.png'),
    sectionTitle: 'Capabilities',
    cards: [
      'Remembers what user said earlier in the conversation',
      'Allows user to provide follow-up corrections',
      'Trained to decline inappropriate requests',
    ],
  },
  {
    title: 'Welcome to ChatGPT',
    subtitle: 'Ask anything, get your answer',
    icon: require('../assets/images/limits.png'),
    sectionTitle: 'Limits',
    cards: [
      'May occasionally generate incorrect information',
      'May occasionally produce harmful instructions or biased content',
      'Limited knowledge of world and events after 2021',
    ],
  },
];

const FirstScreen = () => {
  const [currentState, setCurrentState] = useState(0);
  const router = useRouter(); // Hook para la navegación

  const handleNext = () => {
    if (currentState < states.length - 1) {
      setCurrentState(currentState + 1);
    } else {
      router.push('/auth'); // Redirige al auth cuando llega al último estado
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('../assets/images/logo.png')} style={styles.logo} />
      <Text style={styles.title}>{states[currentState].title}</Text>
      <Text style={styles.subtitle}>{states[currentState].subtitle}</Text>

      <Image source={states[currentState].icon} style={styles.icon} />

      <Text style={styles.sectionTitle}>{states[currentState].sectionTitle}</Text>

      {states[currentState].cards.map((text, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.cardText}>{text}</Text>
        </View>
      ))}

      <View style={styles.navBar}>
        {[0, 1, 2].map((index) => (
          <View
            key={index}
            style={[styles.navDot, currentState === index && styles.activeDot]}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>{currentState === 2 ? "Let's Chat →" : 'Next'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#343541',
    padding: 20,
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  icon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    color: '#bbb',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#3c3c4c',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: '100%',
  },
  cardText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  navBar: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 30,
  },
  navDot: {
    width: 30,
    height: 3,
    borderRadius: 1,
    backgroundColor: '#555',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#00b894',
  },
  button: {
    backgroundColor: '#00b894',
    width: 300,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FirstScreen;
