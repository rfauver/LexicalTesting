class LexicalDiversity

  def lex_d(text, mtld_ttr_threshold=0.72, hdd_sample_size=40.0)
    # puts mtld(text, mtld_ttr_threshold)
    # puts hdd(text, hdd_sample_size)
    # puts yules_i(text)
    (mtld(text, mtld_ttr_threshold) + hdd(text, hdd_sample_size) + yules_i(text)) / 3
  end

  def mtld(text, ttr_threshold=0.72)
    text_array = clean_text(text)
    return 0 if text_array.empty?

    val1 = mtld_eval(text_array, ttr_threshold)
    val2 = mtld_eval(text_array.reverse, ttr_threshold)
    mtld_scale((val1 + val2) / 2.0)
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

    text_array.size / factors
  end

  def mtld_scale(mtld)
    ((mtld - 99.284) * 0.5554 + 100)
  end

  def hdd(text, sample_size=40.0)
    token_array = clean_text(text)
    return 0 if token_array.empty?
    hdd_value = 0.0

    type_array = create_type_array(token_array)

    type_array.each do |element|
      contribution = 1.0 - hypergeometric(token_array.size, sample_size, token_array.count(element), 0.0)
      contribution = contribution / sample_size
      hdd_value += contribution
    end

    hdd_scale(hdd_value)
  end

  def hypergeometric(population, sample, pop_successes, samp_successes)
    (combination(pop_successes, samp_successes) * combination(population - pop_successes, sample - samp_successes)) / combination(population, sample)
  end

  def combination(n, k)
    n_minus_k = n - k
    i = n
    numerator = 1
    while i > n_minus_k && i > 0 do
      numerator *= i
      i -= 1
    end
    numerator / factorial(k)
  end

  def factorial(n)
    if n <= 1
      1
    else
      n * factorial(n - 1)
    end
  end

  def hdd_scale(hdd)
    ((hdd - 0.854) * 592.1052 + 100)
  end

  def yules_i(text)
    token_array = clean_text(text)
    return 0 if token_array.empty?

    type_array = create_type_array(token_array)

    m1 = token_array.size
    m2 = 0.0
    freq_array = Array.new(type_array.size / 2.0, 0.0)

    type_array.each do |element|
      return 0 if token_array.count(element) >= freq_array.size
      freq_array[token_array.count(element)] += 1.0
    end

    freq_array.each_with_index do |element, index|
      m2 += (element * (index ** 2))
    end
    return 0 if (m2 - m1) == 0
    yules_scale((m1 * m1) / (m2 - m1))
  end

  def yules_scale(yules)
    ((yules - 100.793) * 0.6818 + 100)
  end

  def clean_text(text)
    new_text = text.gsub(/<(.|\n)*?>/, ' ')
    new_text = new_text.gsub(/&nbsp;/, ' ')
    new_text = new_text.gsub(/[^a-z0-9 ]/i, '')
    new_text = new_text.downcase
    new_text.split
  end

  def create_type_array(token_array)
    type_array = []
    token_array.each do |element|
      unless type_array.include?(element)
        type_array << element
      end
    end
    type_array
  end
end
