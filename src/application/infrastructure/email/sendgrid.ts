import sgMail from '@sendgrid/mail';

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
if (!SENDGRID_API_KEY) {
  throw new Error("A variável de ambiente SENDGRID_API_KEY não está definida.");
}

sgMail.setApiKey(SENDGRID_API_KEY);

const SENDGRID_FROM_EMAIL: string = process.env.SENDGRID_FROM_EMAIL ?? '';
if (!SENDGRID_FROM_EMAIL) {
  throw new Error("A variável de ambiente SENDGRID_FROM_EMAIL não está definida.");
}

export async function sendPasswordCreationEmail(email: string, userId: string) {
  const link = `https://aps-frontend-v2-dq9o.vercel.app/criar-senha?userId=${userId}`;

  const msg: sgMail.MailDataRequired = {
    to: email,
    from: { email: SENDGRID_FROM_EMAIL, name: "APS Plus" },
    subject: 'Crie sua senha no APS Plus',
    text: `Olá, acesse o link para criar sua senha: ${link}`,
    html: `<p>Olá, acesse o link para criar sua senha: <a href="${link}">Criar Senha</a></p>`,
  };

  try {
    await sgMail.send(msg);
    console.log(`E-mail de criação de senha enviado para: ${email}`);
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
  }
}
