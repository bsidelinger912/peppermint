import { ComponentProps } from "react";
import { Ionicons } from "@expo/vector-icons";

type IconProps = {
  name: ComponentProps<typeof Ionicons>["name"];
  style?: ComponentProps<typeof Ionicons>["style"];
  color?: ComponentProps<typeof Ionicons>["color"];
  size?: number;
};

export default function Icon({ name, size = 24, color = "#334155", style = {} }: IconProps) {
  return <Ionicons name={name} size={size} color={color} style={style} />;
}
