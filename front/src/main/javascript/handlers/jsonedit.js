var POPUP_SEL = "#jsonedit-popup",
    editJSON = function(path, title, data){
    var container = $(POPUP_SEL + " .modal-body")[0],
        editor = new JSONEditor(container),
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
       var saveButton = $(elt).parents(".subpipe").find(".save"),
           view = new JSONEditor(elt, {
               "onChange":function() {
                   if (!saveButton.shown){
                       saveButton.shown = true;
                       saveButton.toggleClass("hide");
                   }
               }
           });
       view.set(Pipes.removeProtectedProperties($(elt).data("json")));
       saveButton.click(function(){
           var subpipe = $(this).parents(".subpipe"),
               pathInfo = Pipes.extractPathInfo(subpipe.data("path"));
           Pipes.importContent(pathInfo.parent, pathInfo.name, view.get(), function(){
               location.reload();
           });
       });
   });
});