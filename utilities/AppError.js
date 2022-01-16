class AppError extends Error {
    constructor(message, statusCode){
        super();
        this.message = message;
        this.statusCode = statusCode;
    }
}
module.exports = AppError

// ini untuk meng extend class Error yang sudah ada di JS

// class Error itu dari javasript
// yang express butuhin ada status code, makanya kita tambahin