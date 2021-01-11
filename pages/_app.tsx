import { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import "../styles/global.css";
import "../styles/loader.css";
import "../styles/font.css";

const App = ({ Component, pageProps }: AppProps) => (
    <RecoilRoot>
        <Component {...pageProps} />
    </RecoilRoot>
);

export default App;
