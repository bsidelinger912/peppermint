import React from "react";
import { Text, StyleSheet } from "react-native";

type Props = {
  variant?: "p" | "h1" | "h2" | "h3" | "h4";
};

const styles = StyleSheet.create({
  base: {
    // color: "#334155", // slate-700
  },
  p: {
    fontSize: 16,
    fontWeight: "400",
  },
  h1: {
    fontSize: 36,
    fontWeight: "700",
  },
  h2: {
    fontSize: 30,
    fontWeight: "600",
  },
  h3: {
    fontSize: 24,
    fontWeight: "600",
  },
  h4: {
    fontSize: 20,
    fontWeight: "500",
  },
});

export default function Typography({
  children,
  variant = "p",
}: Props & { children: React.ReactNode }) {
  return (
    <Text className="text-slate-700" style={[styles.base, styles[variant]]}>
      {children}
    </Text>
  );
}
