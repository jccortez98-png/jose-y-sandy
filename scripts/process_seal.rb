require 'zlib'

def remove_white_background(input_png, output_png)
  data = File.binread(input_png)
  pos = 8
  
  width = 0
  height = 0
  bit_depth = 0
  color_type = 0
  idat_data = "".b
  
  while pos < data.length
    len = data[pos, 4].unpack("N")[0]
    type = data[pos + 4, 4]
    chunk_data = data[pos + 8, len]
    
    if type == "IHDR"
      width, height, bit_depth, color_type = chunk_data.unpack("NNCC")
    elsif type == "IDAT"
      idat_data << chunk_data
    end
    
    pos += 12 + len
  end

  raw_bytes = Zlib::Inflate.inflate(idat_data).bytes
  channels = (color_type == 6) ? 4 : 3
  stride = 1 + width * channels
  
  # Decode PNG filter if any (handling basic unfiltering)
  decoded_rows = []
  (0...height).each do |y|
    row_start = y * stride
    filter_type = raw_bytes[row_start]
    row_pixels = []
    
    (0...width).each do |x|
      px_idx = row_start + 1 + x * channels
      r = raw_bytes[px_idx]
      g = raw_bytes[px_idx + 1]
      b = raw_bytes[px_idx + 2]
      
      # Undo Sub filter (type 1) or Up filter (type 2) if present
      if filter_type == 1 && x > 0
        r = (r + row_pixels[x - 1][0]) % 256
        g = (g + row_pixels[x - 1][1]) % 256
        b = (b + row_pixels[x - 1][2]) % 256
      elsif filter_type == 2 && y > 0
        r = (r + decoded_rows[y - 1][x][0]) % 256
        g = (g + decoded_rows[y - 1][x][1]) % 256
        b = (b + decoded_rows[y - 1][x][2]) % 256
      end
      
      row_pixels << [r, g, b]
    end
    decoded_rows << row_pixels
  end

  new_rgba_bytes = "".b
  
  (0...height).each do |y|
    new_rgba_bytes << 0.chr.b # Filter type 0
    
    (0...width).each do |x|
      r, g, b = decoded_rows[y][x]
      
      min_val = [r, g, b].min
      max_val = [r, g, b].max
      saturation = (max_val > 0) ? (max_val - min_val).to_f / max_val : 0
      
      if r > 240 && g > 240 && b > 240 && saturation < 0.05
        alpha = 0
      elsif r > 220 && g > 220 && b > 220 && saturation < 0.08
        factor = (240 - ((r + g + b) / 3.0)) / 20.0
        alpha = [[(factor * 255).to_i, 0].max, 255].min
      else
        alpha = 255
      end
      
      new_rgba_bytes << [r, g, b, alpha].pack("CCCC").b
    end
  end

  def make_chunk(type, data)
    len = [data.bytesize].pack("N").b
    type_b = type.b
    crc = [Zlib.crc32(type_b + data)].pack("N").b
    len + type_b + data + crc
  end

  compressed_idat = Zlib::Deflate.deflate(new_rgba_bytes)
  
  out = "\x89PNG\r\n\x1a\n".b
  out << make_chunk("IHDR", [width, height, 8, 6, 0, 0, 0].pack("NNCCCCC").b)
  out << make_chunk("IDAT", compressed_idat)
  out << make_chunk("IEND", "".b)
  
  File.binwrite(output_png, out)
  puts "Generated transparent PNG: #{output_png} (#{width}x#{height})"
end

remove_white_background("/Users/joseherrera/Desktop/proyecto_invitaciones/assets/images/wax-seal-raw.png", "/Users/joseherrera/Desktop/proyecto_invitaciones/assets/images/wax-seal-custom.png")
