class ImageQuantizer {
    quantize(imageData : ImageData, quality : number = 50): ImageData {
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


export default ImageQuantizer;
