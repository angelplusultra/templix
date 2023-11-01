import ReactDOM from 'react-dom/client'
import './assets/index.css'
import App from './App'
import { HashRouter } from 'react-router-dom'
import { AuthProvider, TemplatesProvider } from './context'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <HashRouter>
    <AuthProvider>
      <TemplatesProvider>
        <App />
      </TemplatesProvider>
    </AuthProvider>
  </HashRouter>
)
