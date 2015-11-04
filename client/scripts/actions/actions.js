export const INPUT_PERSONAL_NUMBER = 'INPUT_PERSONAL_NUMBER';
export const SET_LOGIN_METHOD = 'SET_LOGIN_METHOD';

export const LoginMethods = {
    BANDK_ID: 'BANK_ID',
    SITHS_CARD: 'SITHS_CARD'
};

export function setLoginMethod(loginMethod) {
    return {
        type: SET_LOGIN_METHOD,
        loginMethod
    };
}

export function inputPersonalNumber(personalNumber) {
    return {
        type: INPUT_PERSONAL_NUMBER,
        personalNumber
    };

}
