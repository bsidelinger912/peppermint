import { View, TouchableOpacity, Text } from "react-native";
import { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import OutsidePressHandler from "react-native-outside-press";
import { useAuthContext } from "../auth/context";

export type Props = {
  image?: boolean;
};

export default function UserMenu({ image }: Props) {
  const [open, setOpen] = useState(false);
  const { logout } = useAuthContext();

  return (
    <OutsidePressHandler onOutsidePress={() => setOpen(false)}>
      <View className="relative">
        <TouchableOpacity onPress={() => setOpen(!open)} className="rounded-full p-0">
          {image && <View className="rounded-full w-7 h-7 bg-black absolute top-1 left-1" />}
          <Ionicons name="person-circle-outline" size={32} color="white" />
        </TouchableOpacity>
        {open && (
          <View className="absolute right-0 top-[30px] flex w-[200px] flex-col gap-3 rounded-md border border-green-600 bg-white p-3">
            <TouchableOpacity onPress={logout}>
              <Text>Logout</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </OutsidePressHandler>
  );
}
