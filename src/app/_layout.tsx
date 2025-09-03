import { Slot } from "expo-router";
import "../../global.css";

import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { tokenCache } from "@clerk/clerk-expo/token-cache";

import AntDesign from "@expo/vector-icons/AntDesign";
import { ClerkProvider } from "@clerk/clerk-expo";
import { StatusBar } from "react-native";

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <SafeAreaProvider>
        <StatusBar backgroundColor={"#1f2937"} barStyle={"light-content"} />
        <SafeAreaView className="flex-1">
          <Slot />
        </SafeAreaView>
      </SafeAreaProvider>
    </ClerkProvider>
  );
}
