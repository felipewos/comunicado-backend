import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.post('/enviar-comunicado', async (req, res) => {
  const { nomeArquivo, pdfBase64, destinatario } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'Outlook365',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: `"Sistema CEFET" <${process.env.EMAIL_USER}>`,
    to: destinatario,
    subject: `Comunicado Escolar - ${nomeArquivo}`,
    text: 'Segue em anexo o comunicado gerado automaticamente.',
    attachments: [
      {
        filename: nomeArquivo,
        content: Buffer.from(pdfBase64, 'base64'),
        encoding: 'base64'
      }
    ]
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ sucesso: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao enviar e-mail' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Servidor ativo na porta ${port}`));
