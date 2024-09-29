const formatToPrice = (num: number): string => {
    let price = num.toString();

    const decimalPart = price.slice(-2)
    const integerPart = price.slice(0, -2)
    const integerLen = integerPart.length

    let commaFormattedInt = ""

    if(integerLen < 4){
        return "₹" + integerPart + '.' + decimalPart  
    }
    
    commaFormattedInt = ',' + integerPart.slice(-3)

    let iters = 0
    for (var i = integerLen - 4; i >= 0; i--) {
        iters++
        if (iters != 1 && iters % 2 !== 0) {
            commaFormattedInt = integerPart.charAt(i) + ',' + commaFormattedInt
        } else {
            commaFormattedInt = integerPart.charAt(i) + commaFormattedInt
        }
    }

    return "₹" +commaFormattedInt + '.' + decimalPart
}

export {
    formatToPrice
}