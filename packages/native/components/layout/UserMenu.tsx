import { View, type ViewProps, TouchableOpacity, Text } from "react-native";
import { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import OutsidePressHandler from "react-native-outside-press";
import { useAuthContext } from "../auth/context";

// export type Props = ViewProps
export type Props = {
  image?: string | undefined;
  children?: ViewProps["children"];
};

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const { logout } = useAuthContext();

  return (
    <OutsidePressHandler onOutsidePress={() => setOpen(false)}>
      <View className="relative">
        <TouchableOpacity onPress={() => setOpen(!open)}>
          <Ionicons name="person" size={28} color="white" />
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
