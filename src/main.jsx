import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { ThemeProvider } from './provider/ThemeProvider'
import { router } from './routes/router'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { HelmetProvider } from 'react-helmet-async';
import {QueryClient, QueryClientProvider,} from '@tanstack/react-query'
import AuthProvider from './provider/AuthProvider'


const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
<React.StrictMode>
<AuthProvider>
<QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <HelmetProvider>
          <RouterProvider router={router} />
        </HelmetProvider>
        <ToastContainer></ToastContainer>
      </ThemeProvider>
    </QueryClientProvider>
</AuthProvider>
</React.StrictMode>,
)


