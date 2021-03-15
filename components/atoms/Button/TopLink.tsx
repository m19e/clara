import Link from "next/link";
import Tooltip from "components/molecules/Tooltip";

const TopLink = () => (
    <Link href="/">
        <a>
            <Tooltip text="トップに戻る">
                <img className="w-6 h-6" src="/icon-64x64.png" alt="Clara" />
            </Tooltip>
        </a>
    </Link>
);

export default TopLink;
