import React from "react";
import { View, ImageBackground, type ViewProps } from "react-native";
import HeroContents from "./HeroContents";

export type Props = {
  image?: string | undefined;
  children?: ViewProps["children"];
};

export default function Hero({ children, image = "not-passed" }: Props) {
  const showSkeletonLoader = image === undefined;
  const imageToUse = image === "not-passed" ? "https://www.peppermintmusic.xyz/aurora.png" : image;

  if (showSkeletonLoader) {
    return (
      <View className="h-[250px] w-full bg-gray-200">
        <HeroContents hasImage={false}>{children}</HeroContents>
      </View>
    );
  }

  return (
    <ImageBackground className="h-[250px] w-full" resizeMode="cover" source={{ uri: imageToUse }}>
      <HeroContents hasImage={Boolean(image)}>{children}</HeroContents>
    </ImageBackground>
  );
}
