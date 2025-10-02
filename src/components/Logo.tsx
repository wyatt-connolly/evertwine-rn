import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface LogoProps {
  size?: number;
}

export default function Logo({ size = 60 }: LogoProps) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Ionicons name="people" size={size * 0.6} color="#00BCD4" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f0f8ff",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#00BCD4",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
});
