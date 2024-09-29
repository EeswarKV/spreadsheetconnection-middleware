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

        // Log the fetched data
        console.log('Fetched Stock Data:', stockData);

        // Map stock data into a human-readable format
        let structuredStockData = 'Here is the stock data:\n';
        const headers = stockData[0]; // First row contains headers
        for (let i = 1; i < stockData.length; i++) {
            const stock = stockData[i];
            structuredStockData += `Stock Name: ${stock[0]}, Entry Price Range: ${stock[1]}, Take Profit: ${stock[4]}, Trade Type: ${stock[5]}\n`;
        }

        console.log('Structured Stock Data:', structuredStockData);

        // Prepare the GPT prompt
        const prompt = `Analyze the following stock data and suggest the best stock to invest in based on the entry price range and take profit values:\n\n${structuredStockData}`;

        // Send the prompt to GPT
        const gptResponse = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [{ role: 'user', content: prompt }],
        });

        // Return GPT's analysis
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
