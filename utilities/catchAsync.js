module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next)
    }
}

//fungsi ini biar kita gak input lagi try n catch di route asli
// try catch berfungsi menghandle error dari routes dan monggi, karena kalau if dan return biasa gk bisa handle mongo