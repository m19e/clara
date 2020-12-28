import { useIsMincho } from "../store/editor";
import Header from "./EditorHeader";
import Footer from "./EditorFooter";

export default function Frame() {
    const [isMincho] = useIsMincho();

    return (
        <div className={"transition-opacity duration-1000 ease-out opacity-0 hover:opacity-100" + (isMincho ? " mincho" : " gothic")}>
            <Header />
            <Footer />
        </div>
    );
}
