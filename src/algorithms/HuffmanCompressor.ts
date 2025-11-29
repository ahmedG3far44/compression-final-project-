class HuffmanNode {
    char : string | null;
    freq : number;
    left : HuffmanNode | null;
    right : HuffmanNode | null;

    constructor(char : string | null, freq : number) {
        this.char = char;
        this.freq = freq;
        this.left = null;
        this.right = null;
    }
}

class HuffmanCompressor {
    private buildFrequencyTable(input : string): Map < string,
    number > {
        const freq = new Map<string, number>();
        for (const char of input) {
            freq.set(char, (freq.get(char) || 0) + 1);
        }
        return freq;
    }

    private buildHuffmanTree(freq : Map < string, number >): HuffmanNode | null {
        const nodes: HuffmanNode[] = Array.from(freq.entries()).map(([char, frequency]) => new HuffmanNode(char, frequency));

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

    private buildCodeTable(root : HuffmanNode | null, prefix = '', table = new Map<string, string>()): Map < string,
    string > {
        if (!root) 
            return table;
        
        if (root.char !== null) {
            table.set(root.char, prefix || '0');
        }
        if (root.left) 
            this.buildCodeTable(root.left, prefix + '0', table);
        
        if (root.right) 
            this.buildCodeTable(root.right, prefix + '1', table);
        
        return table;
    }

    compress(input : string): string {
        if (!input) 
            return '';
        
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

    decompress(input : string): string {
        const [tableStr, compressed] = input.split('|');
        if (!tableStr || !compressed) 
            return '';
        

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

export default HuffmanCompressor;
