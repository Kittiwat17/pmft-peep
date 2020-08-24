function getRandomArbitrary() {
    min = 0;
    max = 99999999;
    num = Math.random() * (max - min) + min;
    set = Math.round(num);
    num2 = set.toString();
    last4Digits = num2.slice(-7);
    finish_num = last4Digits.padStart(num2.length, '0');
    console.log(finish_num);
    console.log("ok");
    return finish_num;
}