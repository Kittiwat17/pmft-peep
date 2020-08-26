var acceptBtn = document.querySelector('#accept');
var fnameBar, lnameBar, emailBar
var fname, lname, email = '';
acceptBtn.addEventListener('click', () => {
    if (false) {//ถ้าหาเจอทำif หาในระบบไม่เจอใช้else
        // query email & barcode on firebase
        fname = document.querySelector("#firstName").value;
        console.log(fname);
        lname = document.querySelector("#lastName").value;
        console.log(lname)
        fnameBar = document.querySelector("#fname");
        lnameBar = document.querySelector("#lname");

        emailBar = document.querySelector("#email");
        fnameBar.innerHTML = fname;
        lnameBar.innerHTML = lname;
        // emailBar.innerHTML = email;
    }else{
        $("#failedModal").modal('show');
    }
})