import React from "react";
import { View, type ViewProps } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import Title from "../../svg/title";
import Headphones from "../../svg/headphones";

export type Props = {
  children?: ViewProps["children"];
  hasImage?: boolean;
  isDark?: boolean;
};

export default function HeroContents({ children }: Props) {
  const { top } = useSafeAreaInsets();

  return (
    <SafeAreaView>
      <View className="relative flex flex-col items-center justify-center">
        {children ? (
          <View style={{ height: 250 - top }} className="relative z-10 w-full">
            {children}
          </View>
        ) : (
          <>
            <View className="-ml-[90px] mt-8 w-[90px]">
              <Headphones />
            </View>
            <View className="-ml-36">
              <Title />
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
