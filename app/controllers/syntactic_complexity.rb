class SyntacticComplexity

  def num_before_verb (text)
    sentence_arr = text.split('._.')
    sentence_arr.map! { |sentence| clean_text(sentence) }

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

  def clean_text (text)
    new_text = text.gsub(/[^a-z0-9_ ]+_[^a-z0-9_ ]/i, '')
    new_text.split
  end
end