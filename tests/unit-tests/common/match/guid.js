module("common", { setup:setup8Inputs });

test("$.fn.match('guid')", 2, function() {
    var expected, result;

    $('#qunit-fixture input:first').val("{3F2504E0-4F89-11D3-9A0C-0305E82C3301}");
    $.validity.start();
    $('#qunit-fixture input:first').match('guid');
    result = $.validity.end().errors;
    expected = 0;
    equal(result, expected, "match('guid') does not fail proper guid ({3F2504E0-4F89-11D3-9A0C-0305E82C3301}).");
    
    $('#qunit-fixture input:first').val("obviously not a guid.");
    $.validity.start();
    $('#qunit-fixture input:first').match('guid');
    result = $.validity.end().errors;
    expected = 1;
    equal(result, expected, "match('guid') fails on non-guid (obviously not a guid.).");
});
