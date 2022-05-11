import nodemailer from "nodemailer";

import config from "../../../core/config";
import { logger } from "../../global/helpers/loggers";

export default class MailService {
  static async sendPasswordResetEmail({
    to, passwordResetToken, userId
  }) {
    const { clientMainAppDomainName } = config.appConfig;

    try {
      await MailService.sendEmail({
        from: "info@alloy.capital",
        to,
        subject: "Reset passsword",
        text: `You recently requested to reset your Alloy password. To select a new password, visit this link ${clientMainAppDomainName}/password-reset/${passwordResetToken}`,
        html: `<p>You recently requested to reset your Alloy password. To select a new password, click <a href="${clientMainAppDomainName}/password-reset/${passwordResetToken}">here</a>.</p>`
      });

    } catch (error) {
      logger.info(`Error sending password reset email: ${error.message}`)
    }
  }

  static async sendVerificationEmail({
    to, emailVerificationToken, userId
  }) {

    const { clientMainAppDomainName } = config.appConfig;

    try {
      await MailService.sendEmail({
        from: "'Alloy' info@alloy.capital",
        to,
        subject: "Verify your account",
        text: `Thank you for signing up. Visit this link ${clientMainAppDomainName}/verify-email/${emailVerificationToken} to verify your email`,
        html: `<p>Thank you for signing up. Click <a href="${clientMainAppDomainName}/verify-email/${emailVerificationToken}">here</a> to verify your email.</p>`
      })

    } catch (error) {
      logger.info(`Error verifying email: ${error.message}`)
    }
  }


  static async sendEmail({
    from, to, subject, text, html
  }) {

    var transport = nodemailer.createTransport({
      service: "SendPulse",
      auth: {
        user: config.appConfig.nodemailerTransportUser,
        pass: config.appConfig.nodemailerTransportPassword
      }
    });

    let mailOptions = { from, to, subject, text, html };

    transport.sendMail(mailOptions, function (error, response) {
      if (error) {
        throw new Error("Error: sending email:" + " " + error.message);
      }

      logger.info(`Message sent: ${JSON.stringify(response)}`)
    });
  }
}
