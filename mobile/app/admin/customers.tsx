import SafeScreen from "@/components/SafeScreen";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View, ActivityIndicator, Image } from "react-native";
import { useApi } from "@/lib/api";

const ADMIN_EMAIL = "ry728309@gmail.com";

export default function AdminCustomersScreen() {
  const { user } = useUser();
  const api = useApi();

  const isAdmin = user?.emailAddresses?.[0]?.emailAddress === ADMIN_EMAIL;

  const { data: customersData, isLoading } = useQuery({
    queryKey: ["admin-customers"],
    queryFn: async () => {
      const { data } = await api.get("/admin/customers");
      return data.customers;
    },
    enabled: isAdmin,
  });

  if (!isAdmin) {
    return (
      <SafeScreen>
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="lock-closed-outline" size={64} color="#EF4444" />
          <Text className="text-text-primary text-xl font-bold mt-4 text-center">
            Admin Access Only
          </Text>
        </View>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen>
      {/* HEADER */}
      <View className="px-6 pb-4 border-b border-surface flex-row items-center pt-6">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text className="text-text-primary text-2xl font-bold">Customers</Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#00D9FF" />
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View className="px-6 pt-6">
            {!customersData || customersData.length === 0 ? (
              <View className="items-center justify-center py-20">
                <Ionicons name="people-outline" size={48} color="#666" />
                <Text className="text-text-primary font-semibold mt-4">No customers yet</Text>
              </View>
            ) : (
              customersData.map((customer) => (
                <View key={customer._id} className="bg-surface rounded-2xl p-4 mb-4 flex-row items-center">
                  <View className="bg-primary/20 rounded-full w-12 h-12 items-center justify-center mr-4">
                    <Ionicons name="person" size={24} color="#3B82F6" />
                  </View>

                  <View className="flex-1">
                    <Text className="text-text-primary font-bold">{customer.name}</Text>
                    <Text className="text-text-secondary text-sm">{customer.email}</Text>
                    <Text className="text-text-secondary text-xs mt-1">
                      Joined:{" "}
                      {new Date(customer.createdAt).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      )}
    </SafeScreen>
  );
}
