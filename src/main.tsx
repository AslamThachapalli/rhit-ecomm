import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import RootPage from './routes/RootPage.tsx'
import HomePage from './routes/HomePage.tsx'
import { RecoilRoot } from 'recoil'
import CartPage from './routes/CartPage.tsx'
import RequireAuth from './components/RequireAuth.tsx'
import LoginPage from './routes/LoginPage.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: '/cart',
        element: <RequireAuth><CartPage/></RequireAuth>
      }
    ]
  }, 
  {
    path: '/login',
    element: <LoginPage/>
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RecoilRoot>
      <RouterProvider router={router} />
    </RecoilRoot>
  </React.StrictMode>,
)
