import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export async function sendPasswordCreationEmail(email: string, userId: string) {
  const link = `http://localhost:3000/criar-senha?userId=${userId}`;

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Crie sua senha no APS Plus',
    text: `Olá, acesse o link para criar sua senha: ${link}`,
    html: `<p>Olá, acesse o link para criar sua senha: <a href="${link}">Criar Senha</a></p>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('E-mail de criação de senha enviado para:', email, info.response);
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
  }
}
