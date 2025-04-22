import React from "react";
import { View, ImageBackground, type ViewProps } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import Animated, { FadeIn } from "react-native-reanimated";

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

  if (showSkeletonLoader) {
    return (
      <View className="h-[250px] w-full bg-gray-200">
        <HeroContents hasImage={false}>{children}</HeroContents>
      </View>
    );
  }

  if (image === "blank") {
    return (
      <View className="h-[250px] w-full bg-gray-400">
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
        <HeroContents hasImage={true}>{children}</HeroContents>
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
          entering={FadeIn.duration(1000)}
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
