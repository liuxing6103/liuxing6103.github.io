// masonry.config.js
(function(){
	$(function(){
		
	var $container = $('#masonry');

	if(!$container.length) return;

	$container.masonry({
	    itemSelector : '.box',
	    isAnimated: true,
	});
	
	})
})()