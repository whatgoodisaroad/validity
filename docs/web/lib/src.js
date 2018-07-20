$(function() {
    $(".ex_w_src").each(function() {
        var 
            $self = $(this),
            iframe = true;
            
        $self.find("pre")
            .hide();
        
        $self.find("a")
            .click(function() {
                iframe = !iframe;

                $self.find("iframe, pre")
                    .slideToggle();
                $self.find("a")
                    .text(
                        iframe ?
                            "View Source" :
                            "View Example"
                    );
                    
                return false;
            });
    });
});