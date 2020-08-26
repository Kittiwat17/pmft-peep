function registerEmail(e) {
  var email = document.getElementById("email").value;
  var password = document.getElementById("passwordForm").value;
  var nameStore = document.getElementById("storeNameForm").value;
  // var user = firebase.auth().currentUser;
  console.log(email, password);

  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // [START_EXCLUDE]
      if (errorCode == "auth/weak-password") {
        alert("The password is too weak.");
      } else {
        alert(errorMessage);
      }
      console.log(error);

      // [END_EXCLUDE]
    }).then(() => {
      var user = firebase.auth().currentUser;
      if (user) {
        var uid = user.uid;
      }
      writeUserData(nameStore, email, uid)
      // window.location.href = "../Map/index.html";
    }).then(() => {
      window.location.href = "../Map/index.html";
    })
    e.preventDefault();
}


function writeUserData(place, email, uid) {
  firebase
    .database()
    .ref("users-store/" + uid)
    .set({
      namePlace: place,
      email: email,
      location: "",
    });

}



function createOutsideUser(e) {
  e.preventDefault()
  var randomNum = getRandomArbitrary();
  sessionStorage.setItem("randomNum", randomNum);
  var firstName = document.getElementById("firstNameValue").value
  var lastName = document.getElementById("lastNameValue").value
  var email = document.getElementById("emailValue").value
  firebase
    .database()
    .ref("outside-user/" + randomNum)
    .set({
      firstName: firstName,
      lastName: lastName,
      email: email,
      number: randomNum
    }).then(()=>{
      console.log('registered')
      window.location.href="../barcodeGene"
    });
  
}

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


function logout(){
  firebase.auth().signOut().then(()=>{
    window.location.href = "../index.html"
  })
}

function checkUser(e){
  firebase.database().ref("outside-user").once('value',function(snapshot){
    var list = snapshot.val()
    var numberID = document.getElementById("id-input").value  
    if (numberID in list){
      // if has data
      // console.log('True')
      checkInOutOutside(numberID);
    }else{
      //if not has data in list
      // console.log('False')
      alert("ไม่มีเลขนี้ในระบบ")
    }
  })
  e.preventDefault()
}



function checkInOutOutside(code) {
  var user = firebase.auth().currentUser;
  if (user) {
      var uid = user.uid;
      //user in system
      var path = firebase.database().ref('users-store/' + uid)
      path.once('value').then(function (snapshot) {
          var a = snapshot.child("customer").exists();
          if (a) {
              firebase.database().ref("users-store/" + uid + '/customer').once('value', function (snapshot) {
                  var temp = snapshot.val()
                  console.log(temp)
                  if (temp.includes(code)) {
                      console.log(temp)
                      const index = temp.indexOf(code);
                      if (index > -1) {
                          temp.splice(index, 1);
                      }
                      database.ref("users-store/" + uid).update({ customer: temp })
                  } else {
                      temp.push(code)
                      console.log(temp)
                      database.ref("users-store/" + uid).update({ customer: temp })
                  }
              });



          } else {
              var customer = []
              customer.push(code)
              console.log(customer)
              firebase.database().ref("users-store/" + uid).update({
                  'customer': customer
              })
          }
      })
  } else {
      alert("Please login again")
      window.location.href = "../../index.html"
  }
}