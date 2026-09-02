import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: 'AQ.Ab8RN6LqfLs-CcCc1nmpoZq8j4VcnUJjCcDoidwMFnTOQJnrrw' });

async function runEcoShieldTest() {
  const prompt = `
    Kamu adalah EcoShield AI, asisten keuangan cerdas & ramah untuk generasi muda.
    
    Ada pengguna yang mau beli barang ini:
    - Nama Barang: Sepatu Sneakers Fast-Fashion
    - Harga: Rp 1.200.000
    - Tabungan Saat Ini: Rp 2.000.000
    
    Berikan respons singkat (maksimal 3 kalimat) dengan gaya anak muda yang santai tapi persuasif. 
    Jelaskan apakah ini keputusan yang aman dan berikan saran alternatif untuk investasi hijau/tabungan.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash', // UBAH DI SINI
      contents: prompt,
    });

    console.log("\n=== RESPON ECOSHIELD AI ===");
    console.log(response.text);
  } catch (error) {
    console.error("Gagal terhubung ke AI:", error);
  }
}

runEcoShieldTest();