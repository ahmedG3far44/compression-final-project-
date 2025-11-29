class LZWCompressor {
    compress(input : string): string {
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

    decompress(input : string): string {
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
            } result += entry;
            dictionary.set(dictSize++, w + entry[0]);
            w = entry;
        }

        return result;
    }
}

export default LZWCompressor;
