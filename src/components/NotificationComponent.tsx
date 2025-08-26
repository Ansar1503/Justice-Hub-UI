import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "./ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { useInfiniteFetchAllNotifications } from "@/store/tanstack/infiniteQuery";
import { useAppDispatch } from "@/store/redux/Hook";
import { useJoinSession } from "@/store/tanstack/mutations/sessionMutation";
import { setZcState } from "@/store/redux/zc/zcSlice";
import { useNavigate } from "react-router-dom";

type Props = {
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
};

export default function NotificationComponent({
  onMarkAsRead,
  onMarkAllAsRead,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { mutateAsync: JoinSessionMutation } = useJoinSession();
  const { data: notificationsData } = useInfiniteFetchAllNotifications(isOpen);
  const unreadCount = notificationsData?.pages?.filter(
    (n) => !n?.data?.isRead
  )?.length;
  const notifications = notificationsData?.pages?.flatMap(
    (page) => page?.data ?? []
  );
  const formatTime = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  const getNotificationIcon = (type: "message" | "session") => {
    return type === "message" ? "💬" : "🎯";
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative p-2 hover:bg-white hover:bg-opacity-20 transition-all duration-200"
        >
          <Bell className="h-5 w-5" />
          {unreadCount && unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-0 dark:bg-black border bg-white shadow-lg z-50"
        align="end"
      >
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount && unreadCount > 0 && (
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
        </div>
        <ScrollArea className="h-80 ">
          {notifications && notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground ">
              No notifications yet
            </div>
          ) : (
            <div className="divide-y bg-dark">
              {notifications &&
                notifications.map((notification, i) => (
                  <div key={notification.id}>
                    <div
                      className={`p-4 hover:bg-muted/50 cursor-pointer 
                      `}
                      onClick={async () => {
                        onMarkAsRead?.(notification.id);
                        if (notification.roomId) {
                          const data = await JoinSessionMutation({
                            sessionId: notification?.sessionId || "",
                          });
                          dispatch(
                            setZcState({
                              AppId: data?.zc?.appId,
                              roomId: String(data?.room_id),
                              token: data?.zc?.token,
                            })
                          );
                          navigate(
                            `/client/session/join/${notification?.sessionId}`
                          );
                        }
                      }}
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
                            <span className="capitalize">
                              {notification.type}
                            </span>
                            {notification.sessionId && (
                              <span>{notification.sessionId.slice(0, 8)}</span>
                            )}
                            <span>• {formatTime(notification.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {i === notifications.length - 1 && (
                      <div className="flex items-center justify-center mt-4">
                        <Button variant={"link"}>view More</Button>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
