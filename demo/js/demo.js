$(function() {
    
    $("#form-code-pre").on("keyup", function() {
        $("#form-content").html(
            $("#form-code-pre").text()
        );
    });

    
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
