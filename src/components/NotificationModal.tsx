"use client";

import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { useInfiniteFetchAllNotifications } from "@/store/tanstack/infiniteQuery";

interface NotificationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
}

export default function NotificationModal({
  isOpen,
  onOpenChange,
  onMarkAsRead,
  onMarkAllAsRead,
}: NotificationModalProps) {
  const {
    data: notificationsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteFetchAllNotifications(isOpen);

  const notifications = notificationsData?.pages?.flatMap(
    (page) => page?.data ?? []
  );
  const unreadCount = notifications
    ? notifications.filter((n) => !n.isRead).length
    : 0;
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  const getNotificationIcon = (type: "message" | "session" | "general") => {
    switch (type) {
      case "message":
        return "💬";
      case "session":
        return "🎯";
      default:
        return "🔔";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Notifications</DialogTitle>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onMarkAllAsRead}
                className="text-xs"
              >
                Mark all read
              </Button>
            )}
          </div>
          <DialogDescription>
            {unreadCount > 0
              ? `${unreadCount} unread notifications`
              : "All caught up!"}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-80 -mx-6">
          {notifications && notifications.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              No notifications yet
            </div>
          ) : (
            <div className="divide-y">
              {notifications?.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-muted/50 cursor-pointer transition-colors ${
                    !notification.isRead ? "bg-muted/20" : ""
                  }`}
                  onClick={() => onMarkAsRead?.(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-lg">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm truncate">
                          {notification.title}
                        </p>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <span className="capitalize">{notification.type}</span>
                        <span>
                          •{" "}
                          {notification.createdAt
                            ? formatTime(notification.createdAt)
                            : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {hasNextPage && (
                <div className="p-4 flex justify-center">
                  <Button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    variant="outline"
                    size="sm"
                  >
                    {isFetchingNextPage ? "Loading..." : "Show More"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
