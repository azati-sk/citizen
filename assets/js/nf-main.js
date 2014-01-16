
$(document).ready(function() {
	$('#menu > ul > li > a').on("click",function(){

		

		$menuItem = $(this).parent().next('ul');

		if($menuItem.hasClass('open')){
			$menuItem.removeClass('open').hide();
			$(this).parent().removeClass('openItem');

			console.log("yes");
		}else{
			console.log("nope");
			
			$('#menu .open').each(function(){
		 		$(this).removeClass('open').hide();
			})

			$('#menu .openItem').each(function(){
		 		$(this).removeClass('openItem');
			})

			$(this).parent().addClass('openItem');

			$menuItem.addClass('open').show();
		}

		//$(this).siblings('ul').animate({'height':100%});
		return false;
	})

	$('#menu ul ul a').on("click",function(){
		$('#menu .current').each(function(){
			$(this).removeClass('current');
		})
		$(this).addClass('current');
		clickedTitle = $(this).html();
		$('.tester').html(clickedTitle);
		return false;
	})
})