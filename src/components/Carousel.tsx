import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Banner } from '@/data/mockData'
import { cn } from '@/lib/utils'

interface CarouselProps {
  banners: Banner[]
  autoPlay?: boolean
  interval?: number
  showArrows?: boolean
  showDots?: boolean
  className?: string
}

export default function Carousel({
  banners,
  autoPlay = true,
  interval = 4000,
  showArrows = true,
  showDots = true,
  className = ''
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const timerRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (autoPlay && !isHovering) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % banners.length)
      }, interval)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [autoPlay, isHovering, interval, banners.length])

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length)
  }

  const handleDotClick = (index: number) => {
    setCurrentIndex(index)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    const diff = touchStart - touchEnd
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext()
      } else {
        handlePrev()
      }
    }
  }

  return (
    <div
      className={cn('relative group', className)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative h-44 rounded-2xl overflow-hidden shadow-xl">
        {banners.map((banner, index) => (
          <Link
            key={banner.id}
            to={banner.link || '/'}
            className={cn(
              'absolute inset-0 transition-all duration-500 ease-out',
              index === currentIndex
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-105'
            )}
          >
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover"
            />
            <div className={`absolute inset-0 bg-gradient-to-r ${banner.gradient} opacity-60`} />
            <div className="absolute inset-0 flex flex-col justify-center px-6">
              <h2 className="text-2xl font-bold text-white mb-1 animate-slide-in-up">
                {banner.title}
              </h2>
              <p className="text-white/90 text-sm">{banner.subtitle}</p>
            </div>
          </Link>
        ))}

        {/* Arrows */}
        {showArrows && (
          <>
            <button
              onClick={handlePrev}
              className={cn(
                'absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/50 hover:bg-white/80 flex items-center justify-center transition-all',
                'opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0'
              )}
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={handleNext}
              className={cn(
                'absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/50 hover:bg-white/80 flex items-center justify-center transition-all',
                'opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0'
              )}
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </>
        )}

        {/* Progress Bar */}
        <div className="absolute bottom-3 left-0 right-0 h-0.5 bg-white/20 mx-6">
          <div
            className="h-full bg-white transition-all duration-300"
            style={{
              width: `${((currentIndex + 1) / banners.length) * 100}%`
            }}
          />
        </div>

        {/* Dots */}
        {showDots && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={cn(
                  'h-2 rounded-full transition-all',
                  index === currentIndex
                    ? 'w-6 bg-white'
                    : 'w-2 bg-white/50 hover:bg-white/80'
                )}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
