# root = this
# Functions with underscore (_) before the fn name, are utility fn,
# they don't control flow of library
# root.pmwc =
# 	debug: ()->
# 		console.log arguments

class @Blurry
	# 
	constructor: (options={})->
		# To prevent Hash collisions
		@usedHashes = []
		# options for each instance
		# el jQueryElement
		this.options = options
		# Multidim assoc-array of sharp/original data, by data-blurry-id:hash
		this.sharpEl = {}
		# Multidim assoc-array of blurred data, by data-blurry-id:hash
		this.blurryEl = {}
		# Object.prototype.toString.call(el) === '[object HTMLCanvasElement]'
		ite = 0
		for el in this.options.el
			#this.originalCanvas.push el 
			$el = $(el)
			hash = this.hash()

			if not el.getAttribute('data-blurry-id')
				el.setAttribute('data-blurry-id', hash)
				if this._type(el) is 'Canvas'
					this.sharpEl[hash] = el.toDataURL()
				if this._type(el) is 'Image'
					# Currently there is a problem calculating H and W
					# I believe the problem is with the calculation done before img draws
					# 99.99% of cases should appear if CTRL+F5 (why moved to this.cavasify)
					# edit: This should be fixed by now: waitForImages before calling Blurry
					if el.naturalHeight isnt 0 or el.naturalWidth isnt 0
						canvas =  this.canvasify $el, el, el.naturalWidth, el.naturalHeight
						this.sharpEl[hash] = canvas.toDataURL()
		
		totalSharpEl = this._size(this.sharpEl)
		if totalSharpEl >= 1
			for sharpHash, sharpData of this.sharpEl
				do (sharpHash, sharpData)=>
					imgtmp = new Image()
					imgtmp.src = sharpData
					# Should delay enough to permit imgtmp.src to render, so we can get data
					# 2ms should be enough
					imgtmp.onload = setTimeout (this.blurry this, imgtmp, {sharpHash:sharpHash, sharpData:sharpData}), 5
					ite++
		
		@events()
		return this

	###
	Element manipulation funs
	-------------------------
	###
	canvasify: ($el, el, w, h)->
		# console.debug 'aW:onElCalcW aH:onElCalcH'
		# console.debug 'o_' + w + ':' + 'c_' + el.naturalWidth, h + ':' + el.naturalHeight
		cvs = new this._Canvas()
		cvs.height = el.naturalHeight
		cvs.width = el.naturalWidth
		ctx = cvs.getContext('2d')
		ctx.clearRect(0, 0, cvs.width, cvs.height)
		ctx.drawImage el, 0, 0
		ctx.save
		# $el.replaceWith(cvs)
		return cvs

	###
	@param $el querySelector
	@param el HTMLCanvasElement
	###
	imagify: ($el, el)->
		# cvs = new this._Canvas()
		# cvs.height = el.naturalHeight
		# cvs.width = el.naturalWidth
		imgtmp = new Image
		imgtmp.src = el.toDataURL()
		imgtmp.onload = =>
			$el.replaceWith(imgtmp)
		return imgtmp

	# TODO: clear fn from unneccessary anonymous fn
	blurry: (_this, imgtmp, sharpObj)->
		# imgtmp.onload = ((_self, _this, options)=>
			# console.log this, _self
			cvstmp = new _this._Canvas()
			cvsctx = cvstmp.getContext '2d'
			cvstmp.height = imgtmp.naturalHeight
			cvstmp.width = imgtmp.naturalWidth
			cvsctx.clearRect 0, 0, cvstmp.width, cvstmp.height
			cvsctx.drawImage imgtmp, 0, 0
			cvsctx.save
			cvstmp = new StackBlur.canvasRGBA cvstmp, 0, 0, cvstmp.width, cvstmp.height, 3
			_this.blurryEl[sharpObj.sharpHash] = cvstmp.toDataURL()
			console.log sharpObj.sharpData is _this.blurryEl[sharpObj.sharpHash]
			# console.log cvstmp.getContext('2d').getImageData(0, 0, _self.naturalWidth, _self.naturalHeight) is _cvs.getContext('2d').getImageData(0, 0, _self.naturalWidth, _self.naturalHeight)
		# )(imgtmp, _this, {sharpHash: sharpObj.sharpHash, sharpData: sharpObj.sharpData})

	imgToCanvas : (image)->
		cvs = document.createElement('canvas')
		cvs.height = el.naturalHeight
		cvs.width = el.naturalWidth
		ctx = cvs.getContext('2d')
		ctx.clearRect(0, 0, cvs.width, cvs.height)
		ctx.drawImage el, 0, 0
		ctx.save
		$el.replaceWith(cvs)

	###
	Events
	------
	###
	events: ->
		for el in @options.el
			do (el)=>
				if @_type(el) is 'Image'
					$(el).bind 'mouseover', {_this:this,el:el}, (event)->
						# console.log event.data._this
						data = event.data._this.blurryEl[event.data.el.dataset.blurryId]
						event.data.el.src = data
					$(el).bind 'mouseleave', {_this:this,el:el}, (event)->
						# console.log event.data._this
						data = event.data._this.sharpEl[event.data.el.dataset.blurryId]
						event.data.el.src = data


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
		hash = this._random()
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
			'[object HTMLImageElement]': 	'Image',
			'[object Object]': 						'Object',
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
		window.blurFx = new Blurry {
			# el: $('section.identity').find('h1 img')
			el: $('canvas')
		}
		console.log blurFx, blurFx.options.el.length
		# for hash in blurFx.usedHashes
		# for k, v of blurFx.blurryEl
		# 	do =>
		# 		console.log k + ':' + Object.prototype.toString.call(k), v + ':' + Object.prototype.toString.call(v)
		# elI = 0
		# for el in blurFx.options.el
		# 	do (el)=>
		# 		# console.log el.src
		# 		# console.log blurFx.sharpEl[el.dataset.blurryId] is blurFx.blurryEl[el.dataset.blurryId]
		# 		# data = blurFx.hashTable.get el.dataset.blurryId
		# 		# hashtable = new Hashtable
		# 		# hashtable.put 'a', 'b'
		# 		# data = hashtable.get 'a'
		# 		data = blurFx.blurryEl[el.dataset.blurryId]
		# 		el.src = data
		# 		elI++
		# #for canvas in $('img')
		# 	#c = document.createElement 'canvas'
		# 	#$(canvas.parentElement).append c
		# 	#canvas = querySelector(canvas)
		# 	#Pixastic.process(canvas, "blur", {amount:0.5})
		# #$(canvas).pixastic("blur", {amount:1}) for canvas in $('canvas')
