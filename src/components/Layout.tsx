import { Outlet, useLocation } from 'react-router-dom'
import TabBar from '@/components/TabBar'
import Header from '@/components/Header'
import FloatingSidebar from '@/components/FloatingSidebar'

export default function Layout() {
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className={`pb-20 ${isHomePage ? 'pt-[106px]' : 'pt-16'}`}>
        <Outlet />
      </main>
      <TabBar />
      <FloatingSidebar />
    </div>
  )
}
