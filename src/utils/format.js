export function priceWithRouble(number) {
    return `${separateThousands(number)} ₽`
}

export function separateThousands(number) {
    if (isNumber(number)) {
        return number.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ' ');
    }
    return number;
}

function isNumber(n) { return !isNaN(parseFloat(n)) && !isNaN(n - 0) }