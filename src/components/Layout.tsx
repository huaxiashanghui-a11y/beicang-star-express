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
      <main className={`pb-20 ${isHomePage ? 'pt-[106px]' : 'pt-16'}`}>
        <PageTransition key={location.pathname}>
          <Outlet />
        </PageTransition>
      </main>
      <TabBar />
      <FloatingWindows cartCount={3} messageCount={5} />
    </div>
  )
}
