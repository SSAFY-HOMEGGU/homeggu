// pages/api/proxy-download.js
import axios from 'axios';

export default async function handler(req, res) {
  const { url } = req.query;

  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/octet-stream'
      }
    });

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', 'attachment; filename=model.obj');
    res.send(Buffer.from(response.data));
  } catch (error) {
    console.error('프록시 다운로드 에러:', error);
    res.status(500).json({ error: '다운로드 실패' });
  }
}