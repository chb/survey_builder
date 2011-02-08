/**
 * @tag controllers, home
 */
$.Controller.extend('Surveybuilder.Controllers.Buttons',
/* @Static */
{
    onDocument: false
},
/* @Prototype */
{
    load: function(){
        if ($.DOMCached.get('hideHowto')){
            $('#showHowto').show();
        }
        else{
            $('#hideHowto').show();
        }
    },
    "#saveAll click": function(el, ev){
        Survey.saveRemote();
        Lineitem.saveAll();
        Line.saveAll();
        // hide all "content changed" indicators
        $('.ui-icon-gear').hide();
        $('#saveAll').addClass('disabled').attr("disabled", true);
    },
    "#exportSurvey click": function(el, ev){
	    OpenAjax.hub.publish('survey.export', {});
        ev.stopPropagation();
    },
    '#hideHowto click': function(el, ev){
        $('.howto').addClass('stay-hidden');
        HIDEHOWTO = true;
        $.DOMCached.set('hideHowto', true);
        $(el).hide();
        $('#showHowto').show();
    },
    '#showHowto click': function(el, ev){
        $('.howto').removeClass('stay-hidden');
        HIDEHOWTO = false;
        $.DOMCached.set('hideHowto', false);
        $(el).hide();
        $('#hideHowto').show();
    },
    '#collapseAll click': function(el, ev){
        $('.hideable:visible').slideUp();
        $('.ui-icon-triangle-1-s:visible').removeClass('ui-icon-triangle-1-s').addClass('ui-icon-triangle-1-e');
    }
});
