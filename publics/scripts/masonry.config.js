// masonry.config.js
(function(){
	
	var $container = $('#masonry');

	if(!$container.length) return;

	$container.masonry({
	    itemSelector : '.box',
	    gutterWidth : 20,
	    isAnimated: true,
	});
	
})()