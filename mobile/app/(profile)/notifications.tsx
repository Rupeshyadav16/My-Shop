import SafeScreen from "@/components/SafeScreen";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  icon: string;
  type: "order" | "payment" | "system" | "offer";
}

const SAMPLE_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    title: "Order Confirmed",
    message: "Your order #12345 has been confirmed and will be shipped soon",
    timestamp: "2 hours ago",
    icon: "checkmark-circle-outline",
    type: "order",
  },
  {
    id: "2",
    title: "Payment Successful",
    message: "Payment of ₹2,499 received successfully",
    timestamp: "5 hours ago",
    icon: "card-outline",
    type: "payment",
  },
  {
    id: "3",
    title: "Special Offer",
    message: "Get 30% off on electronics this weekend only!",
    timestamp: "1 day ago",
    icon: "gift-outline",
    type: "offer",
  },
  {
    id: "4",
    title: "Delivery Update",
    message: "Your package is out for delivery today",
    timestamp: "1 day ago",
    icon: "cube-outline",
    type: "system",
  },
];

const getIconColor = (type: Notification["type"]) => {
  switch (type) {
    case "order":
      return "#10B981";
    case "payment":
      return "#3B82F6";
    case "offer":
      return "#F59E0B";
    case "system":
      return "#8B5CF6";
    default:
      return "#666";
  }
};

export default function NotificationsScreen() {
  return (
    <SafeScreen>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* HEADER */}
        <View className="px-6 pb-5 border-b border-surface flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
          <Text className="text-text-primary text-2xl font-bold">Notifications</Text>
        </View>

        {/* NOTIFICATIONS LIST */}
        <View className="px-6 pt-6">
          {SAMPLE_NOTIFICATIONS.length > 0 ? (
            SAMPLE_NOTIFICATIONS.map((notification) => (
              <TouchableOpacity
                key={notification.id}
                className="bg-surface rounded-2xl p-4 mb-3 flex-row"
                activeOpacity={0.7}
              >
                <View
                  className="rounded-full w-12 h-12 items-center justify-center mr-4"
                  style={{ backgroundColor: getIconColor(notification.type) + "20" }}
                >
                  <Ionicons
                    name={notification.icon as any}
                    size={24}
                    color={getIconColor(notification.type)}
                  />
                </View>

                <View className="flex-1">
                  <View className="flex-row items-center justify-between mb-1">
                    <Text className="text-text-primary font-bold text-base">
                      {notification.title}
                    </Text>
                    <Text className="text-text-secondary text-xs">{notification.timestamp}</Text>
                  </View>
                  <Text className="text-text-secondary text-sm" numberOfLines={2}>
                    {notification.message}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View className="items-center justify-center py-20">
              <Ionicons name="notifications-off-outline" size={64} color="#666" />
              <Text className="text-text-secondary text-center text-base mt-4">
                No notifications yet
              </Text>
            </View>
          )}
        </View>

        {/* CLEAR ALL BUTTON */}
        {SAMPLE_NOTIFICATIONS.length > 0 && (
          <TouchableOpacity className="mx-6 mt-8 py-3 items-center border-t border-surface pt-6">
            <Text className="text-blue-500 font-semibold">Clear All Notifications</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeScreen>
  );
}
