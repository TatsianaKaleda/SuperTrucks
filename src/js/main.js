$(document).ready(function () {
    $('.collapsible').collapsible();
    let elem = $('.collapsible.expandable');
    let instance = M.Collapsible.init(elem, {
        accordion: false
    });

    $('select').formSelect();
});
