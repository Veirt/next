import Document, { Html, Head, Main, NextScript } from 'next/document';
import React from 'react';
import Script from 'next/script';
 
// Need to create a custom _document because i18n support is not compatible with `next export`.
class MyDocument extends Document {
    render() {
        return (
            <Html lang={"en"}>
                <Head />
                <body>                                            
                    <script>0</script>
                    <Main />
                    <NextScript />
                    <Script src="https://www.googletagmanager.com/gtag/js?id=UA-169806672-1" strategy="afterInteractive" />
                    <Script id="google-analytics" strategy="afterInteractive">
                      {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){window.dataLayer.push(arguments);}
                        gtag('js', new Date());
              
                        gtag('config', 'UA-169806672-1');
                      `}
                    </Script>


                    <Script id="google-analytics" strategy="afterInteractive">
                      {`
                        window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
                        ga('create', 'G-C9XCQ04FCC', 'auto');
                        ga('send', 'pageview');
                      `}
                    </Script>
                    <Script
                      src="https://www.google-analytics.com/analytics.js"
                      strategy="afterInteractive"
                    />

                    <script dangerouslySetInnerHTML={{ __html: `
                        var ramp = { 
                            mode: "ramp", 
                            config: "//config.playwire.com/1024504/v2/websites/73290/banner.json",
                            passiveMode: true,
                        }
                    ` }} />
                    <script id="ramp" src="//cdn.intergient.com/pageos/pageos.js" type="text/javascript" />
                    <script src="https://btloader.com/tag?o=5150306120761344&upapi=true" />
                </body>
            </Html>
        );
    }
}

export default MyDocument;