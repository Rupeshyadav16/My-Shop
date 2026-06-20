import SafeScreen from "@/components/SafeScreen";
import { useApi } from "@/lib/api";
import { Ionicons } from "@expo/vector-icons";
import { useState, useRef } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

const QUICK_PROMPTS = [
  "Best products under ₹500?",
  "Compare top rated items",
  "What's on sale today?",
];

const ChatScreen = () => {
  const api = useApi();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hello! I am your My Shop AI Assistant. Ask me anything about products, prices, or recommendations!",
      isUser: false,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const { data } = await api.post("/chat", { message: text });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply,
        isUser: false,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I couldn't process that. Please try again.",
        isUser: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  return (
    <SafeScreen>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* HEADER */}
        <View className="px-6 pb-4 pt-2 items-center">
          <View className="bg-primary/20 rounded-full w-14 h-14 items-center justify-center mb-2">
            <Ionicons name="sparkles" size={26} color="#1DB954" />
          </View>
          <Text className="text-text-primary text-xl font-bold">Smart Shopping Assistant</Text>
          <Text className="text-text-secondary text-xs text-center mt-1 px-6">
            Ask about products, prices, comparisons, or recommendations
          </Text>
        </View>

        {/* QUICK PROMPTS */}
        {messages.length === 1 && (
          <View className="px-6 mb-3 flex-row flex-wrap gap-2">
            {QUICK_PROMPTS.map((prompt) => (
              <TouchableOpacity
                key={prompt}
                className="bg-surface rounded-full px-4 py-2 border border-primary/30"
                onPress={() => sendMessage(prompt)}
              >
                <Text className="text-primary text-xs font-medium">{prompt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* MESSAGES */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 20 }}
          renderItem={({ item }) => (
            <View
              className={`mb-3 max-w-[85%] rounded-2xl px-4 py-3 ${
                item.isUser
                  ? "bg-primary self-end rounded-br-md"
                  : "bg-surface self-start rounded-bl-md"
              }`}
            >
              <Text
                className={item.isUser ? "text-background text-sm" : "text-text-primary text-sm"}
              >
                {item.text}
              </Text>
            </View>
          )}
        />

        {loading && (
          <View className="px-6 pb-2 flex-row items-center">
            <ActivityIndicator size="small" color="#1DB954" />
            <Text className="text-text-secondary text-xs ml-2">Thinking...</Text>
          </View>
        )}

        {/* INPUT BAR */}
        <View className="px-6 pb-6 pt-2 flex-row items-center gap-3">
          <View className="flex-1 bg-surface rounded-full px-5 py-3 flex-row items-center">
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Type to ask something..."
              placeholderTextColor="#666"
              className="flex-1 text-text-primary text-sm"
              onSubmitEditing={() => sendMessage(input)}
            />
          </View>
          <TouchableOpacity
            className="bg-primary rounded-full w-12 h-12 items-center justify-center"
            onPress={() => sendMessage(input)}
            disabled={loading || !input.trim()}
          >
            <Ionicons name="send" size={20} color="#121212" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
};

export default ChatScreen;