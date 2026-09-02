import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
// Menggunakan port dinamis dari hosting cloud, fallback ke 3000 jika lokal
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Mengambil API Key aman dari file .env
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
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const resultJson = JSON.parse(response.text);

    res.json({ success: true, ...resultJson });
  } catch (error) {
    console.error("Error AI:", error);
    res.status(500).json({ success: false, message: 'Gagal menganalisis dengan AI.' });
  }
});

app.listen(PORT, () => {
  console.log(`⚡ Server EcoShield AI berjalan di http://localhost:${PORT}`);
});