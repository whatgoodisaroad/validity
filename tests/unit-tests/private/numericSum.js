module("private", { setup:setup8InputsAndDebugPrivates });

test("$.validity.__private.numericSum(obj)", 2, function() {
    var 
        obj = $("<input/>")
            .clone().andSelf()
            .clone().andSelf() // 4 inputs
            .val(1),
        
        result = $.validity.__private.numericSum(obj),
        expected = 4;
        
    equal(result, expected, "numericSum properly finds the sum of 4 elements.");
    
    obj.val(2);
    expected = 8;
    
    result = $.validity.__private.numericSum(obj);
    
    equal(result, expected, "numericSum properly finds the sum of 4 elements.");
});
