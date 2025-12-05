import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'

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
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) throw error

      setNotifications(data || [])
      setUnreadCount((data || []).filter(n => !n.is_read).length)
    } catch (err) {
      console.error('Error fetching notifications:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Subscribe to real-time notifications
  useEffect(() => {
    const setupSubscription = async () => {
      fetchNotifications()

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const channel = supabase
        .channel(`notifications-${user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            const newNotification = payload.new as Notification
            setNotifications((prev) => [newNotification, ...prev])
            setUnreadCount((prev) => prev + 1)
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }

    setupSubscription()
  }, [fetchNotifications])

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({
          is_read: true,
          read_at: new Date().toISOString(),
        })
        .eq('id', notificationId)

      if (error) throw error

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
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('notifications')
        .update({
          is_read: true,
          read_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .eq('is_read', false)

      if (error) throw error

      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
      setUnreadCount(0)
    } catch (err) {
      console.error('Error marking all as read:', err)
    }
  }, [])

  // Delete notification
  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)

      if (error) throw error

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
        const { error } = await supabase
          .from('notifications')
          .insert([
            {
              user_id: userId,
              title,
              message,
              type,
              priority: options?.priority || 'normal',
              action_url: options?.action_url,
              icon: options?.icon,
              related_entity_type: options?.related_entity_type,
              related_entity_id: options?.related_entity_id,
            },
          ])

        if (error) throw error
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
