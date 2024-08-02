import { SEO_META_TAGS } from 'constants/seoMetaTags';
import { isBrowser } from 'constants/url';
import Head from 'next/head';
import { FC } from 'react';
import { Pages } from 'typings';

type SEOProps = {
  page?: Pages;
  title?: string;
  description?: string;
  image?: string;
  customDescription?: string;
  shouldNotIndex?: boolean;
};

export const SEO: FC<SEOProps> = ({ page, title, description, image, customDescription, shouldNotIndex }) => {
  const metaTitle = page ? SEO_META_TAGS[page]?.title : `${title}`;
  const metaDescription = page ? SEO_META_TAGS[page]?.description : description;
  const metaImage = page ? SEO_META_TAGS[page]?.image : image;
  const url = isBrowser ? window.location.href : '';
  const metaKeyphrase = page ? SEO_META_TAGS[page]?.keyphrase : '';

  return (
    <Head>
      <title>{metaTitle}</title>
      <meta name="title" content={metaTitle} />
      <meta name="description" content={customDescription || metaDescription} />
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0" />
      <meta name="keywords" content={metaKeyphrase} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={customDescription || metaDescription} />
      <meta property="og:image" content={metaImage} />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={metaTitle} />
      <meta property="twitter:description" content={customDescription || metaDescription} />
      <meta property="twitter:image" content={metaImage} />
      {shouldNotIndex && <meta name="robots" content="noindex" />}
      <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
    </Head>
  );
};
