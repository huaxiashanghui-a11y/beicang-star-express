import { Outlet, useLocation } from 'react-router-dom'
import TabBar from '@/components/TabBar'
import Header from '@/components/Header'
import FloatingWindows from '@/components/floating/FloatingWindows'
import PageTransition from '@/components/PageTransition'

export default function Layout() {
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className={`pb-16 sm:pb-20 ${isHomePage ? 'pt-[88px] sm:pt-[106px]' : 'pt-12 sm:pt-16'}`}>
        {/* 内容区域自适应 */}
        <div className="w-full px-3 sm:px-4 md:px-6 lg:max-w-4xl mx-auto">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </div>
      </main>
      <TabBar />
      <FloatingWindows cartCount={3} messageCount={5} />
    </div>
  )
}
