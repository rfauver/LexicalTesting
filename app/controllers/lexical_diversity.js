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
