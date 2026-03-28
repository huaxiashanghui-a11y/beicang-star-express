import { Star } from 'lucide-react'
import { currentUser } from '@/data/mockData'

interface ReviewSectionProps {
  productId: string
}

export default function ReviewSection({ productId }: ReviewSectionProps) {
  // Mock reviews
  const reviews = [
    {
      id: '1',
      user: currentUser,
      rating: 5,
      content: '商品质量非常好，包装也很精美。物流很快，客服态度也很好。强烈推荐！',
      images: [],
      createdAt: '2024-03-20',
      helpful: 42,
    },
    {
      id: '2',
      user: { ...currentUser, name: '李四' },
      rating: 4,
      content: '整体不错，就是发货稍微慢了点。商品本身很好用，会回购的。',
      images: [],
      createdAt: '2024-03-18',
      helpful: 28,
    },
  ]

  return (
    <div className="space-y-4">
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review.id} className="bg-card rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                {review.user.avatar ? (
                  <img
                    src={review.user.avatar}
                    alt={review.user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-lg">{review.user.name[0]}</span>
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{review.user.name}</h4>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < review.rating ? 'fill-warning text-warning' : 'text-muted'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <span className="text-xs text-muted-foreground">{review.createdAt}</span>
            </div>
            
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              {review.content}
            </p>
            
            {review.images.length > 0 && (
              <div className="flex gap-2 mb-3">
                {review.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt=""
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                ))}
              </div>
            )}
            
            <button className="text-sm text-muted-foreground hover:text-primary transition-colors">
              👍 有帮助 ({review.helpful})
            </button>
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p>暂无评价</p>
        </div>
      )}
    </div>
  )
}
