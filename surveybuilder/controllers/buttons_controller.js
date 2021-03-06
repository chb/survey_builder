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
    init: function(){
        // TODO: switch to toggle for same button
        if ($.jStorage.get('hideHowto')){
            $('#showHowto').show().css("display", "block");
            $('#hideHowto').hide();
        }
        else{
            $('#hideHowto').show().css("display", "block");
            $('#showHowto').hide();
        }
    },
    
    'survey.loadFinished subscribe': function(event, params) {
    	$('#static-message').slideUp();
    	this.disableSaveButton();
    },
    
    'buttons.disableSaveButton subscribe': function(event, params) {
    	this.disableSaveButton();
    }, 
    
    /**
     * Disable the save button
     */
    disableSaveButton: function() {
    	$('#saveAll').addClass('disabled');
    },
    
    'buttons.enableSaveButton subscribe': function(event, params) {
    	this.enableSaveButton();
    },
    
    /**
     * Enable the save button
     */
     enableSaveButton: function(){
     	$('#saveAll').removeClass("disabled");  
     },
     
    'buttons.showAjaxLoader subscribe': function(event, params) {
    	this.showAjaxLoader();
    },
    
    /**
     * Show the ajax loader
     */
    showAjaxLoader: function() {
    	$('#ajax-loader').css("display", "inline-block");
    },
    
    'buttons.hideAjaxLoader subscribe': function(event, params) {
    	this.hideAjaxLoader();
    },
    
    /**
     * Hide the ajax loader
     */
    hideAjaxLoader: function() {
    	$('#ajax-loader').hide();
    },
    
    "#saveAll click": function(el, ev){
    	if (el.hasClass("disabled")) {
    		// don't save when button is marked as disabled
    		return false;
    	}
    	
	    // disable save button and show loader
		OpenAjax.hub.publish('buttons.disableSaveButton', {});
	    OpenAjax.hub.publish('buttons.showAjaxLoader', {});
    	//save off a copy of the internal representations
        Survey.saveToCache();
        //save external representation remotely
        Survey.saveRemote(1, 
			function(){
				// hide all "content changed" indicators
				OpenAjax.hub.publish('tabs.markTabsAsUnchanged', {});
				OpenAjax.hub.publish('buttons.hideAjaxLoader', {});
			}, 
			function(){
				OpenAjax.hub.publish('buttons.hideAjaxLoader', {});
				alert('remote save failure');
			}
		);
		return false;
    },
    "#exportSurvey click": function(el, ev){
	    OpenAjax.hub.publish('survey.export', {});
        ev.stopPropagation();
    },
    '#hideHowto click': function(el, ev){
        $('.howto').addClass('stay-hidden');
        HIDEHOWTO = true;
        $.jStorage.set('hideHowto', true);
        $(el).hide();
        $('#showHowto').show().css("display", "block");;
    },
    '#showHowto click': function(el, ev){
        $('.howto').removeClass('stay-hidden');
        HIDEHOWTO = false;
        $.jStorage.set('hideHowto', false);
        $(el).hide();
        $('#hideHowto').show().css("display", "block");;
    },
    '#collapseAll click': function(el, ev){
        $('#tabs-container .hideable:visible').slideUp();
        $('#tabs-container .ui-icon-triangle-1-s:visible').removeClass('ui-icon-triangle-1-s').addClass('ui-icon-triangle-1-e');
    }
});
