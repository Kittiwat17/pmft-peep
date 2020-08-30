var acceptBtn = document.querySelector('#accept');
var fnameBar, lnameBar, emailBar
var fname, lname, email, codeID = '';
var isFindUser = false;
acceptBtn.addEventListener('click', () => {
    //ถ้าหาเจอทำif หาในระบบไม่เจอใช้else
    // query email & barcode on firebase
    fname = document.querySelector("#firstName").value;
    lname = document.querySelector("#lastName").value;
    firebase.database().ref("outside-user").once("value", function (snapshot) {
        var list = snapshot.val();
        Object.keys(list).forEach(function (key) {
            console.log(list[key]);
            if (list[key].firstName == fname && list[key].lastName == lname) {
                isFindUser = true;
                var targetUser = list[key];
                codeID = targetUser.number;
                return;
            }
        })
        if (isFindUser) {
            document.querySelector(".data-page").style.display = 'block';
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
            $('#failedModal').on('shown.bs.modal', function () {
                $(this).delay(800).fadeOut(300, function () {
                    $(this).modal('hide');
                });
            })
        } 
    })
    // codeID = ไอดีของผู้ใช้

})