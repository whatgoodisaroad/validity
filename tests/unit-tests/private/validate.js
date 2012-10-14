module("private", { setup:setup8InputsAndDebugPrivates });

test("$.validity.__private.validate($obj, regimen, message)", 4, function() {
    var $obj, regimen, message, expected, result, actual;
    
    $obj = $("<input type='text' value='some value' />");
    regimen = function(elem) { return false; };
    message = "message";
    
    equal(
        $obj.reduction, 
        undefined, 
        "Regimen isn't defined on a new jQuery object for some reason."
    );
    
    result = $.validity.__private.validate($obj, regimen, message);
    
    notEqual(
        $obj.reduction, 
        undefined, 
        "Regimen is defined on the jQuery object after validate is called."
    );
    
    expected = 0;
    actual = result.reduction.length;
    equal(
        actual,
        expected,
        "Validation failure results in empty reduction."
    );
    
    $obj = $("<input type='text' value='some value' />");
    regimen = function(elem) { return true; };
    
    result = $.validity.__private.validate($obj, regimen, message);
    
    expected = result.length;
    actual = result.reduction.length;
    equal(
        actual,
        expected,
        "Validation success results equivalent reduction."
    );
    
});
