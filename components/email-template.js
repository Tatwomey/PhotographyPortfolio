const React = require("react");

const EmailTemplate = ({ firstName }) => (
  <div>
    <h1>
      Thanks for reaching out {firstName}! I&apos;ll be in touch with you shortly.
    </h1>
  </div>
);

module.exports = {
  EmailTemplate,
};
