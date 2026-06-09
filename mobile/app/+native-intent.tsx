import { useEffect } from "react";
import { useRouter } from "expo-router";
import * as Linking from "expo-linking";

export default function NativeIntent() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/(tabs)");
  }, []);

  return null;
}