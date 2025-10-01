import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../hooks/useThemeStore";

export type FilterType = "all" | "meetups" | "posts" | "happy_hours";

interface FilterTabsProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  counts?: {
    all: number;
    meetups: number;
    posts: number;
    happy_hours: number;
  };
}

const FILTERS: Array<{
  type: FilterType;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}> = [
  { type: "all", label: "All", icon: "grid-outline" },
  { type: "meetups", label: "Meetups", icon: "people-outline" },
  { type: "posts", label: "Posts", icon: "newspaper-outline" },
  { type: "happy_hours", label: "Happy Hours", icon: "wine-outline" },
];

export default function FilterTabs({
  activeFilter,
  onFilterChange,
  counts,
}: FilterTabsProps) {
  const { colors } = useThemeStore();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {FILTERS.map((filter, index) => {
          const isActive = activeFilter === filter.type;
          const count = counts?.[filter.type];

          return (
            <TouchableOpacity
              key={filter.type}
              style={[
                styles.tab,
                {
                  backgroundColor: isActive ? colors.primary : colors.surface,
                  borderColor: isActive ? colors.primary : colors.border,
                  marginLeft: index === 0 ? 0 : 8,
                },
              ]}
              onPress={() => onFilterChange(filter.type)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={filter.icon}
                size={16}
                color={isActive ? colors.onPrimary : colors.textSecondary}
              />
              <Text
                style={[
                  styles.tabText,
                  {
                    color: isActive ? colors.onPrimary : colors.text,
                    fontWeight: isActive ? "600" : "500",
                  },
                ]}
              >
                {filter.label}
              </Text>
              {count !== undefined && count > 0 && (
                <View
                  style={[
                    styles.badge,
                    {
                      backgroundColor: isActive
                        ? colors.onPrimary + "20"
                        : colors.primary + "20",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      {
                        color: isActive ? colors.onPrimary : colors.primary,
                      },
                    ]}
                  >
                    {count > 99 ? "99+" : count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  contentContainer: {
    paddingHorizontal: 16,
    flexDirection: "row",
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  tabText: {
    fontSize: 14,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: "center",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
});
