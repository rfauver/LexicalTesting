a = function (text) {

  var mtld = function (args) {
    var text = args["text"];
    var ttr_threshold = "ttr_threshold" in args ? args["ttr_threshold"] : 0.72;
    var text_array = clean_text(text);

    var val1 = mtld_eval(text_array, ttr_threshold);
    var val2 = mtld_eval(text_array.reverse(), ttr_threshold);
    
    return (val1 + val2) / 2;
  }

  var mtld_eval = function (text_array, ttr_threshold) {
    var current_ttr = 1.0,
    current_types = 0.0,
    current_tokens = 0.0,
    current_words = [],
    factors = 0.0;

    text_array.forEach(function(word) {
      current_tokens++;
      if (current_words.indexOf(word) == -1) {
        current_types++;
        current_words.push(word);
      }
      //console.log("word: " + word + "           current_words: " + current_words);

      //console.log("types: " + current_types + "   tokens: " + current_tokens);
      current_ttr = current_types / current_tokens;

      if (current_ttr < ttr_threshold) {
        factors++;
        current_ttr = 0.0;
        current_types = 0.0;
        current_tokens = 0.0;
        current_words = [];
      }

      //console.log(word + "  current_ttr: " + current_ttr + "  factors: " + factors);
    });

    var excess = 1.0 - current_ttr;
    var excess_val = 1.0 - ttr_threshold;
    factors += excess / excess_val;

    return text_array.length / factors;
  }

  var clean_text = function (text) {
    var new_text = text.replace(/[^\w\s\d]/gi, '');
    return new_text.toLowerCase().match(/[a-z0-9]+/gi);
  }

  if (this.revs && this.revs.length > 0){
    var last = this.revs.length - 1 ;
    if (this.revs[last].length > 1 && this.revs[last][1].length > 0){
      var doc = this.revs[last][1];
      emit(this._id, mtld({'text': text}));

    }
  }
}

b = function (text) {

  var hdd = function (args) {
    var text = args["text"];
    var sample_size = "sample_size" in args ? args["sample_size"] : 40.0;
    var token_arrray = clean_text(text);
    
    var hdd_value = 0.0;

    var type_array = create_type_array(token_arrray);

    for (var i = 0; i < type_array.length; i++) {
      var count = 0;
      for (var j = 0; j < token_arrray.length; j++) {
        if (type_array[i] == token_arrray[j]) {
          count++;
        }
      }
      var contribution = 1.0 - hypergeometric(token_arrray.length, sample_size, count, 0.0);
      contribution /= sample_size;
      hdd_value += contribution;
    }
    return hdd_value;
  }

  var hypergeometric = function (population, sample, pop_successes, samp_successes) {
    var mk = combination(pop_successes, samp_successes);
    var Nmnk = combination(population - pop_successes, sample - samp_successes);
    return (mk * Nmnk) / combination(population, sample);
  }

  var combination = function (n, k) {
    var i = n;
    var numerator = 1;
    while (i > (n - k)) {
      numerator *= i;
      i -= 1;
    }
    return numerator / factorial(k);
  }

  var factorial = function (n) {
    if (n <= 1) {
      return 1;
    }
    return (n * factorial(n - 1));
  }

  var clean_text = function (text) {
    var new_text = text.replace(/[^\w\s\d]/gi, '');
    return new_text.toLowerCase().match(/[a-z0-9]+/gi);
  }

  var create_type_array = function (token_arrray) {
    var type_array = [];
    for (var i = 0; i < token_arrray.length; i++) {
      if (type_array.indexOf(token_arrray[i]) == -1) {
        type_array.push(token_arrray[i]);
      }
    }
    return type_array;
  }

  var args = [];
  args['text'] = text;
  return hdd(args);
}

c = function (text) {

  var yules_i = function (text) {
    var token_arrray = clean_text(text);
    var type_array = create_type_array(token_arrray);

    var m1 = token_arrray.length;
    var m2 = 0.0;
    var new_arr_length = parseInt(type_array.length/2);
    var freq_array = Array.apply(null, new Array(new_arr_length)).map(Number.prototype.valueOf,0);

    for (var i = 0; i < type_array.length; i++) {
      var count = 0;
      for (var j = 0; j < token_arrray.length; j++) {
        if (type_array[i] == token_arrray[j]) {
          count++;
        }
      }
      freq_array[count] += 1;
    }

    for (var i = 0; i < freq_array.length; i++) {
      m2 += (freq_array[i] * (i * i));
    }
    return (m1 * m1) / (m2 - m1);
  }

  var clean_text = function (text) {
    var new_text = text.replace(/[^\w\s\d]/gi, '');
    return new_text.toLowerCase().match(/[a-z0-9]+/gi);
  }

  var create_type_array = function (token_arrray) {
    var type_array = [];
    for (var i = 0; i < token_arrray.length; i++) {
      if (type_array.indexOf(token_arrray[i]) == -1) {
        type_array.push(token_arrray[i]);
      }
    }
    return type_array;
  }

  return yules_i(text);
}


