class Continuity

  def cos_sim(text)
    sentence_arr = text.split('.')

    sentence_arr.map! { |sentence| clean_text(sentence) }
    sentence_arr.delete([])

    result_arr = Array.new(sentence_arr.length - 1)
    sentence_arr.each_index do |i|
      unless i == sentence_arr.length - 1
        sentence1 = sentence_arr[i]
        sentence2 = sentence_arr[i+1]

        type_array = []

        sentence1.each do |word|
          unless type_array.include?(word)
            type_array << word
          end
        end
        sentence2.each do |word|
          unless type_array.include?(word)
            type_array << word
          end
        end

        vector1 = Array.new(type_array.size, 0)
        vector2 = Array.new(type_array.size, 0)

        sentence1.each do |word|
          vector1[type_array.find_index(word)] += 1
        end
        sentence2.each do |word|
          vector2[type_array.find_index(word)] += 1
        end

        normalize!(vector1)
        normalize!(vector2)

        result_arr[i] = dot_product(vector1, vector2)
      end
    end

    # puts result_arr.inspect
    result_arr.reduce(:+) / result_arr.length
  end

  def clean_text(text)
    new_text = text.gsub(/[^a-z0-9 ]/i, '')
    new_text = new_text.downcase
    new_text.split
  end

  def normalize!(vector)
    # puts vector.inspect
    length = 0
    vector.each { |element| length += element * element }
    length = Math.sqrt(length)
    # puts length
    vector.map! { |element| element / length }
    vector
  end

  def dot_product(vector1, vector2)
    result = 0
    vector1.each_index { |i| result += vector1[i] * vector2[i] }
    result
  end
end