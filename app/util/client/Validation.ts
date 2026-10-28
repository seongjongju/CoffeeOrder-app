export const validations = {
    idRegex: /^(?=[a-z0-9]{4,12}$)[a-z]{3,}[0-9]+$/,
    passwordRegex: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+=-]).{8,}$/,
    nameRegex: /^[가-힣]{2,10}$/,
    phoneNumberRegex: /^010[0-9]{8}$/,
    emailRegex: /^(?!.*\.\.)(?!\.)(?!.*\.$)[A-Za-z0-9._%+-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*\.[A-Za-z]{2,}$/,
    sixDigitRegex: /^\d{6}$/,
    birthRegex: /^\d{8}$/
};