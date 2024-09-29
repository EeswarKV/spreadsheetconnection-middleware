const express = require('express');
const axios = require('axios');
const { OpenAI } = require('openai');
require('dotenv').config();

// Initialize Express app
const app = express();
const port = 3000;  // Or any other port you'd like to use

// OpenAI configuration
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Route to fetch stock data and send it to GPT for analysis
app.get('/analyze-stocks', async (req, res) => {
    try {
      // Fetch stock data from Vercel URL
      const stockResponse = await axios.get('https://spreadsheetconnection.vercel.app/');
      const stockData = stockResponse.data;
  
      // Log the data to ensure it's being fetched correctly
      console.log('Fetched Stock Data:', stockData);
  
      // Prepare a prompt for GPT
      const prompt = `Analyze the following stock data and suggest the best stock to invest in based on the entry price range and take profit values:\n\n${JSON.stringify(stockData)}`;
  
      // Send the stock data to GPT
      const gptResponse = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
      });
  
      // Return GPT's response
      res.json({ gptAnalysis: gptResponse.choices[0].message.content });
  
    } catch (error) {
      console.error('Error fetching stock data or communicating with GPT:', error.message);
      res.status(500).json({ error: 'Failed to fetch stock data or GPT analysis' });
    }
  });

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// module.exports = fetchDataFromCloudFunction;
