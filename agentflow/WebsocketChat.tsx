import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  SafeAreaView,
  StyleSheet
} from 'react-native';

interface Message {
  id: string;
  text: string;
}

const WS_URL = "ws://de21-2607-f6d0-ced-5bb-182b-8e0c-8127-1c50.ngrok-free.app"; // Or your real IP if testing on physical device

export default function WebSocketChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    console.log("URL: ", WS_URL);
    ws.current = new WebSocket(WS_URL);

    ws.current.onmessage = (event) => {
      const raw = event.data;
      let formatted = raw;
      try {
        const parsed = JSON.parse(raw);
        delete parsed.uuid;
        formatted = JSON.stringify(parsed, null, 2);
      } catch (e) {
        // fallback to raw string
      }

      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), text: formatted },
      ]);
    };

    ws.current.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  const sendMessage = () => {
    if (ws.current && input.trim()) {
      ws.current.send(input.trim());
      setInput('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text style={styles.message}>{item.text}</Text>}
      />

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Send a message..."
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginTop: 16 },
  input: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 4,
  },
  message: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginVertical: 4,
    fontFamily: 'monospace',
  },
});
