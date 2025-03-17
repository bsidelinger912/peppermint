import React, { useEffect } from "react";
import { View, ImageBackground, type ViewProps, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

import HeroContents from "./HeroContents";
import { useHeaderContext } from "../header/HeaderContext";

const AnimatedImageBackground = Animated.createAnimatedComponent(ImageBackground);

export type Props = {
  image?: string | undefined;
  title?: string;
  children?: ViewProps["children"];
};

export default function Hero({ children, image, title }: Props) {
  const showSkeletonLoader = image === "";
  const imageToUse = image === undefined ? "https://www.peppermintmusic.xyz/aurora.png" : image;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  const router = useRouter();
  const { setHeaderState } = useHeaderContext();

  useFocusEffect(
    React.useCallback(() => {
      if (router.canGoBack() && title) {
        setHeaderState((curr) => ({
          ...curr,
          title,
          hasImage: image !== undefined,
          backNavigation: router.back,
        }));
      } else {
        setHeaderState((curr) => ({
          ...curr,
          title,
          hasImage: image !== undefined,
          backNavigation: undefined,
        }));
      }
    }, [title])
  );

  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [imageToUse]);

  if (showSkeletonLoader) {
    return (
      <View className="h-[250px] w-full bg-gray-200">
        <HeroContents hasImage={false}>{children}</HeroContents>
      </View>
    );
  }

  return (
    <View className="h-[250px] w-full">
      {image === undefined ? (
        <ImageBackground
          className="absolute h-full w-full"
          resizeMode="cover"
          source={{ uri: imageToUse }}
        />
      ) : (
        <AnimatedImageBackground
          className="absolute h-full w-full"
          resizeMode="cover"
          source={{ uri: imageToUse }}
          style={{ opacity: fadeAnim }}
        />
      )}

      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.8)"]}
        locations={[0.5, 1]}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        }}
      />

      <HeroContents hasImage={Boolean(image)}>{children}</HeroContents>
    </View>
  );
}
