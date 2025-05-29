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
        const title = rawLesson.match(/<title>(.*?)<\/title>/)?.[1] || "No title";
        const objectives = rawLesson.match(/<learning_objectives>(.*?)<\/learning_objectives>/s)?.[1] || "No objectives";
        const script = rawLesson.match(/<script>(.*?)<\/script>/s)?.[1] || "No script";
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
