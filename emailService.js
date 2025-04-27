const SibApiV3Sdk = require('sib-api-v3-sdk');
require('dotenv').config();

const sendEmail = async (to, subject, text) => {
  const defaultClient = SibApiV3Sdk.ApiClient.instance;
  const apiKey = defaultClient.authentications['api-key'];
  apiKey.apiKey = process.env.SENDINBLUE_API_KEY;

  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  const sendSmtpEmail = {
    to: [{ email: to }],
    sender: {
      name: process.env.FROM_NAME,
      email: process.env.FROM_EMAIL
    },
    subject,
    textContent: text,
  };

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Sendinblue error:', error.response?.body || error.message);
  }
};

module.exports = sendEmail;
