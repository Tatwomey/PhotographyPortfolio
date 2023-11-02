const React = require("react");

const EmailTemplate = ({ firstName }) => (
  <div>
    <h1>Welcome, {firstName}!</h1>
  </div>
);

module.exports = {
  EmailTemplate
};
