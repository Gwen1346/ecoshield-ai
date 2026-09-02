import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/analyze', async (req, res) => {
  try {
    const { item, price, category } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `Analisis pembelian berikut untuk anak muda/Gen Z di Indonesia. 
    Barang: ${item}, Harga: Rp ${price}, Kategori: ${category}. 
    Berikan respon JSON dengan format: 
    { "recommendation": "BUY" | "PASS" | "THINK", "ecoScore": number, "reasoning": "string" }`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      res.json(JSON.parse(jsonMatch[0]));
    } else {
      res.status(500).json({ error: "Gagal memproses analisis AI" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default app;