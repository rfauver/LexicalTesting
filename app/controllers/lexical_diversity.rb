class LexicalDiversity

  def mtld(text, ttr_threshold=0.72)
    new_text = text.gsub(/[^a-z0-9 ]/i, '')
    new_text = new_text.downcase
    text_array = new_text.split

    val1 = mtld_eval(text_array, ttr_threshold)
    val2 = mtld_eval(text_array.reverse, ttr_threshold)
    val1
    #(val1 + val2) / 2
  end

  def mtld_eval(text_array, ttr_threshold)
    current_ttr = 1.0
    current_types = 0.0
    current_tokens = 0.0
    current_words = []
    factors = 0.0

    text_array.each do |element|
      current_tokens += 1
      unless current_words.include?(element)
        current_types += 1
        current_words << element
      end

      current_ttr = current_types / current_tokens

      puts "word: #{element}     current_ttr: #{current_ttr}       factors: #{factors}"
      if current_ttr < ttr_threshold
        factors += 1
        current_ttr = 0.0
        current_types = 0.0
        current_tokens = 0.0
        current_words = []
      end
    end

    excess = 1.0 - current_ttr
    excess_val = 1.0 - ttr_threshold
    factors += excess / excess_val
    puts factors

    text_array.size / factors
  end

end
