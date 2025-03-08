import { View, ImageBackground, type ViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Title from "../svg/title";
import Headphones from "../svg/headphones";
import UserMenu from "./UserMenu";
import { useAuthContext } from "../auth/context";

// export type Props = ViewProps
export type Props = {
  image?: string | undefined;
  children?: ViewProps["children"];
};

export default function Hero({
  // children,
  image = "https://www.peppermintmusic.xyz/aurora.png",
}: Props) {
  const source = { uri: image };
  const { user } = useAuthContext();

  return (
    <ImageBackground className="h-[250px] w-full" resizeMode="cover" source={source}>
      <SafeAreaView>
        <View className="relative flex flex-col items-center justify-center">
          <View className="-ml-[90px] mt-8 w-[90px]">
            <Headphones />
          </View>
          <View className="-ml-36">
            <Title />
          </View>

          {user && (
            <View className="absolute right-2 top-0">
              <UserMenu />
            </View>
          )}
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
