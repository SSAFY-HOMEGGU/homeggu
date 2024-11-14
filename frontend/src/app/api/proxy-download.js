import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '허용되지 않는 메소드입니다' });
  }

  try {
    const { url } = req.body;
    const response = await axios.get(url, {
      responseType: 'arraybuffer'
    });

    res.setHeader('Content-Type', 'application/octet-stream');
    res.send(response.data);
  } catch (error) {
    console.error('프록시 다운로드 실패:', error);
    res.status(500).json({ message: '파일 다운로드 실패' });
  }
}