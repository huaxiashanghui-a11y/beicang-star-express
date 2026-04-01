import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from '@/context/AppContext'
import { ToastProvider } from '@/components/Toast'
import Layout from '@/components/Layout'
import HomePage from '@/pages/HomePage'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import ProductListPage from '@/pages/ProductListPage'
import ProductDetailPage from '@/pages/ProductDetailPage'
import CartPage from '@/pages/CartPage'
import CheckoutPage from '@/pages/CheckoutPage'
import OrdersPage from '@/pages/OrdersPage'
import OrderDetailPage from '@/pages/OrderDetailPage'
import ProfilePage from '@/pages/ProfilePage'
import SettingsPage from '@/pages/SettingsPage'
import NotificationsPage from '@/pages/NotificationsPage'
import SearchPage from '@/pages/SearchPage'
import AddressPage from '@/pages/AddressPage'
import CouponPage from '@/pages/CouponPage'
import ActivityPage from '@/pages/ActivityPage'
import ErrandsPage from '@/pages/ErrandsPage'
// Admin Pages
import AdminLoginPage from '@/pages/admin/AdminLoginPage'
import AdminLayout from '@/layouts/AdminLayout'
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage'
import AdminProductsPage from '@/pages/admin/AdminProductsPage'
import AdminOrdersPage from '@/pages/admin/AdminOrdersPage'
import AdminUsersPage from '@/pages/admin/AdminUsersPage'
import AdminCouponsPage from '@/pages/admin/AdminCouponsPage'
import AdminCategoriesPage from '@/pages/admin/AdminCategoriesPage'
import AdminPaymentsPage from '@/pages/admin/AdminPaymentsPage'
import AdminCustomerServicePage from '@/pages/admin/AdminCustomerServicePage'
import AdminAnnouncementsPage from '@/pages/admin/AdminAnnouncementsPage'
import AdminActivitiesPage from '@/pages/admin/AdminActivitiesPage'
import AdminBannersPage from '@/pages/admin/AdminBannersPage'
import AdminPointsPage from '@/pages/admin/AdminPointsPage'
import AdminRidersPage from '@/pages/admin/AdminRidersPage'
import AdminPermissionsPage from '@/pages/admin/AdminPermissionsPage'
import AdminRechargePage from '@/pages/admin/AdminRechargePage'
import AdminSystemMessagesPage from '@/pages/admin/AdminSystemMessagesPage'
import AdminEmailListPage from '@/pages/admin/AdminEmailListPage'
import AdminSecretaryPage from '@/pages/admin/AdminSecretaryPage'
import AdminPopupPage from '@/pages/admin/AdminPopupPage'
import './index.css'

// Admin Route Guard
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const adminToken = localStorage.getItem('adminToken')
  return adminToken ? <>{children}</> : <Navigate to="/admin/login" replace />
}

function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="category/:categoryId" element={<ProductListPage />} />
              <Route path="search" element={<SearchPage />} />
              <Route path="product/:productId" element={<ProductDetailPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="order/:orderId" element={<OrderDetailPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="addresses" element={<AddressPage />} />
              <Route path="coupons" element={<CouponPage />} />
              <Route path="activity" element={<ActivityPage />} />
              <Route path="errands" element={<ErrandsPage />} />
              <Route path="errands/:type" element={<ErrandsPage />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }>
              <Route index element={<AdminDashboardPage />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="coupons" element={<AdminCouponsPage />} />
              <Route path="categories" element={<AdminCategoriesPage />} />
              <Route path="payments" element={<AdminPaymentsPage />} />
              <Route path="customer-service" element={<AdminCustomerServicePage />} />
              <Route path="announcements" element={<AdminAnnouncementsPage />} />
              <Route path="activities" element={<AdminActivitiesPage />} />
              <Route path="banners" element={<AdminBannersPage />} />
              <Route path="points" element={<AdminPointsPage />} />
              <Route path="recharge" element={<AdminRechargePage />} />
              <Route path="system-messages" element={<AdminSystemMessagesPage />} />
              <Route path="email-list" element={<AdminEmailListPage />} />
              <Route path="secretary" element={<AdminSecretaryPage />} />
              <Route path="popup" element={<AdminPopupPage />} />
              <Route path="riders" element={<AdminRidersPage />} />
              <Route path="permissions" element={<AdminPermissionsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AppProvider>
  )
}

export default App
