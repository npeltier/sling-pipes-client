var POPUP_SEL = "#jsonedit-popup",
    editJSON = function(path, title, data){
    var container = $(POPUP_SEL + " .modal-body")[0],
        options = {
            "theme": "bootsrap3",
            "input_height": "30rem"
        },
        editor = new JSONEditor(container, options),
        modal = $(POPUP_SEL),
        pathInfo = Pipes.extractPathInfo(path);
    $(POPUP_SEL + " .modal-title").text(title);
    $(POPUP_SEL + " button.savejson").click(function(){
        Pipes.importContent(pathInfo.parent, pathInfo.name, editor.get(), function(){
            Pipes.execute(false);
        });
    });

    editor.set(Pipes.removeProtectedProperties(data));

    modal.on("hidden.bs.modal", function(){
        $(POPUP_SEL + " .modal-body").children("*").remove();
    });

    modal.modal();
};

$('.json-edit').click(function(){
    var button = $(this),
        path = button.data("path"),
        title = button.data("title") || "Edit JSON";
    $.ajax({
        url: path + ".infinity.json",
        dataType:'json'
    }).done(function(data){
        editJSON(path, title, data);
    }).fail(function(){
        editJSON(path, title, {});
    });
});

$(document).ready(function(){
   $('.json-view').each(function(idx, elt){
       var options = {
           "theme": "bootsrap3",
           "iconlib": "bootstrap3"
       },
       view = new JSONEditor(elt, options);
       view.set(Pipes.removeProtectedProperties($(elt).data("json")));
   });
});