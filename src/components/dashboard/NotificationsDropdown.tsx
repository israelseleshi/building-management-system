"use client"

import { useState } from "react"
import { Bell, Trash2, CheckCheck, AlertCircle, MessageSquare, DollarSign, Wrench, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useNotifications, type Notification } from "@/hooks/useNotifications"
import { useRouter } from "next/navigation"

const notificationIcons: Record<string, React.ReactNode> = {
  payment: <DollarSign className="w-4 h-4 text-emerald-600" />,
  inquiry: <MessageSquare className="w-4 h-4 text-blue-600" />,
  message: <MessageSquare className="w-4 h-4 text-purple-600" />,
  maintenance: <Wrench className="w-4 h-4 text-orange-600" />,
  listing: <Home className="w-4 h-4 text-cyan-600" />,
  system: <AlertCircle className="w-4 h-4 text-gray-600" />,
}

const priorityColors: Record<string, string> = {
  low: "bg-blue-50 border-blue-200",
  normal: "bg-gray-50 border-gray-200",
  high: "bg-yellow-50 border-yellow-200",
  urgent: "bg-red-50 border-red-200",
}

export function NotificationsDropdown() {
  const router = useRouter()
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications()
  const [isOpen, setIsOpen] = useState(false)

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.is_read) {
      markAsRead(notification.id)
    }
    if (notification.action_url) {
      router.push(notification.action_url)
      setIsOpen(false)
    }
  }

  const handleDelete = (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation()
    deleteNotification(notificationId)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-gray-100 rounded-full"
        >
          <Bell className="w-5 h-5 text-gray-700" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs"
              variant="default"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-96 p-0">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
          <div>
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            <p className="text-xs text-gray-500">{unreadCount} unread</p>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs h-7"
            >
              <CheckCheck className="w-3 h-3 mr-1" />
              Mark all
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <ScrollArea className="h-96">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-8 text-gray-500">
              <Bell className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`px-4 py-3 cursor-pointer transition-colors border-l-4 ${
                    notification.is_read
                      ? "bg-white border-l-transparent hover:bg-gray-50"
                      : "bg-blue-50 border-l-blue-500 hover:bg-blue-100"
                  } ${priorityColors[notification.priority]}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {notificationIcons[notification.type] || (
                        <AlertCircle className="w-4 h-4 text-gray-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium text-sm text-gray-900">
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleDelete(e, notification.id)}
                          className="h-6 w-6 p-0 flex-shrink-0"
                        >
                          <Trash2 className="w-3 h-3 text-gray-400 hover:text-red-600" />
                        </Button>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(notification.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="px-4 py-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs text-blue-600 hover:text-blue-700"
                onClick={() => {
                  router.push("/dashboard/notifications")
                  setIsOpen(false)
                }}
              >
                View all notifications
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
