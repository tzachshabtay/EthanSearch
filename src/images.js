export default class Images {
    images = []
    cursor = -1
    seen = {}
    faulty = {}
    search = ""
    pageSize = 30
    numQueries = 0
    lastRecord = 0

    NewSearch = (search, callback, errorCallback) => {
        this.errorCallback = errorCallback
        this.images = []
        this.numQueries = 0
        this.cursor = -1
        fetch('/images/new_search')
        if (this.search !== search) {
            this.search = search
            this.lastRecord = 0
        }
        this.LoadCurrent(callback)
    }

    LoadPrevious = (callback) => {
        this.cursor = this.cursor - this.pageSize
        this.LoadCurrent(callback)
    }

    LoadNext = (callback) => {
        this.cursor = this.cursor + this.pageSize
        this.LoadCurrent(callback)
    }

    LoadCurrent = (callback) => {
        this.load(this.cursor, this.cursor + this.pageSize, () => {
            this.cursor = this.clamp(this.cursor)
            this.send(this.cursor, this.cursor + this.pageSize, callback)
        })
    }

    load = (from, to, callback) => {
        if (from !== this.images.length) {
            this.load(this.images.length, to, callback)
            return
        }
        if (from > to) {
            console.log(`from ${from} > to ${to}`)
            callback()
            return
        }
        const page = this.lastRecord + 1
        console.log(`searching from offset ${page}, has ${this.images.length}, cursor at ${this.cursor}, #queries = ${this.numQueries}`)
        this.numQueries += 1
        if (this.numQueries > 50) {
            console.log(`self limit, stopping search`)
            callback()
            return
        }
        fetch(`/images/${this.search || "clock"}/${page}`).then(response => response.json()).then(result => {
            this.lastRecord += result.length
            this.addImages(result, page)
            if (this.images.length > to || result.length === 0) {
                callback()
            } else {
                this.load(this.images.length, to, callback)
            }
        }).catch((reason) => {
            console.error(`failed fetching.`, reason)
            this.errorCallback();
        })
    }

    send = (from, to, callback) => {
        from = this.clamp(from)
        to = this.clamp(to)
        callback(this.images.slice(from, to))
    }

    clamp = (val) => {
        if (val < 0) {
            return 0
        }
        if (val >= this.images.length) {
            return this.images.length - 1
        }
        return val
    }

    addImages = (result, page) => {
        for (const image of result) {
            if (image.url in this.seen || image.url in this.faulty) {
                continue
            }
            this.seen[image.url] = true
            image.page = page
            this.images.push(image)
        }
    }

    OnFaultyImage = (url, callback) => {
        console.log(`faulty url ${url}`)
        this.faulty[url] = true
        const index = this.images.findIndex((i) => i.url === url);
        console.log(`faulty url ${url} at index ${index}`)
        if (index > -1) {
            this.images.splice(index, 1);
        }
        this.LoadCurrent(callback)
    }
}
