import { View, ActivityIndicator } from "react-native";

export default function ScreenLoader() {
  return (
    <View className="flex-1 items-center justify-center pt-[200px]">
      <ActivityIndicator size="large" color="#333" />
    </View>
  );
}
