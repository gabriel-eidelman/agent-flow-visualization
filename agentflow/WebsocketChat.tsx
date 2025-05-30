import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,

} from 'react-native';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  id: string;
  sender: string;
  text: string;
}

const WS_URL = "wss://b905-2607-f6d0-ced-5b2-4014-664e-e97d-3305.ngrok-free.app"; // Or your real IP if testing on physical device

export default function WebSocketChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    console.log("URL: ", WS_URL);
    ws.current = new WebSocket(WS_URL);

    ws.current.onmessage = (event) => {
      const raw = event.data;
      try {
        // const parsed = JSON.parse(raw);
        // delete parsed.uuid;
        const parsed = JSON.parse(raw);
        const formatted = JSON.stringify(parsed, null, 2);
        const content = parsed.content
        const msgText = content?.content || "No Content";
        const sender = content?.sender || "No Sender"
        const recipient = content?.recipient || "No Recipient"
        const type = parsed.type || "No Type"

        const uuid = parsed.content?.uuid || uuidv4();
        if (parsed.content?.content?.trim()) {
          setMessages((prev) => [
            ...prev,
            { id: uuid, sender: sender, text: msgText },
          ]);
        }
      } catch (e) {
        // fallback to raw string
      }
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
      console.log(input.trim())
      ws.current.send(input.trim());
      setInput('');
    }
  };

  return (
  <SafeAreaView style={styles.safeArea}>
    <StatusBar barStyle="light-content" />
    <View style={styles.container}>
      <FlatList
        style={styles.chatContainer}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.messageBubble}>
            <Text>{item.sender}</Text>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
      />

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Send a message..."
          placeholderTextColor="#666"
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
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
    backgroundColor: '#0F0F1A',
  },
  chatContainer: {
    flex: 1,
    marginBottom: 16,
  },
  messageBubble: {
    backgroundColor: '#1E1E2F',
    padding: 12,
    marginVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#00FFF7',
    shadowColor: '#00FFF7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  messageText: {
    color: '#EDEDED',
    fontFamily: 'Courier New',
    fontSize: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#222',
  },
  input: {
    flex: 1,
    borderColor: '#00FFF7',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#EDEDED',
    fontFamily: 'Courier New',
    fontSize: 16,
    marginRight: 8,
    backgroundColor: '#1E1E2F',
  },
  sendButton: {
    backgroundColor: '#1E1E2F',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderWidth: 2,
    borderColor: '#00FFF7',
    shadowColor: '#00FFF7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  sendButtonText: {
    color: '#00FFF7',
    fontFamily: 'Courier New',
    fontSize: 16,
    textAlign: 'center',
  },
});
