const invoiceNumber = () => {
    let invNum = String(Math.random()).slice(2,11)
    if(String(invNum).length < 9)  invoiceNumber()
    else  return invNum
}
module.exports=invoiceNumber
