import { createBrowserRouter } from 'react-router-dom'

import RootRoute from './routes/RootRoute.tsx'
import HomeRoute from './routes/HomeRoute.tsx'
import CartRoute from './routes/CartRoute.tsx'
import RequireAuth from './components/RequireAuth.tsx'
import AuthRoute from './routes/AuthRoute.tsx'
import AccountRoute from './routes/AccountRoute.tsx'
import MyProfileRoute from './routes/MyProfileRoute.tsx'
import AddressRoute from './routes/AddressRoute.tsx'
import ErrorRoute from './routes/ErrorRoute.tsx'
import CheckoutRoute from './routes/CheckoutRoute.tsx'
import OrderSuccessRoute from './routes/OrderSuccessRoute.tsx'
import MyOrdersRoute from './routes/MyOrdersRoute.tsx'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootRoute />,
    errorElement: <ErrorRoute />,
    children: [
      {
        index: true,
        element: <HomeRoute />,
      },
      {
        path: 'account',
        element: <RequireAuth><AccountRoute /></RequireAuth>,
        children: [
          {
            index: true,
            element: <MyProfileRoute />
          },
          {
            path: 'address',
            element: <AddressRoute />
          }, 
          {
            path: 'my-orders',
            element: <MyOrdersRoute />
          }
        ]
      },
      {
        path: 'cart',
        element: <RequireAuth><CartRoute /></RequireAuth>
      },
      {
        path: 'checkout',
        element: <RequireAuth><CheckoutRoute /></RequireAuth>
      },
      {
        path: 'order-success/:orderId',
        element: <RequireAuth><OrderSuccessRoute /></RequireAuth>
      }
    ]
  },
  {
    path: '/auth',
    element: <AuthRoute />
  }
])