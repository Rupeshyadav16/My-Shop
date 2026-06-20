import ProductsGrid from "@/components/ProductsGrid";
import SafeScreen from "@/components/SafeScreen";
import FilterModal, { FilterOptions } from "@/components/FilterModal";
import useProducts from "@/hooks/useProducts";

import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image } from "react-native";
import { router } from "expo-router";
import { Image as ExpoImage } from "expo-image";

const CATEGORIES = [
  { name: "All", icon: "grid-outline" as const },
  { name: "Electronics", image: require("@/assets/images/electronics.png") },
  { name: "Fashion", image: require("@/assets/images/fashion.png") },
  { name: "Sports", image: require("@/assets/images/sports.png") },
  { name: "Books", image: require("@/assets/images/books.png") },
];

function getFlashSaleEndTime() {
  // Flash sale ends at midnight every day
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return midnight;
}

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({ hours: "00", minutes: "00", seconds: "00" });

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ hours: "00", minutes: "00", seconds: "00" });
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}

const ShopScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, 10000],
    rating: 0,
    inStock: false,
  });

  const { data: products, isLoading, isError } = useProducts();
  const countdown = useCountdown(getFlashSaleEndTime());

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let filtered = products;

    if (selectedCategory !== "All") {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    filtered = filtered.filter(
      (product) => product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );

    if (filters.rating > 0) {
      filtered = filtered.filter((product) => product.averageRating >= filters.rating);
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [products, selectedCategory, searchQuery, filters]);

  // Top rated products for "Featured" horizontal section
  const featuredProducts = useMemo(() => {
    if (!products) return [];
    return [...products].sort((a, b) => b.averageRating - a.averageRating).slice(0, 8);
  }, [products]);

  return (
    <SafeScreen>
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApplyFilters={(newFilters) => setFilters(newFilters)}
      />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View className="px-6 pb-4 pt-6">
          <View className="flex-row items-center justify-between mb-6">
            <View>
              <Text className="text-text-primary text-3xl font-bold tracking-tight">My Shop</Text>
              <Text className="text-text-secondary text-sm mt-1">Browse all products</Text>
            </View>

            <TouchableOpacity
              className="bg-surface/50 p-3 rounded-full"
              activeOpacity={0.7}
              onPress={() => setFilterModalVisible(true)}
            >
              <Ionicons name="options-outline" size={22} color={"#fff"} />
            </TouchableOpacity>
          </View>

          {/* SEARCH BAR */}
          <View className="bg-surface flex-row items-center px-5 py-4 rounded-2xl">
            <Ionicons color={"#666"} size={22} name="search" />
            <TextInput
              placeholder="Search for products"
              placeholderTextColor={"#666"}
              className="flex-1 ml-3 text-base text-text-primary"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* FLASH SALE BANNER */}
        <View className="px-6 mb-6">
          <View
            className="bg-primary/15 rounded-3xl p-5 border border-primary/30"
            style={{ overflow: "hidden" }}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <View className="bg-primary self-start px-3 py-1 rounded-full mb-2">
                  <Text className="text-background text-xs font-bold">⚡ FLASH SALE LIVE</Text>
                </View>
                <Text className="text-text-primary text-xl font-bold">Mid-Season Sale</Text>
                <Text className="text-text-secondary text-sm mt-1">
                  Ends in {countdown.hours}h {countdown.minutes}m {countdown.seconds}s
                </Text>
              </View>
              <View className="bg-primary rounded-2xl w-14 h-14 items-center justify-center">
                <Ionicons name="flash" size={28} color="#121212" />
              </View>
            </View>
          </View>
        </View>

        {/* CATEGORY FILTER */}
        <View className="mb-6">
          <Text className="text-text-primary text-lg font-bold px-6 mb-3">Top Categories</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          >
            {CATEGORIES.map((category) => {
              const isSelected = selectedCategory === category.name;
              return (
                <TouchableOpacity
                  key={category.name}
                  onPress={() => setSelectedCategory(category.name)}
                  className="mr-4 items-center"
                  style={{ width: 72 }}
                >
                  <View
                    className={`rounded-2xl size-16 overflow-hidden items-center justify-center mb-1 ${isSelected ? "bg-primary" : "bg-surface"}`}
                  >
                    {category.icon ? (
                      <Ionicons
                        name={category.icon}
                        size={30}
                        color={isSelected ? "#121212" : "#fff"}
                      />
                    ) : (
                      <Image source={category.image} className="size-10" resizeMode="contain" />
                    )}
                  </View>
                  <Text
                    className="text-xs text-center"
                    style={{ color: isSelected ? "#1DB954" : "#888" }}
                    numberOfLines={1}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* FEATURED PRODUCTS - HORIZONTAL */}
        {!isLoading && featuredProducts.length > 0 && (
          <View className="mb-6">
            <View className="flex-row items-center justify-between px-6 mb-3">
              <Text className="text-text-primary text-lg font-bold">Featured Hot Picks</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20 }}
            >
              {featuredProducts.map((product) => (
                <TouchableOpacity
                  key={product._id}
                  className="bg-surface rounded-3xl mr-3 overflow-hidden"
                  style={{ width: 150 }}
                  activeOpacity={0.8}
                  onPress={() => router.push(`/product/${product._id}`)}
                >
                  <View className="relative">
                    <ExpoImage
                      source={product.images[0]}
                      style={{ width: "100%", height: 120 }}
                      contentFit="cover"
                    />
                    {product.averageRating >= 4.5 && (
                      <View className="absolute top-2 left-2 bg-primary rounded-full px-2 py-0.5">
                        <Text className="text-background text-[10px] font-bold">TOP RATED</Text>
                      </View>
                    )}
                  </View>
                  <View className="p-3">
                    <Text
                      className="text-text-primary text-sm font-semibold"
                      numberOfLines={1}
                    >
                      {product.name}
                    </Text>
                    <View className="flex-row items-center mt-1">
                      <Ionicons name="star" size={12} color="#FFD700" />
                      <Text className="text-text-secondary text-xs ml-1">
                        {product.averageRating.toFixed(1)}
                      </Text>
                    </View>
                    <Text className="text-primary font-bold text-base mt-1">
                      ₹{product.price.toFixed(0)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View className="px-6 mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-text-primary text-lg font-bold">All Products</Text>
            <Text className="text-text-secondary text-sm">{filteredProducts.length} items</Text>
          </View>

          {/* PRODUCTS GRID */}
          <ProductsGrid products={filteredProducts} isLoading={isLoading} isError={isError} />
        </View>
      </ScrollView>
    </SafeScreen>
  );
};

export default ShopScreen;