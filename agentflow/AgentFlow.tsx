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
import {MessageType, Message} from './DataModels'
import generateGraphData from './GenerateGraphData';
import AgentFlowGraph from './AgentFlowGraph';
import ViewToggle from './ViewToggle'

function get_message_type(type: string): MessageType {
  if (type == "text") return MessageType.text
  else if (type == "tool_response") return MessageType.tool
  else if (type == 'termination') return MessageType.termination
  return MessageType.unknown
}

const WS_URL = "wss://4ca2-2607-f6d0-ced-5b2-4014-664e-e97d-3305.ngrok-free.app"; // Or your real IP if testing on physical device

export default function WebSocketChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const graphData = generateGraphData(messages);

  const [input, setInput] = useState('');
  const [displayType, setDisplayType] = useState<'chat' | 'flow'>('flow');

  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    console.log("URL: ", WS_URL);
    ws.current = new WebSocket(WS_URL);
    ws.current.onmessage = (event) => {
      try {
        // Quick pre-check to ignore non-JSON strings (optional but helps avoid noisy logs)
        if (typeof event.data !== 'string' || !event.data.trim().startsWith('{')) {
          // console.warn("Non-JSON message received, skipping:", event.data);
          return;
        }

        const parsed = JSON.parse(event.data);
        const content = parsed.content;
        const msgText = content?.content || "";
        const type = parsed.type || "agent";
        let sender = content?.sender || "sender";
        const recipient = content?.recipient || "agent";

        // Handle tool_response: extract the actual tool
        if (type === "tool_response" && content.tool_responses?.length > 0) {
          const toolResponse = content.tool_responses[0];
          sender = toolResponse.role === "tool" ? "tool function" : sender;
        }

        const uuid = content?.uuid || uuidv4();

        if (msgText.trim()) {
          setMessages((prev) => [
            ...prev,
            {
              id: uuid,
              type: get_message_type(type),
              sender,
              recipient,
              output: msgText,
            },
          ]);
        }
      } catch (e) {
        console.error("Parse error:", e, "\nRaw event data:", event.data);
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
    <View style={{padding: 20}}>
      <ViewToggle displayType={displayType} setDisplayType={setDisplayType} />
    </View>

    <View style={styles.container}>
      {displayType=="flow" ? <AgentFlowGraph nodes={graphData.nodes} edges={graphData.edges}/> : 
            <FlatList
            style={styles.chatContainer}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.messageBubble}>
                  <Text style={styles.senderName}>{item.sender}</Text>
                  <Text style={styles.messageText}>{item.output}</Text>
              </View>
            )}
          />
      }

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
  senderName: {
  color: '#00FFF7', // Neon turquoise
  fontSize: 14,
  fontWeight: 'bold',
  textTransform: 'uppercase',
  fontFamily: 'Courier New',
  textShadowColor: '#00FFF7',
  textShadowOffset: { width: 0, height: 0 },
  textShadowRadius: 6,
  marginBottom: 4,
},
});
