module("private", { setup:setup8InputsAndDebugPrivates });

test("$.validity.__private.addToReport()", 2, function() {
    $.validity.start();
    
    if ($.validity.isValidating()) {
        $.validity.report.errors = 0;
        $.validity.report.valid = true;
        
        $.validity.__private.addToReport();
        
        var report = $.validity.report;
        
        equal(report.errors, 1, "addToReport properly increments error counter");
        equal(report.valid, false, "addToReport properly sets valid to false.");
    };
});

