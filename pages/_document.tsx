import Document, { DocumentContext, DocumentInitialProps, Head, Html, Main, NextScript } from 'next/document';
import { ReactElement } from 'react';
class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render(): ReactElement {
    return (
      <Html>
        <Head />

        <meta httpEquiv="Expires" content="0" />
        <body style={{ margin: 0 }}>
          <Main />
          <NextScript />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.addEventListener('message', function(event) {
                  if (event.origin !== 'https://store.quxtech.tv/') {
                    console.warn('Received message from unauthorized origin:', event.origin);
                    return;
                  }
                  console.log(event);
                  const token = event.data.token;
                  console.log('Received token:', token);

                  localStorage.setItem(storage.QUX_PAY_USER_TOKEN, token)
                }, false);
              `,
            }}
          />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
