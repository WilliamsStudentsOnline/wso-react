import React from 'react';

const Footer = () => {
  return (
    <footer>
      <section>
        <small>
          &copy;
          {new Date().getFullYear()}
          {' '}
Williams Students Online
        </small>
        <small>Contact Us at wso-dev [at] wso.williams.edu</small>
      </section>
    </footer>
  );
};

export default Footer;
