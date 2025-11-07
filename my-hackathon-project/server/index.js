import express from 'express'
import cors from 'cors'
import { createPdf } from './pdfGenerator.js' // Import the magic

// Set up the app
const app = express()
const PORT = 4000 

// --- Middleware ---
app.use(cors()) 
app.use(express.json({ limit: '10mb' })) // Allow larger payloads for images later
app.use(express.urlencoded({ extended: true, limit: '10mb' }))


// --- Routes ---
app.get('/api/test', (req, res) => {
  res.json({ message: 'Success! Frontend is connected.' })
})

// This is the main PDF generation route
app.post('/api/generate', async (req, res) => {
  try {
    // 1. Get the data from the frontend
    const data = req.body
    console.log('Received data. Starting PDF generation...')

    // 2. Give this 'data' to your PDF generation function
    const pdfBytes = await createPdf(data) // This returns the raw PDF bytes

    // 3. Send the PDF back to the frontend
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename=lab_record.pdf')
    res.send(Buffer.from(pdfBytes)) // Send the bytes as a buffer

    console.log('PDF generated and sent successfully.')

  } catch (error) {
    console.error('Error in /api/generate:', error)
    res.status(500).json({ message: 'Error generating PDF' })
  }
})

// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})