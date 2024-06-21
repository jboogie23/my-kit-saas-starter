import { APP_NAME, APP_URL } from "$configs/general";
import { route } from "$lib/ROUTES";
import * as m from "$paraglide/messages";

import { sendEmail } from ".";
import EmailChangeHtml from "./templates/email-change.html?raw";
import EmailVerificationHtml from "./templates/email-verification.html?raw";
import PasswordResetHtml from "./templates/password-reset.html?raw";
import WelcomeHtml from "./templates/welcome.html?raw";

// TODO we need to translate email bodies sent to users

/**
 * Sends a verification email to the specified email address.
 *
 * @param {string} email - The email address to send the verification email to.
 * @param {string} name - The name of the user to include in the email.
 * @param {string} token - The verification token to include in the email.
 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating whether the email was sent successfully.
 */
export async function sendEmailVerificationEmail(email: string, name: string, token: string): Promise<boolean> {
  if (!email || !name || !token) return false;

  const body = EmailVerificationHtml.replaceAll("{{appName}}", APP_NAME).replace("{{user}}", name).replace("{{token}}", token);

  return await sendEmail(email, m.email_emailVerification_title({ appName: APP_NAME }), body);
}

export async function sendWelcomeEmail(email: string, name: string): Promise<boolean> {
  if (!email || !name) return false;

  const body = WelcomeHtml.replaceAll("{{appName}}", APP_NAME)
    .replace("{{user}}", name)
    .replace("{{url}}", APP_URL + route("/app/dashboard"));

  return await sendEmail(email, m.email_welcome_title({ appName: APP_NAME }), body);
}

// TODO insert welcome user in this email
export async function sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
  if (!email || !token) return false;

  const body = PasswordResetHtml.replaceAll("{{appName}}", APP_NAME).replace("{{token}}", token);

  return await sendEmail(email, m.email_passwordReset_title({ appName: APP_NAME }), body);
}

export async function sendEmailChangeEmail(email: string, name: string, token: string): Promise<boolean> {
  if (!email || !name || !token) return false;

  const body = EmailChangeHtml.replaceAll("{{appName}}", APP_NAME).replace("{{user}}", name).replace("{{token}}", token);

  return await sendEmail(email, m.email_emailChange_title({ appName: APP_NAME }), body);
}
