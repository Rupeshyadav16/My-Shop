import SafeScreen from "@/components/SafeScreen";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  Image,
} from "react-native";
import { useApi } from "@/lib/api";
import * as ImagePicker from "expo-image-picker";

const ADMIN_EMAIL = "ry728309@gmail.com";

export default function AdminProductsScreen() {
  const { user } = useUser();
  const api = useApi();
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "Electronics",
  });
  const [images, setImages] = useState<string[]>([]);

  const isAdmin = user?.emailAddresses?.[0]?.emailAddress === ADMIN_EMAIL;

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await api.get("/admin/products");
      return data;
    },
    enabled: isAdmin,
  });

  const updateProductMutation = useMutation({
    mutationFn: async (updatedProduct) => {
      const form = new FormData();
      form.append("name", updatedProduct.name);
      form.append("description", updatedProduct.description);
      form.append("price", parseFloat(updatedProduct.price).toString());
      form.append("stock", parseInt(updatedProduct.stock).toString());
      form.append("category", updatedProduct.category);

      // Add new images if selected
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
      }

      const { data } = await api.patch(`/admin/products/${updatedProduct._id}`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data;
    },
    onSuccess: () => {
      closeModal();
      queryClient.invalidateQueries({ queryKey: ["products"] });
      Alert.alert("Success", "Product updated successfully!");
    },
    onError: (error: any) => {
      Alert.alert("Error", error.response?.data?.message || "Failed to update product");
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (productId) => {
      await api.delete(`/admin/products/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      Alert.alert("Success", "Product deleted successfully!");
    },
    onError: (error: any) => {
      Alert.alert("Error", error.response?.data?.message || "Failed to delete product");
    },
  });

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      stock: "",
      category: "Electronics",
    });
    setImages([]);
  };

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

  const handleSave = () => {
    if (!formData.name || !formData.price || !formData.stock) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    updateProductMutation.mutate({
      _id: editingProduct._id,
      ...formData,
    });
  };

  const handleDelete = (productId) => {
    Alert.alert("Delete Product", "Are you sure you want to delete this product?", [
      { text: "Cancel", onPress: () => {} },
      {
        text: "Delete",
        onPress: () => deleteProductMutation.mutate(productId),
        style: "destructive",
      },
    ]);
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
        <View>
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text className="text-text-primary text-2xl font-bold flex-1 ml-4">Products</Text>
        <TouchableOpacity
          className="bg-primary rounded-full p-3"
          onPress={() => router.push("/admin/add-product")}
        >
          <Ionicons name="add" size={24} color="#121212" />
        </TouchableOpacity>
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
            {products.length === 0 ? (
              <View className="items-center justify-center py-20">
                <Ionicons name="cube-outline" size={48} color="#666" />
                <Text className="text-text-primary font-semibold mt-4">No products yet</Text>
              </View>
            ) : (
              products.map((product) => (
                <View key={product._id} className="bg-surface rounded-2xl p-4 mb-4">
                  {product.images[0] && (
                    <Image
                      source={{ uri: product.images[0] }}
                      className="w-full h-32 rounded-lg mb-3"
                    />
                  )}
                  <Text className="text-text-primary font-bold text-base mb-1">{product.name}</Text>
                  <View className="flex-row justify-between items-center mb-3">
                    <Text className="text-primary font-bold text-lg">₹{product.price}</Text>
                    <Text className="text-text-secondary text-sm">Stock: {product.stock}</Text>
                  </View>

                  <View className="flex-row gap-2">
                    <TouchableOpacity
                      className="flex-1 bg-primary/20 rounded-lg py-2 items-center"
                      onPress={() => openEditModal(product)}
                    >
                      <Ionicons name="pencil" size={18} color="#3B82F6" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="flex-1 bg-red-500/20 rounded-lg py-2 items-center"
                      onPress={() => handleDelete(product._id)}
                    >
                      <Ionicons name="trash" size={18} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      )}

      {/* EDIT MODAL */}
      <Modal visible={showModal} animationType="slide" transparent={false}>
        <SafeScreen>
          {/* HEADER */}
          <View className="px-6 pb-4 border-b border-surface flex-row items-center justify-between pt-6">
            <TouchableOpacity onPress={closeModal}>
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
            <Text className="text-text-primary text-xl font-bold">Edit Product</Text>
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
                <Text className="text-text-primary font-semibold mb-2">Product Name</Text>
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
                <Text className="text-text-primary font-semibold mb-2">Description</Text>
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
                <Text className="text-text-primary font-semibold mb-2">Price (₹)</Text>
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
                <Text className="text-text-primary font-semibold mb-2">Stock Quantity</Text>
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
              <View className="mb-6">
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
                <Text className="text-text-primary font-semibold mb-3">Update Product Images</Text>
                
                {/* Current Image */}
                {editingProduct?.images?.[0] && images.length === 0 && (
                  <View className="mb-4">
                    <Text className="text-text-secondary text-xs mb-2">Current Image</Text>
                    <Image
                      source={{ uri: editingProduct.images[0] }}
                      className="w-full h-40 rounded-lg"
                    />
                  </View>
                )}

                {/* New Image Preview Grid */}
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
                      {images.length}/3 new images selected
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* SAVE BUTTON */}
              <TouchableOpacity
                className="bg-primary rounded-2xl py-4 items-center mb-4"
                onPress={handleSave}
                disabled={updateProductMutation.isPending}
              >
                {updateProductMutation.isPending ? (
                  <ActivityIndicator color="#121212" />
                ) : (
                  <Text className="text-black font-bold text-base">Save Changes</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeScreen>
      </Modal>
    </SafeScreen>
  );
}
