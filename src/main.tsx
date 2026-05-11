import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/theme-overrides.css'
import { syncBootstrapTheme } from './syncBootstrapTheme'
import './services/mock'
import { store } from './reducers'
import { router } from './router'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import "../node_modules/bootstrap-icons/font/bootstrap-icons.css";
import './styles/main.css'

syncBootstrapTheme()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)
