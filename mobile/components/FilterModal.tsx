import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Switch,
} from "react-native";

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterOptions) => void;
}

export interface FilterOptions {
  priceRange: [number, number];
  rating: number;
  inStock: boolean;
}

const PRICE_RANGES = [
  { label: "All Prices", value: [0, 10000] },
  { label: "$0 - $50", value: [0, 50] },
  { label: "$50 - $100", value: [50, 100] },
  { label: "$100 - $200", value: [100, 200] },
  { label: "$200+", value: [200, 10000] },
];

const RATING_FILTERS = [1, 2, 3, 4, 5];

export default function FilterModal({ visible, onClose, onApplyFilters }: FilterModalProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);

  const handleApply = () => {
    onApplyFilters({
      priceRange,
      rating: minRating,
      inStock: inStockOnly,
    });
    onClose();
  };

  const handleReset = () => {
    setPriceRange([0, 10000]);
    setMinRating(0);
    setInStockOnly(false);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View className="flex-1 bg-background pt-12">
        {/* HEADER */}
        <View className="px-6 pb-4 border-b border-surface flex-row items-center justify-between">
          <Text className="text-text-primary text-2xl font-bold">Filters</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* PRICE FILTER */}
          <View className="px-6 pt-6">
            <Text className="text-text-primary text-lg font-bold mb-4">Price Range</Text>
            {PRICE_RANGES.map((range) => {
              const isSelected =
                priceRange[0] === range.value[0] && priceRange[1] === range.value[1];
              return (
                <TouchableOpacity
                  key={range.label}
                  className={`rounded-2xl p-4 mb-2 flex-row items-center ${
                    isSelected ? "bg-primary/20" : "bg-surface"
                  }`}
                  onPress={() => setPriceRange(range.value as [number, number])}
                >
                  <View
                    className={`w-5 h-5 rounded-full border-2 mr-3 items-center justify-center ${
                      isSelected ? "border-primary bg-primary" : "border-text-secondary"
                    }`}
                  >
                    {isSelected && <Ionicons name="checkmark" size={12} color="#121212" />}
                  </View>
                  <Text className="text-text-primary font-semibold">{range.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* RATING FILTER */}
          <View className="px-6 pt-6">
            <Text className="text-text-primary text-lg font-bold mb-4">Minimum Rating</Text>
            {RATING_FILTERS.map((rating) => (
              <TouchableOpacity
                key={rating}
                className={`rounded-2xl p-4 mb-2 flex-row items-center ${
                  minRating === rating ? "bg-primary/20" : "bg-surface"
                }`}
                onPress={() => setMinRating(rating)}
              >
                <View
                  className={`w-5 h-5 rounded-full border-2 mr-3 items-center justify-center ${
                    minRating === rating ? "border-primary bg-primary" : "border-text-secondary"
                  }`}
                >
                  {minRating === rating && <Ionicons name="checkmark" size={12} color="#121212" />}
                </View>
                <View className="flex-row items-center flex-1">
                  {[...Array(5)].map((_, i) => (
                    <Ionicons
                      key={i}
                      name={i < rating ? "star" : "star-outline"}
                      size={16}
                      color={i < rating ? "#FFC107" : "#666"}
                    />
                  ))}
                  <Text className="text-text-primary font-semibold ml-2">{rating}+</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* IN STOCK FILTER */}
          <View className="px-6 pt-6">
            <View className="bg-surface rounded-2xl p-4 flex-row items-center justify-between">
              <Text className="text-text-primary font-semibold">In Stock Only</Text>
              <Switch
                value={inStockOnly}
                onValueChange={setInStockOnly}
                thumbColor="#FFFFFF"
                trackColor={{ false: "#2A2A2A", true: "#1DB954" }}
              />
            </View>
          </View>
        </ScrollView>

        {/* FOOTER BUTTONS */}
        <View className="absolute bottom-0 left-0 right-0 flex-row gap-3 p-6 bg-background border-t border-surface">
          <TouchableOpacity
            className="flex-1 rounded-2xl py-4 items-center border border-text-secondary"
            onPress={handleReset}
          >
            <Text className="text-text-secondary font-bold">Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 rounded-2xl py-4 items-center bg-primary"
            onPress={handleApply}
          >
            <Text className="text-black font-bold">Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
