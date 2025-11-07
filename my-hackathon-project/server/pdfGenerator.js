import { PDFDocument, rgb, StandardFonts, cmyk } from 'pdf-lib'

// --- Constants for styling ---
const FONT_SIZE_TITLE = 24
const FONT_SIZE_H1 = 18
const FONT_SIZE_H2 = 14
const FONT_SIZE_BODY = 12
const FONT_SIZE_CODE = 10

const COLOR_TITLE = rgb(0, 0, 0)
const COLOR_HEADING = rgb(0.1, 0.1, 0.4) // Dark blue
const COLOR_BODY = rgb(0.1, 0.1, 0.1)
const COLOR_CODE_BG = cmyk(0, 0, 0, 0.05) // 5% black (light gray)
const COLOR_CODE_TEXT = rgb(0, 0, 0)
const COLOR_HEADER_FOOTER = rgb(0.5, 0.5, 0.5) // Gray

const MARGIN = 72 // 1 inch margin
const LINE_HEIGHT_BODY = 18
const LINE_HEIGHT_HEADING = 24
const LINE_HEIGHT_CODE = 14

export async function createPdf(data) {
  // 1. Create a new PDF Document
  const pdfDoc = await PDFDocument.create()

  // 2. Embed the fonts
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const courierFont = await pdfDoc.embedFont(StandardFonts.Courier)

  // 3. Reusable helper class for drawing text and handling page breaks
  const draw = new TextDrawer(pdfDoc, {
    helveticaFont,
    helveticaBoldFont,
    courierFont,
  })

  // 4. --- Create the Title Page ---
  draw.addPage()
  draw.drawTitle(data.collegeName, 250)
  draw.drawTitle(data.subject, 300)
  draw.drawHeading1(`Aim: ${data.aim}`, 350) // This will now wrap

  // Submitted by block
  draw.drawText('Submitted by:', 40, 680, {
    font: helveticaBoldFont,
    size: FONT_SIZE_H2,
    color: COLOR_HEADING,
  })
  draw.drawText(data.studentName, 40, 700, {
    font: helveticaFont,
    size: FONT_SIZE_BODY,
    color: COLOR_BODY,
  })
  draw.drawText(data.rollNumber, 40, 720, {
    font: helveticaFont,
    size: FONT_SIZE_BODY,
    color: COLOR_BODY,
  })
  draw.resetCursor() // Reset cursor for next page

  // 5. --- Create the Content Pages ---
  draw.addPage()
  draw.drawHeading2('Aim')
  draw.drawBody(data.aim)

  draw.drawHeading2('Theory / Apparatus')
  draw.drawBody(data.theory)

  draw.drawHeading2('Code / Procedure')
  draw.drawCodeBlock(data.code)

  draw.drawHeading2('Output / Observations')
  draw.drawCodeBlock(data.output) // Use code block for output too

  draw.drawHeading2('Conclusion')
  draw.drawBody(data.conclusion)

  // 6. --- Add Headers and Footers to all pages ---
  const pageCount = pdfDoc.getPageCount()
  for (let i = 0; i < pageCount; i++) {
    const page = pdfDoc.getPage(i)
    const { width } = page.getSize()

    // No header/footer on title page
    if (i === 0) continue 

    // Header
    page.drawText(`${data.studentName} | ${data.subject}`, {
      x: MARGIN,
      y: page.getHeight() - MARGIN / 2,
      size: 10,
      font: helveticaFont,
      color: COLOR_HEADER_FOOTER,
    })

    // Footer
    page.drawText(`Page ${i + 1} of ${pageCount}`, {
      x: width - MARGIN - 40,
      y: MARGIN / 2,
      size: 10,
      font: helveticaFont,
      color: COLOR_HEADER_FOOTER,
    })
  }

  // 7. Serialize the PDFDocument to bytes
  const pdfBytes = await pdfDoc.save()
  return pdfBytes
}

// --- Text Drawing Helper Class ---
// This is the "engine" that handles text wrapping and page creation
class TextDrawer {
  constructor(pdfDoc, fonts) {
    this.pdfDoc = pdfDoc
    this.fonts = fonts
    this.currentPage = null
    this.y = 0
  }

  drawText(text, x, y, options) {
    this.currentPage.drawText(text, {
      x: x,
      y: this.currentPage.getHeight() - y, // Y is measured from the top
      font: options.font,
      size: options.size,
      color: options.color,
    });
  }

  addPage() {
    this.currentPage = this.pdfDoc.addPage()
    this.y = MARGIN
  }

  resetCursor() {
    this.y = 0
  }

  // Checks if we need a new page, and adds one if we do
  _checkPageBreak(heightNeeded) {
    const { height } = this.currentPage.getSize()
    if (this.y + heightNeeded > height - MARGIN) {
      this.addPage()
    }
  }

  drawTitle(text, yPos) {
    const { width } = this.currentPage.getSize()
    const textWidth = this.fonts.helveticaBoldFont.widthOfTextAtSize(
      text,
      FONT_SIZE_TITLE
    )
    this.currentPage.drawText(text, {
      x: (width - textWidth) / 2, // Centered
      y: this.currentPage.getHeight() - yPos,
      font: this.fonts.helveticaBoldFont,
      size: FONT_SIZE_TITLE,
      color: COLOR_TITLE,
    })
  }
  
  // ***** THIS IS THE NEW, FIXED FUNCTION *****
  drawHeading1(text, yPos) {
    const { width } = this.currentPage.getSize()
    const maxWidth = width - MARGIN * 2 // Max width with margins
    const lines = this._wrapText(text, maxWidth, this.fonts.helveticaFont, FONT_SIZE_H1)
    
    let currentY = yPos
    
    for (const line of lines) {
      const textWidth = this.fonts.helveticaFont.widthOfTextAtSize(line, FONT_SIZE_H1)
      this.currentPage.drawText(line, {
        x: (width - textWidth) / 2, // Center each line
        y: this.currentPage.getHeight() - currentY,
        font: this.fonts.helveticaFont,
        size: FONT_SIZE_H1,
        color: COLOR_HEADING,
        lineHeight: LINE_HEIGHT_HEADING,
      })
      currentY += LINE_HEIGHT_HEADING // Move down for the next line
    }
  }
  // *****************************************

  drawHeading2(text) {
    this._checkPageBreak(LINE_HEIGHT_HEADING * 2) // Need space before
    this.y += LINE_HEIGHT_HEADING * 1.5
    this.currentPage.drawText(text, {
      x: MARGIN,
      y: this.currentPage.getHeight() - this.y,
      font: this.fonts.helveticaBoldFont,
      size: FONT_SIZE_H2,
      color: COLOR_HEADING,
    })
    this.y += LINE_HEIGHT_BODY
  }

  drawBody(text) {
    this._checkPageBreak(LINE_HEIGHT_BODY)
    const { width } = this.currentPage.getSize()
    const maxWidth = width - MARGIN * 2
    
    // Simple text wrapping
    const lines = this._wrapText(text, maxWidth, this.fonts.helveticaFont, FONT_SIZE_BODY)
    
    for (const line of lines) {
      this._checkPageBreak(LINE_HEIGHT_BODY)
      this.currentPage.drawText(line, {
        x: MARGIN,
        y: this.currentPage.getHeight() - this.y,
        font: this.fonts.helveticaFont,
        size: FONT_SIZE_BODY,
        color: COLOR_BODY,
        lineHeight: LINE_HEIGHT_BODY,
      })
      this.y += LINE_HEIGHT_BODY
    }
  }
  
  drawCodeBlock(text) {
    if (!text) return;
    this._checkPageBreak(LINE_HEIGHT_CODE * 2) // Start block
    const { width } = this.currentPage.getSize()
    const maxWidth = width - (MARGIN + 10) * 2 // A little inset
    const lines = this._wrapText(text, maxWidth, this.fonts.courierFont, FONT_SIZE_CODE)
    
    // Draw background box
    const blockHeight = lines.length * LINE_HEIGHT_CODE + 10 // 5 padding top/bottom
    this._checkPageBreak(blockHeight)
    
    this.currentPage.drawRectangle({
      x: MARGIN + 5,
      y: this.currentPage.getHeight() - this.y - blockHeight + 5,
      width: maxWidth + 10,
      height: blockHeight,
      color: COLOR_CODE_BG,
    })
    
    this.y += 10 // Top padding
    
    // Draw text
    for (const line of lines) {
       this._checkPageBreak(LINE_HEIGHT_CODE)
       this.currentPage.drawText(line, {
        x: MARGIN + 10,
        y: this.currentPage.getHeight() - this.y,
        font: this.fonts.courierFont,
        size: FONT_SIZE_CODE,
        color: COLOR_CODE_TEXT,
        lineHeight: LINE_HEIGHT_CODE,
      })
      this.y += LINE_HEIGHT_CODE
    }
    this.y += 5 // Bottom padding
  }
  
  // Simple word-wrap helper
  _wrapText(text, maxWidth, font, size) {
    if (!text) return [];
    const lines = []
    const paragraphs = text.split('\n')
    
    for (const paragraph of paragraphs) {
      let currentLine = ''
      const words = paragraph.split(' ')
      
      for (const word of words) {
        const testLine = currentLine.length > 0 ? `${currentLine} ${word}` : word
        const testWidth = font.widthOfTextAtSize(testLine, size)
        
        if (testWidth <= maxWidth) {
          currentLine = testLine
        } else {
          lines.push(currentLine)
          currentLine = word
        }
      }
      lines.push(currentLine)
    }
    return lines
  }
}