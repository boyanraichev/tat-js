// TAT.JS v2.0 Beta
var tat = {
	
// 	modalDiv: null,
	
	modalHooks: [],
	
	modalCloseHook: {},
	
	lang: {
		ok: 'OK',
		cancel: 'Cancel',
	}
	
	initialize: function() {
		this.listeners();
		this.cookie();
	},
    
    listeners: function() {
	    tat.modalListener();
	    tat.modalOnListener();
		tat.toggleListener();
		tat.tabsListener();
		tat.tooltipListener();
		tat.scrollToListener();
		tat.confirmListener();
		tat.inputListener();
		tat.addRowsListener();
		tat.delRowsListener();
    },
	
	modalListener: function() {
		modals = document.querySelectorAll('.js-modal');
		Array.from(modals).forEach(modal => {
		    modal.addEventListener('click',tat.modalShow);
		});
    },
    
    modalShow: function(event) {
		event.preventDefault();
		var modalClicked = this;
		var modalID = modalClicked.dataset.modal;
		var modalContent = modalClicked.dataset.modalContent;
		if (modalContent==undefined || modalContent.length < 1) { 
			var modalGet = document.getElementById(this.dataset.modalGet);
			if (modalGet) { 
				modalContent = modalGet.innerHTML;
			}
		}
		tat.modal(modalID,modalContent,modalClicked); 
	},

	
	modal: function(modalID,modalContent,elementClicked) {
		var modal = document.querySelector('.modal');
		if (!modal) {
			modal = document.createElement('div');
			modal.id = modalID;
			modal.className = 'modal';
			var modalContentDiv = document.createElement('div');
			modalContentDiv.className = 'modal-content';
			modal.append(modalContentDiv);
			document.body.prepend(modal);
		} else {
			var modalContentDiv = document.querySelector('.modal-content'); 
		}
 		modalContentDiv.innerHTML = modalContent;
		document.body.classList.add('modal-open');
		var modalCloseDiv = document.createElement('div');
		modalCloseDiv.classList.add('modal-close','js-modal-close');
		modalContentDiv.prepend(modalCloseDiv);
		modal.classList.add('fade-in');
		
		tat.modalCloseListeners();
		modal.addEventListener('click',tat.modalClose,{'capture':false});
		
	    for (var i=0; i < tat.modalHooks.length; i++ ) {
	    	if (tat.modalHooks[i].id == modalID) {
	    		if (typeof tat.modalHooks[i].hook == 'function') {
		    		tat.modalHooks[i].hook(i,elementClicked);
		    	}
	    	}
	    }
	},
	
	modalCloseListeners: function() {
		var closes = document.querySelectorAll('.js-modal-close');
		Array.from(closes).forEach(close => {
		    close.addEventListener('click',tat.modalClose);
		});
	},
	
	modalClose: function(event) {	
		if (event.target !== this) { return; }
		event.stopPropagation();
		if (typeof tat.modalCloseHook == 'function') {
    		tat.modalCloseHook();
    	} else {
			var modal = document.querySelector('.modal');
			modal.classList.remove('fade-in');
			modal.classList.add('fade-out');
			setTimeout(function(){ modal.remove(); }, 500);
		    document.body.classList.remove('modal-open');
		}
		tat.modalCloseHook = {};
	},

	modalOnListener: function() {
		var modalOn = document.querySelector('.js-modal-on');
		if (modalOn) {
			var delay = parseInt(modalOn.dataset.delay) || 0;
			setTimeout(function() {
		    	modalOn.click();
		    }, delay);
		}
	},
	
	toggleListener: function() {
		var toggles = document.querySelectorAll('.js-toggle');
		Array.from(toggles).forEach(toggle => {
		    toggle.addEventListener('click',tat.toggle);
		});
	},

	toggle: function(event) {
		event.preventDefault();
		var toggle = document.getElementById(this.dataset.toggle);
		if (toggle) {
			this.classList.toggle('toggled');
			toggle.classList.toggle('opened');
			var bodyClass = this.dataset.bodyClass;
			if (bodyClass!=undefined) {
				document.body.classList.toggle(bodyClass);
			}
		}
	},

	tabsListener: function() {
		var tabs = document.querySelectorAll('.js-tab');
		Array.from(tabs).forEach(tab => {
		    tab.addEventListener('click',tat.tabs);
		});
	},
	
	tabs: function(event) {
		event.preventDefault();
		var menuTabs = document.querySelectorAll('#'+this.dataset.menu+' .js-tab.active');
		Array.from(menuTabs).forEach(menuTab => {
		    menuTab.classList.remove('active');
		});
		this.classList.add('active');
		var wrapTabs = document.querySelectorAll('#'+this.dataset.wrap+' .tab.active');
		Array.from(wrapTabs).forEach(wrapTab => {
		    wrapTab.classList.remove('active');
		});
		var tab = document.getElementById(this.dataset.tab);
		tab.classList.add('active');
	},

	tooltipListener: function() {
		var tooltips = document.querySelectorAll('.js-tooltip');
		Array.from(tooltips).forEach(tooltip => {
		    tooltip.addEventListener('mouseenter',tat.tooltipOn);
		    tooltip.addEventListener('mouseleave',tat.tooltipOff);
		});
		var tooltipsFocus = document.querySelectorAll('.js-tooltip-focus');
		Array.from(tooltipsFocus).forEach(tooltipFocus => {
		    tooltipFocus.addEventListener('focus',tat.tooltipOn);
		    tooltipFocus.addEventListener('blur',tat.tooltipOff);
		});
	},
		
	tooltipOn: function(event) {
		event.preventDefault();
		this.classList.add('tooltipped');
		var tooltip = document.getElementById(this.dataset.tooltip);
		if (tooltip) {
			tooltip.classList.add('opened');
		}
	},
	
	tooltipOff: function(event) {
		event.preventDefault();
		this.classList.remove('tooltipped');
		var tooltip = document.getElementById(this.dataset.tooltip);
		if (tooltip) {
			tooltip.classList.remove('opened');
		}
	},
	
	addRowsListener: function() {
		var addRows = document.querySelectorAll('.js-add-row');
		Array.from(addRows).forEach(addRow => {
		    addRow.addEventListener('click',tat.addRow);
		});
	},
		
	addRow: function(event) {
		event.preventDefault();
		var table = document.getElementById(this.dataset.table);
		if (table) {
			var prototype = this.dataset.prototype;
			var lastRow = table.querySelector('.row:last-child');
			if (lastRow.dataset.key === undefined) {
				var key = 1;
			} else {
				var key = parseInt(lastRow.dataset.key) + 1;
			}
			prototype = prototype.replace(/__key__/gi, key); 
			table.insertAdjacentHTML('beforeend', prototype);
			tat.delRowsListener();
			tat.toggleListener();
			var callback = this.dataset.callback;
			if (callback!==undefined) {
				var x = eval(callback);
				if (typeof x == 'function') {
					x();
				}
			}
		}
	},
	
	delRowsListener: function() {
		var delRows = document.querySelectorAll('.js-del-row');
		Array.from(delRows).forEach(delRow => {
		    delRow.addEventListener('click',tat.delRow);
		});
	},
	
	delRow: function(event) {
		event.preventDefault();
		var row = this.closest('.row');
		row.classList.add('fade-out');
		setTimeout(function(){ row.remove(); }, 500);
	},

	scrollToListener: function() {
		var scrolls = document.querySelectorAll('.js-scroll');
		Array.from(scrolls).forEach(scroll => {
		    scroll.addEventListener('click',tat.scrollTo);
		});
	},
	
	scrollTo: function(event) {
		event.preventDefault();
		var offset = this.dataset.offset;
			if (offset==undefined) { offset=60; }
		var target = document.getElementById(this.dataset.scrollto);
		if (target) {
			target.scrollIntoView({ 
				behavior: 'smooth' 
			});
/*
			var scroll = tat.scrollPosition(target) - offset;
// 			window.scroll(0,scroll);
			window.scroll({
				top: scroll, 
				left: 0, 
				behavior: 'smooth' 
			});
*/			
		}
	},
	
	scrollPosition: function(el) {
		var yPos = 0;
		while (el) {
			if (el.tagName == "BODY") {
				var yScroll = el.scrollTop || document.documentElement.scrollTop;
				yPos += (el.offsetTop - yScroll + el.clientTop);
			} else {
				yPos += (el.offsetTop - el.scrollTop + el.clientTop);
			}			
			el = el.offsetParent;
		}
		return yPos;
	},
	
	confirmListener: function() {
		var confirms = document.querySelectorAll('.js-confirm');
		Array.from(confirms).forEach(confirm => {
		    confirm.addEventListener('click',tat.confirm);
		});
	},
	
	confirm: function(event) {
		event.preventDefault();
		var href = this.attr.href;
		// build content
		modalContent = this.dataset.text;
		modalButtons = document.createElement('div');
		modalButtons.className = 'modal-confirm';
		
		// add OK listener
		var confirm = document.querySelect('js-confirm');
		confirm.addEventListener('click',function() {
			
		});
		// show dialog
		tat.modal('confirm',modalContent,this);
	},
	
	inputListener: function() {
		var inputs = document.querySelectorAll('input, select, textarea');
		Array.from(inputs).forEach(input => {
		    input.addEventListener('focus',function(){
			    this.classList.add('has-input');
		    },
		    {'once':true});
		});
	},
	
	cookie: function() {
		if (document.body.classList.contains('js-cookie')) {
			var cookie = '';
		    match = document.cookie.match(new RegExp('cookielaw=([^;]+)'));
			if (match) cookie = match[1];
			
			if ( cookie.length < 1 ) {
				
				var cookie_btn = document.body.dataset.cookieBtn;
		  		var cookie_msg = document.body.dataset.cookieMsg;
		  		
		  		var cookieDiv = document.createElement('div');
		  		cookieDiv.id = 'cookielaw';
		  		var cookieMsgDiv = document.createElement('div');
		  		cookieMsgDiv.id = 'cookielaw-msg';
		  		cookieMsgDiv.innerHTML = cookie_msg;
		  		var cookieBtnDiv = document.createElement('div');
		  		cookieBtnDiv.id = 'cookielaw-btn';
		  		var cookieBtnBtn = document.createElement('button');
		  		cookieBtnBtn.id = 'cookiewlaw-accept';
		  		cookieBtnBtn.innerHTML = cookie_btn;
		  		
		  		cookieBtnDiv.prepend(cookieBtnBtn);
		  		cookieDiv.prepend(cookieBtnDiv);
		  		cookieDiv.prepend(cookieMsgDiv);
		  		document.body.prepend(cookieDiv);
		  		
		  		setTimeout(function(){ cookieDiv.classList.add('fade-in'); }, 2000);
		  		setTimeout(function(){ cookieDiv.classList.add('fade-out'); }, 12000);
		  		setTimeout(function(){ cookieDiv.remove(); }, 13000);
		  		
		  		cookieBtnBtn.addEventListener('click', function() {
			  		cookieDiv.classList.add('fade-out');
			  		setTimeout(function(){ cookieDiv.remove(); }, 500);
		  		})
		  		
		  		var d = new Date();
			    d.setTime(d.getTime() + (30*24*60*60*1000));
			    var expires = "expires="+d.toUTCString();
			    document.cookie = 'cookielaw=Seen; ' + expires;
			}
		} 
	},
}
tat.initialize();

// scroll listener v.1.3
var tatScroll = {

	scrollHeight: 0,
	viewport: null,
	scrollTop: null, 
	resizeIsOn: false,
	stickyIsOn: false,
			
	initialize: function() {
		this.stickyListener();
		this.inViewListener();
	},

	resizeListener: function() {
		if (tatScroll.resizeIsOn==false) {
			tatScroll.resizeIsOn = true;
			tatScroll.viewport = window.innerHeight;
			window.addEventListener('resize', function() {
		        if (window.innerHeight!=tatScroll.viewport) {
			        tatScroll.viewport = window.innerHeight;
		        }
		    }, true);
		    tatScroll.scrollTop = window.scrollY;
		}
	},
	
	stickyListener: function() {
		var sticky = document.querySelector('.js-sticky');
		if (sticky) {
			this.resizeListener();
			if (sticky.dataset.scrollheight) { 
				this.scrollHeight = sticky.dataset.scrollheight;
/*
				if (this.scrollHeight==='touch') {
					this.scrollHeight = $('.js-sticky').offset().top;
				}
*/
			}
			this.sticky(sticky);
		}
	},
	
    sticky: function(element) {
	    window.addEventListener('scroll',function() {
		    tatScroll.scrollTop = window.scrollY;	
		    if (!tatScroll.stickyIsOn && tatScroll.scrollTop > tatScroll.scrollHeight ) { 
		    	element.classList.add('scrolled');
				document.body.classList.add('sticky-fixed');	   	
				tatScroll.stickyIsOn = true;
		    } else if (tatScroll.stickyIsOn && tatScroll.scrollTop <= tatScroll.scrollHeight) {
		    	element.classList.remove('scrolled');
		    	document.body.classList.remove('sticky-fixed');    
		    	tatScroll.stickyIsOn = false;
		    }
		});
    },
    
    inViewListener: function() {
	    var inviews = document.querySelectorAll('.js-inview');
		Array.from(inviews).forEach(inview => {
			this.resizeListener();
// 		    inview.addEventListener('click',tat.confirm);
		});
	},
	
	inview: function() {
		
	}
	/*
		if ( $( '.js-inview' ).length ) {
			$('.js-inview').each(function () { 	
				var scrollElement = $(this).offset().top;
				var scrollMin = scrollElement - tatScroll.viewport;
				var scrollMax = scrollElement + $(this).outerHeight();
				var scrollCallback = $(this).data('callback');
				if (tatScroll.scrollTop > scrollMin && tatScroll.scrollTop < scrollMax) { 
					$(this).removeClass('js-inview').addClass('in-viewport');
					if (scrollCallback!==undefined && typeof scrollCallback == 'function') { 
						var scrolledID = $(this).attr('id');
						var scrolledElement = $(this);	
						scrollCallback(scrolledID,scrolledElement); 
					}
				}
			});
		} else {
			$(window).off('scroll', tatScroll.scrollListener);
		} 
    },
	*/
}
tatScroll.initialize();

