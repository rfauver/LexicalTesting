class LexicalDiversity

  def mtld(text, ttr_threshold=0.72)
    text_array = clean_text(text)

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

  def hdd(text)
    token_array = clean_text(text)
    type_array = []
    hdd_value = 0.0

    token_array.each do |element|
      unless type_array.include?(element)
        type_array << element
      end
    end

    type_array.each do |element|
      contribution = 1.0 - hypergeometric(token_array.size, 40.0, token_array.count(element), 0.0)
      contribution = contribution / 40.0
      puts "#{element}      contribution: #{contribution}"
      hdd_value += contribution
    end

    hdd_value
  end

  def hypergeometric(population, sample, pop_successes, samp_successes)
    (combination(pop_successes, samp_successes) * combination(population - pop_successes, sample - samp_successes)) / combination(population, sample)
  end

  def combination(n, k)
    n_minus_k = n - k
    i = n
    numerator = 1
    while i > n_minus_k do
      numerator *= i
      i -= 1
    end
    numerator / factorial(k)
    #factorial(n) / (factorial(k) * factorial(n - k))
  end

  def factorial(n)
    if n <= 1
      1
    else
      n * factorial(n - 1)
    end
  end

  def clean_text(text)
    new_text = text.gsub(/[^a-z0-9 ]/i, '')
    new_text = new_text.downcase
    new_text.split
  end

end
