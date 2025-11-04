import React, { useEffect, useRef } from "react";
import { View, Animated, Dimensions, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { useThemeStore } from "../hooks/useThemeStore";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface AnimatedAvatarProps {
  user: {
    uid: string;
    displayName: string;
    profilePictures: string[];
  };
  size?: number;
  onPress?: () => void;
  otherAvatars?: Array<{
    id: string;
    x: number;
    y: number;
    size: number;
  }>;
}

export default function AnimatedAvatar({
  user,
  size = 60,
  onPress,
  otherAvatars = [],
}: AnimatedAvatarProps) {
  const { colors } = useThemeStore();
  const translateX = useRef(
    new Animated.Value(Math.random() * (screenWidth - size))
  ).current;
  const translateY = useRef(
    new Animated.Value(Math.random() * (screenHeight - size))
  ).current;
  const velocityX = useRef((Math.random() - 0.5) * 0.8); // Random velocity between -0.4 and 0.4
  const velocityY = useRef((Math.random() - 0.5) * 0.8);

  useEffect(() => {
    const animate = () => {
      const currentX = translateX._value;
      const currentY = translateY._value;

      // Calculate new position
      let newX = currentX + velocityX.current;
      let newY = currentY + velocityY.current;

      // Check for collisions with other avatars
      otherAvatars.forEach((otherAvatar) => {
        if (otherAvatar.id === user.uid) return; // Skip self

        const dx = newX - otherAvatar.x;
        const dy = newY - otherAvatar.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = (size + otherAvatar.size) / 2 + 5; // Add small buffer

        if (distance < minDistance && distance > 0) {
          // Simple collision - just separate and bounce
          const overlap = minDistance - distance;

          // Normalize the collision vector
          const normalX = dx / distance;
          const normalY = dy / distance;

          // Separate avatars
          newX += normalX * overlap * 0.5;
          newY += normalY * overlap * 0.5;

          // Simple bounce - reverse velocity in collision direction
          const velocityInNormal =
            velocityX.current * normalX + velocityY.current * normalY;

          if (velocityInNormal < 0) {
            velocityX.current -= 2 * velocityInNormal * normalX * 0.8;
            velocityY.current -= 2 * velocityInNormal * normalY * 0.8;
          }
        }
      });

      // Bounce off edges with slight velocity reduction for realism
      if (newX <= 0 || newX >= screenWidth - size) {
        velocityX.current = -velocityX.current * 0.8;
        newX = Math.max(0, Math.min(screenWidth - size, newX));
      }
      if (newY <= 0 || newY >= screenHeight - size - 150) {
        // Account for header/footer
        velocityY.current = -velocityY.current * 0.8;
        newY = Math.max(0, Math.min(screenHeight - size - 150, newY));
      }

      // Add slight random variation to movement for organic feel
      velocityX.current += (Math.random() - 0.5) * 0.02;
      velocityY.current += (Math.random() - 0.5) * 0.02;

      // Limit velocity to keep movement smooth and controlled
      velocityX.current = Math.max(-0.8, Math.min(0.8, velocityX.current));
      velocityY.current = Math.max(-0.8, Math.min(0.8, velocityY.current));

      // Apply friction to gradually slow down
      velocityX.current *= 0.999;
      velocityY.current *= 0.999;

      translateX.setValue(newX);
      translateY.setValue(newY);

      // Use setTimeout for slower, more controlled animation
      setTimeout(animate, 50);
    };

    animate();
  }, []);

  return (
    <Animated.View
      style={{
        position: "absolute",
        transform: [{ translateX }, { translateY }],
        zIndex: 1,
      }}
    >
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <View
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: colors.surface,
            borderWidth: 3,
            borderColor: colors.primary,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
            overflow: "hidden",
          }}
        >
          {user.profilePictures && user.profilePictures.length > 0 ? (
            <Image
              source={{ uri: user.profilePictures[0] }}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: size / 2,
              }}
              contentFit="cover"
            />
          ) : (
            <View
              style={{
                width: "100%",
                height: "100%",
                borderRadius: size / 2,
                backgroundColor: colors.border,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="person"
                size={size * 0.5}
                color={colors.textTertiary}
              />
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
