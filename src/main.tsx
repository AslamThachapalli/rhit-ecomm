import React from 'react'
import ReactDOM from 'react-dom/client'
import { RecoilRoot } from 'recoil'
import { RouterProvider } from 'react-router-dom'

import { router } from './router'
import './index.css'
import { ThemeProvider } from '@material-tailwind/react'

const theme = {
  button: {
    defaultProps: {
      color: "teal",
    },
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RecoilRoot>
      <ThemeProvider value={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </RecoilRoot>
  </React.StrictMode>,
)
