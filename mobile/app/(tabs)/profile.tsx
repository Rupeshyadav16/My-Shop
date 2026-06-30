import SafeScreen from "@/components/SafeScreen";
import { useAuth, useUser } from "@clerk/clerk-expo";

import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const ADMIN_EMAIL = "ry728309@gmail.com";

const MENU_ITEMS = [
  { id: 1, icon: "person-outline", title: "Edit Profile", color: "#3B82F6", action: "/edit-profile" },
  { id: 2, icon: "list-outline", title: "Orders", color: "#10B981", action: "/orders" },
  { id: 3, icon: "location-outline", title: "Addresses", color: "#F59E0B", action: "/addresses" },
  { id: 4, icon: "heart-outline", title: "Wishlist", color: "#EF4444", action: "/wishlist" },
] as const;

const ProfileScreen = () => {
  const { signOut, isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();

  const isAdmin = user?.emailAddresses?.[0]?.emailAddress === ADMIN_EMAIL;

  const handleMenuPress = (action: (typeof MENU_ITEMS)[number]["action"]) => {
    router.push(action);
  };

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return (
      <SafeScreen>
        <View className="flex-1 items-center justify-center px-8">
          <View className="bg-primary/20 rounded-full w-24 h-24 items-center justify-center mb-6">
            <Ionicons name="person-outline" size={48} color="#1DB954" />
          </View>
          <Text className="text-text-primary text-2xl font-bold text-center mb-2">
            Welcome to My Shop
          </Text>
          <Text className="text-text-secondary text-center mb-8 leading-6">
            Login or create an account to track orders, save addresses, and checkout faster.
          </Text>

          <TouchableOpacity
            className="bg-primary rounded-2xl py-4 px-8 w-full items-center"
            activeOpacity={0.9}
            onPress={() => router.push("/(auth)")}
          >
            <Text className="text-background font-bold text-base">Login / Sign Up</Text>
          </TouchableOpacity>

          <Text className="text-text-secondary text-xs text-center mt-6">
            You can browse and add products to cart as a guest, but an account is required to place an order.
          </Text>

          <TouchableOpacity
            className="mt-8 flex-row items-center"
            onPress={() => router.push("/about")}
          >
            <Ionicons name="information-circle-outline" size={18} color="#666" />
            <Text className="text-text-secondary text-sm ml-2">About Us</Text>
          </TouchableOpacity>
        </View>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="px-6 pb-8">
          <View className="bg-surface rounded-3xl p-6">
            <View className="flex-row items-center">
              <View className="relative">
                <Image
                  source={user?.imageUrl}
                  style={{ width: 80, height: 80, borderRadius: 40 }}
                  transition={200}
                />
                <View className="absolute -bottom-1 -right-1 bg-primary rounded-full size-7 items-center justify-center border-2 border-surface">
                  <Ionicons name="checkmark" size={16} color="#121212" />
                </View>
              </View>

              <View className="flex-1 ml-4">
                <Text className="text-text-primary text-2xl font-bold mb-1">
                  {user?.firstName} {user?.lastName}
                </Text>
                <Text className="text-text-secondary text-sm">
                  {user?.emailAddresses?.[0]?.emailAddress || "No email"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="flex-row flex-wrap gap-2 mx-6 mb-3">
          {MENU_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              className="bg-surface rounded-2xl p-6 items-center justify-center"
              style={{ width: "48%" }}
              activeOpacity={0.7}
              onPress={() => handleMenuPress(item.action)}
            >
              <View
                className="rounded-full w-16 h-16 items-center justify-center mb-4"
                style={{ backgroundColor: item.color + "20" }}
              >
                <Ionicons name={item.icon} size={28} color={item.color} />
              </View>
              <Text className="text-text-primary font-bold text-base">{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {isAdmin && (
          <View className="mb-3 mx-6 bg-surface rounded-2xl p-4 border-2" style={{ borderColor: "#F59E0B" }}>
            <TouchableOpacity
              className="flex-row items-center justify-between"
              onPress={() => router.push("/admin")}
              activeOpacity={0.7}
            >
              <View className="flex-row items-center flex-1">
                <Ionicons name="shield-checkmark-outline" size={22} color="#F59E0B" />
                <View className="ml-3 flex-1">
                  <Text className="font-bold" style={{ color: "#F59E0B" }}>Admin Portal</Text>
                  <Text className="text-text-secondary text-xs mt-1">Manage products & orders</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#F59E0B" />
            </TouchableOpacity>
          </View>
        )}

        <View className="mb-3 mx-6 bg-surface rounded-2xl p-4">
          <TouchableOpacity
            className="flex-row items-center justify-between py-2"
            activeOpacity={0.7}
            onPress={() => router.push("/notifications")}
          >
            <View className="flex-row items-center">
              <Ionicons name="notifications-outline" size={22} color="#FFFFFF" />
              <Text className="text-text-primary font-semibold ml-3">Notifications</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <View className="mb-3 mx-6 bg-surface rounded-2xl p-4">
          <TouchableOpacity
            className="flex-row items-center justify-between py-2"
            activeOpacity={0.7}
            onPress={() => router.push("/privacy-security")}
          >
            <View className="flex-row items-center">
              <Ionicons name="shield-checkmark-outline" size={22} color="#FFFFFF" />
              <Text className="text-text-primary font-semibold ml-3">Privacy & Security</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <View className="mb-3 mx-6 bg-surface rounded-2xl p-4">
          <TouchableOpacity
            className="flex-row items-center justify-between py-2"
            activeOpacity={0.7}
            onPress={() => router.push("/about")}
          >
            <View className="flex-row items-center">
              <Ionicons name="information-circle-outline" size={22} color="#FFFFFF" />
              <Text className="text-text-primary font-semibold ml-3">About Us</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="mx-6 mb-3 bg-surface rounded-2xl py-5 flex-row items-center justify-center border-2 border-red-500/20"
          activeOpacity={0.8}
          onPress={() => signOut()}
        >
          <Ionicons name="log-out-outline" size={22} color="#EF4444" />
          <Text className="text-red-500 font-bold text-base ml-2">Sign Out</Text>
        </TouchableOpacity>

        <Text className="mx-6 mb-3 text-center text-text-secondary text-xs">Version 1.0.0</Text>
      </ScrollView>
    </SafeScreen>
  );
};

export default ProfileScreen;