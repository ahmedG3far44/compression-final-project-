class GolombCompressor {
    private m : number = 8; // Golomb parameter

    compress(input : string): string {
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

    decompress(input : string): string {
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

export default GolombCompressor;
