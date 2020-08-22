function registerEmail(e) {
  e.preventDefault();
  var email = document.getElementById("email").value;
  var password = document.getElementById("passwordForm").value;
  var nameStore = document.getElementById("storeNameForm").value;
  var user = firebase.auth().currentUser;
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
    }).then(()=>{
    console.log("Success")
    if (user) {
      var uid = user.uid;
      }
    writeUserData(nameStore, email, uid)
      // window.location.href = "../Map/index.html";
    }).then(() =>{
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

// function createUser(e){
//   e.preventDefault();
//   var email = document.getElementById("email").value;
//   var password = document.getElementById("passwordForm").value;
//   var user = firebase.auth().currentUser;
//   console.log(email, password);

//   firebase
//     .auth()
//     .createUserWithEmailAndPassword(email, password)
//     .catch(function (error) {
//       // Handle Errors here.
//       var errorCode = error.code;
//       var errorMessage = error.message;
//       // [START_EXCLUDE]
//       if (errorCode == "auth/weak-password") {
//         alert("The password is too weak.");
//       } else {
//         alert(errorMessage);
//       }
//       console.log(error);

//       // [END_EXCLUDE]
//     })
// }
