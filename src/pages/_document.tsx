import { Head, Html, Main, NextScript } from 'next/document';
import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core';

export default function Document() {
    // Lang will be set dynamically by useLanguage hook in runtime
    return (
        <Html lang="en" {...mantineHtmlProps}>
            <Head>
                <ColorSchemeScript />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
