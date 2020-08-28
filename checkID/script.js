var acceptBtn = document.querySelector('#accept');
var fnameBar, lnameBar, emailBar
var fname, lname, email, codeID = '';
var isFindUser = false;
acceptBtn.addEventListener('click', () => {
    //ถ้าหาเจอทำif หาในระบบไม่เจอใช้else
    // query email & barcode on firebase
    fname = document.querySelector("#firstName").value;
    lname = document.querySelector("#lastName").value;

    // codeID = ไอดีของผู้ใช้
    if (isFindUser) {
        fnameBar = document.querySelector("#fname");
        lnameBar = document.querySelector("#lname");
        emailBar = document.querySelector("#email");
        fnameBar.innerHTML = fname;
        lnameBar.innerHTML = lname;
        // emailBar.innerHTML = email;


        JsBarcode("#showBarcode", codeID);
        var imgBarCode = document.querySelector('#showBarcode')
        var btnBarCode = document.querySelector('.saveImg').href = imgBarCode.src;
    } else {
        $("#failedModal").modal('show');
    }
})