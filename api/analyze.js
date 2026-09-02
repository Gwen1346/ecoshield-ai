import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

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
    return res.status(200).json({ success: true, ...resultJson });
  } catch (error) {
    console.error("Error AI:", error);
    return res.status(500).json({ success: false, message: 'Gagal menganalisis dengan AI.' });
  }
}