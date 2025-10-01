import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../hooks/useThemeStore";

export type DateFilter = "all" | "today" | "this_week" | "this_weekend";
export type LocationFilter = "all" | "nearby" | "neighborhood";

interface QuickActionsBarProps {
  onLocationPress: () => void;
  onDateFilterChange: (filter: DateFilter) => void;
  onMapPress: () => void;
  onSearchPress: () => void;
  selectedDateFilter: DateFilter;
  nearbyCount?: number;
}

const DATE_FILTERS: Array<{ value: DateFilter; label: string; icon: string }> =
  [
    { value: "all", label: "All Time", icon: "calendar-outline" },
    { value: "today", label: "Today", icon: "today-outline" },
    { value: "this_week", label: "This Week", icon: "calendar-outline" },
    { value: "this_weekend", label: "This Weekend", icon: "sunny-outline" },
  ];

export default function QuickActionsBar({
  onLocationPress,
  onDateFilterChange,
  onMapPress,
  onSearchPress,
  selectedDateFilter,
  nearbyCount,
}: QuickActionsBarProps) {
  const { colors } = useThemeStore();
  const [showDateModal, setShowDateModal] = useState(false);

  const selectedDateLabel =
    DATE_FILTERS.find((f) => f.value === selectedDateFilter)?.label || "Filter";

  return (
    <>
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.surface }]}
          onPress={onLocationPress}
          activeOpacity={0.7}
        >
          <Ionicons name="location-outline" size={18} color={colors.primary} />
          <Text style={[styles.actionText, { color: colors.text }]}>
            Nearby
          </Text>
          {nearbyCount !== undefined && nearbyCount > 0 && (
            <View
              style={[styles.countBadge, { backgroundColor: colors.primary }]}
            >
              <Text style={[styles.countText, { color: colors.onPrimary }]}>
                {nearbyCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.surface }]}
          onPress={() => setShowDateModal(true)}
          activeOpacity={0.7}
        >
          <Ionicons name="calendar-outline" size={18} color={colors.primary} />
          <Text style={[styles.actionText, { color: colors.text }]}>
            {selectedDateLabel}
          </Text>
          <Ionicons
            name="chevron-down"
            size={16}
            color={colors.textSecondary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: colors.surface }]}
          onPress={onMapPress}
          activeOpacity={0.7}
        >
          <Ionicons name="map-outline" size={20} color={colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: colors.surface }]}
          onPress={onSearchPress}
          activeOpacity={0.7}
        >
          <Ionicons name="search-outline" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Date Filter Modal */}
      <Modal
        visible={showDateModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDateModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowDateModal(false)}
        >
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Filter by Date
              </Text>
              <TouchableOpacity onPress={() => setShowDateModal(false)}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView>
              {DATE_FILTERS.map((filter) => (
                <TouchableOpacity
                  key={filter.value}
                  style={[
                    styles.modalOption,
                    {
                      backgroundColor:
                        selectedDateFilter === filter.value
                          ? colors.primary + "10"
                          : "transparent",
                    },
                  ]}
                  onPress={() => {
                    onDateFilterChange(filter.value);
                    setShowDateModal(false);
                  }}
                >
                  <Ionicons
                    name={filter.icon as any}
                    size={20}
                    color={
                      selectedDateFilter === filter.value
                        ? colors.primary
                        : colors.textSecondary
                    }
                  />
                  <Text
                    style={[
                      styles.modalOptionText,
                      {
                        color:
                          selectedDateFilter === filter.value
                            ? colors.primary
                            : colors.text,
                        fontWeight:
                          selectedDateFilter === filter.value ? "600" : "500",
                      },
                    ]}
                  >
                    {filter.label}
                  </Text>
                  {selectedDateFilter === filter.value && (
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color={colors.primary}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    borderBottomWidth: 1,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 6,
  },
  actionText: {
    fontSize: 13,
    fontWeight: "500",
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  countBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: "center",
  },
  countText: {
    fontSize: 11,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    borderRadius: 16,
    borderWidth: 1,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  modalOptionText: {
    fontSize: 15,
    flex: 1,
  },
});
