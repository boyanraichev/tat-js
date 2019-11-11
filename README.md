# tat-js

Minimalistic JS web package.

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

If you are using npm or another package manager you can install by including `tat-js` in your dependencies and then using `require('tat')` or `import {} from 'tat.js'` in your script. This will include the babel EC5 transpiled version of the package.

If you need better support, you would have to include polyfills, i.e.:

```html
<script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>
```
  
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

**Confirm**

You can show a confirmation modal box in two ways:

1. Use a ".js-confirm" class on your handler element. Use the data-modal attribute to set the modal ID and the data-text attribute to set the modal text. Pass additional data through the data-confirm-data="" attribute on the same element. Set up your callback function using a modal hook as described in the modals section.

2. Hook your handler in your script and call tat.confirm(modalID,modalContent,callback,data) method with the following parameters: the ID of the confirmation modal, the text of the confirmation modal, the callback function upon confirmation and additional data you want to pass to the callback function.

**Toggle on/off**

Toggle an element (use CSS to style the desired behaviour, i.e. show/hide). The toggled element will receive a class `.active` when ON and the handler will receive a class `.toggled`. Use the `.js-toggle` class to activate the handler.

Must-fill attributes:
data-toggle="" - the ID of the element to be toggled. 

Optional attributes:
data-body-class="" - add this class on the <body> element when the element is toggled ON.

Events:
'toggled' event is sent on the target element.

Example markup:
```html
<div id="target">Target element</div>
<button class="js-toggle" data-toggle="target" data-body-class="has-element-toggled">Toggle link</button>
```

**Scroll**

Use the `.js-scroll` class to an element to add a scroll-to function when this element is clicked. 

Must-fill attributes:
data-scrollto="" - the id of the element to scroll to

Optional attributes:
data-offset="" - the offset from the viewport top (in pixels) to leave above the scroll-to element. Default is 60 pixels.

**Tabs**

Use the `.js-tab` class to a handler to make a tab visible in a tab pane design.

Must-fill attributes:
data-tab="" - the ID of the tab to be shown. It will receive a class .active
data-menu="" - the ID of the element containing the tab handlers. The currently active handler will receive class .active
data-wrap="" - the ID of the element containing the tabs. Each tab should have the .tab class.

**Tooltip**

Use the `.js-tooltip` class to a handler to show a tooltip upon specific action. The handler will receive a class `.tooltip-on` when activated. The tooltip itself can be another element (which will receive  a class `.active` when active) or an element created programmatically with the text provided in a data attribute. 

Must-fill attributes (one of the two):
data-tooltip="" -  the ID of the tooltip element to be shown. The tooltip will receive a class .active.
data-tooltip-text="" -  the text content to be put in the tooltip element created dynamically.

Optional attribute:
data-trigger="" - possible options currently: mouseover, focus. Default is mouseover.

**Form validation**

All input, select and textarea elements on your page will receive a class `.has-input` when they receive input for the first time. This allows you to use the css `:invalid` selector to visualise invalid input only after the user has interacted with this field. 

Further form validation is possible with the addition of `.js-validate` class on the form. This will add a `.was-validated` class upon submit, allowing you to further use css `:invalid` and `:valid` selectors to style the inputs. Additionally, you can easily set custom validation messages with the following data attributes:
data-validation-required="" - for empty required field
data-validation-type="" - for wrong type value (i.e. not an email)
data-validation-minlength="" - for value that is too short
data-validation-range="" - for numeric value that is not respecting the min, max or step values
data-validation-pattern="" - for when a pattern has not been matched

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

Additional scroll-related functions.

***Sticky Header***

Use ".js-sticky" class on the header or other element you want to make sticky. Use CSS to actually make the element sticky - the script only adds the class `sticked` on the element and the `has-sticky` class on the body, when the scroll position is reached.

***Element in viewport***

Use *js-inview* class on an element and when the element is scrolled into the viewport it will gain the *in-viewport* class.