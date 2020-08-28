function login(e) {
  var email = document.getElementById("emailForm").value;
  var password = document.getElementById("passwordForm").value;
  console.log(email,password)
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // [START_EXCLUDE]
      if (errorCode === "auth/wrong-password") {
        alert("Wrong password.");
      } else {
        alert(errorMessage);
      }
      console.log(error);
      // document.getElementById('quickstart-sign-in').disabled = false;
      // [END_EXCLUDE]
    }).then(()=>{
      if(firebase.auth().currentUser){
      window.location.href = "../barcodeScan"
      }
      // console.log(firebase.auth().currentUser)
    }
    );
    e.preventDefault();
  
}
