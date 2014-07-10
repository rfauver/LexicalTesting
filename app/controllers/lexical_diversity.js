function () {

  var lex_d = function (args) {
    var text = args["text"];
    var ttr_threshold = "mtld_ttr_threshold" in args ? args["mtld_ttr_threshold"] : 0.72;
    var sample_size = "hdd_sample_size" in args ? args["hdd_sample_size"] : 40.0;

    return (mtld({'text': text, 'ttr_threshold': ttr_threshold}) + 
            hdd({'text': text, 'sample_size': sample_size}) + 
            yules_i(text)) / 3;
  }

  var mtld = function (args) {
    var text = args["text"];
    var ttr_threshold = "ttr_threshold" in args ? args["ttr_threshold"] : 0.72;
    var text_array = clean_text(text);
    if (text_array === null) { return mtld_scale(0); }

    var val1 = mtld_eval(text_array, ttr_threshold);
    var val2 = mtld_eval(text_array.reverse(), ttr_threshold);
    
    return mtld_scale((val1 + val2) / 2);
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

      if (current_tokens === 0.0) { return 0; }
      current_ttr = current_types / current_tokens;

      if (current_ttr < ttr_threshold) {
        factors++;
        current_ttr = 0.0;
        current_types = 0.0;
        current_tokens = 0.0;
        current_words = [];
      }
    });

    var excess = 1.0 - current_ttr;
    var excess_val = 1.0 - ttr_threshold;
    if (excess_val === 0.0) { return 0; }
    factors += excess / excess_val;

    if (factors === 0.0) { return 0; }
    return text_array.length / factors;
  }

  var mtld_scale = function (mtld) {
    return ((mtld - 99.284) * 0.5554 + 100);
  }

  var hdd = function (args) {
    var text = args["text"];
    var sample_size = "sample_size" in args ? args["sample_size"] : 40.0;
    var token_arrray = clean_text(text);
    if (token_arrray === null) { return hdd_scale(0); }
    
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
    return hdd_scale(hdd_value);
  }

  var hypergeometric = function (population, sample, pop_successes, samp_successes) {
    var mk = combination(pop_successes, samp_successes);
    var Nmnk = combination(population - pop_successes, sample - samp_successes);
    return (mk * Nmnk) / combination(population, sample);
  }

  var combination = function (n, k) {
    var i = n;
    var numerator = 1;
    while (i > (n - k) && i > 0) {
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

  var hdd_scale = function(hdd) { 
    return ((hdd - 0.854) * 592.1052 + 100); 
  }

  var yules_i = function (text) {
    var token_arrray = clean_text(text);
    if (token_arrray === null) { return yules_scale(0); }
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
      if (count >= freq_array.length) { return 0; }
      freq_array[count] += 1;
    }

    for (var i = 0; i < freq_array.length; i++) {
      m2 += (freq_array[i] * (i * i));
    }
    if ((m2 - m1) === 0) { return yules_scale(0); }
    return yules_scale((m1 * m1) / (m2 - m1));
  }

  var yules_scale = function(yules) {
    return ((yules - 100.793) * 0.6818 + 100)
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

  var clean_text = function (text) {
    var html_strip = /<(.|\n)*?>/;
    var new_text = text;
    while (html_strip.test(new_text)) {
      new_text = new_text.replace(html_strip, ' ');
    }
    new_text = new_text.replace(/&nbsp;/g, ' ');
    new_text = new_text.replace(/\\n/g, ' ');
    new_text = new_text.replace(/[^\w\s\d]/gi, '');
    return new_text.toLowerCase().match(/[a-z0-9]+/gi);
  }

  if (this.revs && this.revs.length > 0){
    var last = this.revs.length - 1 ;
    if (this.revs[last].length > 1 && this.revs[last][1].length > 0){
      var doc = this.revs[last][1];
      //emit(this._id, mtld({'text': doc}));
      //emit(this._id, hdd({'text': doc}));
      //emit(this._id, yules_i(doc));
      emit(this._id, lex_d({'text': doc}));
    }
  }
}
