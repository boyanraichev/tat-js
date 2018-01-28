# tat-js
Minimalistic JS framework

Objectives
----------

This is a simple JS framework to provide standard websites with common stuff like modals, sticky headers, etc. in the smallest script possible. It is aimed at smaller websites and web apps that do not need a heavy powerful framework and do not want the bulky and slow bootstrap JS and the likes. 

This frameworks aims to:
- be very lightweight
- provide only the most common JS needs

Get Started
-----------

There is only one file you need to include: tat.min.js

**Hooks**
This framework uses classes as handlers, as they are much faster than using data attributes. All classes that call the framework are "js-" prefixed.

**Modals**

Attach a ".js-modal" class to your handler. The content of your modal can be either passed in the data-modal-content="" attribute of your handler, or alternatively pass a data-modal-get="" attribute with the ID of the html element that contains your modal content. The data-modal="" attribute of the handler contains the ID of the modal to be created. 

The modal will be created with the following structure:
```html
<div id="" class="modal">
  <div class="modal-content"></div>
</div>
```

The ".modal" element is also your overlay element, if you need one.

The handler for closing the element is a "js-modal-close" class which you should put in your modal content. 

