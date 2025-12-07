import json
from typing import Dict, List, Optional
from collections import defaultdict


class GolombCompressor:
    def __init__(self, m: int = 8):
        self.m = m  # Golomb parameter

    def compress(self, input_str: str) -> str:
        bytes_data = input_str.encode('utf-8')
        compressed = ''

        for byte in bytes_data:
            q = byte // self.m
            r = byte % self.m
            compressed += '1' * q + '0'
            compressed += format(r, '03b')

        return compressed

    def decompress(self, input_str: str) -> str:
        bytes_list = []
        i = 0

        while i < len(input_str):
            q = 0
            while i < len(input_str) and input_str[i] == '1':
                q += 1
                i += 1
            i += 1  # Skip the '0'

            r_bits = input_str[i:i + 3]
            i += 3
            r = int(r_bits, 2)
            bytes_list.append(q * self.m + r)

        return bytes(bytes_list).decode('utf-8')


class HuffmanNode:
    def __init__(self, char: Optional[str], freq: int):
        self.char = char
        self.freq = freq
        self.left: Optional[HuffmanNode] = None
        self.right: Optional[HuffmanNode] = None

    def __lt__(self, other):
        return self.freq < other.freq


class HuffmanCompressor:
    def _build_frequency_table(self, input_str: str) -> Dict[str, int]:
        freq = defaultdict(int)
        for char in input_str:
            freq[char] += 1
        return dict(freq)

    def _build_huffman_tree(self, freq: Dict[str, int]) -> Optional[HuffmanNode]:
        nodes = [HuffmanNode(char, frequency) for char, frequency in freq.items()]

        while len(nodes) > 1:
            nodes.sort(key=lambda x: x.freq)
            left = nodes.pop(0)
            right = nodes.pop(0)
            parent = HuffmanNode(None, left.freq + right.freq)
            parent.left = left
            parent.right = right
            nodes.append(parent)

        return nodes[0] if nodes else None

    def _build_code_table(self, root: Optional[HuffmanNode], 
                          prefix: str = '', 
                          table: Optional[Dict[str, str]] = None) -> Dict[str, str]:
        if table is None:
            table = {}

        if not root:
            return table

        if root.char is not None:
            table[root.char] = prefix or '0'

        if root.left:
            self._build_code_table(root.left, prefix + '0', table)

        if root.right:
            self._build_code_table(root.right, prefix + '1', table)

        return table

    def compress(self, input_str: str) -> str:
        if not input_str:
            return ''

        freq = self._build_frequency_table(input_str)
        tree = self._build_huffman_tree(freq)
        code_table = self._build_code_table(tree)

        compressed = ''
        for char in input_str:
            compressed += code_table.get(char, '')

        table_str = json.dumps(list(code_table.items()))
        return f"{table_str}|{compressed}"

    def decompress(self, input_str: str) -> str:
        parts = input_str.split('|', 1)
        if len(parts) != 2:
            return ''

        table_str, compressed = parts
        if not table_str or not compressed:
            return ''

        code_table = dict(json.loads(table_str))
        reverse_table = {code: char for char, code in code_table.items()}

        decompressed = ''
        code = ''

        for bit in compressed:
            code += bit
            if code in reverse_table:
                decompressed += reverse_table[code]
                code = ''

        return decompressed


class ImageQuantizer:
    def quantize(self, image_data: List[int], width: int, height: int, 
                 quality: int = 50) -> List[int]:
        """
        Quantize image data. Input should be a flat list of RGBA values.
        Returns quantized image data as a flat list.
        """
        quantized = []
        step = max(1, 256 // quality)

        for i in range(0, len(image_data), 4):
            quantized.append(round(image_data[i] / step) * step)      # R
            quantized.append(round(image_data[i + 1] / step) * step)  # G
            quantized.append(round(image_data[i + 2] / step) * step)  # B
            quantized.append(image_data[i + 3])                        # A

        return quantized


class LZWCompressor:
    def compress(self, input_str: str) -> str:
        dictionary = {chr(i): i for i in range(256)}
        dict_size = 256

        w = ''
        result = []

        for c in input_str:
            wc = w + c
            if wc in dictionary:
                w = wc
            else:
                result.append(dictionary[w])
                dictionary[wc] = dict_size
                dict_size += 1
                w = c

        if w:
            result.append(dictionary[w])

        return json.dumps(result)

    def decompress(self, input_str: str) -> str:
        compressed = json.loads(input_str)
        dictionary = {i: chr(i) for i in range(256)}
        dict_size = 256

        w = chr(compressed[0])
        result = w

        for i in range(1, len(compressed)):
            k = compressed[i]

            if k in dictionary:
                entry = dictionary[k]
            elif k == dict_size:
                entry = w + w[0]
            else:
                raise ValueError('Invalid compressed data')

            result += entry
            dictionary[dict_size] = w + entry[0]
            dict_size += 1
            w = entry

        return result


class RLECompressor:
    def compress(self, input_str: str) -> str:
        if not input_str:
            return ''

        compressed = ''
        count = 1

        for i in range(len(input_str)):
            if i + 1 < len(input_str) and input_str[i] == input_str[i + 1]:
                count += 1
            else:
                compressed += f"{count}{input_str[i]}" if count > 1 else input_str[i]
                count = 1

        return compressed

    def decompress(self, input_str: str) -> str:
        decompressed = ''
        i = 0

        while i < len(input_str):
            count = ''
            while i < len(input_str) and input_str[i].isdigit():
                count += input_str[i]
                i += 1

            if count and i < len(input_str):
                decompressed += input_str[i] * int(count)
                i += 1
            elif i < len(input_str):
                decompressed += input_str[i]
                i += 1

        return decompressed


# Example usage
if __name__ == "__main__":
    # Test RLE
    rle = RLECompressor()
    text = "aaabbbcccdddd"
    compressed = rle.compress(text)
    decompressed = rle.decompress(compressed)
    print(f"RLE - Original: {text}, Compressed: {compressed}, Decompressed: {decompressed}")

    # Test Huffman
    huffman = HuffmanCompressor()
    text = "hello world"
    compressed = huffman.compress(text)
    decompressed = huffman.decompress(compressed)
    print(f"Huffman - Original: {text}, Decompressed: {decompressed}")

    # Test LZW
    lzw = LZWCompressor()
    text = "TOBEORNOTTOBEORTOBEORNOT"
    compressed = lzw.compress(text)
    decompressed = lzw.decompress(compressed)
    print(f"LZW - Original: {text}, Decompressed: {decompressed}")

    # Test Golomb
    golomb = GolombCompressor()
    text = "Hello"
    compressed = golomb.compress(text)
    decompressed = golomb.decompress(compressed)
    print(f"Golomb - Original: {text}, Decompressed: {decompressed}")