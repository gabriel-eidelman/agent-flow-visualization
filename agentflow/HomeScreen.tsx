import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './App';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;


export default function HomeScreen(props: Props) {
  console.log("HomeScreen props:", props);
  const { navigation } = props;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <Text style={styles.title}>Agent Flow</Text>
        <Text style={styles.description}>
          Built with AG2, FastAPI, React Native.
        </Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AgentFlow')}>
          <Text style={styles.buttonText}>🤖 Visualize</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AgentChat')}>
          <Text style={styles.buttonText}>🚀 Launch Curriculum Planning Demo</Text>
        </TouchableOpacity> */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F0F1A',
  },
  container: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F0F1A',
  },
  title: {
    fontFamily: 'Courier New',
    fontSize: 32,
    color: '#00FFF7',
    textShadowColor: '#00FFF7',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontFamily: 'Courier New',
    fontSize: 16,
    color: '#EDEDED',
    lineHeight: 26,
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 0,
  },
  button: {
    backgroundColor: '#1E1E2F',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderWidth: 2,
    borderColor: '#00FFF7',
    shadowColor: '#00FFF7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  buttonText: {
    fontFamily: 'Courier New',
    fontSize: 16,
    color: '#00FFF7',
    textAlign: 'center',
  },
});
