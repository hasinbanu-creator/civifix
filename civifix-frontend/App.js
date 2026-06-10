import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
import { AuthProvider } from "./src/context/AuthContext";
import RootNavigator from "./src/navigation/RootNavigator";
import { getAndroidTopPadding } from "./src/utils/layout";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1, paddingTop: getAndroidTopPadding() }}>
      <SafeAreaProvider>
        <StatusBar backgroundColor="transparent" translucent barStyle="dark-content" />
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}