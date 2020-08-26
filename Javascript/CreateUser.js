function registerEmail(e) {
  e.preventDefault();
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