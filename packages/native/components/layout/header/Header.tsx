import { View, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { useAuthContext } from "../../auth/context";
import UserMenu from "../hero/UserMenu";
import { useHeaderContext } from "./HeaderContext";
import { useEffect } from "react";

export default function Header() {
  const { user } = useAuthContext();
  const {
    headerState: { backNavigation, hasImage, title, scrollPosition },
  } = useHeaderContext();
  const { top } = useSafeAreaInsets();

  const scrollY = useSharedValue(0);

  useEffect(() => {
    scrollY.value = withTiming(scrollPosition, { duration: 0 });
  }, [scrollPosition]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: `rgba(0,0,0,${Math.min(scrollY.value / 100, 1)})`,
    };
  });

  const titleStyle = useAnimatedStyle(() => {
    return {
      color: `rgba(255,255,255,${Math.min(scrollY.value / 100, 1)})`,
    };
  });

  return (
    <Animated.View className="absolute z-20 h-32 w-full" style={animatedStyle}>
      {hasImage && (
        <View style={{ height: top }} className="absolute left-0 top-0 w-full bg-black/60" />
      )}

      <View
        className="absolute left-0 flex w-full flex-row items-center px-2"
        style={{
          top: top + 8,
          justifyContent: title || backNavigation ? "space-between" : "flex-end",
        }}>
        {backNavigation && (
          <TouchableOpacity
            onPress={() => {
              backNavigation();
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            className="relative rounded-full">
            {hasImage && <View className="absolute left-1 top-1 h-7 w-7 rounded-full bg-black" />}
            <Ionicons name="chevron-back-circle" size={32} color="white" />
          </TouchableOpacity>
        )}

        {title && <Animated.Text style={[titleStyle, { fontSize: 16 }]}>{title}</Animated.Text>}
        {user && <UserMenu image={true} />}
      </View>
    </Animated.View>
  );
}
