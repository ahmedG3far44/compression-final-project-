import { useCallback, useState } from "react";
import { ArrowUpZA, Download, FileText, Image, Info, Zap } from "lucide-react";
import type { CompressionMode, CompressionResult, LosslessAlgorithm } from "../types";

import RLECompressor from "../algorithms/RLECompressor";
import HuffmanCompressor from "../algorithms/HuffmanCompressor";
import GolombCompressor from "../algorithms/GolombCompressor";
import LZWCompressor from "../algorithms/LZWCompressor";
import ImageQuantizer from "../algorithms/ImageQuantizer";





export default function DataCompressionApp() {
    const [mode, setMode] = useState<CompressionMode>(null);
    const [algorithm, setAlgorithm] = useState<LosslessAlgorithm>('rle');
    const [inputText, setInputText] = useState('');
    const [compressedData, setCompressedData] = useState('');
    const [decompressedData, setDecompressedData] = useState('');
    const [result, setResult] = useState<CompressionResult | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [compressedImage, setCompressedImage] = useState<string | null>(null);
    const [quality, setQuality] = useState(50);






    const handleLosslessCompress = useCallback(() => {
        if (!inputText) return;

        let compressor: RLECompressor | HuffmanCompressor | GolombCompressor | LZWCompressor;
        let algorithmName = '';

        switch (algorithm) {
            case 'rle':
                compressor = new RLECompressor();
                algorithmName = 'Run-Length Encoding';
                break;
            case 'huffman':
                compressor = new HuffmanCompressor();
                algorithmName = 'Huffman Coding';
                break;
            case 'golomb':
                compressor = new GolombCompressor();
                algorithmName = 'Golomb Coding';
                break;
            case 'lzw':
                compressor = new LZWCompressor();
                algorithmName = 'LZW Coding';
                break;
        }

        const compressed = compressor.compress(inputText);
        setCompressedData(compressed);

        const originalSize = new Blob([inputText]).size;
        const compressedSize = new Blob([compressed]).size;

        setResult({
            originalSize,
            compressedSize,
            compressionRatio: ((1 - compressedSize / originalSize) * 100),
            data: compressed,
            algorithm: algorithmName
        });
    }, [inputText, algorithm]);

    const handleLosslessDecompress = useCallback(() => {
        if (!compressedData) return;

        let compressor: RLECompressor | HuffmanCompressor | GolombCompressor | LZWCompressor;

        switch (algorithm) {
            case 'rle':
                compressor = new RLECompressor();
                break;
            case 'huffman':
                compressor = new HuffmanCompressor();
                break;
            case 'golomb':
                compressor = new GolombCompressor();
                break;
            case 'lzw':
                compressor = new LZWCompressor();
                break;
        }

        try {
            const decompressed = compressor.decompress(compressedData);
            setDecompressedData(decompressed);
        } catch (error) {
            alert('Decompression failed. Please ensure the data is valid.');
        }
    }, [compressedData, algorithm]);

    const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImageFile(file);
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new window.Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d')!;
                ctx.drawImage(img, 0, 0);

                setOriginalImage(canvas.toDataURL());

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const quantizer = new ImageQuantizer();
                const quantized = quantizer.quantize(imageData, quality);

                ctx.putImageData(quantized, 0, 0);
                setCompressedImage(canvas.toDataURL());

                const originalSize = file.size;
                const compressedSize = Math.round(originalSize * (quality / 100));

                setResult({
                    originalSize,
                    compressedSize,
                    compressionRatio: ((1 - compressedSize / originalSize) * 100),
                    data: quantized
                });
            };
            img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
    }, [quality]);

    const resetApp = () => {
        setMode(null);
        setInputText('');
        setCompressedData('');
        setDecompressedData('');
        setResult(null);
        setImageFile(null);
        setOriginalImage(null);
        setCompressedImage(null);
    };

    return (
        <div className="min-h-screen bg-zinc-200 p-8">
            <div className="max-w-6xl mx-auto space-y-8 mt-20">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Data Compression Application</h1>
                    <p className="text-gray-600">Advanced lossless and lossy compression algorithms</p>
                </div>
                {!mode && (
                    <div className="grid md:grid-cols-2 gap-6 mt-20">
                        <button
                            onClick={() => setMode('lossless')}
                            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow hover:border-blue-500 cursor-pointer border border-zinc-300"
                        >
                            <FileText className="w-16 h-16 mx-auto mb-4 text-blue-500" />
                            <h2 className="text-2xl font-bold mb-2">Lossless Compression</h2>
                            <p className="text-gray-600">Perfect reconstruction of original data</p>
                            <div className="mt-4 text-sm text-gray-500">
                                RLE • Huffman • Golomb • LZW
                            </div>
                        </button>

                        <button
                            onClick={() => setMode('lossy')}
                            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow  hover:border-indigo-500 cursor-pointer border border-zinc-300"
                        >
                            <Image className="w-16 h-16 mx-auto mb-4 text-indigo-500" />
                            <h2 className="text-2xl font-bold mb-2">Lossy Compression</h2>
                            <p className="text-gray-600">High compression for images</p>
                            <div className="mt-4 text-sm text-gray-500">
                                Quantization-based compression
                            </div>
                        </button>
                    </div>
                )}
                {mode === 'lossless' && (
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Lossless Compression</h2>
                            <button onClick={resetApp} className="text-blue-500 hover:text-blue-700">
                                ← Back
                            </button>
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Algorithm
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {(['rle', 'huffman', 'golomb', 'lzw'] as LosslessAlgorithm[]).map((alg) => (
                                    <button
                                        key={alg}
                                        onClick={() => setAlgorithm(alg)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors hover:bg-zinc-300 duration-300 cursor-pointer ${algorithm === alg
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {alg.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Input Text
                            </label>
                            <textarea
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                className="w-full h-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter text to compress..."
                            />
                        </div>
                        <button
                            onClick={handleLosslessCompress}
                            disabled={!inputText}
                            className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <Zap className="w-5 h-5" />
                            Compress
                        </button>

                        {result && (
                            <div className="mt-6 space-y-4">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div>
                                            <div className="text-sm text-gray-600">Original Size</div>
                                            <div className="text-xl font-bold">{result.originalSize} bytes</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-600">Compressed Size</div>
                                            <div className="text-xl font-bold">{result.compressedSize} bytes</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-600">Compression Ratio</div>
                                            <div className="text-xl font-bold text-green-600">
                                                {result.compressionRatio.toFixed(2)}%
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Compressed Data
                                    </label>
                                    <textarea
                                        value={compressedData}
                                        readOnly
                                        className="w-full h-24 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                                    />
                                </div>

                                <button
                                    onClick={handleLosslessDecompress}
                                    className="my-4 w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <ArrowUpZA className="w-5 h-5" />
                                    Decompress
                                </button>


                                {decompressedData && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Decompressed Data
                                        </label>
                                        <textarea
                                            value={decompressedData}
                                            readOnly
                                            className="w-full h-24 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                                        />
                                        <button onClick={() => {
                                            const blob = new Blob([compressedData], { type: 'text/plain' });
                                            const url = URL.createObjectURL(blob);
                                            const a = document.createElement('a');
                                            a.href = url;
                                            a.download = 'compressed.txt';
                                            a.click();
                                        }} className=" my-4 w-full bg-indigo-500 text-white py-3 rounded-lg font-medium hover:bg-indigo-600 flex items-center justify-center gap-2 cursor-pointer">
                                            <Download className="w-5 h-5" />
                                            Download Compressed Data
                                        </button>
                                        {compressedData === inputText && (
                                            <div className="mt-2 bg-green-100 border border-green-100 text-green-600 rounded-md py-2 px-4 flex items-center gap-2">
                                                <Info className="w-4 h-4" />
                                                Verification successful: Data matches original
                                            </div>
                                        )}

                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Lossy Mode */}
                {mode === 'lossy' && (
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Lossy Compression (Image Quantization)</h2>
                            <button onClick={resetApp} className="text-indigo-500 hover:text-indigo-700">
                                ← Back
                            </button>
                        </div>

                        {/* Quality Slider */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Quality Level: {quality}
                            </label>
                            <input
                                type="range"
                                min="10"
                                max="100"
                                value={quality}
                                onChange={(e) => setQuality(parseInt(e.target.value))}
                                className="w-full"
                            />
                        </div>

                        {/* Image Upload */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Upload Image
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>

                        {/* Image Comparison */}
                        {originalImage && compressedImage && (
                            <div className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-700 mb-2">Original Image</h3>
                                        <img src={originalImage} alt="Original" className="w-full rounded-lg border border-zinc-300" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-700 mb-2">Compressed Image</h3>
                                        <img src={compressedImage} alt="Compressed" className="w-full rounded-lg border border-zinc-300" />
                                    </div>
                                </div>

                                {result && (
                                    <div className="bg-indigo-50 p-4 rounded-lg">
                                        <div className="grid grid-cols-3 gap-4 text-center">
                                            <div>
                                                <div className="text-sm text-gray-600">Original Size</div>
                                                <div className="text-xl font-bold">{(result.originalSize / 1024).toFixed(2)} KB</div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-600">Estimated Compressed</div>
                                                <div className="text-xl font-bold">{(result.compressedSize / 1024).toFixed(2)} KB</div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-600">Compression Ratio</div>
                                                <div className="text-xl font-bold text-green-600">
                                                    {result.compressionRatio.toFixed(2)}%
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {
                                    compressedImage && (
                                        <button onClick={() => {
                                            const blob = new Blob([compressedImage], { type: 'text/plain' });
                                            const url = URL.createObjectURL(blob);
                                            const a = document.createElement('a');
                                            a.href = url;
                                            a.download = 'compressed.txt';
                                            a.click();
                                        }} className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-800 duration-300 transition-colors w-full cursor-pointer">
                                            Download Compressed Data
                                        </button>
                                    )
                                }
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}