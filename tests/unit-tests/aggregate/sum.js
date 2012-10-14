module("aggregate", { setup:setup8Inputs });

test("$.fn.sum(val)", 3, function() {
    var result, expected, values;
    
    values = [
        25, 25, 25, 25, 25, 25, 25, 25
    ];
    
    $('#qunit-fixture input').each(function(i){
        this.value = values[i];
    });
    
    $.validity.start();
    $('#qunit-fixture input').sum(200);
    
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "sum(200) finds no failures when all 8 inputs sum exactly to 200.");
    
    values = [
        5, 12, 5, 7, 5, 6, 87, 5
    ];
    
    $('#qunit-fixture input').each(function(i){
        this.value = values[i];
    });

    $.validity.start();
    $('#qunit-fixture input').sum(200);
    
    result = $.validity.end().errors;
    expected = 1;
    equal(result, expected, "sum(200) finds failure when sum of inputs is less than 200");
    
    values = [
        5, 12, 5, 7, 5, 6, 837, 5
    ];
    
    $('#qunit-fixture input').each(function(i){
        this.value = values[i];
    });

    $.validity.start();
    $('#qunit-fixture input').sum(200);
    
    result = $.validity.end().errors;
    expected = 1;
    equal(result, expected, "sum(200) finds failure when sum of inputs is greater than 200");
});
