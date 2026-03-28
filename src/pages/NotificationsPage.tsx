import { Link } from 'react-router-dom'
import { Bell, Package, Tag, Settings, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useApp } from '@/context/AppContext'

const typeIcons: Record<string, any> = {
  order: Package,
  promotion: Tag,
  system: Settings,
  social: Bell,
}

const typeLabels: Record<string, string> = {
  order: '订单消息',
  promotion: '促销优惠',
  system: '系统通知',
  social: '社交动态',
}

export default function NotificationsPage() {
  const { state, dispatch } = useApp()
  const { notifications } = state

  const unreadCount = notifications.filter(n => !n.isRead).length

  const handleMarkAllRead = () => {
    dispatch({ type: 'MARK_ALL_NOTIFICATIONS_READ' })
  }

  const handleMarkRead = (id: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-14 z-30 bg-background/95 backdrop-blur border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold">消息通知</h2>
            {unreadCount > 0 && (
              <p className="text-sm text-muted-foreground">{unreadCount} 条未读</p>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllRead}
              className="text-primary"
            >
              <Check className="w-4 h-4 mr-1" />
              全部已读
            </Button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="p-4 space-y-3">
        {notifications.length > 0 ? (
          notifications.map((notification) => {
            const Icon = typeIcons[notification.type] || Bell
            const isUnread = !notification.isRead

            return (
              <Link
                key={notification.id}
                to={notification.actionUrl || '#'}
                onClick={() => handleMarkRead(notification.id)}
              >
                <Card className={`transition-all ${isUnread ? 'border-primary/30 bg-primary/5' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        notification.type === 'order' ? 'bg-primary/10' :
                        notification.type === 'promotion' ? 'bg-warning/10' :
                        notification.type === 'system' ? 'bg-secondary/10' :
                        'bg-muted'
                      }`}>
                        <Icon className={`w-6 h-6 ${
                          notification.type === 'order' ? 'text-primary' :
                          notification.type === 'promotion' ? 'text-warning' :
                          notification.type === 'system' ? 'text-secondary' :
                          'text-muted-foreground'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={`font-semibold ${isUnread ? 'text-primary' : ''}`}>
                            {notification.title}
                          </h3>
                          <Badge variant={notification.type === 'promotion' ? 'warning' : 'secondary'} className="text-[10px]">
                            {typeLabels[notification.type]}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {notification.content}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {notification.createdAt}
                        </p>
                      </div>
                      {isUnread && (
                        <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
              <Bell className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold mb-2">暂无消息</h3>
            <p className="text-muted-foreground">有新消息时我们会第一时间通知您</p>
          </div>
        )}
      </div>
    </div>
  )
}
