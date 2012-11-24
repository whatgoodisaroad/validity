module("static", { setup:setup8Inputs });

test("$.validity.isValidating()", 3, function() {
    var expected, result;
    
    expected = false;
    result = $.validity.isValidating();
    equal(result, expected, "isValidating returns false when nothing has been started.");
    
    $.validity.start();
    
    expected = true;
    result = $.validity.isValidating();
    equal(result, expected, "isValidating returns true when validation has been started but not ended.");
    
    $.validity.end();
    
    expected = false;
    result = $.validity.isValidating();
    equal(result, expected, "isValidating returns false when validation has been ended.");
});


