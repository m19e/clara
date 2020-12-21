import { AppProps } from "next/app";
import { AuthProvider } from "../auth/AuthProvider";
import "../styles/global.css";
import "../styles/loader.css";
import "../styles/font.css";

const App = ({ Component, pageProps }: AppProps) => (
    <AuthProvider>
        <Component {...pageProps} />
    </AuthProvider>
);

export default App;
