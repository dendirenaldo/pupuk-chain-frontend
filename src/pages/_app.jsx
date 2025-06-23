import '@/styles/globals.css';
import "bootstrap/dist/css/bootstrap.min.css";
import 'simplebar-react/dist/simplebar.min.css';
import { AuthProvider } from '@/context/AuthProvider'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { config } from '@fortawesome/fontawesome-svg-core'
config.autoAddCss = false
config.autoReplaceSvg = 'nest'
import { ConfigurationProvider } from '@/context/ConfigurationProvider';
import NextNProgress from 'nextjs-progressbar';
import { useEffect } from 'react';


function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const bootstrap = require("bootstrap/dist/js/bootstrap.bundle.min.js");
    window.bootstrap = bootstrap;
  }, [])
  const getLayout = Component.getLayout || ((page) => page)
  return (
    <ConfigurationProvider>
      <AuthProvider>
        <NextNProgress />
        {getLayout(<Component {...pageProps} />)}
      </AuthProvider>
    </ConfigurationProvider>
  )
}

export default MyApp
