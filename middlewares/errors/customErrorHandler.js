const CustomError = require("../../helpers/error/CustomError");

const customErrorHandler = (err,req,res,next) => {
    let customError = err;

    if(err && err.code === 11000){
        err.message = "Bu kimlik numarasına ait bir kullanıcı zaten var.";
        customError = new CustomError(err.message,400);
    }
    else if(err.name === "ValidationError") {
        customError = new CustomError(err.message,400);
    }
    else if(err.name === "CastError"){
        customError = new CustomError("Lütfen geçerli bir Kimlik numarası giriniz.",400);
    }
    res.status(customError.status ||500)
    .json({
        success: false,
        message: customError.message
    });
}

module.exports = customErrorHandler;