module("common", { setup:setupTestArea });

function setupTestArea() {
    $("#qunit-fixture").html(
        $("<input/>")
            .attr("type", "hidden")
            .val("")
    );
}

test("hidden fields", 1, function() {
    $.validity.start();
    $('#qunit-fixture input:first').require();
    result = $.validity.end().errors;
    
    expected = 1;
    equal(
        result, 
        expected, 
        "hidden fields work"
    );
});
