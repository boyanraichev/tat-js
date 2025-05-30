var tat = {

	modalHooks: [],

	modalWillClose: false,

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
		this.validationListener();
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
		let modalTitle = modalClicked.dataset.modalTitle;
		if (modalContent==undefined || modalContent.length < 1) {
			let modalGet = document.getElementById(this.dataset.modalGet);
			if (modalGet) {
				modalContent = modalGet.innerHTML;
			}
		}
		tat.modal(modalID,modalContent,modalTitle,modalClicked);
	},


	modal: function(modalID,modalContent,modalTitle,elementClicked) {
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

		if(modalTitle!=undefined && modalTitle.length > 0) {
			let modalTitleDiv = document.createElement('div');
			modalTitleDiv.innerHTML = modalTitle;
			modalTitleDiv.classList.add('modal-title');
			modalContentDiv.prepend(modalTitleDiv);
		}

		let modalCloseDiv = document.createElement('div');
		modalCloseDiv.classList.add('modal-close','js-modal-close');
		modalContentDiv.prepend(modalCloseDiv);
		modal.classList.add('fade-in');

		modal.addEventListener('mousedown',tat.modalCloseMouseEv,{'capture':false});
		if(!elementClicked || elementClicked.dataset.backdrop==undefined || elementClicked.dataset.backdrop != 'static') {
			modal.addEventListener('click',tat.modalCloseEv,{'capture':false});
		}

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

	modalCloseMouseEv: function(event) {
		tat.modalWillClose = event.target;
	},

	modalCloseEv: function(event) {
		if (event.target !== this) { return; }
		if (!tat.modalWillClose) { return; }
		if (tat.modalWillClose != event.target) {
			tat.modalWillClose = false;
			return;
		}
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
		let modalTitle = click?.dataset?.modalTitle ?? '';
		if (follow) {
			var href = click.href;
			modalButtonY.addEventListener('click',function() {
				window.location = href;
			});
		}
		tat.modal(modalID,modalContent,modalTitle,click);
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
		event.stopPropagation();
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
			if (this.dataset.type == 'dropdown') {
				if (this.classList.contains('toggled')) {
					if (tat.dropdown && tat.dropdown.dataset.toggle != this.dataset.toggle) {
						tat.closeDropdown();
					}
					tat.dropdown = this;
					document.addEventListener('click',tat.closeDropdown,{once:true});
				} else {
					tat.dropdown = null;
					document.removeEventListener('click',tat.closeDropdown);
				}
			}
		}
	},

	closeDropdown: function(e) {
		if (tat.dropdown) {
			tat.dropdown.dispatchEvent(new Event('click'));
			tat.dropdown = null;
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
					tooltip.addEventListener('focus',tat.tooltipOn);
					tooltip.addEventListener('blur',tat.tooltipOff);
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
			delRow.addEventListener('click',tat.delRowEv);
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
		setTimeout(function(){
			row.remove();
			if (table.dataset.maxRows > table.childElementCount && table.classList.contains('is-full')) {
				table.classList.remove('is-full');
				let adds = document.querySelectorAll('.js-add-row.is-full[data-table="'+table.id+'"');
				if (adds) {
					Array.from(adds).forEach((add) => { add.classList.remove('is-full') });
				}
			}
		}, 500);

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

	validationListener: function() {
		let forms = document.querySelectorAll('.js-validate');
		Array.from(forms).forEach(form => {
			form.noValidate = true;
			form.addEventListener('submit',tat.validateFormHook);
		});
	},

	inputListener: function() {
		let inputs = document.querySelectorAll('input:not([type="hidden"]), select, textarea');
		Array.from(inputs).forEach(input => {
			let event = ( (input.tagName == 'SELECT' || input.type == 'checkbox' || input.type == 'radio' || input.classList.contains('is-invalid') ) ? 'input' : 'blur');
			input.addEventListener(event,function(){
				this.classList.add('has-input');
				this.classList.remove('is-invalid');
			},
			{'once':true});
		});
	},

	validateFormHook: function(e) {
		if(!tat.validateForm(this)) {
			e.preventDefault();
		}
	},

	validateForm: function(form) {
		let validates = true;
		let hasReported = false;
		let inputs = form.querySelectorAll('input:not([type="hidden"]):not(.no-validate), select:not(.no-validate), textarea:not(.no-validate)');

		Array.from(inputs).forEach(input => {
			input.classList.remove('is-invalid');
			input.setCustomValidity("");
			input.checkValidity();
			if (!input.validity.valid) {
				validates = false;
				if (input.validity.badInput && input.dataset.validationType) {
					input.setCustomValidity(input.dataset.validationType);
				} else if (input.validity.valueMissing) {
					let msg = input.dataset.validationRequired || tat.lang.validationRequired;
					input.setCustomValidity(msg);
				} else if (input.validity.typeMismatch && input.dataset.validationType) {
					input.setCustomValidity(input.dataset.validationType);
				} else if (input.validity.tooShort && input.dataset.validationMinlength) {
					input.setCustomValidity(input.dataset.validationMinlength);
				} else if ((input.validity.rangeOverflow || input.validity.rangeUnderflow || input.validity.stepMismatch) && input.dataset.validationRange) {
					input.setCustomValidity(input.dataset.validationRange);
				} else if (input.validity.patternMismatch && input.dataset.validationPattern) {
					input.setCustomValidity(input.dataset.validationPattern);
				} else {
// 					input.reportValidity();
				}
				input.addEventListener('input',() => { input.setCustomValidity(""); }, {'once':true});

				if ( HTMLFormElement.prototype.reportValidity && !hasReported) {
					input.reportValidity();
					hasReported = true;
				}
			}
		});
		form.classList.add('was-validated');

		return validates;
	},

	// scrollHeight: 0,
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
		tat.stickyTouchRecalc();
	},

	stickyListener: function() {
		tat.stickies = [];
		let stickies = document.querySelectorAll('.js-sticky');
		if (stickies) {
			tat.stickies = Array.from(stickies);
			tat.stickyTouchRecalc();
			tat.resizeListener();
			window.addEventListener('scroll',tat.scroll);
		}
	},

	stickyTouchRecalc: function() {
		tat.stickies.forEach(sticky => {
			if (sticky.dataset.ontouch!=undefined) {
				sticky.dataset.scrollheight = tat.scrollPosition(sticky);
			}
		});
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
		if (el.dataset.offset != undefined) {
			scrollMin = scrollElement - ( tat.viewport * (1 - parseFloat(el.dataset.offset) ) );
			scrollMax = scrollElement + el.offsetHeight - ( tat.viewport * (1 - parseFloat(el.dataset.offset) ) );
		}
		if (tat.scrollTop > scrollMin && tat.scrollTop < scrollMax) {
			if (el.dataset.inview == undefined || el.dataset.inview == 0) {
				el.dataset.inview = 1;
				el.classList.add('in-viewport');
				let event = new CustomEvent('inView');
				el.dispatchEvent(event);
				if (el.dataset.once !== undefined) {
					el.classList.remove('js-inview');
					tat.inviews.splice(index, 1);
				}
			}
		} else {
			if (el.dataset.inview != undefined && el.dataset.inview == 1) {
				el.dataset.inview = 0;
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
			tat.stickies.forEach(sticky => {
				let scrollHeight = ( sticky.dataset.scrollheight ? parseInt(sticky.dataset.scrollheight) : 0 );
				if (sticky.dataset.offset != undefined) {
					scrollHeight -= parseInt(sticky.dataset.offset);
				}
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
