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
});

var goTop = $("#gotop");

goTop.click(function(){
	$.smoothScroll({scrollTarget : 0});
})

$(window).bind("scroll" ,function(){
	if($(window).scrollTop() > 200){
		$("#totop").stop().animate({opacity:1});
	}else{
		$("#totop").stop().animate({opacity:0});
	}
})

})()