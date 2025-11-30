// api/itunes-proxy.js
export default async function handler(req, res) {
  // 处理预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 只允许 GET 请求
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { term, entity = 'musicTrack', limit = 50, offset = 0, country = 'CN', lang = 'zh_cn' } = req.query;

  if (!term) {
    return res.status(400).json({ error: 'Missing search term' });
  }

  try {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=${entity}&limit=${limit}&offset=${offset}&country=${country}&lang=${lang}`;
    
    console.log('代理请求:', url);
    
    const response = await fetch(url);
    const data = await response.json();
    
    // 设置CORS头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    res.status(200).json(data);
  } catch (error) {
    console.error('代理错误:', error);
    res.status(500).json({ error: error.message });
  }
}