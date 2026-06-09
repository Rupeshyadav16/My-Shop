import { useApi } from "@/lib/api";
import { Product } from "@/types";
import { useQuery } from "@tanstack/react-query";

const useProducts = () => {
  const api = useApi();

  const result = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      try {
        const { data } = await api.get<Product[]>("/products");
        return data;
      } catch (error: any) {
        console.error("Failed to fetch products:", error.message);
        console.error("API URL:", api.defaults.baseURL);
        console.error("Error details:", error.response?.data || error.response?.status);
        throw error;
      }
    },
    retry: 2,
  });

  return result;
};

export default useProducts;
