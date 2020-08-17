function registerEmail(e) {
  
  e.preventDefault()
  var email = document.getElementById("email").value;
  var password = document.getElementById("passwordForm").value;
  var nameStore = document.getElementById("storeNameForm").value;
  
  console.log(email,password)

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
    }).then;
    console.log("Success")
    writeUserData(nameStore,email)
}


function writeUserData(place,email) {
    firebase.database().ref('users-store/' + place).set({
      email: email,
      location: "",
    });
    console.log('Database')
  }