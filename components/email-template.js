const React = require("react");

const EmailTemplate = ({ firstName }) => (
  <div style={{ fontFamily: "Arial, sans-serif", fontSize: "16px", lineHeight: "1.6", color: "#333" }}>
    <p>Hi {firstName},</p>

    <p>
      Thanks for reaching out! I’ve received your message and will get back to you as soon as possible.
    </p>

    <p style={{ marginTop: "1.5rem" }}>
      Best regards,<br />
      Trevor Twomey
    </p>
  </div>
);

module.exports = {
  EmailTemplate,
};
