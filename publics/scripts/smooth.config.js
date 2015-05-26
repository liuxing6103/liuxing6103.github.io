// smooth.config.js
(function(){

var links = $("#blogMenuStage ,#categoryNav").find("a");
links.each(function(){
	$(this).click(function(e){
		var id = $(this).attr("href").substring(1);
		name="1428232557373"
		$.smoothScroll({scrollTarget: "[id="+id+"]"});
		e.preventDefault();
		return false;
	})
})

})()