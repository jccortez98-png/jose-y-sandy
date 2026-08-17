import Foundation
import CoreGraphics
import ImageIO
import AppKit

let inputPath = "/Users/joseherrera/.gemini/antigravity-ide/brain/017e88ac-d16d-4030-a021-229d9e69b0f3/wedding_wax_seal_floral_1786895226604.jpg"
let outputPath = "/Users/joseherrera/Desktop/proyecto_invitaciones/assets/images/wax-seal-custom.png"

guard let imageSource = CGImageSourceCreateWithURL(URL(fileURLWithPath: inputPath) as CFURL, nil),
      let cgImage = CGImageSourceCreateImageAtIndex(imageSource, 0, nil) else {
    print("Failed to load image")
    exit(1)
}

let width = cgImage.width
let height = cgImage.height
let colorSpace = CGColorSpaceCreateDeviceRGB()
let bytesPerPixel = 4
let bytesPerRow = bytesPerPixel * width
let rawData = malloc(height * bytesPerRow)

let context = CGContext(data: rawData,
                        width: width,
                        height: height,
                        bitsPerComponent: 8,
                        bytesPerRow: bytesPerRow,
                        space: colorSpace,
                        bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue | CGBitmapInfo.byteOrder32Big.rawValue)!

context.draw(cgImage, in: CGRect(x: 0, y: 0, width: width, height: height))

let pixelBuffer = rawData!.bindMemory(to: UInt8.self, capacity: height * bytesPerRow)

let cx = Double(width) / 2.0
let cy = Double(height) / 2.0

for y in 0..<height {
    for x in 0..<width {
        let offset = (y * bytesPerRow) + (x * bytesPerPixel)
        let r = Double(pixelBuffer[offset])
        let g = Double(pixelBuffer[offset + 1])
        let b = Double(pixelBuffer[offset + 2])
        
        let maxVal = max(r, max(g, b))
        let minVal = min(r, min(g, b))
        let delta = maxVal - minVal
        let saturation = maxVal > 0 ? (delta / maxVal) : 0.0
        let brightness = (r + g + b) / 3.0
        
        let dx = (Double(x) - cx) / cx
        let dy = (Double(y) - cy) / cy
        let dist = sqrt(dx * dx + dy * dy)
        
        // If it's near-white paper background (low saturation, high brightness)
        if brightness > 242.0 && saturation < 0.06 {
            pixelBuffer[offset + 3] = 0 // Transparent
        } else if brightness > 225.0 && saturation < 0.09 && dist > 0.32 {
            // Soft feathered edge
            let factor = (242.0 - brightness) / 17.0
            let alpha = max(0.0, min(1.0, factor))
            
            // Adjust RGB for premultiplied alpha
            pixelBuffer[offset] = UInt8(r * alpha)
            pixelBuffer[offset + 1] = UInt8(g * alpha)
            pixelBuffer[offset + 2] = UInt8(b * alpha)
            pixelBuffer[offset + 3] = UInt8(alpha * 255.0)
        }
    }
}

let resultCgImage = context.makeImage()!
free(rawData)

let outputUrl = URL(fileURLWithPath: outputPath) as CFURL
guard let destination = CGImageDestinationCreateWithURL(outputUrl, kUTTypePNG, 1, nil) else {
    print("Failed to create destination")
    exit(1)
}

CGImageDestinationAddImage(destination, resultCgImage, nil)
if CGImageDestinationFinalize(destination) {
    print("Successfully created pristine transparent PNG: \(outputPath)")
} else {
    print("Failed to save image")
    exit(1)
}
