import Link from "next/link";
import Tooltip from "./Tooltip";

export default function HomeButton() {
    return (
        <Link href="/">
            <a>
                <Tooltip text="トップに戻る" child={<img className="w-6 h-6" src="/icon-64x64.png" alt="Clara" />} />
            </a>
        </Link>
    );
}
