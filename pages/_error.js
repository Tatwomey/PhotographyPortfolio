import React from 'react';
import ErrorPage from 'next/error';

const MyError = ({ statusCode }) => {
  return <ErrorPage statusCode={statusCode} />;
};

MyError.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default MyError;
