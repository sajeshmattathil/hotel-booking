const invoiceNumber = () => {
    let otp = String(Math.random()).slice(2,8)
    if(String(otp).length < 10)  generateOtp()
    else  return otp
}

module.exports=invoiceNumber
