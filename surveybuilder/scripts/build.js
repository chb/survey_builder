//steal/js surveybuilder/scripts/compress.js

load("steal/rhino/steal.js");
steal.plugins('steal/build','steal/build/scripts','steal/build/styles',function(){
	steal.build('surveybuilder/scripts/build.html',{to: 'surveybuilder'});
});
