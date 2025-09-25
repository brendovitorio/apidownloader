const express = require("express");
const cors = require("cors");
const playdl = require("play-dl");

const app = express();
const PORT = 3000;
const HOST = "0.0.0.0";

app.use(cors());
app.use(express.json());

async function getDirectUrl(url) {
  if (url.includes("youtube")) {
    const stream = await playdl.stream(url);
    return stream.url;
  }

  const info = await playdl.video_info(url);
  if (info && info.format) {
    return info.format[0].url; // pega primeiro formato válido
  }

  throw new Error("Não foi possível obter o vídeo");
}

app.post("/api/download", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL não informada" });

    const downloadUrl = await getDirectUrl(url);
    res.json({ url: downloadUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Erro ao processar vídeo" });
  }
});

app.listen(PORT, HOST, () => {
  console.log(`✅ Backend rodando em http://${HOST}:${PORT}`);
});
