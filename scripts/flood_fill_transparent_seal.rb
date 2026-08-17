require 'zlib'

def flood_fill_remove_background(bmp_path, output_png_path)
  data = File.binread(bmp_path)
  
  offset = data[10, 4].unpack("V")[0]
  width = data[18, 4].unpack("l")[0]
  height = data[22, 4].unpack("l")[0]
  bpp = data[28, 2].unpack("v")[0]
  
  is_bottom_up = (height > 0)
  height = height.abs
  
  bytes_per_pixel = bpp / 8
  row_padded = ((width * bytes_per_pixel + 3) / 4) * 4
  
  grid_r = Array.new(height) { Array.new(width) }
  grid_g = Array.new(height) { Array.new(width) }
  grid_b = Array.new(height) { Array.new(width) }
  
  (0...height).each do |y|
    src_y = is_bottom_up ? (height - 1 - y) : y
    row_offset = offset + src_y * row_padded
    
    (0...width).each do |x|
      px = row_offset + x * bytes_per_pixel
      grid_b[y][x] = data[px].ord
      grid_g[y][x] = data[px + 1].ord
      grid_r[y][x] = data[px + 2].ord
    end
  end
  
  # Geometric center and protected radius of the wax seal
  cx = width * 0.505
  cy = height * 0.525
  seal_protection_radius = width * 0.260 # Protect all top/bottom highlights of the wax disc
  
  bg_mask = Array.new(height) { Array.new(width, false) }
  
  is_paper = lambda do |x, y|
    dx = x - cx
    dy = y - cy
    dist = Math.sqrt(dx * dx + dy * dy)
    
    # Wax seal interior and upper highlight loop must NEVER be treated as paper background!
    return false if dist < seal_protection_radius
    
    r = grid_r[y][x]
    g = grid_g[y][x]
    b = grid_b[y][x]
    max_c = [r, g, b].max
    min_c = [r, g, b].min
    delta = max_c - min_c
    sat = max_c > 0 ? (delta.to_f / max_c) : 0.0
    lum = (0.299 * r + 0.587 * g + 0.114 * b)
    
    (lum > 242 && sat < 0.05)
  end
  
  queue = []
  
  (0...width).each do |x|
    if is_paper.call(x, 0) && !bg_mask[0][x]
      bg_mask[0][x] = true
      queue << [x, 0]
    end
    if is_paper.call(x, height - 1) && !bg_mask[height - 1][x]
      bg_mask[height - 1][x] = true
      queue << [x, height - 1]
    end
  end
  
  (0...height).each do |y|
    if is_paper.call(0, y) && !bg_mask[y][0]
      bg_mask[y][0] = true
      queue << [0, y]
    end
    if is_paper.call(width - 1, y) && !bg_mask[y][width - 1]
      bg_mask[y][width - 1] = true
      queue << [width - 1, y]
    end
  end
  
  head = 0
  while head < queue.length
    cx_curr, cy_curr = queue[head]
    head += 1
    
    [[cx_curr + 1, cy_curr], [cx_curr - 1, cy_curr], [cx_curr, cy_curr + 1], [cx_curr, cy_curr - 1]].each do |nx, ny|
      if nx >= 0 && nx < width && ny >= 0 && ny < height
        if !bg_mask[ny][nx] && is_paper.call(nx, ny)
          bg_mask[ny][nx] = true
          queue << [nx, ny]
        end
      end
    end
  end
  
  rgba_rows = []
  
  (0...height).each do |y|
    row_bytes = "".b
    row_bytes << 0.chr.b
    
    (0...width).each do |x|
      r = grid_r[y][x]
      g = grid_g[y][x]
      b = grid_b[y][x]
      
      dx = x - cx
      dy = y - cy
      dist = Math.sqrt(dx * dx + dy * dy)
      
      if dist < seal_protection_radius
        alpha = 255 # 100% Solid Seal (Top loop, rim, letters, highlights)
      elsif bg_mask[y][x]
        lum = (0.299 * r + 0.587 * g + 0.114 * b)
        if lum >= 248
          alpha = 0
        else
          alpha = [[((248 - lum) * 16).to_i, 0].max, 180].min
        end
      else
        alpha = 255 # 100% Solid (Foliage, flowers, outer wax rim)
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
  puts "Generated 100% solid wax seal with top highlight protection: #{output_png_path}"
end

flood_fill_remove_background(
  "/Users/joseherrera/Desktop/proyecto_invitaciones/assets/images/seal_flood_raw.bmp",
  "/Users/joseherrera/Desktop/proyecto_invitaciones/assets/images/wax-seal-official.png"
)
