import SafeScreen from "@/components/SafeScreen";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View, ActivityIndicator, Alert, Modal } from "react-native";
import { useApi } from "@/lib/api";
import { useState } from "react";

const ADMIN_EMAIL = "ry728309@gmail.com";

const ORDER_STATUSES = [
  { id: "pending", label: "Pending", color: "#EF4444", icon: "time-outline" },
  { id: "confirmed", label: "Confirmed", color: "#F59E0B", icon: "checkmark-outline" },
  { id: "packed", label: "Packed", color: "#3B82F6", icon: "cube-outline" },
  { id: "shipped", label: "Shipped", color: "#8B5CF6", icon: "rocket-outline" },
  { id: "delivered", label: "Delivered", color: "#10B981", icon: "checkmark-circle-outline" },
  { id: "cancelled", label: "Cancelled", color: "#6B7280", icon: "close-circle-outline" },
];

const ORDER_STATUS_COLORS = {
  pending: "#EF4444",
  confirmed: "#F59E0B",
  packed: "#3B82F6",
  shipped: "#8B5CF6",
  delivered: "#10B981",
  cancelled: "#6B7280",
};

// Define valid next statuses for workflow
const NEXT_STATUSES = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["packed", "cancelled"],
  packed: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

export default function AdminOrdersScreen() {
  const { user } = useUser();
  const api = useApi();
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);

  const isAdmin = user?.emailAddresses?.[0]?.emailAddress === ADMIN_EMAIL;

  // React Query to fetch admin orders
  const { data: ordersData, isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data } = await api.get("/admin/orders");
      return data.orders;
    },
    enabled: isAdmin,
  });

  // Mutation to update status
  const updateStatusMutation = useMutation({
    mutationFn: async (payload: { orderId: string; status: string }) => {
      const { data } = await api.patch(`/admin/orders/${payload.orderId}/status`, {
        status: payload.status,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      setShowStatusModal(false);
      setSelectedOrder(null);
      Alert.alert("Success", "Order status updated!");
    },
    onError: (error: any) => {
      Alert.alert("Error", error.response?.data?.message || "Failed to update order");
    },
  });

  const handleStatusChange = (newStatus: string) => {
    if (!selectedOrder?._id) return;
    updateStatusMutation.mutate({
      orderId: selectedOrder._id,
      status: newStatus,
    });
  };

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
        <Text className="text-text-primary text-2xl font-bold">Orders</Text>
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
            {!ordersData || ordersData.length === 0 ? (
              <View className="items-center justify-center py-20">
                <Ionicons name="cart-outline" size={48} color="#666" />
                <Text className="text-text-primary font-semibold mt-4">No orders yet</Text>
              </View>
            ) : (
              ordersData.map((order: any) => (
                <View key={order._id} className="bg-surface rounded-2xl p-4 mb-4">
                  {/* Order Header */}
                  <View className="flex-row justify-between items-center mb-3">
                    <View>
                      <Text className="text-text-secondary text-xs">Order #{order._id.slice(-6)}</Text>
                      <Text className="text-text-secondary text-xs mt-1">
                        {new Date(order.createdAt).toLocaleDateString('en-IN')}
                      </Text>
                    </View>
                    <TouchableOpacity
                      className="px-3 py-1 rounded-full flex-row items-center gap-1"
                      style={{ backgroundColor: ORDER_STATUS_COLORS[order.status as keyof typeof ORDER_STATUS_COLORS] + "30" }}
                      onPress={() => {
                        setSelectedOrder(order);
                        setShowStatusModal(true);
                      }}
                    >
                      <Text
                        className="text-xs font-semibold"
                        style={{ color: ORDER_STATUS_COLORS[order.status as keyof typeof ORDER_STATUS_COLORS] }}
                      >
                        {order.status.toUpperCase()}
                      </Text>
                      <Ionicons
                        name="chevron-down"
                        size={12}
                        color={ORDER_STATUS_COLORS[order.status as keyof typeof ORDER_STATUS_COLORS]}
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Customer Info */}
                  <View className="mb-3 bg-background-lighter rounded-lg p-3">
                    <Text className="text-text-primary font-bold">{order.user?.name || "Unknown"}</Text>
                    <Text className="text-text-secondary text-xs mt-1">{order.user?.email}</Text>
                    {order.shippingAddress?.phoneNumber && (
                      <View className="flex-row items-center mt-2 gap-2">
                        <Ionicons name="call-outline" size={12} color="#00D9FF" />
                        <Text className="text-text-secondary text-xs">{order.shippingAddress.phoneNumber}</Text>
                      </View>
                    )}
                  </View>

                  {/* Order Summary */}
                  <View className="flex-row gap-4 mb-3 bg-background-lighter rounded-lg p-3">
                    <View>
                      <Text className="text-text-secondary text-xs">Items</Text>
                      <Text className="text-text-primary font-bold text-lg">{order.orderItems?.length || 0}</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-text-secondary text-xs">Total Amount</Text>
                      <Text className="text-primary font-bold text-lg">₹{order.totalAmount || order.totalPrice}</Text>
                    </View>
                    {order.paymentResult?.status && (
                      <View>
                        <Text className="text-text-secondary text-xs">Payment</Text>
                        <Text className="text-text-primary font-bold text-xs capitalize">{order.paymentResult.status}</Text>
                      </View>
                    )}
                  </View>

                  {/* Order Items */}
                  <View className="border-t border-background-lighter pt-3 mb-3">
                    {order.orderItems?.slice(0, 2).map((item: any, idx: number) => (
                      <View key={idx} className="flex-row justify-between mb-2">
                        <Text className="text-text-secondary text-sm flex-1">
                          {item.name || item.product?.name || "Product"}
                        </Text>
                        <Text className="text-text-primary font-semibold text-sm">
                          ×{item.quantity} ₹{(item.price * item.quantity)}
                        </Text>
                      </View>
                    ))}
                    {order.orderItems?.length > 2 && (
                      <Text className="text-text-secondary text-xs mt-2">+{order.orderItems.length - 2} more items</Text>
                    )}
                  </View>

                  {/* Quick Action Buttons */}
                  <View className="flex-row gap-2">
                    <TouchableOpacity
                      className="flex-1 bg-primary/20 rounded-lg py-2 items-center"
                      onPress={() => {
                        setSelectedOrder(order);
                        setShowStatusModal(true);
                      }}
                    >
                      <Ionicons name="checkmark-circle-outline" size={16} color="#00D9FF" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="flex-1 bg-blue-500/20 rounded-lg py-2 items-center"
                      onPress={() => {
                        Alert.alert("Shipping Address", 
                          `${order.shippingAddress?.fullName}\n${order.shippingAddress?.streetAddress}\n${order.shippingAddress?.city}, ${order.shippingAddress?.state} ${order.shippingAddress?.zipCode}`,
                          [{ text: "OK" }]
                        );
                      }}
                    >
                      <Ionicons name="location-outline" size={16} color="#3B82F6" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      )}

      {/* STATUS UPDATE MODAL */}
      <Modal visible={showStatusModal} animationType="slide" transparent={true}>
        <View className="flex-1 bg-black/50">
          <View className="absolute bottom-0 left-0 right-0 bg-background rounded-3xl p-6 pt-8">
            {/* Header */}
            <View className="flex-row justify-between items-center mb-6">
              <View>
                <Text className="text-text-primary text-xl font-bold">Update Order Status</Text>
                <Text className="text-text-secondary text-xs mt-1">Order #{selectedOrder?._id.slice(-6)}</Text>
              </View>
              <TouchableOpacity onPress={() => setShowStatusModal(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Current Status Badge */}
            <View className="mb-6 p-4 rounded-2xl flex-row items-center gap-3" style={{ backgroundColor: ORDER_STATUS_COLORS[selectedOrder?.status as keyof typeof ORDER_STATUS_COLORS] + "20" }}>
              <Ionicons 
                name={ORDER_STATUSES.find(s => s.id === selectedOrder?.status)?.icon as any} 
                size={24} 
                color={ORDER_STATUS_COLORS[selectedOrder?.status as keyof typeof ORDER_STATUS_COLORS]} 
              />
              <View>
                <Text className="text-text-secondary text-xs">Current Status</Text>
                <Text className="text-text-primary font-bold">{selectedOrder?.status.toUpperCase()}</Text>
              </View>
            </View>

            {/* Status Options */}
            <ScrollView showsVerticalScrollIndicator={false} className="max-h-72 mb-4">
              <Text className="text-text-secondary text-xs font-semibold mb-3">NEXT ACTIONS</Text>
              {selectedOrder && NEXT_STATUSES[selectedOrder.status as keyof typeof NEXT_STATUSES]?.length > 0 ? (
                NEXT_STATUSES[selectedOrder.status as keyof typeof NEXT_STATUSES].map((statusId) => {
                  const status = ORDER_STATUSES.find(s => s.id === statusId);
                  if (!status) return null;
                  return (
                    <TouchableOpacity
                      key={status.id}
                      className="bg-surface rounded-2xl p-4 mb-3 flex-row items-center"
                      onPress={() => handleStatusChange(status.id)}
                      disabled={updateStatusMutation.isPending}
                    >
                      <View
                        className="rounded-full w-12 h-12 items-center justify-center mr-4"
                        style={{ backgroundColor: status.color + "20" }}
                      >
                        <Ionicons name={status.icon as any} size={24} color={status.color} />
                      </View>
                      <View className="flex-1">
                        <Text className="text-text-primary font-bold">{status.label}</Text>
                        <Text className="text-text-secondary text-xs mt-1">{status.id}</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={20} color="#00D9FF" />
                    </TouchableOpacity>
                  );
                })
              ) : (
                <View className="items-center py-6">
                  <Ionicons name="checkmark-circle" size={48} color="#10B981" />
                  <Text className="text-text-primary font-semibold mt-3">Final Status</Text>
                  <Text className="text-text-secondary text-sm mt-1">No further actions available</Text>
                </View>
              )}
            </ScrollView>

            {/* Action Buttons */}
            <View className="flex-row gap-3 mt-4">
              <TouchableOpacity
                className="flex-1 rounded-2xl py-3 items-center border border-text-secondary"
                onPress={() => setShowStatusModal(false)}
                disabled={updateStatusMutation.isPending}
              >
                <Text className="text-text-secondary font-semibold">Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeScreen>
  );
}