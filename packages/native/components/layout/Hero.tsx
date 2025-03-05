import { View, SafeAreaView, ImageBackground, type ViewProps } from "react-native";
import Title from "../svg/title";
import Headphones from "../svg/headphones";

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

  return (
    <ImageBackground className="h-[250px] w-full" resizeMode="cover" source={source}>
      <SafeAreaView
        style={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }}
      >
        <View className="w-[90px] -ml-[90px] mt-8">
          <Headphones />
        </View>
        <View className="-ml-36">
          <Title />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
