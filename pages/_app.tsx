import { AppProps } from "next/app";
import "../styles/global.css";
import "../styles/loader.css";
import "../styles/font.css";

const App = ({ Component, pageProps }: AppProps) => <Component {...pageProps} />;

export default App;
