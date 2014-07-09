class SyntacticComplexity

  def num_before_verb (text)
    sentence_arr = text.split('._.')
    sentence_arr.map! { |sentence| clean_pos_text(sentence) }

    sentence_arr.each do |sentence|
      sentence.map! do |word|
        word.split('_')
      end
    end
    
    total_before_verb = 0
    sentence_arr.each do |sentence|
      sentence.each do |word|
        if (word[1] =~ /^(VB|VBD|VBG|VBN|VBP|VBZ)$/)
          break
        end
        total_before_verb += 1
      end
    end
    total_before_verb.to_f / sentence_arr.size
  end

  def mean_sent_length (text)
    sentence_arr = text.split('.')

    sentence_arr.map! { |sentence| clean_text(sentence) }
    sentence_arr.delete([])

    num_words = 0

    sentence_arr.each do |sentence|
      sentence.each { |word| num_words += 1 }
    end

    puts sentence_arr

    num_words.to_f / sentence_arr.size
  end

  def clean_pos_text (text)
    new_text = text.gsub(/[^a-z0-9_ ]+_[^a-z0-9_ ]/i, '')
    new_text.split
  end

  def clean_text(text)
    new_text = text.gsub(/[^a-z0-9 ]/i, '')
    new_text = new_text.downcase
    new_text.split
  end
end