**[Blurry.js](http://www.pmura.com/labs/blurryjs)** it's an experimental javascript library (written in [CoffeScript](http://jashkenas.github.com/coffee-script/)) for applying blur effects to HTML text and images. Blurry.js' dependencies include: an html to canvas replacement engine (by default it uses Cufon), a slighty modified version of the [StackBlur](http://www.quasimondo.com/StackBlurForCanvas/StackBlurDemo.html) library for canvas gaussian blur, jQuery and jQuery.waitForImages.

It is amasingly fast though we want to test it with web workers on bigger images.

**WARNING**: As of now, it shouldn't be used for other then experimenting with the code itself.

Technicals
==========

How it works
------------

1. Get all canvases and apply a unique id under \<\canvas data-blurry-id="ID" \/>
2. For each canvas store hash

        {Blurry.sharpEl.ID = data/png}

3. For each stored hash, data in Blurry.sharpEl

<pre>
  create tempImage
  load tempImage src with data/png from Blurry.sharpEl.ID
  apply blur
</pre>

3.1 Store the blur data

        {Blurry.blurryEl.ID = data/png}

4. For each hash, delegate events (mouseover, mouseout)

4.1 If is canvas, apply event on parent tag (which is HTML). Canvas elements don't support blur.

Browser Support
---------------

Should work on all current HTML5 enabled browsers (IE9+, Firefox 5+, Chrome 10+, Opera 12+, Safari 5+). Tested on:
* Chrome 14.0.814.0
* Firefox 5

In the wild
===========
* Originally written for and implemented in the new [pmworks website](http://www.pmworks-corp.com)
* Will be partially implemented in a major brand website

Usage
=====
In CoffeeScript

    $ ->
      $('body').waitForImages ()=>
        blurFx = new Blurry {
          # replace HTMLImageObject with HTMLCanvasObject
          # if only images it is not required
          replaceWithCanvas: true

          # Element(s) to apply the blur
          el: $('section').find('img')

          # gaussian blur radius
          radius: 3

          # after Blurry completes, it calls this method
          onComplete: (_this)->
            console.log 'complete'
        }

Next
====
Implement <code>Blurry::blurAllExcept</code>, and <code>Blurry::sharpAllExcept</code> so that it fully simulates the on hover CSS3 blur.

License
=======
Blurry.js is licensed under the MIT license.

Copyright (C) 2011 by Pasion Mura <pmura@pmura.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.