module("aggregate", { setup:setup8Inputs });

test("$.fn.distinct()", 2, function() {
    var result, expected, values;
    
    values = [
        1, 2, 3, 4, 5, 6, 7, 8
    ];
    
    $('#qunit-fixture input').each(function(i){
        this.value = values[i];
    });
    
    $.validity.start();
    $('#qunit-fixture input').distinct();
    
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "distinct() finds no failure when none among 8 inputs have equal values");
    
    values = [
        1, 2, 3, 4, 1, 6, 7, 8
    ];
    
    $('#qunit-fixture input').each(function(i){
        this.value = values[i];
    });

    $.validity.start();
    $('#qunit-fixture input').distinct();
    
    result = $.validity.end().errors;
    expected = 1;
    equal(result, expected, "distinct() finds failure when 2 among 8 inputs have equal values");
});
