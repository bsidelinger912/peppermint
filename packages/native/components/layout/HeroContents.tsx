import React from "react";
import { View, TouchableOpacity, type ViewProps } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import Title from "../svg/title";
import Headphones from "../svg/headphones";
import UserMenu from "./UserMenu";
import { useAuthContext } from "../auth/context";

export type Props = {
  children?: ViewProps["children"];
  hasImage?: boolean;
  isDark?: boolean;
};

export default function HeroContents({ children, hasImage }: Props) {
  const { user } = useAuthContext();
  const router = useRouter();
  const { top } = useSafeAreaInsets();

  return (
    <SafeAreaView>
      <View className="relative flex flex-col items-center justify-center">
        {router.canGoBack() && (
          <View className="absolute left-2 top-0 z-20">
            <TouchableOpacity
              onPress={() => {
                router.back();
              }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              className="rounded-full relative"
            >
              {hasImage && <View className="rounded-full w-7 h-7 bg-black absolute top-1 left-1" />}
              <Ionicons name="chevron-back-circle" size={32} color="white" />
            </TouchableOpacity>
          </View>
        )}

        {children ? (
          <View style={{ height: 250 - top }} className="relative w-full z-10">
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
          <View className="absolute right-2 top-0 z-20">
            <UserMenu image={hasImage} />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
