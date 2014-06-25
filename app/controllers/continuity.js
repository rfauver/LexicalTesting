a = function (text) {

  var cos_sim = function (text) {
    var sentence_arr = text.match(/[^.]+/gi);

    sentence_arr = sentence_arr.map(clean_text);

    for (var i = sentence_arr.length-1; i >= 0; i--) {
      if (sentence_arr[i] === []) {
          sentence_arr.splice(i, 1);
      }
    }

    var result_arr = new Array(sentence_arr.length - 1)

    for (var i = 0; i < sentence_arr.length; i++) {
      if (i !== sentence_arr.length - 1) {
        var sentence1 = sentence_arr[i];
        var sentence2 = sentence_arr[i+1];

        var type_array = [];

        for (var j = 0; j < sentence1.length; j++) {
          if (type_array.indexOf(sentence1[j]) === -1) {
            type_array.push(sentence1[j]);
          }
        }
        for (var j = 0; j < sentence2.length; j++) {
          if (type_array.indexOf(sentence2[j]) === -1) {
            type_array.push(sentence2[j]);
          }
        }

        var vector1 = new Array(type_array.length);
        var vector2 = new Array(type_array.length);

        for (var j = 0; j < vector1.length; j++) {
          vector1[j] = 0;
          vector2[j] = 0;
        }

        for (var j = 0; j < sentence1.length; j++) {
          vector1[type_array.indexOf(sentence1[j])]++;
        }
        for (var j = 0; j < sentence2.length; j++) {
          vector2[type_array.indexOf(sentence2[j])]++;
        }

        normalize(vector1);
        normalize(vector2);

        result_arr[i] = dot_product(vector1, vector2);
      }
    }

    var total = 0;
    for (var i = 0; i < result_arr.length; i++) {
      total += result_arr[i];
    }
    return total / result_arr.length;
  }

  var normalize = function (vector) {
    var length = 0;
    for (var i = 0; i < vector.length; i++) {
      length += vector[i] * vector[i];
    }
    length = Math.sqrt(length);
    for (var i = 0; i < vector.length; i++) {
      vector[i] = vector[i] / length;
    }
    return vector;
  }

  var dot_product = function (vector1, vector2) {
    var result = 0;
    for (var i = 0; i < vector1.length; i++) {
      result += (vector1[i] * vector2[i]);
    }
    return result;
  }

  var clean_text = function (text) {
    var new_text = text.replace(/[^\w\s\d]/gi, '');
    return new_text.toLowerCase().match(/[a-z0-9]+/gi);
  }

  return cos_sim(text);
}