Blurry.js it's an experimental cross-html5-browser javascript library for applying blur effects to HTML text and images. Blurry.js' dependencies include: an html to canvas replacement engine (by default it uses Cufon), and the StackBlur library for canvas blur.

Works best when using web workers.

# How it works
## Step 1

Get all canvases and apply a unique id under \<\canvas data-blurry-id="ID" \/>

## Step 2

For each canvas store hash
{Blurry.sharpEl.ID = data/png}
{Blurry.blurryEl.ID = data/png}

# Browser Support
Should work on all current HTML5 enabled browsers (IE9+, Firefox 5+, Chrome 10+, Opera 12+, Safari 5+). Tested on:
- Chrome 14.0.814.0