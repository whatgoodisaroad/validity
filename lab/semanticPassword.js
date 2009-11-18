// Experimental Validity Plugin
// semanticPassword.js
(function($) {
    $.fn.password = function(options) {
        options = $.extend({
                mininumNonAlphaNumeric:0,
                mininumNonAlphaNumericMessage:"#{field}",
                
                minLength:4,
                minLengthMessage:"#{field} must be at least #{length} characters long.",
                
                maxLength:null,
                
                alphabet:null
            }, 
            options
        );
        
        if (options.alphabet) {
            this.match(options.alphabet, "The password contains unallowed characters.");
        }
    };
})(jQuery);
