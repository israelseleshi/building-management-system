import { useEffect, useState, useCallback } from 'react'
import { API_BASE_URL, getAuthToken } from '@/lib/apiClient'

export interface Notification {
  id: string
  user_id?: string
  title: string
  message: string
  type: 'payment' | 'reminder' | 'maintenance' | 'document' | 'message' | 'system' | 'inquiry' | 'listing'
  related_entity_type?: string
  related_entity_id?: string
  is_read: boolean
  action_url?: string
  icon?: string
  priority: 'low' | 'normal' | 'high' | 'urgent'
  created_at: string
  read_at?: string
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Rent Payment Due Soon",
    message: "Your rent payment for April 2026 is due in 5 days. Please ensure you have sufficient funds.",
    type: "payment",
    priority: "high",
    is_read: false,
    created_at: "2026-04-01T10:00:00Z"
  },
  {
    id: "2",
    title: "Payment Received - Thank You",
    message: "We have received your rent payment of 15,000 ETB for March 2026. Thank you!",
    type: "payment",
    priority: "normal",
    is_read: true,
    created_at: "2026-03-01T14:30:00Z"
  },
  {
    id: "3",
    title: "Maintenance Update",
    message: "Your maintenance request for the bathroom faucet has been completed. Please verify the work.",
    type: "maintenance",
    priority: "normal",
    is_read: false,
    created_at: "2026-04-03T09:15:00Z",
    action_url: "/tenant-dashboard/maintenance"
  },
  {
    id: "4",
    title: "New Lease Document",
    message: "Your landlord has uploaded a new lease agreement. Please review and sign.",
    type: "document",
    priority: "high",
    is_read: false,
    created_at: "2026-04-02T11:00:00Z",
    action_url: "/tenant-dashboard/documents"
  },
  {
    id: "5",
    title: "Message from Property Management",
    message: "You have a new message regarding your recent maintenance request.",
    type: "message",
    priority: "normal",
    is_read: true,
    created_at: "2026-03-28T16:45:00Z",
    action_url: "/tenant-dashboard/chat"
  },
  {
    id: "6",
    title: "Scheduled Inspection",
    message: "A routine property inspection is scheduled for next week. Please ensure access.",
    type: "reminder",
    priority: "normal",
    is_read: false,
    created_at: "2026-04-04T08:00:00Z"
  },
  {
    id: "7",
    title: "Building Maintenance Notice",
    message: "Water supply will be temporarily interrupted on Saturday for maintenance work.",
    type: "system",
    priority: "high",
    is_read: true,
    created_at: "2026-03-25T12:00:00Z"
  },
  {
    id: "8",
    title: "Rent Increase Notice",
    message: "Your landlord has sent information about the upcoming rent adjustment.",
    type: "system",
    priority: "urgent",
    is_read: false,
    created_at: "2026-04-05T07:30:00Z"
  }
]

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      const token = getAuthToken()
      if (!API_BASE_URL || !token) {
        // Use mock data when API is not available
        setNotifications(mockNotifications)
        setUnreadCount(mockNotifications.filter(n => !n.is_read).length)
        setLoading(false)
        return
      }

      const response = await fetch(`${API_BASE_URL}/notifications`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(err => {
        console.warn('Notification service unreachable:', err)
        return null
      })

      if (!response || !response.ok) {
        // Notifications endpoint is not defined in the API spec yet or server is down.
        // Use mock data
        setNotifications(mockNotifications)
        setUnreadCount(mockNotifications.filter(n => !n.is_read).length)
        setLoading(false)
        return
      }

      const payload = await response.json().catch(() => ({}))
      const data = payload?.data?.notifications || []
      setNotifications(data)
      setUnreadCount(data.filter((n: Notification) => !n.is_read).length)
    } catch (err) {
      console.error('Error fetching notifications:', err)
      // Use mock data on error
      setNotifications(mockNotifications)
      setUnreadCount(mockNotifications.filter(n => !n.is_read).length)
    } finally {
      setLoading(false)
    }
  }, [])

  // Subscribe to real-time notifications
  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const token = getAuthToken()
      if (API_BASE_URL && token) {
        await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => undefined)
      }

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, is_read: true } : n
        )
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (err) {
      console.error('Error marking notification as read:', err)
    }
  }, [])

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    try {
      const token = getAuthToken()
      if (API_BASE_URL && token) {
        await fetch(`${API_BASE_URL}/notifications/read-all`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => undefined)
      }

      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
      setUnreadCount(0)
    } catch (err) {
      console.error('Error marking all as read:', err)
    }
  }, [])

  // Delete notification
  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      const token = getAuthToken()
      if (API_BASE_URL && token) {
        await fetch(`${API_BASE_URL}/notifications/${notificationId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => undefined)
      }

      setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
    } catch (err) {
      console.error('Error deleting notification:', err)
    }
  }, [])

  // Create notification (for testing/internal use)
  const createNotification = useCallback(
    async (
      userId: string,
      title: string,
      message: string,
      type: Notification['type'],
      options?: {
        priority?: Notification['priority']
        action_url?: string
        icon?: string
        related_entity_type?: string
        related_entity_id?: string
      }
    ) => {
      try {
        const token = getAuthToken()
        if (API_BASE_URL && token) {
          await fetch(`${API_BASE_URL}/notifications`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              user_id: userId,
              title,
              message,
              type,
              priority: options?.priority || 'normal',
              action_url: options?.action_url,
              icon: options?.icon,
              related_entity_type: options?.related_entity_type,
              related_entity_id: options?.related_entity_id,
            }),
          }).catch(() => undefined)
        }
      } catch (err) {
        console.error('Error creating notification:', err)
      }
    },
    []
  )

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createNotification,
  }
}
