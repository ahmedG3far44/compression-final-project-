export type CompressionMode = 'lossless' | 'lossy' | null;
export type LosslessAlgorithm = 'rle' | 'huffman' | 'golomb' | 'lzw';
export type CompressionResult = {
    originalSize: number;
    compressedSize: number;
    compressionRatio: number;
    data: string | ImageData;
    algorithm?: string;
};