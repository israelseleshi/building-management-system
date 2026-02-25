import { useEffect, useState, useCallback } from 'react'
import { API_BASE_URL, getAuthToken } from '@/lib/apiClient'

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: 'payment' | 'inquiry' | 'message' | 'maintenance' | 'listing' | 'system'
  related_entity_type?: string
  related_entity_id?: string
  is_read: boolean
  action_url?: string
  icon?: string
  priority: 'low' | 'normal' | 'high' | 'urgent'
  created_at: string
  read_at?: string
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      const token = getAuthToken()
      if (!API_BASE_URL || !token) {
        setNotifications([])
        setUnreadCount(0)
        return
      }

      const response = await fetch(`${API_BASE_URL}/notifications`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        // Notifications endpoint is not defined in the API spec yet.
        setNotifications([])
        setUnreadCount(0)
        return
      }

      const payload = await response.json().catch(() => ({}))
      const data = payload?.data?.notifications || []
      setNotifications(data)
      setUnreadCount(data.filter((n: Notification) => !n.is_read).length)
    } catch (err) {
      console.error('Error fetching notifications:', err)
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
