import SafeScreen from "@/components/SafeScreen";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View, Alert, ActivityIndicator, Image } from "react-native";
import { useApi } from "@/lib/api";
import * as ImagePicker from "expo-image-picker";

const ADMIN_EMAIL = "ry728309@gmail.com";

export default function AddProductScreen() {
  const { user } = useUser();
  const api = useApi();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "Electronics",
  });
  const [images, setImages] = useState<string[]>([]);

  const isAdmin = user?.emailAddresses?.[0]?.emailAddress === ADMIN_EMAIL;

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        if (images.length < 3) {
          setImages([...images, result.assets[0].uri]);
        } else {
          Alert.alert("Limit", "Maximum 3 images allowed");
        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const createProductMutation = useMutation({
    mutationFn: async (productData) => {
      const form = new FormData();
      form.append("name", productData.name);
      form.append("description", productData.description);
      form.append("price", parseFloat(productData.price).toString());
      form.append("stock", parseInt(productData.stock).toString());
      form.append("category", productData.category);

      // Add images
      if (images.length > 0) {
        images.forEach((image, index) => {
          const filename = image.split("/").pop() || `image_${index}.jpg`;
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : `image/jpeg`;

          form.append("images", {
            uri: image,
            name: filename,
            type,
          } as any);
        });
      } else {
        // Use default image if no images selected
        form.append("images", "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500");
      }

      const { data } = await api.post("/admin/products", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      Alert.alert("Success", "Product added successfully!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    },
    onError: (error: any) => {
      Alert.alert("Error", error.response?.data?.message || "Failed to add product");
    },
  });

  const handleSave = () => {
    if (!formData.name || !formData.price || !formData.stock || !formData.description) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    createProductMutation.mutate(formData);
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
      <View className="px-6 pb-4 border-b border-surface flex-row items-center justify-between pt-6">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text className="text-text-primary text-2xl font-bold">Add Product</Text>
        <View className="w-7" />
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="px-6 pt-6">
          {/* Product Name */}
          <View className="mb-6">
            <Text className="text-text-primary font-semibold mb-2">Product Name *</Text>
            <TextInput
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="Enter product name"
              placeholderTextColor="#666"
              className="bg-surface rounded-2xl px-4 py-3 text-text-primary"
            />
          </View>

          {/* Description */}
          <View className="mb-6">
            <Text className="text-text-primary font-semibold mb-2">Description *</Text>
            <TextInput
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              placeholder="Enter product description"
              placeholderTextColor="#666"
              multiline
              numberOfLines={4}
              className="bg-surface rounded-2xl px-4 py-3 text-text-primary"
            />
          </View>

          {/* Price */}
          <View className="mb-6">
            <Text className="text-text-primary font-semibold mb-2">Price (₹) *</Text>
            <TextInput
              value={formData.price}
              onChangeText={(text) => setFormData({ ...formData, price: text })}
              placeholder="Enter price"
              placeholderTextColor="#666"
              keyboardType="decimal-pad"
              className="bg-surface rounded-2xl px-4 py-3 text-text-primary"
            />
          </View>

          {/* Stock */}
          <View className="mb-6">
            <Text className="text-text-primary font-semibold mb-2">Stock Quantity *</Text>
            <TextInput
              value={formData.stock}
              onChangeText={(text) => setFormData({ ...formData, stock: text })}
              placeholder="Enter stock quantity"
              placeholderTextColor="#666"
              keyboardType="number-pad"
              className="bg-surface rounded-2xl px-4 py-3 text-text-primary"
            />
          </View>

          {/* Category */}
          <View className="mb-8">
            <Text className="text-text-primary font-semibold mb-2">Category</Text>
            <TextInput
              value={formData.category}
              onChangeText={(text) => setFormData({ ...formData, category: text })}
              placeholder="Enter category"
              placeholderTextColor="#666"
              className="bg-surface rounded-2xl px-4 py-3 text-text-primary"
            />
          </View>

          {/* Images */}
          <View className="mb-8">
            <Text className="text-text-primary font-semibold mb-3">Product Images (Max 3)</Text>
            
            {/* Image Preview Grid */}
            {images.length > 0 && (
              <View className="flex-row flex-wrap gap-2 mb-4">
                {images.map((image, index) => (
                  <View key={index} className="relative">
                    <Image
                      source={{ uri: image }}
                      className="w-20 h-20 rounded-lg"
                    />
                    <TouchableOpacity
                      className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center"
                      onPress={() => removeImage(index)}
                    >
                      <Ionicons name="close" size={14} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {/* Add Image Button */}
            {images.length < 3 && (
              <TouchableOpacity
                className="border-2 border-dashed border-primary rounded-2xl py-6 items-center"
                onPress={pickImage}
              >
                <Ionicons name="cloud-upload-outline" size={32} color="#00D9FF" />
                <Text className="text-text-primary font-semibold mt-2">Choose Image</Text>
                <Text className="text-text-secondary text-xs mt-1">
                  {images.length}/3 images selected
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* ADD BUTTON */}
          <TouchableOpacity
            className="bg-primary rounded-2xl py-4 items-center mb-4"
            onPress={handleSave}
            disabled={createProductMutation.isPending}
          >
            {createProductMutation.isPending ? (
              <ActivityIndicator color="#121212" />
            ) : (
              <Text className="text-black font-bold text-base">Add Product</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            className="rounded-2xl py-4 items-center border border-text-secondary"
            onPress={() => router.back()}
            disabled={createProductMutation.isPending}
          >
            <Text className="text-text-secondary font-semibold">Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeScreen>
  );
}
