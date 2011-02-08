/**
 * @tag controllers, home
 */
$.Controller.extend('Surveybuilder.Controllers.Main',
/* @Static */
{
    onDocument: true
},
/* @Prototype */
{
    load: function(){
    	//console.log("main controller load");
    	SURVEY = {};
        LINEITEMS = {};
        LINES = {};
        HIDEHOWTO = $.DOMCached.get('hideHowto');
    }
});
