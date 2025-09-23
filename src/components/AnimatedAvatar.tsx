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
  const velocityX = useRef((Math.random() - 0.5) * 2); // Random velocity between -1 and 1
  const velocityY = useRef((Math.random() - 0.5) * 2);

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
        const minDistance = (size + otherAvatar.size) / 2;

        if (distance < minDistance && distance > 0) {
          // Collision detected - bounce off each other
          const overlap = minDistance - distance;
          const angle = Math.atan2(dy, dx);

          // Separate avatars
          const separationX = Math.cos(angle) * overlap * 0.5;
          const separationY = Math.sin(angle) * overlap * 0.5;

          newX += separationX;
          newY += separationY;

          // Reverse velocity for bouncing effect
          velocityX.current = -velocityX.current * 0.7;
          velocityY.current = -velocityY.current * 0.7;
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
      velocityX.current += (Math.random() - 0.5) * 0.05;
      velocityY.current += (Math.random() - 0.5) * 0.05;

      // Limit velocity to keep movement smooth and slow
      velocityX.current = Math.max(-1.5, Math.min(1.5, velocityX.current));
      velocityY.current = Math.max(-1.5, Math.min(1.5, velocityY.current));

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
          <Image
            source={{ uri: user.profilePictures[0] }}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: size / 2,
            }}
            contentFit="cover"
          />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
