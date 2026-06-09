import { useAddresses } from "@/hooks/useAddressess";
import { Address } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { View, Text, Modal, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";

interface AddressSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onProceed: (address: Address, paymentMethod: "online" | "cod") => void;
  isProcessing: boolean;
}

const AddressSelectionModal = ({
  visible,
  onClose,
  onProceed,
  isProcessing,
}: AddressSelectionModalProps) => {
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cod">("online");
  const { addresses, isLoading: addressesLoading } = useAddresses();

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-background rounded-t-3xl" style={{ height: "75%" }}>
          {/* Modal Header */}
          <View className="flex-row items-center justify-between p-6 border-b border-surface">
            <Text className="text-text-primary text-2xl font-bold">Select Address</Text>
            <TouchableOpacity onPress={onClose} className="bg-surface rounded-full p-2">
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* ADDRESSES LIST */}
          <ScrollView className="flex-1 p-6">
            {addressesLoading ? (
              <View className="py-8">
                <ActivityIndicator size="large" color="#00D9FF" />
              </View>
            ) : (
              <View className="gap-4">
                {addresses?.map((address: Address) => (
                  <TouchableOpacity
                    key={address._id}
                    className={`bg-surface rounded-3xl p-6 border-2 ${
                      selectedAddress?._id === address._id
                        ? "border-primary"
                        : "border-background-lighter"
                    }`}
                    activeOpacity={0.7}
                    onPress={() => setSelectedAddress(address)}
                  >
                    <View className="flex-row items-start justify-between">
                      <View className="flex-1">
                        <View className="flex-row items-center mb-3">
                          <Text className="text-primary font-bold text-lg mr-2">
                            {address.label}
                          </Text>
                          {address.isDefault && (
                            <View className="bg-primary/20 rounded-full px-3 py-1">
                              <Text className="text-primary text-sm font-semibold">Default</Text>
                            </View>
                          )}
                        </View>
                        <Text className="text-text-primary font-semibold text-lg mb-2">
                          {address.fullName}
                        </Text>
                        <Text className="text-text-secondary text-base leading-6 mb-1">
                          {address.streetAddress}
                        </Text>
                        <Text className="text-text-secondary text-base mb-2">
                          {address.city}, {address.state} {address.zipCode}
                        </Text>
                        <Text className="text-text-secondary text-base">{address.phoneNumber}</Text>
                      </View>
                      {selectedAddress?._id === address._id && (
                        <View className="bg-primary rounded-full p-2 ml-3">
                          <Ionicons name="checkmark" size={24} color="#121212" />
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Payment Method Selection */}
            <View className="mt-4 mb-2">
              <Text className="text-text-primary font-bold text-lg mb-3">Payment Method</Text>
              <View className="gap-3">

                {/* Online Payment */}
                <TouchableOpacity
                  className={`bg-surface rounded-2xl p-4 border-2 flex-row items-center ${
                    paymentMethod === "online" ? "border-primary" : "border-background-lighter"
                  }`}
                  onPress={() => setPaymentMethod("online")}
                >
                  <View className={`w-6 h-6 rounded-full border-2 mr-3 items-center justify-center ${
                    paymentMethod === "online" ? "border-primary" : "border-surface"
                  }`}>
                    {paymentMethod === "online" && (
                      <View className="w-3 h-3 rounded-full bg-primary" />
                    )}
                  </View>
                  <Ionicons name="card-outline" size={22} color="#1DB954" />
                  <View className="ml-3">
                    <Text className="text-text-primary font-bold">Online Payment</Text>
                    <Text className="text-text-secondary text-sm">Pay via Razorpay (UPI, Card, NetBanking)</Text>
                  </View>
                </TouchableOpacity>

                {/* Cash on Delivery */}
                <TouchableOpacity
                  className={`bg-surface rounded-2xl p-4 border-2 flex-row items-center ${
                    paymentMethod === "cod" ? "border-primary" : "border-background-lighter"
                  }`}
                  onPress={() => setPaymentMethod("cod")}
                >
                  <View className={`w-6 h-6 rounded-full border-2 mr-3 items-center justify-center ${
                    paymentMethod === "cod" ? "border-primary" : "border-surface"
                  }`}>
                    {paymentMethod === "cod" && (
                      <View className="w-3 h-3 rounded-full bg-primary" />
                    )}
                  </View>
                  <Ionicons name="cash-outline" size={22} color="#1DB954" />
                  <View className="ml-3">
                    <Text className="text-text-primary font-bold">Cash on Delivery</Text>
                    <Text className="text-text-secondary text-sm">Pay when your order arrives</Text>
                  </View>
                </TouchableOpacity>

              </View>
            </View>
          </ScrollView>

          <View className="p-6 border-t border-surface">
            <TouchableOpacity
              className="bg-primary rounded-2xl py-5"
              activeOpacity={0.9}
              onPress={() => {
                if (selectedAddress) onProceed(selectedAddress, paymentMethod);
              }}
              disabled={!selectedAddress || isProcessing}
            >
              <View className="flex-row items-center justify-center">
                {isProcessing ? (
                  <ActivityIndicator size="small" color="#121212" />
                ) : (
                  <>
                    <Text className="text-background font-bold text-lg mr-2">
                      {paymentMethod === "cod" ? "Place Order (COD)" : "Continue to Payment"}
                    </Text>
                    <Ionicons name="arrow-forward" size={20} color="#121212" />
                  </>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddressSelectionModal;