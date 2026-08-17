require 'zlib'

def process_solid_seal(bmp_path, output_png_path)
  data = File.binread(bmp_path)
  
  offset = data[10, 4].unpack("V")[0]
  width = data[18, 4].unpack("l")[0]
  height = data[22, 4].unpack("l")[0]
  bpp = data[28, 2].unpack("v")[0]
  
  is_bottom_up = (height > 0)
  height = height.abs
  
  bytes_per_pixel = bpp / 8
  row_padded = ((width * bytes_per_pixel + 3) / 4) * 4
  
  # Approximate center of wax seal in this image
  cx = width * 0.505
  cy = height * 0.525
  seal_radius = width * 0.285 # Full solid radius of the wax disc
  
  rgba_rows = []
  
  (0...height).each do |y|
    src_y = is_bottom_up ? (height - 1 - y) : y
    row_offset = offset + src_y * row_padded
    
    row_bytes = "".b
    row_bytes << 0.chr.b # PNG Filter 0
    
    (0...width).each do |x|
      px = row_offset + x * bytes_per_pixel
      b = data[px].ord
      g = data[px + 1].ord
      r = data[px + 2].ord
      
      dx = x - cx
      dy = y - cy
      dist = Math.sqrt(dx * dx + dy * dy)
      
      # 1. GUARANTEED 100% SOLID OPAQUE WAX SEAL
      # No matter the highlights, the seal itself will NEVER have transparent blue holes!
      if dist <= seal_radius
        alpha = 255
      else
        max_c = [r, g, b].max
        min_c = [r, g, b].min
        delta = max_c - min_c
        sat = max_c > 0 ? (delta.to_f / max_c) : 0.0
        lum = (0.299 * r + 0.587 * g + 0.114 * b)
        
        # Check if it's the organic outer wax rim just beyond radius
        if dist <= seal_radius + (width * 0.04) && lum < 240
          alpha = 255
        elsif lum >= 248 && sat < 0.04
          # Pure white paper background -> Transparent
          alpha = 0
        elsif lum >= 235 && sat < 0.07
          # Soft feathered edge around paper
          factor = (248.0 - lum) / 13.0
          alpha = [[(factor * 255).to_i, 0].max, 255].min
        else
          # Green leaves, flower blossoms, brown twigs -> 100% Solid!
          alpha = 255
        end
      end
      
      row_bytes << [r, g, b, alpha].pack("CCCC").b
    end
    
    rgba_rows << row_bytes
  end
  
  raw_stream = rgba_rows.join("".b)
  compressed_idat = Zlib::Deflate.deflate(raw_stream, Zlib::BEST_COMPRESSION)
  
  def make_chunk(type, data)
    len = [data.bytesize].pack("N").b
    type_b = type.b
    crc = [Zlib.crc32(type_b + data)].pack("N").b
    len + type_b + data + crc
  end
  
  out = "\x89PNG\r\n\x1a\n".b
  out << make_chunk("IHDR", [width, height, 8, 6, 0, 0, 0].pack("NNCCCCC").b)
  out << make_chunk("IDAT", compressed_idat)
  out << make_chunk("IEND", "".b)
  
  File.binwrite(output_png_path, out)
  puts "Generated 100% solid wax seal with transparent background: #{output_png_path}"
end

process_solid_seal(
  "/Users/joseherrera/Desktop/proyecto_invitaciones/assets/images/seal_raw.bmp",
  "/Users/joseherrera/Desktop/proyecto_invitaciones/assets/images/wax-seal-official.png"
)
