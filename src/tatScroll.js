var tatScroll = {

	scrollHeight: 0,
	viewport: null,
	scrollTop: null, 
	
	stickyIsOn: false,
	stopScroll: true,
	
	sticky: null,
	inviews: [],
			
	initialize: function() {
		this.stickyListener();
		this.inViewListener();
	},

	resizeListener: function() {
		tatScroll.viewport = window.innerHeight;
		tatScroll.scrollTop = window.scrollY;
		window.addEventListener('resize', tatScroll.resize, true);
	},
	
	resize: function() {
        if (window.innerHeight!=tatScroll.viewport) {
	        tatScroll.viewport = window.innerHeight;
	        tatScroll.scrollTop = window.scrollY;
	        tatScroll.inViewListener();
        }
	},
	
	stickyListener: function() {
		var sticky = document.querySelector('.js-sticky');
		if (sticky) {
			tatScroll.resizeListener();
			if (sticky.dataset.scrollheight) { 
				this.scrollHeight = sticky.dataset.scrollheight;
			}
			tatScroll.sticky = sticky;
			window.addEventListener('scroll',tatScroll.scroll);
		}
	},
    
    inViewListener: function() {
	    tatScroll.inviews = [];
	    var inviews = document.querySelectorAll('.js-inview');
	    if (inviews) {
		    tatScroll.inviews = Array.from(inviews);
			tatScroll.resizeListener();
			tatScroll.scrollListener();
		}
	},
	
	inview(el,index) {
		
		tatScroll.stopScroll = false;
		let scrollElement = tatScroll.scrollPosition(el);
		let scrollMin = scrollElement - tatScroll.viewport;
		let scrollMax = scrollElement + el.offsetHeight;
		if (tatScroll.scrollTop > scrollMin && tatScroll.scrollTop < scrollMax) { 
			console.log('inview el',el,index,tatScroll.viewport,tatScroll.scrollTop,scrollElement,scrollMin,scrollMax);
			el.classList.add('in-viewport');
			el.classList.remove('js-inview');
			let event = new CustomEvent('inView');
			el.dispatchEvent(event);
			tatScroll.inviews.splice(index, 1);
		}
	},
	
	scrollListener: function() {
		if (tatScroll.inviews.length > 0) {
			window.addEventListener('scroll', tatScroll.scroll);
		}
	},
	
	scroll: function() {
		tatScroll.stopScroll = true;
		
		tatScroll.scrollTop = window.scrollY;	
		
		tatScroll.inviews.forEach(tatScroll.inview);

		if (tatScroll.sticky) {
			tatScroll.stopScroll = false;
		    if (!tatScroll.stickyIsOn && tatScroll.scrollTop > tatScroll.scrollHeight ) { 
		    	tatScroll.sticky.classList.add('scrolled');
				document.body.classList.add('sticky-fixed');	   	
				tatScroll.stickyIsOn = true;
		    } else if (tatScroll.stickyIsOn && tatScroll.scrollTop <= tatScroll.scrollHeight) {
		    	tatScroll.sticky.classList.remove('scrolled');
		    	document.body.classList.remove('sticky-fixed');    
		    	tatScroll.stickyIsOn = false;
		    }
		}
		
		if (tatScroll.stopScroll) {
			console.log('stop');
			window.removeEventListener('scroll', tatScroll.scroll);
		}
	},
	
	scrollPosition: function(el) {
		let yPos = 0;
		while (el) {
			yPos += el.offsetTop;
			el = el.offsetParent;
		}
		return yPos;
	},
	
	scrollPositionViewport: function(el) {
		let yPos = 0;
		while (el) {
			if (el.tagName == "BODY") {
				let yScroll = el.scrollTop || document.documentElement.scrollTop;
				yPos += (el.offsetTop - yScroll + el.clientTop);
			} else {
				yPos += (el.offsetTop - el.scrollTop + el.clientTop);
			}			
			el = el.offsetParent;
		}
		return yPos;
	}
	
}
tatScroll.initialize();