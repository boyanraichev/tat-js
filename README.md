# tat-js
Minimalistic JS web package

Objectives
----------

This is a simple native JavaScript library to provide standard websites with common stuff like modals, sticky headers, etc. in a lightweight and fast script. It is aimed at smaller websites and web apps that do not need a heavy, powerful framework and do not want the bulkiness of libraries like Bootstrap JS or similar. 

This package aims to:
- be very lightweight
- be very fast
- provide only the most common JS needs
- let CSS do the animations and design, as browsers render native CSS animations faster than JS

Get Started
-----------

There are two files you need to include: 

1. Polyfill - including this great package will add support for the JavaScript features that the user browser is missing. Most people use a modern browser and will only have a few KB script included, which is a huge difference compared to jQuery. 
```html
<script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>
```

2 tat.min.js - TAT.js itself

**Hooks**

This library uses classes as handlers, as they are much faster than using data attributes. All classes that call the library are "js-" prefixed.

**Modals**

Attach a ".js-modal" class to your handler. The content of your modal can be either passed in the data-modal-content="" attribute of your handler, or alternatively pass a data-modal-get="" attribute with the ID of the html element that contains your modal content. 

The modal will be created with the following structure:
```html
<div id="" class="modal">
  <div class="modal-content">
  	<div class="js-modal-close modal-close"></div>
  	Your content will go here
  </div>
</div>
```

The ".modal" element is also your overlay element, if you need one. The style.css file contains sample CSS styling to get you started.

The handler for closing the element is a "js-modal-close" class which is automatically included in your modal content.

Must-fill attributes:
data-modal="" - the ID of the modal that will be created
data-modal-content="" -  the HTML content of the modal (parse through htmlspecialchars() php function). If this attribute is not set you must set the next one
data-modal-get="" - the ID of an element on your page that contains your modal content.

Hooks:
- You can push objects to the tat.modalHooks array, containing hooks tied to a particular modal ID. The hook object should contain two properties: "id" is the modal ID you want it to run on, and "hook" is your hook function.
- You can set the tat.modalCloseHook property as a function to run when the user tries to close the modal. This hook is run once and then cleared (so you have to set it up every time this particular modal is shown).

**Toggle on/off**

Toggle an element (use CSS to style the desired behaviour, i.e. show/hide). The toggled element will receive a class .opened when ON and the handler will receive a class .toggled. Use the .js-toggle class to activate the handler.

Must-fill attributes:
data-toggle="" - the ID of the element to be toggled. 

Optional attributes:
data-body-class="" - add this class on the <body> element when the element is toggled ON.

**Scroll**

Use the .js-scroll class to an element to add a scroll-to function when this element is clicked. 

Must-fill attributes:
data-scrollto="" - the id of the element to scroll to

Optional attributes:
data-offset="" - the offset from the viewport top (in pixels) to leave above the scroll-to element. Default is 60 pixels.

**Tabs**

Use the .js-tab class to a handler to make a tab visible in a tab pane design.

Must-fill attributes:
data-tab="" - the ID of the tab to be shown. It will receive a class .active
data-menu="" - the ID of the element containing the tab handlers. The currently active handler will receive class .active
data-wrap="" - the ID of the element containing the tabs. Each tab should have the .tab class.

**Tooltip**

Use the .js-tooltip class to a handler to show a tooltip upon mouseover. Use the .js-tooltip-focus on an input to show the tooltip upon input focus. The handler will receive a class .tooltipped when activated.

Must-fill attributes:
data-tooltip="" -  the ID of the tooltip element to be shown. The tooltip will receive a class .opened. 

**Input Started**

All input, select and textarea elements on your page will receive a class .has-input when focused for the first time. This allows you to use the css :invalid selector to visualise invalid input only after the user has interacted with this field. 

**Table rows**

Use the .js-add-row on a handler to add rows to a table (does not have to be <table> explicitly) and .js-del-row on an element within a row to delete this specific row. Every row should have the .row class.

Must-fill attributes on .js-add-row:
data-table="" - the ID of the table element
data-prototype="" - the HTML prototype of the row to be added. "__key__" will be replaced with the incremental row number.

Optional attributes on .js-add-row:
data-callback="" - a function name to be run upon adding a row.

**Cookie Law message**

Add the .js-cookie class on your <body> element to activate the Cookie Law message. This function sets a cookie, so that the message is shown to the user only upon first visit.

Must-fill attributes:
data-cookie-msg="" - the HTML of the message you want displayed.
data-cookie-btn="" - the HTML content of the accept button.

**Scroll Functions**

Additional scroll-related functions are contained in the tatScroll object.

***Sticky Header***

***Element in viewport***