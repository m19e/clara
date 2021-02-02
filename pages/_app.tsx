import { AppProps } from "next/app";
import Head from "next/head";
import { RecoilRoot } from "recoil";
import "../styles/global.css";
import "../styles/loader.css";
import "../styles/font.css";

const App = ({ Component, pageProps }: AppProps) => (
    <RecoilRoot>
        <Head>
            <link rel="shortcut icon" href="/favicon.ico" />
        </Head>
        <Component {...pageProps} />
    </RecoilRoot>
);

export default App;
