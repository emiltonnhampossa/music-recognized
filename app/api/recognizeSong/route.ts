import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import fs from 'fs';
import axios from 'axios';
import crypto from 'crypto';
import path from 'path';
import FormData from 'form-data';
import { promisify } from 'util';

const unlinkAsync = promisify(fs.unlink);

const upload = multer({ dest: 'uploads/' });

function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: Function) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log('Método HTTP recebido:', req.method); // Verificação adicional

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  await runMiddleware(req, res, upload.single('file'));

  try {
    const file = (req as any).file;
    if (!file) {
      return res.status(400).json({ message: 'Nenhum arquivo foi enviado' });
    }

    const audioBuffer = fs.readFileSync(file.path);
    const host = process.env.ACR_HOST;
    const accessKey = process.env.ACR_ACCESS_KEY;
    const accessSecret = process.env.ACR_ACCESS_SECRET;
    const httpMethod = 'POST';
    const httpUri = '/v1/identify';
    const timestamp = Math.floor(Date.now() / 1000);

    const stringToSign = [httpMethod, httpUri, accessKey, 'audio', timestamp].join('\n');
    const signature = crypto.createHmac('sha1', accessSecret!).update(stringToSign).digest('base64');

    const formData = new FormData();
    formData.append('access_key', accessKey!);
    formData.append('data_type', 'audio');
    formData.append('signature', signature);
    formData.append('sample_bytes', audioBuffer.length.toString());
    formData.append('sample', audioBuffer, path.basename(file.path));
    formData.append('timestamp', timestamp.toString());

    const response = await axios.post(`https://${host}${httpUri}`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    await unlinkAsync(file.path);
    res.status(200).json(response.data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao processar o arquivo de música',  });
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
