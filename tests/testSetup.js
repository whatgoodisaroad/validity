function setup8Inputs() {
    $("#qunit-fixture").html(
        '<div id="testArea" style="display:none;">' +
            '<div class="validity-summary-container">' +
                'Summary:' +
                '<ul></ul>' +
            '</div>' +
            '<input type="text" name="i0" id="i0" /><br />' +
            '<input type="text" name="i1" id="i1" /><br />' +
            '<input type="text" name="i2" id="i2" /><br />' +
            '<input type="text" name="i3" id="i3" /><br />' +
            '<input type="text" name="i4" id="i4" /><br />' +
            '<input type="text" name="i5" id="i5" /><br />' +
            '<input type="text" name="i6" id="i6" /><br />' +
            '<input type="text" name="i7" id="i7" /><br />' +
            '<div class="validity-summary-container">' +
                'Summary:' +
                '<ul></ul>' +
            '</div>' +
        '</div>'
    );
}

function setup8InputsAndDebugPrivates() {
    setup8Inputs();
    
    $.validity.setup({ debugPrivates:true });
}
