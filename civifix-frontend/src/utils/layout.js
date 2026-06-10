import { Platform, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const getAndroidTopPadding = () => {
  return Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0;
};

export const useSafeAreaStyles = () => {
  const insets = useSafeAreaInsets();
  return {
    paddingTop: getAndroidTopPadding() + (insets.top || 0),
    paddingBottom: insets.bottom || 0,
    paddingLeft: insets.left || 0,
    paddingRight: insets.right || 0,
  };
};

export default {
  getAndroidTopPadding,
  useSafeAreaStyles,
};
