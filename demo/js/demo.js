$(function() {
    if (location.hash.length) {
        var json = Base64.decode(
            location.hash
                .replace("!", "=")
                .replace(/^#/, "")
        );
        try {
            var obj = JSON.parse(json);
            $("#form-code-pre").text(obj.form);
            $("#validation-code-pre").text(obj.validation);
        }
        catch (exc) { }
    }

    $("#form-code-pre, #validation-code-pre")
        .on("change keyup", function() {
            location.hash = Base64.encode(
                JSON.stringify({
                    form:$("#form-code-pre").text(),
                    validation:$("#validation-code-pre").text()
                })
            ).replace("=", "!");
        });


    $("#form-code-pre")
        .on("keyup", function() {
            $("#form-content").html(
                $("#form-code-pre").text()
            );
        })
        .trigger("keyup");

    
    $("#test-submit")
        .on("click", function() {
            $.validity.start();

            eval(
                $("#validation-code-pre")
                    .text()
            );

            var result = $.validity.end();

            if (!result.errors) {
                $("#success-message")
                    .show()
                    .fadeOut();
            }
        });
    

});
