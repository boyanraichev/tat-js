var tat = {
	
	modalHooks: [],
		
	init: function() {
		this.listeners();
	    this.modalOnListener();
	    this.stickyListener();
		this.inViewListener();
	},
    
    listeners: function() {
	    this.modalListener();
		this.toggleListener();
		this.tabsListener();
		this.tooltipListener();
		this.scrollToListener();
		this.confirmListener();
		this.inputListener();
		this.addRowsListener();
		this.delRowsListener();
    },
	
	modalListener: function() {
		let modals = document.querySelectorAll('.js-modal');
		Array.from(modals).forEach(modal => {
		    modal.addEventListener('click',tat.modalShow);
		});
    },
    
    modalShow: function(event) {
		event.preventDefault();
		let modalClicked = this;
		let modalID = modalClicked.dataset.modal;
		let modalContent = modalClicked.dataset.modalContent;
		if (modalContent==undefined || modalContent.length < 1) { 
			let modalGet = document.getElementById(this.dataset.modalGet);
			if (modalGet) { 
				modalContent = modalGet.innerHTML;
			}
		}
		tat.modal(modalID,modalContent,modalClicked); 
	},

	
	modal: function(modalID,modalContent,elementClicked) {
		let modal = document.querySelector('.modal');
		if (!modal) {
			modal = document.createElement('div');
			modal.className = 'modal';
			var modalContentDiv = document.createElement('div');
			modalContentDiv.className = 'modal-content';
			modal.append(modalContentDiv);
			document.body.prepend(modal);
		} else {
			var modalContentDiv = document.querySelector('.modal-content'); 
		}
		modal.id = modalID;
		if (typeof modalContent === 'object') {
			modalContentDiv.innerHTML = '';
			modalContentDiv.prepend(modalContent);	
		} else {
			modalContentDiv.innerHTML = modalContent;	
		}
		document.body.classList.add('modal-open');
		let modalCloseDiv = document.createElement('div');
		modalCloseDiv.classList.add('modal-close','js-modal-close');
		modalContentDiv.prepend(modalCloseDiv);
		modal.classList.add('fade-in');

		modal.addEventListener('click',tat.modalCloseEv,{'capture':false});
		tat.modalCloseListeners();
		tat.modalConfirmListeners();
		tat.confirmListener();
		tat.inputListener();
		
		tat.modalHooks.forEach(function(modalHook,i) {		    
	    	if (modalHook.id == modalID) {
	    		if (typeof modalHook.hook == 'function') {
		    		modalHook.hook(i,elementClicked);
		    	}
	    	}
	    });
	},
	
	modalConfirmListeners: function() {
		let confirms = document.querySelectorAll('.js-modal-confirm');
		Array.from(confirms).forEach(confirm => {
		    confirm.addEventListener('click',tat.modalConfirm,{'once':true});
		});
	},
	
	modalConfirm: function() {
		if (typeof tat.modalConfirmHook == 'function') {
    		tat.modalConfirmHook(tat.modalConfirmData);
    	} else {
	    	tat.modalClose();
    	}
	},
	
	modalCloseListeners: function() {
		let closes = document.querySelectorAll('.js-modal-close');
		Array.from(closes).forEach(close => {
		    close.addEventListener('click',tat.modalCloseEv);
		});
	},
	
	modalCloseEv: function(event) {
		if (event.target !== this) { return; }
		event.stopPropagation();
		event.preventDefault();
		tat.modalClose(this);
	},
	
	modalClose: function(el) {	
		if (typeof tat.modalCloseHook == 'function') {
    		tat.modalCloseHook(el);
    	} else {
			let modal = document.querySelector('.modal');
			modal.classList.remove('fade-in');
			modal.classList.add('fade-out');
			setTimeout(function(){ modal.remove(); }, 500);
		    document.body.classList.remove('modal-open');
    		tat.modalConfirmHook = null;
			tat.modalConfirmData = null;
		}
		tat.modalCloseHook = {};
	},

	modalOnListener: function() {
		let modalOn = document.querySelector('.js-modal-on');
		if (modalOn) {
			let delay = parseInt(modalOn.dataset.delay) || 0;
			setTimeout(function() {
		    	modalOn.click();
		    }, delay);
		}
	},
	
	confirmListener: function() { 
		let confirms = document.querySelectorAll('.js-confirm');
		Array.from(confirms).forEach(confirm => {
		    confirm.addEventListener('click',tat.confirmHook);
		});
	},
	
	confirmHook: function(e) {
		e.preventDefault();
	    let modalID = ( this.dataset.modal ? this.dataset.modal : 'modal-confirm' );
	    let text = this.dataset.text;
	    tat.modalConfirmData = this.dataset.confirmData;
	    let follow = this.dataset.follow;
	    tat.confirmPrep(modalID,text,this,follow);
	},
	
	confirmEvent: function(e) {
	    e.preventDefault();
	    let modalID = ( this.dataset.modal ? this.dataset.modal : 'modal-confirm' );
	    let text = this.dataset.text;
	    tat.modalConfirmData = this.dataset.confirmData;
	    let follow = this.dataset.follow;
	    tat.confirmPrep(modalID,text,this,follow);
    },
	
	confirmPrep: function(modalID,text,click,follow) {
		
		let modalContent = document.createElement('div');
		modalContent.innerHTML = text;
		modalContent.classList.add('modal-confirm-content');
		let modalButtons = document.createElement('div');
		modalButtons.classList.add('modal-confirm');
		let modalButtonN = document.createElement('button');
		modalButtonN.classList.add('button','cancel','js-modal-close');
		modalButtonN.innerHTML = tat.lang.cancel;
		modalButtons.prepend(modalButtonN);
		let modalButtonY = document.createElement('button');
		modalButtonY.classList.add('button','confirm','js-modal-confirm');
		modalButtonY.innerHTML = tat.lang.ok;
		modalButtons.prepend(modalButtonY);
		modalContent.append(modalButtons);
		if (follow) {
			var href = this.href;
			modalButtonY.addEventListener('click',function() { 
				window.location = href;
			});
		}
		tat.modal(modalID,modalContent,click);
	},
	
	confirm: function(modalID,modalContent,hook,data) {
		tat.modalConfirmHook = hook;
		tat.modalConfirmData = data;
		tat.confirmPrep(modalID,modalContent,null,false);
	},
	
	toggleListener: function() {
		let toggles = document.querySelectorAll('.js-toggle');
		Array.from(toggles).forEach(toggle => {
		    toggle.addEventListener('click',tat.toggle);
		});
	},

	toggle: function(event) {
		event.preventDefault();
		let toggle = document.getElementById(this.dataset.toggle);
		if (toggle) {
			this.classList.toggle('toggled');
			toggle.classList.toggle('active');
			let bodyClass = this.dataset.bodyClass;
			if (bodyClass!=undefined) {
				document.body.classList.toggle(bodyClass);
			}
			let event = new CustomEvent('toggled');
			toggle.dispatchEvent(event);
		}
	},

	tabsListener: function() {
		let tabs = document.querySelectorAll('.js-tab');
		Array.from(tabs).forEach(tab => {
		    tab.addEventListener('click',tat.tabs);
		});
	},
	
	tabs: function(event) {
		event.preventDefault();
		let menuTabs = document.querySelectorAll('#'+this.dataset.menu+' .js-tab.active');
		Array.from(menuTabs).forEach(menuTab => {
		    menuTab.classList.remove('active');
		});
		this.classList.add('active');
		let wrapTabs = document.querySelectorAll('#'+this.dataset.wrap+' .tab.active');
		Array.from(wrapTabs).forEach(wrapTab => {
		    wrapTab.classList.remove('active');
		});
		let tab = document.getElementById(this.dataset.tab);
		tab.classList.add('active');
	},

	tooltipListener: function() {
		let tooltips = document.querySelectorAll('.js-tooltip');
		Array.from(tooltips).forEach(tooltip => {
			switch(tooltip.dataset.trigger) {
				case 'focus':
					tooltipFocus.addEventListener('focus',tat.tooltipOn);
					tooltipFocus.addEventListener('blur',tat.tooltipOff);
					break;
				case 'mouseover':
				default:
					tooltip.addEventListener('mouseenter',tat.tooltipOn);
				    tooltip.addEventListener('mouseleave',tat.tooltipOff);
					break;
			}
		});
	},
		
	tooltipOn: function(event) {
		event.preventDefault();
		this.classList.add('tooltip-on');
		let tooltip = document.getElementById(this.dataset.tooltip);
		if (tooltip) {
			tooltip.classList.add('active');
		}
	},
	
	tooltipOff: function(event) {
		event.preventDefault();
		this.classList.remove('tooltip-on');
		let tooltip = document.getElementById(this.dataset.tooltip);
		if (tooltip) {
			tooltip.classList.remove('active');
		}
	},
	
	addRowsListener: function() {
		let addRows = document.querySelectorAll('.js-add-row');
		Array.from(addRows).forEach(addRow => {
		    addRow.addEventListener('click',tat.addRowEv);
		});
	},
		
	addRowEv: function(event) {
		event.preventDefault();
		let table = document.getElementById(this.dataset.table);
		if (table) {
			tat.addRow(table,this);
		}
	},
	
	addRow: function(table,handler) {
		let max = table.dataset.maxRows;
		if (max && max <= table.childElementCount) {
			return;
		}
		let prototype = handler.dataset.prototype;
		let lastRow = table.querySelector('.row:last-child');
		if (!lastRow || lastRow.dataset.key === undefined) {
			var key = 1;
		} else {
			var key = parseInt(lastRow.dataset.key) + 1;
		}
		prototype = prototype.replace(/__key__/gi, key); 
		table.insertAdjacentHTML('beforeend', prototype);
		tat.delRowsListener();
		if (max == table.childElementCount ) {
			table.classList.add('is-full');
			handler.classList.add('is-full');
		}
		let event = new CustomEvent('rowAdded',{ detail: key });
		table.dispatchEvent(event);			
	}, 
	
	delRowsListener: function() {
		let delRows = document.querySelectorAll('.js-del-row');
		Array.from(delRows).forEach(delRow => {
		    delRow.addEventListener('click',tat.delRow);
		});
	},
	
	delRowEv: function(event) {
		event.preventDefault();
		let row = this.closest('.row');
		tat.delRow(row);
	},
	
	delRow: function(row) {
		let table = row.parentNode;
		row.classList.add('fade-out');
		setTimeout(function(){ row.remove(); }, 500);
		if (table.dataset.maxRows > table.childElementCount && table.classList.contains('is-full')) {
			table.classList.remove('is-full');
			let adds = document.querySelectorAll('.js-add-row.is-full[data-table="'+table.id+'"');
			if (adds) {
				Array.from(adds).forEach((add) => { add.classList.remove('is-full') });
			}
		}
	},

	scrollToListener: function() {
		let scrolls = document.querySelectorAll('.js-scroll');
		Array.from(scrolls).forEach(scroll => {
		    scroll.addEventListener('click',tat.scrollTo);
		});
	},
	
	scrollTo: function(event) {
		event.preventDefault();
		let offset = this.dataset.offset;
			if (offset==undefined) { offset=60; }
		let target = document.getElementById(this.dataset.scrollto);
		if (target) {
			let yCoordinate = target.getBoundingClientRect().top + window.pageYOffset;
			window.scrollTo({
			    top: yCoordinate - offset,
			    behavior: 'smooth'
			});
		}
	},
	
	inputListener: function() {
		let inputs = document.querySelectorAll('input, select, textarea');
		Array.from(inputs).forEach(input => {
		    input.addEventListener('focus',function(){
			    this.classList.add('has-input');
		    },
		    {'once':true});
		});
	},
	
	scrollHeight: 0,
	viewport: null,
	scrollTop: null, 
	
	stickyIsOn: false,
	stopScroll: true,
	
	stickies: [],
	inviews: [],

	resizeListener: function() {
		tat.viewport = window.innerHeight;
		tat.scrollTop = window.scrollY;
		window.addEventListener('resize', tat.resize, true);
	},
	
	resize: function() {
		if (window.innerHeight!=tat.viewport) {
		tat.viewport = window.innerHeight;
			tat.scrollTop = window.scrollY;
			tat.inViewListener();
		}
	},
	
	stickyListener: function() {
		tat.stickies = [];
		let stickies = document.querySelectorAll('.js-sticky');
		if (stickies) {
			tat.stickies = Array.from(stickies);
			tat.resizeListener();
/*
			if (sticky.dataset.scrollheight) { 
				this.scrollHeight = sticky.dataset.scrollheight;
			}
			tat.sticky = sticky;
*/
			window.addEventListener('scroll',tat.scroll);
		}
	},
    
    inViewListener: function() {
	    tat.inviews = [];
	    let inviews = document.querySelectorAll('.js-inview');
	    if (inviews) {
		    tat.inviews = Array.from(inviews);
			tat.resizeListener();
			tat.scrollListener();
		}
	},
	
	inview: function(el,index) {
		
		tat.stopScroll = false;
		let scrollElement = tat.scrollPosition(el);
		let scrollMin = scrollElement - tat.viewport;
		let scrollMax = scrollElement + el.offsetHeight;
		if (tat.scrollTop > scrollMin && tat.scrollTop < scrollMax) { 
			el.classList.add('in-viewport');
			let event = new CustomEvent('inView');
			el.dispatchEvent(event);
			if (el.dataset.once !== undefined) {
				el.classList.remove('js-inview');
				tat.inviews.splice(index, 1);
			}
		}
	},
	
	scrollListener: function() {
		if (tat.inviews.length > 0) {
			window.addEventListener('scroll', tat.scroll);
		}
	},
	
	scroll: function() {
		tat.stopScroll = true;
		
		tat.scrollTop = window.scrollY;	
		
		tat.inviews.forEach(tat.inview);

		if (tat.stickies.length > 0) {
			tat.stopScroll = false;
			tat.stickyIsOn = false;
			tat.stickiers.forEach(sticky => {
				let scrollHeight = ( sticky.dataset.scrollheight ? sticky.dataset.scrollheight : 0 );
				let stickyIsOn = sticky.classList.contains('sticked');
				if (!stickyIsOn && tat.scrollTop > scrollHeight) {
					sticky.classList.add('sticked');
					stickyIsOn = true;
				} else if (stickyIsOn && tat.scrollTop <= scrollHeight) {
			    	sticky.classList.remove('sticked');
			    	stickyIsOn = false;
			    }
			    if (stickyIsOn) {
				    tat.stickyIsOn = true;
			    } 
			});
			if (tat.stickyIsOn) {
				document.body.classList.add('has-sticky');
			} else {
				document.body.classList.remove('has-sticky');    
			}
		}
		
		if (tat.stopScroll) {
			window.removeEventListener('scroll', tat.scroll);
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

Object.defineProperties(tat,{
	'modalConfirmHook': { 
		value: null,
		writable: true
	},
	'modalConfirmData': {
		value: null,
		writable: true		
	},
	'modalCloseHook': {
		value: {},
		writable: true
	},
	'lang': {
		value: {
			ok: 'OK',
			cancel: 'Cancel',
		},
		writable: true
	}
});

tat.init();

export { tat as tat }