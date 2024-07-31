import React from 'react'
import ReactDOM from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react'
import App from './App.jsx'
import './global/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-r2mv3rfjemmllkw6.eu.auth0.com"
      clientId="no7ngJNodj6ebYttFzEbzlcuvBDKWNJh"
      authorizationParams={{
        redirect_uri: "http://localhost:5173"
      }}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>,
)