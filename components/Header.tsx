import { deflate } from "zlib";
import Head from "next/head";

type OGP = {
    title: string;
    description: string;
    ogImage: string;
    ogDescription: string;
    ogTitle: string;
    twTitle: string;
    twDescription: string;
    twImage: string;
    twUrl: string;
    twCard: "summary" | "summary_large_image";
};

const Header = ({ title, description, ogTitle, ogDescription, ogImage, twTitle, twDescription, twImage, twUrl, twCard }: OGP) => (
    <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:site_name" content="Clara" />
        <meta property="og:title" content={ogTitle + " | Clara"} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:type" content="article" />
        <meta property="twitter:title" content={twTitle + " | Clara"} />
        <meta property="twitter:description" content={twDescription} />
        <meta property="twitter:image" content={twImage} />
        <meta property="twitter:url" content={twUrl} />
        <meta property="twitter:card" content={twCard} />
    </Head>
);

export default Header;
