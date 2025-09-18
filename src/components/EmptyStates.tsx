import React from "react";
import EmptyStateCard from "./EmptyStateCard";

interface EmptyStateProps {
  onActionPress?: () => void;
  style?: any;
}

export const EmptyMeetupsState = ({
  onActionPress,
  style,
}: EmptyStateProps) => (
  <EmptyStateCard
    icon="people-outline"
    title="No Meetups Yet"
    description="Start connecting with people by creating your first meetup or joining others in your area."
    actionText="Create Meetup"
    onActionPress={onActionPress}
    style={style}
  />
);

export const EmptyEventsState = ({ onActionPress, style }: EmptyStateProps) => (
  <EmptyStateCard
    icon="calendar-outline"
    title="No Events Found"
    description="There are no events in your area right now. Check back later or explore different locations."
    actionText="Explore More"
    onActionPress={onActionPress}
    style={style}
  />
);

export const EmptyMessagesState = ({
  onActionPress,
  style,
}: EmptyStateProps) => (
  <EmptyStateCard
    icon="chatbubbles-outline"
    title="No Messages Yet"
    description="Your conversations will appear here. Start chatting with people you've connected with through meetups."
    actionText="Find Meetups"
    onActionPress={onActionPress}
    style={style}
  />
);

export const EmptyActivityState = ({
  onActionPress,
  style,
}: EmptyStateProps) => (
  <EmptyStateCard
    icon="pulse-outline"
    title="No Activity Yet"
    description="Your activity feed is empty. Join meetups and connect with people to see updates here."
    actionText="Discover Meetups"
    onActionPress={onActionPress}
    style={style}
  />
);

export const EmptyNotificationsState = ({
  onActionPress,
  style,
}: EmptyStateProps) => (
  <EmptyStateCard
    icon="notifications-outline"
    title="No Notifications"
    description="You're all caught up! Notifications about meetups, messages, and connections will appear here."
    style={style}
  />
);

export const EmptyFavoritesState = ({
  onActionPress,
  style,
}: EmptyStateProps) => (
  <EmptyStateCard
    icon="heart-outline"
    title="No Favorites Yet"
    description="Save meetups you're interested in by tapping the heart icon. They'll appear here for easy access."
    actionText="Browse Meetups"
    onActionPress={onActionPress}
    style={style}
  />
);

export const EmptyStandoutsState = ({
  onActionPress,
  style,
}: EmptyStateProps) => (
  <EmptyStateCard
    icon="star-outline"
    title="No Standouts"
    description="Featured users and popular meetups in your area will appear here. Check back later!"
    style={style}
  />
);

export const EmptySearchState = ({ onActionPress, style }: EmptyStateProps) => (
  <EmptyStateCard
    icon="search-outline"
    title="No Results Found"
    description="We couldn't find any meetups matching your search. Try different keywords or browse all meetups."
    actionText="Browse All"
    onActionPress={onActionPress}
    style={style}
  />
);

export const EmptyConnectionsState = ({
  onActionPress,
  style,
}: EmptyStateProps) => (
  <EmptyStateCard
    icon="people-circle-outline"
    title="No Connections Yet"
    description="Connect with people through meetups and events. Your network will grow as you participate more."
    actionText="Join Meetups"
    onActionPress={onActionPress}
    style={style}
  />
);

export const LoadingState = ({ style }: { style?: any }) => (
  <EmptyStateCard
    icon="hourglass-outline"
    title="Loading..."
    description="Getting your content ready. This should only take a moment."
    style={style}
  />
);

export const ErrorState = ({ onActionPress, style }: EmptyStateProps) => (
  <EmptyStateCard
    icon="alert-circle-outline"
    title="Something Went Wrong"
    description="We're having trouble loading your content. Please check your connection and try again."
    actionText="Retry"
    onActionPress={onActionPress}
    style={style}
  />
);
