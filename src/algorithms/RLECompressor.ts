class RLECompressor {
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

export default RLECompressor;