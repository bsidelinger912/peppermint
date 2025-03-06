import AuthProvider from "~/components/auth/AuthProvider";
import "../global.css";

import { Stack } from "expo-router";

export default function Layout() {
  return (
    <AuthProvider>
      <Stack />
    </AuthProvider>
  );
}
