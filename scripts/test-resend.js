require('dotenv').config({ path: '.env.local' });
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function testResend() {
  console.log('--- Testando Resend ---');
  console.log('API Key:', process.env.RESEND_API_KEY ? 'Presente' : 'AUSENTE');
  
  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'delivered@resend.dev', // Resend testing address
      subject: 'Teste de Integração HUB Lab-Div',
      html: '<strong>Resend está funcionando no servidor local!</strong>'
    });
    console.log('Sucesso!', data);
  } catch (error) {
    console.error('Falha Crítica:', error);
  }
}

testResend();
