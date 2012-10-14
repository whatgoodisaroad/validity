module("common", { setup:setup8Inputs });

test("$.fn.require()", 3, function() {
    var expected, result;
    
    $('#qunit-fixture input:odd').val('a value');
    $('#qunit-fixture input:even').val('');
    $.validity.start();
    $('#qunit-fixture input').require();
    result = $.validity.end().errors;
    expected = $('#qunit-fixture input:even').length;
    equal(result, expected, "require validation fails on only empty inputs");
    
    $('#qunit-fixture input').val('');
    $.validity.start();
    $('#qunit-fixture input').require();
    result = $.validity.end().errors;
    expected = 8;
    equal(result, expected, "require validation fails on all inputs when all are empty");
    
    $('#qunit-fixture input').val('value');
    $.validity.start();
    $('#qunit-fixture input').require();
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "require validation does not fail when there are not empty inputs");
});
