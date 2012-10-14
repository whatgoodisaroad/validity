module("private", { setup:setup8InputsAndDebugPrivates });

test("$.validity.__private.infer(field)", 4, function() {
    var field, expected, result;
    
    field = $("<input/>").attr("title", "name");
    expected = "name";
    result = $.validity.__private.infer(field);
    equal(result, expected, "infer finds name on title.");
    
    field = $("<input/>").attr("id", "ABunchOfWords");
    expected = "A Bunch Of Words";
    result = $.validity.__private.infer(field);
    equal(result, expected, "infer finds name in id with upper camelcase.");
    
    field = $("<input/>").attr("id", "words_separated_by_underscores");
    expected = "Words Separated By Underscores";
    result = $.validity.__private.infer(field);
    equal(result, expected, "infer finds name in id in lowercase with underscores.");
    
    field = $("<input/>");
    expected = $.validity.settings.defaultFieldName;
    result = $.validity.__private.infer(field);
    equal(result, expected, "infer defaults when name cannot be inferred.");    
});
