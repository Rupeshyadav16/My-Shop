import { router } from "expo-router";
import { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

const SLIDES = [
  {
    icon: "flash" as const,
    title: "My Shop",
    subtitle: "Your Favorite Shopping Destination",
    description: "Discover thousands of products at the best prices, delivered to your doorstep.",
  },
  {
    icon: "card" as const,
    title: "Checkout Made Simple",
    subtitle: "Fast & Secure Payments",
    description: "Pay easily with UPI, Cards, NetBanking or Cash on Delivery.",
  },
  {
    icon: "cube" as const,
    title: "Track Your Orders",
    subtitle: "Stay Updated, Every Step",
    description: "Get real-time updates from order confirmation to delivery.",
  },
];

export default function OnboardingScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = async () => {
    if (activeIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1 });
    } else {
      await AsyncStorage.setItem("hasSeenOnboarding", "true");
      router.replace("/(tabs)");
    }
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem("hasSeenOnboarding", "true");
    router.replace("/(tabs)");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#121212" }}>
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => i.toString()}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setActiveIndex(index);
        }}
        renderItem={({ item }) => (
          <View style={{ width, flex: 1, justifyContent: "center", alignItems: "center", padding: 32 }}>
            <View
              style={{
                width: 96,
                height: 96,
                borderRadius: 28,
                backgroundColor: "#1DB95433",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 32,
              }}
            >
              <Ionicons name={item.icon} size={48} color="#1DB954" />
            </View>
            <Text style={{ color: "#fff", fontSize: 28, fontWeight: "bold", textAlign: "center" }}>
              {item.title}
            </Text>
            <Text style={{ color: "#1DB954", fontSize: 14, fontWeight: "600", marginTop: 8, textAlign: "center" }}>
              {item.subtitle}
            </Text>
            <Text style={{ color: "#999", fontSize: 14, textAlign: "center", marginTop: 16, lineHeight: 22 }}>
              {item.description}
            </Text>
          </View>
        )}
      />

      {/* DOTS */}
      <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 24 }}>
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={{
              width: i === activeIndex ? 24 : 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: i === activeIndex ? "#1DB954" : "#333",
              marginHorizontal: 4,
            }}
          />
        ))}
      </View>

      {/* BUTTONS */}
      <View style={{ paddingHorizontal: 24, paddingBottom: 40 }}>
        <TouchableOpacity
          style={{
            backgroundColor: "#1DB954",
            borderRadius: 16,
            paddingVertical: 16,
            alignItems: "center",
          }}
          onPress={handleNext}
        >
          <Text style={{ color: "#121212", fontWeight: "bold", fontSize: 16 }}>
            {activeIndex === SLIDES.length - 1 ? "GET STARTED" : "NEXT"}
          </Text>
        </TouchableOpacity>

        {activeIndex < SLIDES.length - 1 && (
          <TouchableOpacity style={{ alignItems: "center", marginTop: 16 }} onPress={handleSkip}>
            <Text style={{ color: "#888", fontSize: 14 }}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}