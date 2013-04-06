$(document).ready(function(){
    $('form').validate({
        rules: {
            name: 'required'
        }
    });

    $('#phones').coledit({
        defaultItems: 2,
        minItems: 2,
        maxItems: 6,
        btnAutoHide: false,
        onAddItem: function(item, count) {
            $('input', item).rules('add', {
                required: true
            });
        }
    });

    $('#emails').coledit({
        onAddItem: function(item, count) {
            $('input', item).rules('add', {
                required: true,
                email: true
            });
        }
    });
});
