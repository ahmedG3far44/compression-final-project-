export class RLECompressor {
  compress(input: string): string {
    if (!input) return '';
    let compressed = '';
    let count = 1;
    
    for (let i = 0; i < input.length; i++) {
      if (i + 1 < input.length && input[i] === input[i + 1]) {
        count++;
      } else {
        compressed += count > 1 ? `${count}${input[i]}` : input[i];
        count = 1;
      }
    }
    return compressed;
  }

  decompress(input: string): string {
    let decompressed = '';
    let i = 0;
    
    while (i < input.length) {
      let count = '';
      while (i < input.length && /\d/.test(input[i])) {
        count += input[i];
        i++;
      }
      
      if (count && i < input.length) {
        decompressed += input[i].repeat(parseInt(count));
        i++;
      } else if (i < input.length) {
        decompressed += input[i];
        i++;
      }
    }
    return decompressed;
  }
}

// Huffman Coding
export class HuffmanNode {
  char: string | null;
  freq: number;
  left: HuffmanNode | null;
  right: HuffmanNode | null;

  constructor(char: string | null, freq: number) {
    this.char = char;
    this.freq = freq;
    this.left = null;
    this.right = null;
  }
}

export class HuffmanCompressor {
  private buildFrequencyTable(input: string): Map<string, number> {
    const freq = new Map<string, number>();
    for (const char of input) {
      freq.set(char, (freq.get(char) || 0) + 1);
    }
    return freq;
  }

  private buildHuffmanTree(freq: Map<string, number>): HuffmanNode | null {
    const nodes: HuffmanNode[] = Array.from(freq.entries())
      .map(([char, frequency]) => new HuffmanNode(char, frequency));
    
    while (nodes.length > 1) {
      nodes.sort((a, b) => a.freq - b.freq);
      const left = nodes.shift()!;
      const right = nodes.shift()!;
      const parent = new HuffmanNode(null, left.freq + right.freq);
      parent.left = left;
      parent.right = right;
      nodes.push(parent);
    }
    
    return nodes[0] || null;
  }

  private buildCodeTable(root: HuffmanNode | null, prefix = '', table = new Map<string, string>()): Map<string, string> {
    if (!root) return table;
    if (root.char !== null) {
      table.set(root.char, prefix || '0');
    }
    if (root.left) this.buildCodeTable(root.left, prefix + '0', table);
    if (root.right) this.buildCodeTable(root.right, prefix + '1', table);
    return table;
  }

  compress(input: string): string {
    if (!input) return '';
    const freq = this.buildFrequencyTable(input);
    const tree = this.buildHuffmanTree(freq);
    const codeTable = this.buildCodeTable(tree);
    
    let compressed = '';
    for (const char of input) {
      compressed += codeTable.get(char) || '';
    }
    
    const tableStr = JSON.stringify(Array.from(codeTable.entries()));
    return `${tableStr}|${compressed}`;
  }

  decompress(input: string): string {
    const [tableStr, compressed] = input.split('|');
    if (!tableStr || !compressed) return '';
    
    const codeTable = new Map<string, string>(JSON.parse(tableStr));
    const reverseTable = new Map<string, string>();
    codeTable.forEach((code, char) => reverseTable.set(code, char));
    
    let decompressed = '';
    let code = '';
    
    for (const bit of compressed) {
      code += bit;
      if (reverseTable.has(code)) {
        decompressed += reverseTable.get(code);
        code = '';
      }
    }
    
    return decompressed;
  }
}

// Golomb Coding
export class GolombCompressor {
  private m: number = 8; // Golomb parameter

  compress(input: string): string {
    const bytes = new TextEncoder().encode(input);
    let compressed = '';
    
    for (const byte of bytes) {
      const q = Math.floor(byte / this.m);
      const r = byte % this.m;
      compressed += '1'.repeat(q) + '0';
      compressed += r.toString(2).padStart(3, '0');
    }
    
    return compressed;
  }

  decompress(input: string): string {
    const bytes: number[] = [];
    let i = 0;
    
    while (i < input.length) {
      let q = 0;
      while (i < input.length && input[i] === '1') {
        q++;
        i++;
      }
      i++; // Skip the '0'
      
      const rBits = input.slice(i, i + 3);
      i += 3;
      const r = parseInt(rBits, 2);
      bytes.push(q * this.m + r);
    }
    
    return new TextDecoder().decode(new Uint8Array(bytes));
  }
}

// LZW Coding
export class LZWCompressor {
  compress(input: string): string {
    const dictionary = new Map<string, number>();
    let dictSize = 256;
    
    for (let i = 0; i < 256; i++) {
      dictionary.set(String.fromCharCode(i), i);
    }
    
    let w = '';
    const result: number[] = [];
    
    for (const c of input) {
      const wc = w + c;
      if (dictionary.has(wc)) {
        w = wc;
      } else {
        result.push(dictionary.get(w)!);
        dictionary.set(wc, dictSize++);
        w = c;
      }
    }
    
    if (w) {
      result.push(dictionary.get(w)!);
    }
    
    return JSON.stringify(result);
  }

  decompress(input: string): string {
    const compressed = JSON.parse(input);
    const dictionary = new Map<number, string>();
    let dictSize = 256;
    
    for (let i = 0; i < 256; i++) {
      dictionary.set(i, String.fromCharCode(i));
    }
    
    let w = String.fromCharCode(compressed[0]);
    let result = w;
    
    for (let i = 1; i < compressed.length; i++) {
      const k = compressed[i];
      let entry: string;
      
      if (dictionary.has(k)) {
        entry = dictionary.get(k)!;
      } else if (k === dictSize) {
        entry = w + w[0];
      } else {
        throw new Error('Invalid compressed data');
      }
      
      result += entry;
      dictionary.set(dictSize++, w + entry[0]);
      w = entry;
    }
    
    return result;
  }
}

// ==================== LOSSY COMPRESSION ====================
export class ImageQuantizer {
  quantize(imageData: ImageData, quality: number = 50): ImageData {
    const quantized = new ImageData(imageData.width, imageData.height);
    const step = Math.max(1, Math.floor(256 / quality));  
    for (let i = 0; i < imageData.data.length; i += 4) {
      quantized.data[i] = Math.round(imageData.data[i] / step) * step;
      quantized.data[i + 1] = Math.round(imageData.data[i + 1] / step) * step;
      quantized.data[i + 2] = Math.round(imageData.data[i + 2] / step) * step;
      quantized.data[i + 3] = imageData.data[i + 3];
    }
    
    return quantized;
  }
}

