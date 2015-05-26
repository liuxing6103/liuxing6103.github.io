// smooth.config.js
(function(){

var links = $("#blogMenuStage ,#categoryNav").find("a");
links.each(function(){
	$(this).click(function(e){
		var id = $(this).attr("href").substring(1);
		name="1428232557373"
		$.smoothScroll({scrollTarget: "[name="+id+"]"});
		e.preventDefault();
		return false;
	})
});

var goTop = $("#gotop");

goTop.click(function(e){
	$.smoothScroll({scrollTarget : "#top"});
	e.preventDefault();
	return false;
})

$(window).bind("scroll" ,function(){
	if($(window).scrollTop() > 200){
		$("#totop").css("display","block").stop().animate({opacity:1});
	}else{
		$("#totop").stop().animate({opacity:0},function(){
			$(this).css("display","none");
		});
	}
})

})()