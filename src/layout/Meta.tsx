import { NextSeo } from 'next-seo';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Config from '../Config';

type IMetaProps = {
    title: string;
    description?: string;
    canonical?: string;
    reverseTitle?: boolean;
    isThumbnail?: boolean;
    customImage?: string;
};

const Meta = (props: IMetaProps) => {
    const router = useRouter();

    const useTitle = props.reverseTitle ? `${props.title} - ${Config.name}` : `${Config.name} - ${props.title}`;
    const useImage = !props.isThumbnail ? Config.defaultIcon : Config.defaultImage;
    const useKeywords = 'keymash,keyma.sh,keyma sh,keysmash,typing,typing practice,type,type test,type practice,typing games,online typing,multiplayer typing,learn typing,how to type,multiplayer typing game,multiplayer typing website,typeracer alternative,typing website,new games,competitive typing,speed typing,type faster,mavis beacon,typing tutor,free typing games,typing test,typing lessons,wpm,typing software,typing game,typing practice,free typing program,typing games for kids,best typing game,typing skills,free typing test,typing speedtest,typing test,speedtest,speed test,typing,test,typing-test,typing test,smooth caret,smooth,new,new typing site,new typing website';
    const useDescription = props.description || 'An online multiplayer typing game where you can go head to head versus players around the world.'

    return (
        <>
            <Head>
                <meta charSet="UTF-8" key="charset" />
                <meta name="viewport" content="width=device-width,initial-scale=1" key="viewport" />
                <meta name="theme-color" content="#FB923C" />
                <link rel="apple-touch-icon" href={`${router.basePath}/apple-touch-icon.png`} key="apple" />
                <link rel="icon" type="image/png" sizes="32x32" href={`${router.basePath}/favicon-32x32.png`} key="icon32" />
                <link rel="icon" type="image/png" sizes="16x16" href={`${router.basePath}/favicon-16x16.png`} key="icon16" />
                <link rel="icon" href={`${router.basePath}/favicon.ico`} key="favicon" />
                <title>{useTitle}</title>

                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap" rel="stylesheet" />
            </Head>
            <NextSeo
                title={useTitle}
                description={useDescription}
                canonical={props.canonical}
                openGraph={{
                    type: 'website',
                    title: useTitle,
                    description: useDescription,
                    url: props.canonical || router.asPath,
                    site_name: Config.name,
                    images: [ { url: props.customImage || useImage, alt: useTitle } ]
                }}
                twitter={{
                    cardType: props.isThumbnail ? 'summary_large_image' : 'summary',
                    handle: "@KeymashGame"
                }}
                additionalMetaTags={[
                    { name: 'keywords', content: useKeywords },
                ]}
            />
        </>
    );
};

export { Meta };
