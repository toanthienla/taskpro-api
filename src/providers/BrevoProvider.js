const brevo = require('@getbrevo/brevo');
import env from '~/config/enviroment';

let apiInstance = new brevo.TransactionalEmailsApi();
let apiKey = apiInstance.authentications['apiKey'];
apiKey.apiKey = env.BREVO_API_KEY;

const sendEmail = async (toEmail, subject, htmlContent) => {
  let sendSmtpEmail = new brevo.SendSmtpEmail();

  // Email sender
  sendSmtpEmail.sender = {
    email: env.ADMIN_EMAIL_ADDRESS,
    name: env.ADMIN_EMAIL_NAME
  };

  // Email receivers
  sendSmtpEmail.to = [{ email: toEmail }];

  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = htmlContent;

  // Call Bravo send email
  return apiInstance.sendTransacEmail(sendSmtpEmail);
};

export const BrevoProvider = {
  sendEmail
};