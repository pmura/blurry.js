# root = this
# Functions with underscore (_) before the fn name, are utility fn,
# they don't control flow of library
# root.pmwc =
#   debug: ()->
#     console.log arguments
class @Blurry
  # 
  constructor: (options={})->
    # To prevent Hash collisions
    @usedHashes = []
    # options for each instance
    # el jQueryElement
    @options = options
    # Multidim assoc-array of sharp/original data, by data-blurry-id:hash
    @sharpEl = {}
    # Multidim assoc-array of blurred data, by data-blurry-id:hash
    @blurryEl = {}
    # Object.prototype.toString.call(el) === '[object HTMLCanvasElement]'
    @iteSharp = 0
    @iteSharpList = []
    @iteBlurry = 0
    @iteBlurryList = []
    for el in this.options.el
      #this.originalCanvas.push el 
      $el = $(el)
      hash = @hash()

      if not el.getAttribute('data-blurry-id')
        el.setAttribute('data-blurry-id', hash)
        if @_type(el) is 'Canvas'
          @sharpEl[hash] = el.toDataURL()
          @iteSharpList.push @iteSharp
          @iteSharp++
        if @_type(el) is 'Image'
          # Currently there is a problem calculating H and W
          # I believe the problem is with the calculation done before img draws
          # 99.99% of cases should appear if CTRL+F5 (why moved to this.cavasify)
          # edit: This should be fixed by now: waitForImages before calling Blurry
          if el.naturalHeight isnt 0 or el.naturalWidth isnt 0
            canvas =  @canvasify @options.replaceWithCanvas, @iteSharp, $el, el, el.naturalWidth, el.naturalHeight
            this.sharpEl[hash] = canvas.toDataURL()
            @iteSharpList.push @iteSharp
            @iteSharp++
    # console.log @iteSharpList

    totalSharpEl = @_size @sharpEl
    if totalSharpEl >= 1
      for sharpHash, sharpData of @sharpEl
        do (sharpHash, sharpData)=>
          imgtmp = new Image()
          imgtmp.src = sharpData
          imgtmp.onload = =>
            cvstmp = new @_Canvas()
            cvsctx = cvstmp.getContext '2d'
            # naturalWidth/Height is HTML5 only, but since this lib uses canvas...
            cvstmp.height = imgtmp.naturalHeight
            cvstmp.width = imgtmp.naturalWidth
            cvsctx.clearRect 0, 0, cvstmp.width, cvstmp.height
            cvsctx.drawImage imgtmp, 0, 0
            cvs = new StackBlur.canvasRGBA cvstmp, 0, 0,
              cvstmp.width, cvstmp.height, @options.radius
            # We have to call toDataURL anyway, even if sharp === blurry
            @blurryEl[sharpHash] = cvs.toDataURL()

            # Test and log if data (sharp and blurry) is the same
            console.log sharpHash + ' '+ (sharpData is @blurryEl[sharpHash])

            if @iteBlurry is @iteSharpList.length-1
              @iteBlurryList.push @iteBlurry
              @iteBlurry++
              return @options.onComplete(this)
            
            @iteBlurryList.push @iteBlurry
            @iteBlurry++
    
    @events()
    return this

  ###
  Element manipulation funs
  -------------------------
  ###

  ###
  @param replaceWithCanvas querySelector
  @param indexInOptions querySelector
  @param $el querySelector
  @param el querySelector
  @param w int
  @param h int
  @return HTMLImageElement
  ###
  canvasify: (replaceWithCanvas, indexInOptions, $el, el, w, h)->
    # console.debug 'aW:onElCalcW aH:onElCalcH'
    # console.debug 'o_' + w + ':' + 'c_' + el.naturalWidth, h + ':' + el.naturalHeight
    cvs = new @_Canvas()
    cvs.height = el.naturalHeight
    cvs.width = el.naturalWidth
    ctx = cvs.getContext('2d')
    ctx.clearRect(0, 0, cvs.width, cvs.height)
    ctx.drawImage el, 0, 0
    ctx.save
    if replaceWithCanvas
      for attr in el.attributes
        attrToSkip = ['alt', 'src']
        if attr.name in attrToSkip
          #do nothing
        else
          cvs.setAttribute attr.name, attr.value
      $el.replaceWith(cvs)
      @options.el[indexInOptions] = cvs
    return cvs

  ###
  @param replaceWithImage boolean
  @param el HTMLCanvasElement
  @param $el querySelector
  @return HTMLImageElement
  ###
  imagify: (replaceWithImage, el, $el)->
    imgtmp = new Image
    imgtmp.src = el.toDataURL()
    imgtmp.onload = =>
      if  replaceWithImage
        $el.replaceWith imgtmp
      return imgtmp
  ###
  ###
  dataToCanvas: (data)->
    imgtmp = new Image
    imgtmp.src = data
    imgtmp.onload = =>
      canvas = new @_Canvas()
      canvas.height = imgtmp.naturalHeight
      canvas.width = imgtmp.naturalWidth
      cvsctx.clearRect 0, 0, canvas.width, canvas.height
      cvsctx.drawImage imgtmp, 0, 0
      return canvas
  ###
  ###
  canvasDataReplacement: (canvas, data)->
    imgtmp = new Image
    imgtmp.src = data
    imgtmp.onload = =>
      canvas.height = imgtmp.naturalHeight
      canvas.width = imgtmp.naturalWidth
      cvsctx = canvas.getContext('2d')
      cvsctx.clearRect 0, 0, canvas.width, canvas.height
      cvsctx.drawImage imgtmp, 0, 0
      return canvas

  imgToCanvas : (image)->
    cvs = document.createElement('canvas')
    cvs.height = el.naturalHeight
    cvs.width = el.naturalWidth
    ctx = cvs.getContext('2d')
    ctx.clearRect(0, 0, cvs.width, cvs.height)
    ctx.drawImage el, 0, 0
    ctx.save
    return cvs
    # $el.replaceWith(cvs)

  ###
  Events
  ------
  ###
  events: ->
    for el in @options.el
      do (el)=>
        if @_type(el) is 'Image'
          $(el).bind 'mouseover', {_this:this,el:el}, (event)->
            # console.log event
            data = event.data._this.blurryEl[event.data.el.dataset.blurryId]
            event.data.el.src = data
          $(el).bind 'mouseleave', {_this:this,el:el}, (event)->
            # console.log event.data._this
            data = event.data._this.sharpEl[event.data.el.dataset.blurryId]
            event.data.el.src = data

        else if @_type(el) is 'Canvas'
          console.log 'not ready for canvas'
          $(el.parentNode).bind 'mouseover', {_this:this,el:el,parent:el.parentNode}, (e)->
            $parent = $(e.data.parent).find(e.data.el.tagName.toLowerCase())
            for el in $parent
              a = e.data._this.canvasDataReplacement el, e.data._this.blurryEl[el.dataset.blurryId]
              a()
          $(el.parentNode).bind 'mouseout', {_this:this,el:el,parent:el.parentNode}, (e)->
            $parent = $(e.data.parent).find(e.data.el.tagName.toLowerCase())
            for el in $parent
              a = e.data._this.canvasDataReplacement el, e.data._this.sharpEl[el.dataset.blurryId]
              a()
          # $(el).bind 'mousemove', {_this:this,el:el}, @_mouseover
          # $(el).bind 'mousemove', {_this:this,el:el}, (event)->
          #   $(el).trigger 'active'
          #   # data = event.data._this.sharpEl[event.data.el.dataset.blurryId]
          #   # event.data.el.src = data
        else
          return

  _mouseover: (e)->
    # if not e
    #   e = window.event;
    # console.log e
    # console.log e.currentTarget.parentNode

  _mouseactive: (e)->
    # if not e
    #   e = window.event;
    # console.log e
    # mx = e.pageX
    # my = e.pageY
    # areaX = [e.currentTarget.offsetLeft, e.currentTarget.offsetLeft + e.currentTarget.offsetWidth]
    # areaY = [e.currentTarget.offsetTop, e.currentTarget.offsetTop + e.currentTarget.offsetHeight]
    # if areaX[1] >= mx >= areaX[0] and areaY[1] >= my >= areaY[0]
    #   console.log 'over'
    # console.log areaX
    # console.log mx

  _mouseout: (_this)->
    # _this.mousePos = null
    # if typeof canvasOnmouseout is typeof Function
    #   canvasOnmouseout(_this)

  ###
  Blur all elements in this.options.el, except the one passed as arg[0]
  @param except querySelector
  @return true if replaced elements; false if none replaced, error if except not
          found
  ###
  blurAllExcept: (except)->
    for el in this.options.el
      $(el).bind 'mouseover', {_this:this}, (e)->
        data = _this.blurryEl[el.dataset.blurryId]
        el.src = data

  ###
  Sharp all elements in this.options.el, except the one passed as arg[0]
  @param except querySelector
  @return true if replaced elements; false if none replaced, error if except not
          found
  ###
  sharpAllExcept: (except)->

  hash: ->
    hash = @_random()
    if hash not in @usedHashes
      @usedHashes.push hash
      return hash
    else
      this.addHash()

  _Canvas: ->
    return document.createElement 'canvas'

  _random: ->
    string = ''
    chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for num in [1..32]
        string += chars.charAt(Math.floor(Math.random() * chars.length))
    return string
  
  _type: (obj)->
    list = {
      '[object HTMLCanvasElement]': 'Canvas',
      '[object HTMLImageElement]':  'Image',
      '[object Object]':            'Object',
    }
    if obj?
      return list[Object.prototype.toString.call(obj)]
    else
      return list

  _size: (obj)->
    size = 0
    for key, val of obj
      if (obj.hasOwnProperty(key)) then size++
    return size

#root.Blurry.prototype.loaded = true

$ ->
  $('body').waitForImages ()=>
    blurFx = new Blurry {
      replaceWithCanvas: true
      parent: $('section.identity')
      el: $('section.identity').find('h1 img')
      # el: $('canvas')
      radius: 3
      onComplete: (_this)->
        console.log 'complete'
    }
    console.log blurFx