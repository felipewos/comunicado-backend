import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.post('/enviar-comunicado', async (req, res) => {
  const { nomeArquivo, pdfBase64, destinatario, nome, numero, tipo } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'Outlook365',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  let mailOptions;

  if (tipo === "Advertência") {
    mailOptions = {
      from: `"Setor de Disciplina" <${process.env.EMAIL_USER}>`,
      to: destinatario,
      subject: `Solicitação de Assinatura de Advertência`,
      text: `Prezado(a) Coordenador(a),

Encaminho, em anexo, o Comunicado de Advertência nº ${numero}, referente ao(à) aluno(a) ${nome}, para sua ciência e assinatura.

Solicito que, por gentileza, revise e assine o documento, a fim de prosseguirmos com os trâmites internos.

Caso haja qualquer dúvida ou necessidade de ajustes, estou à disposição.

Este e-mail também foi encaminhado à Gerência Acadêmica e à SAPED para ciência.

Atenciosamente,

Felipe Wagner de O. e Silva
Chefe do Setor de Disciplina
Campus Petrópolis
(24)2292-9718
www.cefet-rj.br`,
      attachments: [
        {
          filename: nomeArquivo,
          content: Buffer.from(pdfBase64, 'base64'),
          encoding: 'base64'
        }
      ]
    };
  } else if (tipo === "Suspensão") {
    mailOptions = {
      from: `"Setor de Disciplina" <${process.env.EMAIL_USER}>`,
      to: destinatario,
      subject: `Solicitação de Assinaturas de Suspensão`,
      text: `Prezados(as) Gerente Administrativo(a) e Coordenador(a),

Encaminho, em anexo, o Comunicado de Suspensão nº ${numero}, referente ao(à) aluno(a) ${nome}, para suas ciências e assinaturas.

Solicito que, por gentileza, revise e assine o documento, a fim de prosseguirmos com os trâmites internos.

Este e-mail também foi encaminhado à SAPED para ciência.

Atenciosamente,

Felipe Wagner de O. e Silva
Chefe do Setor de Disciplina
Campus Petrópolis
(24)2292-9718
www.cefet-rj.br`,
      attachments: [
        {
          filename: nomeArquivo,
          content: Buffer.from(pdfBase64, 'base64'),
          encoding: 'base64'
        }
      ]
    };
  } else {
    return res.status(400).json({ erro: 'Tipo de comunicado inválido.' });
  }

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
