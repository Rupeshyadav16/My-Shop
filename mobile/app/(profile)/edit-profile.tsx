import SafeScreen from "@/components/SafeScreen";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function EditProfileScreen() {
  const { user } = useUser();

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(user?.emailAddresses?.[0]?.emailAddress || "");
  const [phone, setPhone] = useState(user?.phoneNumbers?.[0]?.phoneNumber || "");

  const handleSave = async () => {
    try {
      if (user) {
        await user.update({
          firstName: firstName || undefined,
          lastName: lastName || undefined,
        });
      }
      router.back();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

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
          <Text className="text-text-primary text-2xl font-bold">Edit Profile</Text>
        </View>

        {/* FORM */}
        <View className="px-6 pt-6">
          {/* First Name */}
          <View className="mb-6">
            <Text className="text-text-primary font-semibold mb-2">First Name</Text>
            <TextInput
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Enter first name"
              placeholderTextColor="#666"
              className="bg-surface rounded-2xl px-5 py-4 text-base text-text-primary"
            />
          </View>

          {/* Last Name */}
          <View className="mb-6">
            <Text className="text-text-primary font-semibold mb-2">Last Name</Text>
            <TextInput
              value={lastName}
              onChangeText={setLastName}
              placeholder="Enter last name"
              placeholderTextColor="#666"
              className="bg-surface rounded-2xl px-5 py-4 text-base text-text-primary"
            />
          </View>

          {/* Email */}
          <View className="mb-6">
            <Text className="text-text-primary font-semibold mb-2">Email</Text>
            <TextInput
              value={email}
              editable={false}
              className="bg-surface/50 rounded-2xl px-5 py-4 text-base text-text-secondary"
            />
            <Text className="text-text-secondary text-xs mt-2">Email cannot be changed</Text>
          </View>

          {/* Phone */}
          <View className="mb-6">
            <Text className="text-text-primary font-semibold mb-2">Phone</Text>
            <TextInput
              value={phone}
              editable={false}
              className="bg-surface/50 rounded-2xl px-5 py-4 text-base text-text-secondary"
            />
          </View>

          {/* SAVE BUTTON */}
          <TouchableOpacity
            className="bg-primary rounded-2xl py-4 items-center mt-8"
            onPress={handleSave}
          >
            <Text className="text-black font-bold text-base">Save Changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeScreen>
  );
}
