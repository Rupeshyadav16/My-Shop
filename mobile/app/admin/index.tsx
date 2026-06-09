import SafeScreen from "@/components/SafeScreen";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { useApi } from "@/lib/api";

const ADMIN_EMAIL = "ry728309@gmail.com";

export default function AdminDashboard() {
  const { user } = useUser();
  const api = useApi();

  const isAdmin = user?.emailAddresses?.[0]?.emailAddress === ADMIN_EMAIL;

  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const { data } = await api.get("/admin/stats");
      return data;
    },
    enabled: isAdmin,
  });

  if (!isAdmin) {
    return (
      <SafeScreen>
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="lock-closed-outline" size={64} color="#EF4444" />
          <Text className="text-text-primary text-xl font-bold mt-4 text-center">Admin Access Only</Text>
          <Text className="text-text-secondary text-center mt-2">
            You don't have admin permissions to access this panel.
          </Text>
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
        {/* HEADER */}
        <View className="px-6 pt-6 pb-8">
          <Text className="text-text-primary text-3xl font-bold tracking-tight">Admin Dashboard</Text>
          <Text className="text-text-secondary text-sm mt-1">Manage your store</Text>
        </View>

        {/* STATS */}
        {isLoading ? (
          <View className="items-center justify-center py-20">
            <ActivityIndicator size="large" color="#00D9FF" />
          </View>
        ) : (
          <View className="px-6 mb-8">
            <View className="flex-row flex-wrap gap-3">
              {/* Total Products */}
              <View className="bg-surface rounded-2xl p-6 flex-1">
                <View className="flex-row items-center mb-2">
                  <Ionicons name="cube-outline" size={24} color="#3B82F6" />
                  <Text className="text-text-secondary text-sm ml-2">Products</Text>
                </View>
                <Text className="text-text-primary text-3xl font-bold">
                  {stats?.totalProducts || 0}
                </Text>
              </View>

              {/* Total Orders */}
              <View className="bg-surface rounded-2xl p-6 flex-1">
                <View className="flex-row items-center mb-2">
                  <Ionicons name="cart-outline" size={24} color="#10B981" />
                  <Text className="text-text-secondary text-sm ml-2">Orders</Text>
                </View>
                <Text className="text-text-primary text-3xl font-bold">
                  {stats?.totalOrders || 0}
                </Text>
              </View>
            </View>

            <View className="flex-row flex-wrap gap-3 mt-3">
              {/* Total Revenue */}
              <View className="bg-surface rounded-2xl p-6 flex-1">
                <View className="flex-row items-center mb-2">
                  <Ionicons name="wallet-outline" size={24} color="#F59E0B" />
                  <Text className="text-text-secondary text-sm ml-2">Revenue</Text>
                </View>
                <Text className="text-primary text-2xl font-bold">
                  ₹{stats?.totalRevenue?.toFixed(0) || 0}
                </Text>
              </View>

              {/* Total Customers */}
              <View className="bg-surface rounded-2xl p-6 flex-1">
                <View className="flex-row items-center mb-2">
                  <Ionicons name="people-outline" size={24} color="#8B5CF6" />
                  <Text className="text-text-secondary text-sm ml-2">Customers</Text>
                </View>
                <Text className="text-text-primary text-3xl font-bold">
                  {stats?.totalCustomers || 0}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* MENU */}
        <View className="px-6">
          <Text className="text-text-primary text-lg font-bold mb-4">Management</Text>

          {/* Products Management */}
          <TouchableOpacity
            className="bg-surface rounded-2xl p-4 mb-3 flex-row items-center justify-between"
            onPress={() => router.push("/admin/products")}
          >
            <View className="flex-row items-center flex-1">
              <View className="bg-blue-500/20 rounded-full w-12 h-12 items-center justify-center mr-4">
                <Ionicons name="cube-outline" size={24} color="#3B82F6" />
              </View>
              <View>
                <Text className="text-text-primary font-bold text-base">Products</Text>
                <Text className="text-text-secondary text-sm">Add, edit, delete products</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          {/* Orders Management */}
          <TouchableOpacity
            className="bg-surface rounded-2xl p-4 mb-3 flex-row items-center justify-between"
            onPress={() => router.push("/admin/orders")}
          >
            <View className="flex-row items-center flex-1">
              <View className="bg-green-500/20 rounded-full w-12 h-12 items-center justify-center mr-4">
                <Ionicons name="cart-outline" size={24} color="#10B981" />
              </View>
              <View>
                <Text className="text-text-primary font-bold text-base">Orders</Text>
                <Text className="text-text-secondary text-sm">Manage order status</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          {/* Customers Management */}
          <TouchableOpacity
            className="bg-surface rounded-2xl p-4 mb-3 flex-row items-center justify-between"
            onPress={() => router.push("/admin/customers")}
          >
            <View className="flex-row items-center flex-1">
              <View className="bg-purple-500/20 rounded-full w-12 h-12 items-center justify-center mr-4">
                <Ionicons name="people-outline" size={24} color="#8B5CF6" />
              </View>
              <View>
                <Text className="text-text-primary font-bold text-base">Customers</Text>
                <Text className="text-text-secondary text-sm">View all customers</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeScreen>
  );
}
