// eslint-disable-next-line @next/next/no-document-import-in-page
import Document, { Html, Head, Main, NextScript } from 'next/document';
import React from 'react';
// eslint-disable-next-line @next/next/no-script-in-document
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
                </body>
            </Html>
        );
    }
}

export default MyDocument;
