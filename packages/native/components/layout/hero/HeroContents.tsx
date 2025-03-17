import React from "react";
import { View, TouchableOpacity, type ViewProps } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import Title from "../../svg/title";
import Headphones from "../../svg/headphones";
import UserMenu from "./UserMenu";
import { useAuthContext } from "../../auth/context";

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
        {/* {router.canGoBack() && (
          <View className="absolute left-2 top-2 z-20">
            <TouchableOpacity
              onPress={() => {
                router.back();
              }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              className="relative rounded-full">
              {hasImage && <View className="absolute left-1 top-1 h-7 w-7 rounded-full bg-black" />}
              <Ionicons name="chevron-back-circle" size={32} color="white" />
            </TouchableOpacity>
          </View>
        )} */}

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

        {/* {user && (
          <View className="absolute right-2 top-2 z-20">
            <UserMenu image={hasImage} />
          </View>
        )} */}
      </View>
    </SafeAreaView>
  );
}
