import React, { FC, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Svg, { Rect } from "react-native-svg";

const AnimatedRect = Animated.createAnimatedComponent(Rect);

export const AnimatedBars: FC = () => {
  const heights = [
    useSharedValue(10), // First bar starts at 10px
    useSharedValue(15), // Second bar starts at 15px
    useSharedValue(18), // Third bar starts at 18px
  ];

  useEffect(() => {
    heights.forEach((height, index) => {
      height.value = withRepeat(
        withSequence(
          withTiming(20, { duration: 500 + index * 100 }), // Max height now 20px
          withTiming(10, { duration: 500 + index * 100 })
        ),
        -1,
        true
      );
    });
  }, []);

  const getAnimatedProps = (height: Animated.SharedValue<number>) => {
    return useAnimatedProps(() => ({
      height: height.value,
      y: (20 - height.value) / 2, // Updated to 20px container
    }));
  };

  return (
    <View style={styles.container}>
      <Svg width={20} height={20}>
        {heights.map((height, index) => (
          <AnimatedRect
            key={index}
            x={index * 6} // Adjusted spacing for smaller container
            width={4} // Made bars slightly thinner
            fill="#334155"
            animatedProps={getAnimatedProps(height)}
          />
        ))}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});
