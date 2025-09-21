const express = require("express");
const cors = require("cors");
const playdl = require("play-dl");

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0'; // aceita conexões externas (LAN / Internet)

app.use(cors());
app.use(express.json());

// Função para pegar o link direto sem marca d'água
async function getDirectUrl(url) {
  if (url.includes("tiktok")) {
    // TikTok sem watermark
    const stream = await playdl.stream(url, { noWatermark: true });
    return stream.url;
  } else if (url.includes("twitter") || url.includes("x.com")) {
    const info = await playdl.video_info(url);
    return info.video_details?.url;
  } else if (url.includes("instagram")) {
    const info = await playdl.video_info(url);
    return info.video_details?.url;
  } else if (url.includes("kwai")) {
    const info = await playdl.video_info(url);
    return info.video_details?.url;
  } else if (url.includes("youtube")) {
    const stream = await playdl.stream(url);
    return stream.url;
  } else {
    throw new Error("Plataforma não suportada");
  }
}

// Endpoint para baixar vídeo
app.post("/api/download", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL não informada" });

    const downloadUrl = await getDirectUrl(url);

    if (!downloadUrl) {
      return res.status(400).json({ error: "Não foi possível obter o vídeo" });
    }

    res.json({ url: downloadUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Erro ao processar vídeo" });
  }
});

app.listen(PORT, HOST, () => {
  console.log(`Backend rodando em http://${HOST}:${PORT}`);
});
