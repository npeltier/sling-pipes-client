var POPUP_SEL = "#jsonedit-popup";
var editJSON = function(path, title, data){
    var container = $(POPUP_SEL + " .modal-body")[0],
        options = {},
        editor = new JSONEditor(container, options),
        modal = $(POPUP_SEL);
    $(POPUP_SEL + " .modal-title").text(title);
    $(POPUP_SEL + " button.savejson").click(function(){
        $.ajax({
            url: path,
            type:'post',
            data: editor.get()
        });
    });
    editor.set(data);
    modal.modal();
};

$('button.json-edit').click(function(){
    var button = $(this),
        path = button.data("path"),
        title = button.data("title") || "Edit JSON";
    $.ajax({
        url: path + ".json",
        dataType:'json'
    }).done(function(data){
        editJSON(path, title, data);
    }).fail(function(){
        editJSON(path, title, {});
    });
});