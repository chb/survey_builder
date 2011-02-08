$(function(){

    //attach controllers
    $('#components').surveybuilder_components();
    $('#survey').surveybuilder_survey();
    $('.ui-tabs-nav').surveybuilder_tabs();
    $('#buttons').surveybuilder_buttons();


    $('#tabs').tabs({
        tabTemplate: '<li><a href="#{href}"><span class="ui-icon ui-icon-gear changes-made" title="content changed"></span><span>#{label}</span></a><a class="close-tab"><span class="ui-icon ui-icon-closethick close-icon"></span></a></li>',
        add: function(event, ui) {
            $('#tabs').tabs('select', '#' + ui.panel.id);
        }
    });

   $('.info-icon').live('click', function(){
       var infoDiv = $($(this).attr("data-infoId"));
      jQuery.facebox(infoDiv.html());
   });

    // Hide details on lines/questions/answers/etc
    $(".ui-icon-triangle-1-s").live("click", function(){
        $(this).parent().children('.hideable').slideUp();
        $(this).parent().children('.lineitem-form').find('.hideable').slideUp();
        $(this).removeClass('ui-icon-triangle-1-s').addClass('ui-icon-triangle-1-e');
    });

    // Expand details on lines/questions/answers/etc
    $('.ui-icon-triangle-1-e').live('click', function(){
        $(this).parent().children('.hideable').slideDown();
        $(this).parent().children('.lineitem-form').find('.hideable').slideDown();
        $(this).removeClass('ui-icon-triangle-1-e').addClass('ui-icon-triangle-1-s');
    });

});
