class @blurt
	# 
	constructor: (opts=[])->
		# To prevent Hash collisions
		@usedHashes = []
		@hashTable = new Hashtable()
		# opts for each instance
		# el jQueryElement
		this.opts = opts
		# Multidim assoc-array of sharp/original data, by data-blurry-id:hash
		this.sharpEl = {}
		# Multidim assoc-array of blurred data, by data-blurry-id:hash
		this.blurryEl = {}
		# Object.prototype.toString.call(el) === '[object HTMLCanvasElement]'
		#i = 0
		for el in this.opts
			hash = this.hash()
			this.sharpEl[hash] = 'sharpdataof-'+hash
			@hashTable.put(hash, 'sharpdataof-'+hash)

			totalSharpEl = this._size(this.sharpEl)
			if totalSharpEl >= 1
				for sharpHash, sharpData of this.sharpEl
					do ()=>
							@blurryEl[sharpHash] = 'blurry-'+sharpData
							# console.log _this.sharpEl[opts.sharpHash] is cvstmp.toDataURL()
	getHash: (index)->
		return @usedHashes[index]

	hash: ->
		hash = this._random()
		if hash not in @usedHashes
			@usedHashes.push hash
			return hash
		else
			this.addHash()

	_random: ->
		string = ''
		chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		for num in [1..16]
				string += chars.charAt(Math.floor(Math.random() * chars.length))
		return string
	_size: (obj)->
		size = 0
		for key, val of obj
			if (obj.hasOwnProperty(key)) then size++
		return size
$ ->
		window.bblurt = new blurt [1,2,3,4,5,6,7,8,9,10,11,12,13]
		console.log bblurt
		for hash in bblurt.usedHashes
			console.log hash