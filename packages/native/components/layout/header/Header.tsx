import { View, TouchableOpacity, Animated } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { useAuthContext } from "../../auth/context";
import UserMenu from "../hero/UserMenu";
import { useHeaderContext } from "./HeaderContext";
import { useEffect } from "react";

const scrollY = new Animated.Value(0);

export default function Header() {
  const { user } = useAuthContext();
  const {
    headerState: { backNavigation, hasImage, title, scrollPosition },
  } = useHeaderContext();
  const { top } = useSafeAreaInsets();

  const backgroundColor = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: ["rgba(0,0,0,0)", "rgba(0,0,0,1)"],
    extrapolate: "clamp",
  });

  const titleColor = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: ["rgba(255,255,255,0)", "rgba(255,255,255,1)"],
    extrapolate: "clamp",
  });

  useEffect(() => {
    scrollY.setValue(scrollPosition);
  }, [scrollPosition]);

  return (
    <Animated.View className="absolute z-20 h-32 w-full" style={{ backgroundColor }}>
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

        {title && (
          <Animated.Text style={{ color: titleColor, fontSize: 16 }}>{title}</Animated.Text>
        )}
        {user && <UserMenu image={true} />}
      </View>
    </Animated.View>
  );
}
