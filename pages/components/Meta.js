import Head from 'next/head';

const Meta = ({ title, keywords, description }) => {
  return (
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="keywords" content={keywords} />
      <meta name="description" content={description} />
      <meta charSet="utf-8" />
      <link rel="icon" href="/Watermarklogo.png" />
      <title>{title}</title>
      {/* Add additional tags as needed */}
    </Head>
  );
};

Meta.defaultProps = {
  title: 'Trevor Twomey Photography',
  keywords: 'music photography, concert photography, band photos, live music',
  description: 'Trevor Twomey\'s portfolio of music and concert photography capturing the energy and passion of live performances.'
};

export default Meta;
