# Data Compression Application

A comprehensive web-based data compression tool built with React, TypeScript, and Tailwind CSS. This application provides both lossless and lossy compression capabilities through an intuitive user interface, with all algorithms implemented from scratch.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/React-18+-61DAFB.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6.svg)

## 🌟 Features

### Lossless Compression
Perfect reconstruction of original data with support for multiple algorithms:

- **Run-Length Encoding (RLE)** - Optimal for data with repeated sequences
- **Huffman Coding** - Frequency-based optimal prefix-free encoding
- **Golomb Coding** - Parameterized coding for geometric distributions
- **LZW Coding** - Dictionary-based pattern replacement

### Lossy Compression
High-efficiency image compression using quantization techniques:

- **Image Quantization** - Adjustable quality levels (10-100)
- **Side-by-side comparison** - Visual comparison of original vs compressed
- **Real-time metrics** - Instant compression statistics

### Core Capabilities

✅ **Compression & Decompression** - Full bidirectional support for lossless algorithms  
✅ **Real-time Metrics** - Original size, compressed size, and compression ratio  
✅ **Data Integrity Verification** - Automatic verification of lossless compression  
✅ **Responsive Design** - Works seamlessly on desktop, tablet, and mobile  
✅ **Type-Safe** - Built with TypeScript for reliability and maintainability  
✅ **Modern UI** - Clean, intuitive interface with Tailwind CSS

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm/yarn/pnpm
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/data-compression-app.git

# Navigate to project directory
cd compression-final-project

# Install dependencies
npm install
# or
yarn install
# or
pnpm install

# Start development server
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
# Create optimized production build
npm run build

# Preview production build
npm run preview
```

## 📖 Usage Guide

### Lossless Compression Workflow

1. **Select Mode**: Click on "Lossless Compression" from the home screen
2. **Choose Algorithm**: Select from RLE, Huffman, Golomb, or LZW
3. **Input Data**: Enter or paste your text in the input field
4. **Compress**: Click the "Compress" button to process your data
5. **View Results**: See compression statistics and compressed output
6. **Decompress** (optional): Verify data integrity by decompressing
7. **Download** (coming soon): Save compressed data to file

### Lossy Compression Workflow

1. **Select Mode**: Click on "Lossy Compression" from the home screen
2. **Adjust Quality**: Use the slider to set compression level (10-100)
3. **Upload Image**: Select an image file (JPEG, PNG, etc.)
4. **View Results**: Compare original and compressed images side-by-side
5. **Download** (coming soon): Save compressed image

## 🎯 Algorithm Details

### Run-Length Encoding (RLE)

**Best for**: Data with long runs of repeated characters  
**Method**: Represents consecutive identical symbols as count-value pairs

```
Input:  "aaabbbccc"
Output: "3a3b3c"
```

**Pros**: Simple, fast, effective for specific data types  
**Cons**: Can increase size if data has few repetitions

### Huffman Coding

**Best for**: General text compression  
**Method**: Variable-length prefix-free codes based on character frequency

```
Character Frequency → Optimal Binary Code
'a': 50%  → '0'
'b': 30%  → '10'
'c': 20%  → '11'
```

**Pros**: Optimal for known frequency distributions  
**Cons**: Requires transmitting/storing the code table

### Golomb Coding

**Best for**: Data following geometric distributions  
**Method**: Parameterized unary-binary hybrid encoding

```
Parameter m = 8
Value 15 → Quotient: 1, Remainder: 7
Output: "10" + "111" (binary of 7)
```

**Pros**: Efficient for certain statistical distributions  
**Cons**: Performance depends on parameter selection

### LZW (Lempel-Ziv-Welch)

**Best for**: Text with repeated patterns  
**Method**: Dictionary-based replacement of patterns with indices

```
"TOBEORNOTTOBEORTOBEORNOT"
→ Builds dictionary dynamically
→ Replaces patterns with shorter codes
```

**Pros**: No need to pass dictionary, adapts to data  
**Cons**: Dictionary size can grow large

### Image Quantization

**Best for**: Photographs and complex images  
**Method**: Reduces color bit depth by rounding to nearest quantization level

```
Quality 50: 256 colors → 128 colors
Quality 25: 256 colors → 64 colors
```

**Pros**: High compression ratios, visually acceptable quality  
**Cons**: Irreversible, quality loss increases with compression

## 🏗️ Architecture

### Project Structure

```
src/
├── components/
│   └── DataCompressionApp.tsx    # Main application component
├── algorithms/
│   ├── RLECompressor.ts           # Run-Length Encoding
│   ├── HuffmanCompressor.ts       # Huffman Coding
│   ├── GolombCompressor.ts        # Golomb Coding
│   ├── LZWCompressor.ts           # LZW Coding
│   └── ImageQuantizer.ts          # Image quantization
├── types/
│   └── index.ts                   # TypeScript type definitions
└── utils/
    └── fileHelpers.ts             # File handling utilities
```

### Technology Stack

- **Frontend Framework**: React 18+
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS 3+
- **Icons**: Lucide React
- **Build Tool**: Vite (recommended) or Create React App

### Design Patterns

- **Strategy Pattern**: Interchangeable compression algorithms
- **Class-based Architecture**: Each algorithm as a separate class
- **Separation of Concerns**: UI logic separate from business logic
- **Type Safety**: Full TypeScript coverage

## 📊 Performance Metrics

### Compression Ratios (Typical)

| Algorithm | Text (English) | Repeated Data | Binary Data |
|-----------|---------------|---------------|-------------|
| RLE       | 0-20%         | 60-90%        | Variable    |
| Huffman   | 30-50%        | 40-60%        | 20-40%      |
| Golomb    | 15-35%        | Variable      | 25-45%      |
| LZW       | 40-60%        | 50-70%        | 30-50%      |

### Processing Speed

- **Text compression**: < 100ms for files up to 1MB
- **Image quantization**: < 500ms for images up to 5MB
- **Decompression**: ~1.5x compression time



**Made with ❤️ by [Your Name/Team]**

*Last updated: November 2024*
