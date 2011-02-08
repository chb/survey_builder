//js surveybuilder/scripts/doc.js

load('steal/rhino/steal.js');
steal.plugins("documentjs").then(function(){
	DocumentJS('surveybuilder/surveybuilder.html');
});