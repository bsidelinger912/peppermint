import { Pressable, Text } from "react-native";

export type ButtonProps = {
  title: string;
  onPress: () => void;
  // loading: boolean;
  // disabled: boolean;
  // size: "small" | "medium" | "large";
};

export default function PeppermintButton({ title, onPress }: ButtonProps) {
  return (
    <Pressable className="p-4 border rounded-lg bg-slate-700" onPress={onPress}>
      <Text className="text-white">{title}</Text>
    </Pressable>
  );
}
