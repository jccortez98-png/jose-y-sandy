require 'zlib'

def convert_bmp_to_transparent_png(bmp_path, png_path)
  data = File.binread(bmp_path)
  
  offset = data[10, 4].unpack("V")[0]
  width = data[18, 4].unpack("l")[0]
  height = data[22, 4].unpack("l")[0]
  bpp = data[28, 2].unpack("v")[0]
  
  is_bottom_up = (height > 0)
  height = height.abs
  
  bytes_per_pixel = bpp / 8
  row_padded = ((width * bytes_per_pixel + 3) / 4) * 4
  
  # Center for radial distance checks if needed
  cx = width / 2.0
  cy = height / 2.0
  
  # Prepare rows in top-down order
  rgba_rows = []
  
  (0...height).each do |y|
    src_y = is_bottom_up ? (height - 1 - y) : y
    row_offset = offset + src_y * row_padded
    
    row_bytes = "".b
    row_bytes << 0.chr.b # Filter type 0 (None)
    
    (0...width).each do |x|
      px = row_offset + x * bytes_per_pixel
      b = data[px].ord
      g = data[px + 1].ord
      r = data[px + 2].ord
      
      # Max, min, saturation, brightness
      max_c = [r, g, b].max
      min_c = [r, g, b].min
      delta = max_c - min_c
      sat = max_c > 0 ? (delta.to_f / max_c) : 0.0
      lum = (0.299 * r + 0.587 * g + 0.114 * b)
      
      # Distance from center
      dx = (x - cx) / cx
      dy = (y - cy) / cy
      dist = Math.sqrt(dx * dx + dy * dy)
      
      # If near pure white paper background
      if lum > 246 && sat < 0.05
        alpha = 0
      elsif lum > 230 && sat < 0.08 && dist > 0.30
        # Smooth alpha feathering on edges
        factor = (246.0 - lum) / 16.0
        alpha = [[(factor * 255).to_i, 0].max, 255].min
      else
        alpha = 255
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
  
  File.binwrite(png_path, out)
  puts "Created crystal clear transparent PNG: #{png_path} (#{width}x#{height})"
end

convert_bmp_to_transparent_png(
  "/Users/joseherrera/Desktop/proyecto_invitaciones/assets/images/seal_temp.bmp",
  "/Users/joseherrera/Desktop/proyecto_invitaciones/assets/images/wax-seal-official.png"
)
