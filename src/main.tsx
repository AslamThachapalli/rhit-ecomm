import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import RootRoute from './routes/RootRoute.tsx'
import HomeRoute from './routes/HomeRoute.tsx'
import { RecoilRoot } from 'recoil'
import CartRoute from './routes/CartRoute.tsx'
import RequireAuth from './components/RequireAuth.tsx'
import LoginRoute from './routes/LoginRoute.tsx'
import AccountRoute from './routes/AccountRoute.tsx'
import MyProfileRoute from './routes/MyProfileRoute.tsx'
import AddressRoute from './routes/AddressRoute.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootRoute />,
    children: [
      {
        index: true,
        element: <HomeRoute />,
      },
      {
        path: 'cart',
        element: <RequireAuth><CartRoute /></RequireAuth>
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
          }
        ]
      },
    ]
  },
  {
    path: '/auth',
    element: <LoginRoute />
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RecoilRoot>
      <RouterProvider router={router} />
    </RecoilRoot>
  </React.StrictMode>,
)
