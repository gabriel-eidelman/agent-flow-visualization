#!/bin/bash

set -e

PROJECT_NAME="agentflow"

echo "Creating new React Native app with TypeScript..."
# avoids issues with the latest version of react-native-cli
npm uninstall -g react-native-cli @react-native-community/cli
npx @react-native-community/cli@latest init $PROJECT_NAME

cd $PROJECT_NAME
# removes nested git
rm -rf .git
rm -rf .gitignore
cd ios
pod install
cd ..

echo "Creating AgentChat.tsx file..."

touch AgentChat.tsx
cat <<EOF > AgentChat.tsx
// AgentChat.tsx
import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';

interface AgentResponse {
  title: string;
  objectives: string;
  script: string;
}

type AgentChatProps = {
    // add here
};

const AgentChat: React.FC<AgentChatProps> = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<AgentResponse | null>(null);

    const handleTap = async () => {
        setLoading(true);
        const response = await fetch("http://127.0.0.1:8000/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ input: "some user data" })
        });
        const data = await response.json();
        const rawLesson = data.response;
        const title = rawLesson.match(/<title>(.*?)<\\/title>/)?.[1] || "No title";
        const objectives = rawLesson.match(/<learning_objectives>(.*?)<\\/learning_objectives>/s)?.[1] || "No objectives";
        const script = rawLesson.match(/<script>(.*?)<\\/script>/s)?.[1] || "No script";
        setResult({ title, objectives, script });
        setLoading(false);
    };
      
    useEffect(() => {
        handleTap();
    }, []);
    
    return (
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.card}>
            {(result && !loading) && (
              <>
                <Text style={styles.heading}>📚 Title</Text>
                <Text style={styles.content}>{result.title}</Text>

                <Text style={styles.heading}>🎯 Objectives</Text>
                <Text style={styles.content}>{result.objectives}</Text>

                <Text style={styles.heading}>🎤 Script</Text>
                <Text style={styles.content}>{result.script}</Text>
              </>
            )}
            {loading && <ActivityIndicator />}
          </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0F0F1A',
    padding: 24,
    paddingTop: 80,
    minHeight: '100%',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: '#1E1E2F',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#00FFF7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: '#00FFF7',
  },
  heading: {
    fontFamily: 'Courier New',
    fontSize: 16,
    color: '#00FFF7',
    marginTop: 12,
    marginBottom: 6,
    textShadowColor: '#00FFF7',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  content: {
    fontFamily: 'Courier New',
    fontSize: 14,
    color: '#EDEDED',
    lineHeight: 22,
    backgroundColor: '#292941',
    padding: 10,
    borderRadius: 8,
  },
  loader: {
    marginTop: 20,
  },
});

export default AgentChat;
EOF

cat <<EOF > App.tsx
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import AgentChat from './AgentChat';

export default function App() {
  const [showResult, setShowResult] = useState(false);

  if (showResult) {
    return <AgentChat />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <Text style={styles.title}>🤖 Demo App</Text>
        <Text style={styles.description}>
          This is a demo app showing how to integrate AG2 with React Native and FastAPI.
          Feel free to customize it however you like!
        </Text>

        <TouchableOpacity style={styles.button} onPress={() => setShowResult(true)}>
          <Text style={styles.buttonText}>🚀 Launch Curriculum Planning Demo</Text>
        </TouchableOpacity>
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
    padding: 24,
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
    paddingHorizontal: 8,
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
EOF



