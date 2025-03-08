import React from "react";
import { View, ImageBackground, type ViewProps, TouchableOpacity } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import Title from "../svg/title";
import Headphones from "../svg/headphones";
import UserMenu from "./UserMenu";
import { useAuthContext } from "../auth/context";

// export type Props = ViewProps
export type Props = {
  image?: string | undefined;
  children?: ViewProps["children"];
};

export default function Hero({ children, image }: Props) {
  const { user } = useAuthContext();
  const router = useRouter();

  const imageToUse = image ? image : "https://www.peppermintmusic.xyz/aurora.png";

  const { top } = useSafeAreaInsets();

  return (
    <ImageBackground className="h-[250px] w-full" resizeMode="cover" source={{ uri: imageToUse }}>
      <SafeAreaView>
        <View className="relative flex flex-col items-center justify-center">
          {router.canGoBack() && (
            <View className="absolute left-2 top-0">
              <TouchableOpacity onPress={() => router.back()} className="rounded-full p-0 relative">
                {image && <View className="rounded-full w-7 h-7 bg-black absolute top-1 left-1" />}
                <Ionicons name="chevron-back-circle" size={32} color="white" />
              </TouchableOpacity>
            </View>
          )}

          {children ? (
            <View style={{ height: 250 - top }} className="relative w-full">
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

          {user && (
            <View className="absolute right-2 top-0">
              <UserMenu image={Boolean(image)} />
            </View>
          )}
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
