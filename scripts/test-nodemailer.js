require('dotenv').config({ path: '.env.local' });
const nodemailer = require('nodemailer');

async function testNodemailer() {
  console.log('--- Testando Nodemailer + Gmail ---');
  console.log('User:', process.env.GMAIL_USER);
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"Teste HUB Lab-Div" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER, // Teste enviando para si mesmo
      subject: 'Teste de Entrega - HUB Lab-Div',
      text: 'O Nodemailer está funcionando corretamente!',
      html: '<b>O Nodemailer está funcionando corretamente!</b>',
    });
    console.log('Mensagem enviada:', info.messageId);
    console.log('Sucesso!');
  } catch (error) {
    console.error('Falha Crítica:', error);
  }
}

testNodemailer();
