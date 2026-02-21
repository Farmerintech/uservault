import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const SendMail = async function (to:string, subject:string, html:string) {
  const { data, error } = await resend.emails.send({
    from: 'UserVault <onboarding@resend.dev>',
    to,
    subject,
    html,
  });

  if (error) {
    return console.error({ error });
  }

  console.log({ data });
}