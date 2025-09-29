import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeStore } from "../../hooks/useThemeStore";
import { Ionicons } from "@expo/vector-icons";
import GradientBackground from "../../components/GradientBackground";
import AnimatedButton from "../../components/AnimatedButton";

const { width, height } = Dimensions.get("window");

interface AppFeaturesScreenProps {
  navigation: any;
}

const appFeatures = [
  {
    id: "discover",
    title: "Discover Events",
    description:
      "Find meetups and happy hours that match your interests and schedule",
    icon: "search",
    color: "#4CAF50",
    image:
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop",
  },
  {
    id: "connect",
    title: "Connect with People",
    description:
      "Meet like-minded individuals and build meaningful relationships",
    icon: "people",
    color: "#2196F3",
    image:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=300&fit=crop",
  },
  {
    id: "create",
    title: "Create Your Own",
    description:
      "Host meetups and events to bring people together in your community",
    icon: "add-circle",
    color: "#FF9800",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
  },
  {
    id: "grow",
    title: "Grow Your Network",
    description: "Build professional connections and expand your social circle",
    icon: "trending-up",
    color: "#9C27B0",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
  },
];

export default function AppFeaturesScreen({
  navigation,
}: AppFeaturesScreenProps) {
  const { colors } = useThemeStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Ensure the carousel starts at the first item
    const timer = setTimeout(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToOffset({ offset: 0, animated: false });
      }
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  const handleNext = () => {
    console.log("Next button pressed, currentIndex:", currentIndex);
    if (currentIndex < appFeatures.length - 1) {
      const nextIndex = currentIndex + 1;
      console.log("Moving to next index:", nextIndex);
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToOffset({
        offset: nextIndex * width,
        animated: true,
      });
    } else {
      console.log("Navigating to LocationPermission");
      // Navigate to next onboarding step
      navigation.navigate("LocationPermission");
    }
  };

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / width);
    if (index >= 0 && index < appFeatures.length) {
      setCurrentIndex(index);
    }
  };

  const renderFeature = ({ item, index }: { item: any; index: number }) => (
    <View style={styles.featureCard}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.featureImage}
          resizeMode="cover"
        />
        <View style={styles.imageOverlay} />
      </View>

      <View style={styles.contentContainer}>
        <View
          style={[styles.iconContainer, { backgroundColor: item.color + "20" }]}
        >
          <Ionicons name={item.icon as any} size={32} color={item.color} />
        </View>

        <Text style={[styles.featureTitle, { color: colors.text }]}>
          {item.title}
        </Text>

        <Text
          style={[styles.featureDescription, { color: colors.textSecondary }]}
        >
          {item.description}
        </Text>
      </View>
    </View>
  );

  const renderPagination = () => (
    <View style={styles.pagination}>
      {appFeatures.map((_, index) => (
        <View
          key={index}
          style={[
            styles.paginationDot,
            {
              backgroundColor:
                index === currentIndex ? colors.primary : colors.border,
            },
          ]}
        />
      ))}
    </View>
  );

  return (
    <GradientBackground variant="primary">
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Title */}
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: colors.text }]}>
              What you can do on Evertwine
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Discover all the ways to connect and grow your network
            </Text>
          </View>

          {/* Features Carousel */}
          <View style={styles.carouselContainer}>
            <FlatList
              ref={flatListRef}
              data={appFeatures}
              renderItem={renderFeature}
              keyExtractor={(item) => item.id}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={handleScroll}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              style={styles.carousel}
              snapToInterval={width}
              snapToAlignment="center"
              decelerationRate="fast"
              getItemLayout={(data, index) => ({
                length: width,
                offset: width * index,
                index,
              })}
              initialScrollIndex={0}
              contentContainerStyle={styles.carouselContent}
              removeClippedSubviews={false}
            />

            {renderPagination()}
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <AnimatedButton
              title={
                currentIndex < appFeatures.length - 1 ? "Next" : "Get Started"
              }
              onPress={handleNext}
              variant="primary"
              icon="arrow-forward"
              style={styles.continueButton}
            />
          </View>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  carouselContainer: {
    flex: 1,
    marginBottom: 32,
  },
  carousel: {
    flex: 1,
  },
  carouselContent: {
    paddingHorizontal: 0,
  },
  featureCard: {
    width: width - 48,
    marginHorizontal: 24,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    alignSelf: "center",
  },
  imageContainer: {
    height: 160,
    position: "relative",
    width: "100%",
  },
  featureImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  contentContainer: {
    padding: 28,
    paddingBottom: 32,
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    minHeight: 140,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },
  featureTitle: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 14,
    color: "#FFFFFF",
  },
  featureDescription: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    color: "rgba(255, 255, 255, 0.85)",
    maxWidth: 260,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  buttonContainer: {
    width: "100%",
  },
  continueButton: {
    height: 56,
    borderRadius: 16,
  },
});
