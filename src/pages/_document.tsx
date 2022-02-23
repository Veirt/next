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
