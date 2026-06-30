import SafeScreen from "@/components/SafeScreen";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Linking, ScrollView, Text, TouchableOpacity, View } from "react-native";

const FOUNDER_NAME = "Rupesh Yadav";
const FOUNDER_EMAIL = "ry728309@gmail.com";
const FOUNDER_PHONE = "+91 9820426454";

export default function AboutScreen() {
  return (
    <SafeScreen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        {/* HEADER */}
        <View className="px-6 pb-5 border-b border-surface flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
          <Text className="text-text-primary text-2xl font-bold">About Us</Text>
        </View>

        {/* APP INFO */}
        <View className="px-6 pt-8 items-center">
          <View className="bg-primary/20 rounded-3xl w-20 h-20 items-center justify-center mb-4">
            <Ionicons name="storefront" size={36} color="#1DB954" />
          </View>
          <Text className="text-text-primary text-2xl font-bold">My Shop</Text>
          <Text className="text-text-secondary text-sm mt-1">Version 1.0.0</Text>
        </View>

        {/* FOUNDER CARD */}
        <View className="px-6 mt-8">
          <Text className="text-text-secondary text-xs uppercase font-bold mb-3 tracking-wide">
            Founder
          </Text>
          <View className="bg-surface rounded-3xl p-6">
            <Text className="text-text-primary text-xl font-bold">{FOUNDER_NAME}</Text>
            <Text className="text-text-secondary text-sm mt-1">Founder & Developer</Text>

            <View className="mt-5 gap-3">
              <TouchableOpacity
                className="flex-row items-center"
                onPress={() => Linking.openURL(`mailto:${FOUNDER_EMAIL}`)}
              >
                <View className="bg-primary/20 rounded-full w-10 h-10 items-center justify-center">
                  <Ionicons name="mail" size={18} color="#1DB954" />
                </View>
                <Text className="text-text-primary ml-3">{FOUNDER_EMAIL}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row items-center"
                onPress={() => Linking.openURL(`tel:${FOUNDER_PHONE}`)}
              >
                <View className="bg-primary/20 rounded-full w-10 h-10 items-center justify-center">
                  <Ionicons name="call" size={18} color="#1DB954" />
                </View>
                <Text className="text-text-primary ml-3">{FOUNDER_PHONE}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* DESCRIPTION */}
        <View className="px-6 mt-8">
          <Text className="text-text-secondary text-xs uppercase font-bold mb-3 tracking-wide">
            About This App
          </Text>
          <View className="bg-surface rounded-3xl p-6">
            <Text className="text-text-secondary leading-6">
              My Shop is your one-stop destination for quality products at the best prices.
              We are committed to providing a fast, secure, and enjoyable shopping experience
              with reliable delivery and excellent customer support.
            </Text>
          </View>
        </View>

        {/* QUICK LINKS / FOOTER */}
        <View className="px-6 mt-8">
          <Text className="text-text-secondary text-xs uppercase font-bold mb-3 tracking-wide">
            Quick Links
          </Text>
          <View className="bg-surface rounded-3xl overflow-hidden">
            <TouchableOpacity
              className="flex-row items-center justify-between p-4 border-b border-background-lighter"
              onPress={() => router.push("/privacy-security")}
            >
              <Text className="text-text-primary">Privacy & Security</Text>
              <Ionicons name="chevron-forward" size={18} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center justify-between p-4"
              onPress={() => Linking.openURL(`mailto:${FOUNDER_EMAIL}`)}
            >
              <Text className="text-text-primary">Contact Support</Text>
              <Ionicons name="chevron-forward" size={18} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        <Text className="text-center text-text-secondary text-xs mt-10">
          © 2026 My Shop. All rights reserved.{"\n"}Made with ❤️ by {FOUNDER_NAME}
        </Text>
      </ScrollView>
    </SafeScreen>
  );
}