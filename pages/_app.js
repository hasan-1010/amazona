import { ToastContainer } from 'react-toastify';
import { useEffect } from 'react';
import { StoreProvider } from '../utils/store';
import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

function MyApp({ Component, pageProps }) {
    useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
    }, []);
    return (
        <>
            <StoreProvider>
                <PayPalScriptProvider deferLoading={true}>
                    <Component {...pageProps} />
                </PayPalScriptProvider>
            </StoreProvider>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </>
    );
}

export default MyApp;
