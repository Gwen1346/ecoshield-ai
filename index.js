import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// Melayani file statis dari folder public
app.use(express.static(path.join(__dirname, 'public')));

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/api/analyze-purchase', async (req, res) => {
  try {
    const { namaBarang, hargaBarang, tabungan } = req.body;

    const prompt = `
      Kamu adalah EcoShield AI, asisten keuangan cerdas & ramah untuk generasi muda.
      Analisis rencana pembelian berikut:
      - Nama Barang: ${namaBarang}
      - Harga: Rp ${hargaBarang}
      - Tabungan Saat Ini: Rp ${tabungan}

      Kembalikan respon HANYA dalam format JSON valid dengan struktur:
      {
        "status": "BAHAYA" | "WASPADA" | "AMAN",
        "analysis": "Pesan analisis singkat max 3 kalimat gaya anak muda",
        "greenReturn1Year": "Estimasi nilai uang jika diinvestasikan ke Reksa Dana ESG selama 1 tahun (asumsi return 6-8%)"
      }

      Kriteria Status:
      - BAHAYA: Jika harga barang > 30% dari tabungan.
      - WASPADA: Jika harga barang 15% - 30% dari tabungan.
      - AMAN: Jika harga barang < 15% dari tabungan.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const resultJson = JSON.parse(response.text);
    return res.json({ success: true, ...resultJson });
  } catch (error) {
    console.error("Error AI:", error);
    return res.status(500).json({ success: false, message: 'Gagal menganalisis dengan AI.' });
  }
});

// Routing default ke index.html di dalam folder public
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

export default app;