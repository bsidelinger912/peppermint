import { View, TouchableOpacity, Text } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

import OutsidePressHandler from "react-native-outside-press";
import { useAuthContext } from "../../auth/context";
import Typography from "~/components/ds/Typography";

export type Props = {
  image?: boolean;
};

export default function UserMenu({ image }: Props) {
  const [open, setOpen] = useState(false);
  const { logout, user } = useAuthContext<true>();

  return (
    <OutsidePressHandler onOutsidePress={() => setOpen(false)}>
      <View className="relative">
        <TouchableOpacity onPress={() => setOpen(!open)} className="rounded-full p-0">
          {image && <View className="absolute left-1 top-1 h-7 w-7 rounded-full bg-black" />}
          <Ionicons name="person-circle-outline" size={32} color="white" />
        </TouchableOpacity>
        {open && (
          <View className="absolute right-0 top-[30px] flex w-[250px] flex-col gap-3 rounded-md border border-green-600 bg-white p-3">
            <View className="truncate border-b pb-2">
              <Typography numberOfLines={1}>{user.email}</Typography>
            </View>

            <TouchableOpacity
              onPress={() => {
                router.push("/queue");
                setOpen(false);
              }}>
              <Text>Queue</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={logout}>
              <Text>Logout</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </OutsidePressHandler>
  );
}
