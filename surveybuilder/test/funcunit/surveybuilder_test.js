module("surveybuilder test", { 
	setup: function(){
		S.open("//surveybuilder/surveybuilder.html");
	}
});

test("Copy Test", function(){
	equals(S("h1").text(), "Welcome to JavaScriptMVC 3.0!","welcome text");
});