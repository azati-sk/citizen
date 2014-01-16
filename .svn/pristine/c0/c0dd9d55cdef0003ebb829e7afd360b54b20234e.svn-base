
var global_CustomerID = null;        // global variables to store customer ID 
var global_CustomerName = "";        //     and name
var showMenu = false;

$(document).bind('mobileinit', function () {
	console.log('mobileinit');
	$.mobile.selectmenu.prototype.options.nativeMenu = false;
	if ("ontouchstart" in document.documentElement)
		$('html').addClass('touch');
	navController();
});

$(document).on('pageinit', '#citizen-choose-customer', function (event) {
	console.log('pageinit citizen-choose-customer');
	$('#select-customer-element').listview('option', 'filterCallback', listviewCallback);
	SelectCustControls();
});


function PageBeforeChange() {
	$(document).on('pagebeforechange', function (event, data) {
		if (typeof data.toPage === "string") {
			console.log('pagebeforechange to ' + data.toPage);
		} else
			if (typeof data.toPage === "object") {
				var myFrom = data.options.fromPage;
				var strFrom = "nothing";
				if (myFrom != null)
					strFrom = data.options.fromPage.attr('data-url');
				console.log('pagebeforechange obj to ' + data.toPage.attr('data-url') + ", from = " + strFrom);
				console.log('    data options = ' + data.options);

				if (data.toPage.attr('data-url') === "citizen-choose-customer" &&
					strFrom != "nothing") {
					console.log("prevented default page change");
					event.preventDefault();
				}
			}
	});
}

$(document).ready(function () {
	PageBeforeChange();
});

$(document).on('pagebeforeshow', '#citizen-choose-customer', function (event) {
	console.log('pagebeforeshow citizen-choose-customer');
});

$(document).on('pageinit', '#main-body', function () {
	// If we are entering a deep link but customer ID has not been set, redirect to first page
	if (global_CustomerID == null)
		$.mobile.changePage($("#citizen-choose-customer"), { changeHash: false });

	console.log('pageinit main-body');
	slideshow();
	navController();
	buttons();
	imageblocks();

	// Set all watch quantities on this slide to 0
	// and cart icon to 0
	// Code below will set to correct values after AJAX
	//      NOTE:  I don't think it's necessary to do this in pageinit
	//$('.quantity').val(0);
	//$('.cart-icon').val(0);

	// Set quantity values in grid thumbs, based on cart values
	$.ajax({
		url: "SetQuantities.aspx",
		//async: false,
		cache: false
	}).always(function (myData, textStatus, myErr) {
		if (textStatus == "success")
			jQuery.globalEval(myData);
	});
});

$(document).on('pageshow', '#main-body', function () {
});

$(document).bind("pagebeforeshow", function (e, data) {
});

$(window).load(function () {
});


function listviewCallback(text, searchString) {
	console.log('listviewCallback');
	$('#select-customer-container').addClass('active rsNoDrag').click(function () {
		$('#select-customer-container').removeClass('active rsNoDrag');
		$('#select-customer').find('a[data-icon="delete"]').click();
	}).children().click(function (e) {
		return false;
	});

	$('#select-customer a[data-icon="delete"]').remove();
	$('.ui-icon.ui-icon-arrow-r.ui-icon-shadow').remove();


	$('#select-customer a[data-icon="delete"]').off('click').on('click', function () {
		console.log('select-customer click');
		$('#select-customer-container').click();
	});

	return text.toLowerCase().indexOf(searchString) === -1;
}

function slideshow() {
	var winH, winW, options, slider;
	winW = 1024;
	winH = 768;
	winH = $(document).height();
	winW = $(document).width();
	options = ({
		arrowsNav: false,
		loop: false,
		keyboardNavEnabled: true,
		controlsInside: false,
		imageScaleMode: 'fit',
		arrowsNavAutoHide: false,
		autoScaleSlider: true,
		autoScaleSliderWidth: winW,
		autoScaleSliderHeight: winH,
		controlNavigation: 'none',
		thumbsFitInViewport: false,
		navigateByClick: false,
		startSlideId: 0,
		autoPlay: false,
		transitionType: 'move',
		nonDraggableClassEnabled: true,
		globalCaption: true,
		block: {
			fadeEffect: true
		},
		deeplinking: {
			enabled: true,
			change: true,
			prefix: 'slide-'
		}
	});

	$('#full-width-slider').royalSlider(options).css('display', 'block');
	slider = $('#full-width-slider').data('royalSlider');
	slider.ev.on('rsAfterSlideChange', function (event) {
		console.log('rsAfterSlideChange, currSlideId = ' + slider.currSlideId.toString());

		slider.currSlide.holder.addClass('rsActiveSlide').siblings().removeClass('rsActiveSlide');
		var thisSlide = $('.rsActiveSlide');
		var thisAnimation = slider.currSlide.holder.find('.animation').data('animation');
		if (slider.currSlide.holder.find('.rsContent').data('animation')) {
			if (thisAnimation) {
				console.log('calling letsAnimate = ' + thisAnimation);
				letsAnimate(thisAnimation);
			}
		} else {
			console.log('calling revertAnimate');
			revertAnimate();
		}

		if (slider.currSlide.holder.find('.quantity') ||
            slider.currSlide.holder.find('.cart-icon')) {
			// Set all watch quantities on this slide to 0
			// and cart icon to 0
			// Code below will set to correct values after AJAX
			slider.currSlide.holder.find('.txt-itemQuantity').val('0');
			slider.currSlide.holder.find('.cart-icon').find('span').text('0');

			console.log('calling setquantities ajax');
			// Set quantity values in grid thumbs, based on cart values
			$.ajax({
				url: "SetQuantities.aspx",
				//async: false,
				cache: false
			}).always(function (myData, textStatus, myErr) {
				console.log('setquantities done');
				if (textStatus == "success")
					jQuery.globalEval(myData);
			});
		}

		var custName = slider.currSlide.holder.find('#citizen-cust-name');
		if (custName != null)
			slider.currSlide.holder.find('#citizen-cust-name').text(global_CustomerName);

	});

	slider.ev.off('rsAfterInit').on('rsAfterInit', function () {
		console.log('rsAfterInit');
		navController();

		var thisAnimation = slider.currSlide.holder.find('.animation').data('animation');
		if (slider.currSlide.holder.find('.rsContent').data('animation')) {
			if (thisAnimation) {
				letsAnimate(thisAnimation);
			}
		} else {
			revertAnimate();
		}
		if (slider.currSlide.holder.find('.rsContent').data('panel')) {
			var whichPanel = $('.rsActiveSlide').data('panel');
			$(whichPanel).fadeIn(500);
		} else {
			$('[data-panel]').fadeOut(500);
		}
	});

	slider.ev.on('rsAfterContentSet', function (e, slideObject) {
		console.log("rsAfterContentSet, slide = ", slideObject);

		buttons();
		imageblocks();
		spinner();
		
		if (showMenu == false) {
			console.log('menu removed on ' + slideObject);
			$('.lock-section').remove();
		}
		// fires when every time when slide content is loaded and added to DOM
	});


	//var pageSlider = $pageSlider.data('royalSlider');

slider.ev.on('rsBeforeAnimStart', function() {
		console.log("beforeAnimate" + slider.currSlideId);


    	if ($('video', slider.currSlide.holder).length > 0) {
			console.log("exiting now, bye bye!!!!!!!!!!!!!");

			myVideo = $('video', slider.currSlide.holder)[0];
			if(!myVideo.paused){
				myVideo.pause();
				console.log("Pause!!!!!!!!!!!!!");
			}
		}
	});


	slider.ev.on('rsAfterSlideChange', function () {
		console.log("AfterChange" + slider.currSlideId)
	// start video for the current slide (if any)	
	//$('video', slider.currSlide.holder)[0].pause();	
		if ($('video', slider.currSlide.holder).length > 0) {
			console.log("Video exists!!!!!!!!!!!!!!!!!!!!!!!");

			myVideo = $('video', slider.currSlide.holder)[0];
			if(myVideo.paused){
				myVideo.play(); 
				console.log("Play!!!!!!!!!!!!!");
			}
		}
	});
}

function spinner() {
	var slider = $('#full-width-slider').data('royalSlider');
	var thisKnob = slider.currSlide.holder.find('.slider-knob');
	var myImage = slider.currSlide.holder.find('.slider-img');
	$(thisKnob).off('change').change(function () {
		//var myImage = $(this).siblings('img.slider-img'); //$('div.ui-page-active img.slider-img');
		var currentVal = $(this).attr('value');
		var slideNumber = myImage.attr('data-slidenumber');
		var myImageNumber = $(myImage).attr('src').split('.');
		myImageNumber[0] = myImageNumber[0].replace(/\-?\d+(\.\d+)?/g, currentVal);
		newImage = myImageNumber[0] + "." + myImageNumber[1];
		$(myImage).attr('src', newImage);
		//myImageNumber = currentVal;

		//slideNumber
		$(myImage).attr('data-slideNumber', currentVal);
		if (currentVal != slideNumber)
			myImageNumber = currentVal;
	});
	$('input[type="number"]').hide();
}
function letsAnimate(thisAnimation) {
	var delay = 0;;
	if (thisAnimation === "barchart") {
		var barChart = $('#barChart-animated');
		$(barChart).addClass('active').find('.bar').each(function (i) {
			var myPercent = $(this).data('percentage');
			delay = (i + 1) * 100;
			$(this).transition({
				delay: delay,
				height: myPercent + '%'
			}, 500);
		});
	} else if (thisAnimation === "fade-in") {
		var fades = $('.fade-in');
		$(fades).addClass('active').each(function (i) {
			delay = (i + 1) * 1000;
			$(this).transition({
				delay: delay,
				opacity: 1
			}, 1000);
		});
	} else if (thisAnimation === "play-out") {
		var fades = $('.fade-in2');

		$(fades).each(function (i) {
			$(this).removeClass("fadeOut lastIn");
		});

		$(fades).addClass('activePlay').each(function (i) {
			delay = (i + 1) * 1400;
			//$(this).delay(delay).addClass('fadeOut');
			console.log("hereee");

			$(this).delay(delay).queue(function(next){
				console.log("yerr");


				if ($(this).hasClass("stayStill"))
		        {
		            $(this).addClass('lastIn');
		        }else{
		        	$(this).addClass('fadeOut');
		        }
    			next();
    		});
			//$(this).transition({
				//delay: delay
				//opacity: 1
			//}, 2000);
		});
	}
}

function revertAnimate() {
	var barChart = $('#barChart-animated');
	$(barChart).removeClass('active').find('.bar').css({
		height: '0%'
	});
}

function imageblocks() {

	// JG modified to unbind

	if ($('.quantity')) {
		$('.quantity').each(function () {
			var thisId, $thisPlus, $thisMinus, $thisTextField, thisQuantity, newVal;
			thisId = $(this).attr('data-productId'); //Product number of watch
			$thisPlus = $(this).find('[data-icon="plus"]'); //Every instance of the plus for the product object
			$thisMinus = $(this).find('[data-icon="minus"]'); //Every instance of the minus for the product object
			$thisTextField = $(this).find('.txt-itemQuantity'); //Every instance of the textfield for the product object

			$thisPlus.off('click').on('click', function () {
				thisQuantity = $thisTextField.val();
				thisQuantity++;
				newVal = thisQuantity;
				updateValues(thisId, newVal)
			});
			$thisMinus.off('click').on('click', function () {
				thisQuantity = $thisTextField.val();
				if (thisQuantity != 0) {
					thisQuantity--;
					newVal = thisQuantity;
					updateValues(thisId, newVal)
				}
			});
			$thisTextField.off('change').on('change', function () {
				thisQuantity = $thisTextField.val();
				newVal = thisQuantity;
				updateValues(thisId, newVal)
			});
		});


		$('.rowRemove').off('click').on('click', function (event) {
			var productReset = $(this).siblings('.productCount').find('.quantity').attr('data-productId');
			console.log(productReset);

			$(this).parent('.cartRow').slideUp(500, function () { $(this).remove(); });
			var reset = 0;
			updateValues(productReset, reset);
		});
	}
}

function updateValues(thisId, newVal) {
	var totalWatches = [];
	var $cart = $('.cart-icon');
	$('[data-productId="' + thisId + '"]').find('.txt-itemQuantity').val(newVal);

	// send new value to server via AJAX
	$.ajax({
		url: "CartItemHandler.aspx?Action=SetQuantity&ITEM=" + thisId
		+ "&CustomerID=" + global_CustomerID.toString()
		+ "&SalesRep=" + global_SalesRep.toString()
		+ "&Quantity=" + newVal,
		//async: false,
		cache: false
	}).always(function (myData, myResult, myErr) {
		if (myResult == "success") {
			$.each(myData.split('|'), function (myIndex, myValue) {
				switch (myIndex) {
					case 0:     // item subtotal dollar amount
						if ($('#cart').hasClass('active')) {        // if cart lightbox is displayed
							// Now, update the line item subtotal to myValue
							var theParent = $('#cart').find('[data-productId="' + thisId + '"]').parent().parent().parent();
							$(theParent).find('.totalPrice').text(myValue);
						}
						break;
					case 1:     // cart total dollar amount
						// If no watches remain, hide the Complete Order button
						if (myValue == "0" || myValue == "" || myValue == "$0.00")
							$('#cart').find('.dialog-checkout').css('display', 'none');

						$('.citizen-cart-total').empty().text(myValue);
						break;
					case 2:     // cart total count of items
						$cart.find('span').text(myValue);
						break;
				}
			});
		}
	});

}

function CompleteOrder(obj) {
	$(obj).parent().parent().css('display', 'none');        // hide the Complete Order button
	$(obj).parent().parent().parent().parent().find('.citizen-edit-order').css('display', 'none');

	// change the header text
	var topParent = $(obj).parent().parent().parent().parent().parent().parent().parent().parent();
	topParent.find('h1').text('ORDER COMPLETED');

	// clear the content area and replace with new text
	topParent.find('ul').empty();
	topParent.find('#cartTitles').empty().html('<br><br><br><br><br><br><h2>Thank you!  Your order has been processed.<br><br>The contents of the shopping cart have been cleared. ' +
                                            'To return to the product listing, click the X button on the top right.</h2>');

	// clear the cart contents  (was building string but removed that -- cart is in db)
	//var strCart = "";
	if ($('.quantity')) {
		$('.quantity').each(function () {
			var thisId, $thisPlus, $thisMinus, $thisTextField, thisQuantity, newVal;
			thisId = $(this).attr('data-productId'); //Product number of watch
			$thisTextField = $(this).find('.txt-itemQuantity'); //Every instance of the textfield for the product object

			if ($thisTextField.val() != '0') {
				//strCart += thisId + "=" + $thisTextField.val() + "&";
				$thisTextField.val('0');
			}
		});
	}
	var $iconQty = $('.cart-icon');
	if ($iconQty && $iconQty.length > 0)
		$iconQty.find('span').text('0');

	// send the order to the server via AJAX
	$.ajax({
		url: "CartItemHandler.aspx?Action=CompleteOrder"
		    + "&CustomerID=" + global_CustomerID
            // if cust id set to ZZZ this means user entered a custom customer name
            + (global_CustomerID == "ZZZ" ? ("&CustomerName=" + global_CustomerName) : "")
		    + "&SalesRep=" + global_SalesRep,
		//+ "&" + strCart,
		cache: false
	}).done(function (data) {
	});

}

function RebindCloseButtons() {
	console.log('RebindCloseButtons');
	$('.btn-close, .dialog-close').off('click').on('click', function (event) {
		CloseBox(event, this);
	});

	$('.citizen-complete-finalize').off('click').on('click', function (event) {
		CompleteOrder(event.target);
	});

	$('.citizen-edit-order').off('click').on('click', function (event) {
		console.log('citizen-edit-order click');
		$('#checkout').removeClass('active');
		$('#checkout').hide();
		$('#cart').addClass('active');
		$('#cart').show();

		event.stopImmediatePropagation();
		event.stopPropagation();
		event.preventDefault();
	});
}

function CloseBox(ev, obj) {
	console.log('CloseBox');
	var $thisVid = $(obj).parent('.lightbox').find('.video-js')[0];
	$('.lightbox').fadeOut(500).removeClass('active');
	$('[data-role="dialog"]').dialog('close');
	if ($thisVid != null)
		$thisVid.player.pause();
	event.stopImmediatePropagation();
	event.stopPropagation();
	event.preventDefault();
}

function SelectCustControls() {
	console.log('SelectCustControls');
	// after selecting customer (first screen)
	$('.btn-select-cust').off('click').on('click', function (ev) {
		if (ev.target == this) {		// if the target is the select button
			global_CustomerID = $(this).data('custid'); 		// set customer ID to the value
			global_CustomerName = $(this).data('custname');
			$('#citizen-cust-name').text(global_CustomerName);

			// Clear the cart if new customer selected
			$.ajax({
				url: "CartItemHandler.aspx?Action=ClearOldItems"
		        + "&CustomerID=" + global_CustomerID
		        + "&SalesRep=" + global_SalesRep,
				cache: false
			}).done(function (data) {
			});

			// Write this client to the "past clients" table to show the menu
			$.ajax({
				url: "SetClient.aspx?CustomerID=" + global_CustomerID,
				cache: false,
				async: false
			}).done(function (data) {
				showMenu = (data == 0) ? false : true;
				console.log('showMenu: ' + showMenu);
			});


			$.mobile.changePage($("#main-body"), { changeHash: false });

			$('#main-body').off('pageshow').on('pageshow', function () {
				$('#main-body').resize();
			});
		}
	});

	$('.select-customer-custom').off('click').on('click', function () {
		global_CustomerID = "ZZZ"; 		    // set customer ID to the value
		global_CustomerName = $('#select-customer').find('.ui-input-text').val();
		$('#citizen-cust-name').text(global_CustomerName);

		$.ajax({
			url: "CartItemHandler.aspx?Action=ClearOldItems"
		        + "&CustomerID=XYZ"     // clear all items regardless of customer id
		        + "&SalesRep=" + global_SalesRep,
			cache: false
		}).done(function (data) {
		});

		$.mobile.changePage($("#main-body"), { changeHash: false });

		$('#main-body').off('pageshow').on('pageshow', function () {
			$('#main-body').resize();
		});
	});
}

function buttons() {
	console.log('buttons');
	//Face Mask
	$('.face-mask').on('click', function () {
		$('body').removeClass('panel-open');
	});


	$('.btn-circle').off('click').on('click', function () {
		$(this).removeClass("ui-btn-active");
	});
	$('a[data-lightbox]').off('click').on('click', function (event) {

		//var thisVid = '#' + $(this).find('.video-js').attr('id');
		var whichLightbox = $(this).data('lightbox');
		var $thisVid = $(whichLightbox).find('.video-js');
		var showLightBox = true;

		if (whichLightbox == "#lightbox-product-detail") {
			//$(whichLightbox).data('citizen-item', $(this).data('citizen-item'));

			// read the product detail page via AJAX
			$.ajax({
				url: "GetProductDetail.aspx?ITEM=" + $(this).data('citizen-item') +
                    "&CustomerID=" + global_CustomerID,
				cache: false
			}).done(function (data) {
				$('#lightbox-product-detail').empty().html(data).trigger('create');

				// set up event handlers
				RebindCloseButtons();
				imageblocks();
			});
		} else
			if (whichLightbox == "#lightbox-product-detail-drive") {
				//$(whichLightbox).data('citizen-item', $(this).data('citizen-item'));

				// read the product detail page via AJAX
				$.ajax({
					url: "GetProductDetailDrive.aspx?ITEM=" + $(this).data('citizen-item') +
						"&CustomerID=" + global_CustomerID,
					cache: false
				}).done(function (data) {
					$('#lightbox-product-detail-drive').empty().html(data).trigger('create');

					// set up event handlers
					RebindCloseButtons();
					imageblocks();

				});
			} else
				if (whichLightbox == "#cart") {
					var $cart = $('.cart-icon');
					var iconFirst = $cart.find('span')[0];

					if ($(iconFirst).text() != '0')       // if any watches in cart
					{
						$.ajax({
							url: "ViewCart.aspx?SalesRep=" + global_SalesRep,
							cache: false
						}).done(function (data) {
							$('#cartContent').empty().html(data).trigger('create');

							// set up event handlers
							RebindCloseButtons();
							buttons();          // recursive call!  for "complete order" button handler
							imageblocks();
						});
					} else
						showLightBox = false;       // cart will not be viewed
				} else
					if (whichLightbox == "#checkout") {
						var $cart = $('.cart-icon');
						var iconFirst = $cart.find('span')[0];
						$('#checkout').find('h1').text('COMPLETE ORDER');

						if ($(iconFirst).text() != '0')       // if any watches in cart
						{
							$.ajax({
								url: "CompleteCart.aspx?SalesRep=" + global_SalesRep,
								cache: false
							}).done(function (data) {
								$('#cartCompleteContent').empty().html(data).trigger('create');

								// set up event handlers
								RebindCloseButtons();
								imageblocks();
							});
						} else
							showLightBox = false;       // cart will not be viewed
					}

		if (showLightBox) {
			$(whichLightbox).addClass('active').trigger("create").fadeIn(500);

			if ($thisVid != null && $thisVid[0] != null && $thisVid[0].player != null)
				$thisVid[0].player.play();
		}

		event.stopImmediatePropagation();
		event.stopPropagation();
	});

	$('.btn-close, .dialog-close').off('click').on('click', function (event) {
		CloseBox(event, this);
	});


	$(document).keyup(function (e) {
		if (e.keyCode === 27) {
			$('.btn-close').click();
		} // esc
	});

	if ($('html').hasClass('touch')) {
		$('.flip-container').bind('touchstart', function () {
			$(this).addClass('hover');
		}).bind('touchend', function () {
			$(this).removeClass('hover');
		});
	} else {
		$('.flip-container').bind('mousedown', function () {
			$(this).addClass('hover');
		}).bind('mouseout', function () {
			$(this).removeClass('hover');
		});
	}


	var slider = $('#full-width-slider').data('royalSlider');
	var slideCircle = slider.currSlide.holder.find('.planogramHolder div');

	$(slideCircle).on("click", function () {
		var imgNum = $(this).index();
		// alert(imgNum);
		slideFade(imgNum);
		slider.currSlide.holder.find('.planogramHolder div.active').removeClass('active');
		$(this).addClass('active');
	})

	function slideFade(imgUrl) {
		slider = $('#full-width-slider').data('royalSlider');
		var fadeSlider = slider.currSlide.holder.find('.slide-fadein');

		var imgs = $('.slide-fadein img');
		//var fadeSlider = $('.slide-fadein');
		var buttonsContainer = fadeSlider.next('.planogram-buttons');

		fadeSlider.find('img').eq(imgUrl).addClass('active').siblings().removeClass('active');


	}

	$('.citizen-close-session').off('click').on('click', function () {
		global_CustomerID = null;
		global_CustomerName = "";

		// Clear the cart if new customer selected
		$.ajax({
			url: "CartItemHandler.aspx?Action=ClearOldItems"
		    + "&CustomerID=null"
		    + "&SalesRep=null",
			cache: false
		}).done(function (data) {
			location.href = "SiteMain.aspx";
		});

		//$(document).off('pagebeforechange');
		//$('.ui-input-search .ui-input-text').val('');
		//$.mobile.changePage($("#citizen-choose-customer"), { changeHash: false });  
		//PageBeforeChange();
	});
}

function toggleThis(id) {
	$('[data-role="' + id + '"]').toggleClass('active');
}
function panelNav(parent, target, link) {
	this.parent = $(parent).parent('.nav-column').attr('id');
	this.target = target;
	this.link = link;
	console.log(panelNav.arguments);

	if (this.target == undefined) {
		console.log('Target is undefined.');
		panelToggle()
		$.mobile.changePage('#' + this.link);
	}
	if (this.parent == undefined) {
		console.log('Parent is undefined.');
		$.mobile.changePage('#' + this.link);
	}
	if (this.link == undefined) {
		console.log('Link not defined.'); //Main page does not change.
	}



	// if (this.parent !== undefined && this.target !== undefined && this.link !== undefined){
	//     console.log('All arguments defined.')
	//     $.mobile.changePage('#'+this.link);
	// }
	if (this.parent && this.target && this.link !== undefined) {
		console.log('All arguments defined.');
		panelToggle('#mobile-nav');
		//$.mobile.changePage(this.link);

	}
}
function panelToggle(panelID) {
	this.panel = panelID;
	var defaultPanel = $('#mobile-nav');
	if (panelID == undefined)
		panelID = defaultPanel;
	else
		panelID = $("#" + panelID);

	var wH = $(window).height();
	var ulH = wH - $(this.panel).find('.content-top').height();
	panelID.find('.nav-columns').css('height', ulH + 'px');
	if ($('body').hasClass('panel-open')) {
		panelID.css('height', wH);
		$('body').removeClass('panel-open');
	} else {
		$('body').addClass('panel-open');
	}
}

function navController(slider) {
	$('#menu ul li a').on('click',function(event){
        console.log("navController click function")
        var slide, menu, link, thisCol = undefined;

		var slider = $('#full-width-slider').data('royalSlider');

		thisCol = '#' + $(this).parent('.nav-column').attr('id');
		menu = $(this).data('menu');
		link = $(this).data('link');
		slide = $(this).data('slide');

		$(thisCol).removeClass('active');
		$(menu).addClass('active').siblings('.nav-column').removeClass('active'); // change/animate active menu

		console.log(thisCol, menu, link, slide);
		if (menu == undefined && slide == undefined && link !== undefined) {
			panelToggle();
			window.setTimeout(function () {
				$.mobile.changePage(link);
			}, 500);
		} else if (menu && link !== undefined) {
			window.setTimeout(function () {
				$.mobile.changePage(link);
			}, 500);
		} else if (slide && link !== undefined) {
			window.setTimeout(function () {
				$.mobile.changePage(link);
			}, 500);
			slide = slide - 1;
			slider.goTo(slide);
			panelToggle();
		}
		else if (slide !== undefined && link == undefined) {
			slide = slide - 1;
			//slider.goTo(slide);

			slider.st.transitionSpeed = 0;
			slider.goTo(slide);
			setTimeout(function () {
				slider.st.transitionSpeed = 600;
			}, 10);

			panelToggle();
		}
		if (event.preventDefault) { event.preventDefault(); } else { event.returnValue = false; }

	});
}


// function buttons(){

// }