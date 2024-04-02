// const urlBase = "chompersphonebook.xyz";
const urlBase = "143.198.135.118";
const extension = "php";

var UserID = 0;
let userFirstName = "";
let userLastName = "";

let contactSearchList = [];
let contactList = [];


document.addEventListener("DOMContentLoaded", function () {
    const root = document.getElementById('root');
    let isRegistering = false;

    const handleLogin = () => {
        // Placeholder for login logic
        console.log("Logging in...");
    };

    const handleRegister = () => {
        // Placeholder for registration logic
        console.log("Registering...");
    };

    const toggleRegister = () => {
        isRegistering = !isRegistering;
        renderPage();
    };

    const renderPage = () => {
        const containerContent = isRegistering ? getRegisterContainer() : getLoginContainer();
        root.innerHTML = containerContent;

        // Add event listeners after rendering the page
        if (isRegistering) {
            document.getElementById('registerButton').addEventListener('click', handleRegister);
            document.getElementById('loginLink').addEventListener('click', toggleRegister);
        } else {
            document.getElementById('loginButton').addEventListener('click', handleLogin);
            document.getElementById('registerLink').addEventListener('click', toggleRegister);
        }
    };

    const getLoginContainer = () => {
        return `
        <div class="container">
          <div class="login-container">
            <h1 class="title">Turntable</h1>
            <div class="form-group">
              <input id="loginName" class="input" type="text" placeholder="Username">
              <input id="loginPassword" class="input" type="password" placeholder="Password">
              <button id="loginButton" class="button">Login</button>
              <span id="loginResult"></span>
              <p class="toggleText">Don't have an account yet? <a id="registerLink" href="#">Register</a></p>
            </div>
          </div>
        </div>
      `;
    };

    const getRegisterContainer = () => {
        return `
        <div class="container">
          <div class="login-container">
            <h1 class="title">Turntable</h1>
            <div class="form-group">
              <input class="input" type="text" placeholder="First Name">
              <input class="input" type="text" placeholder="Last Name">
              <input class="input" type="text" placeholder="Username">
              <input class="input" type="text" placeholder="Email">
              <input class="input" type="password" placeholder="Password">
              <button onclick="doLogin(); id="registerButton" class="button">Register</button>
              <p class="toggleText">Already have an account? <a id="loginLink" href="#">Login</a></p>
            </div>
          </div>
        </div>
      `;
    };

    renderPage();
});




function doLogin() {
    generateHtmlContent(); // This function is not defined in the provided code snippet. Make sure it exists or remove this line.
  
    // Resetting global variables which are not declared in the provided code snippet. 
    UserID = 0; 
    FirstName = ""; 
    LastName = "";
  
    // Getting login name and password from input fields.
    let login = document.getElementById("loginName").value;
    let password = document.getElementById("loginPassword").value;
  
    console.log("user/pass= " + login);
    console.log(password);
  
    document.getElementById("loginResult").innerHTML = ""; // Clearing any previous login result message.
  
    let tmp = { login: login, password: password };
    let jsonPayload = JSON.stringify(tmp); // Converting data to JSON format for sending to server.
  
    let url = "http://" + urlBase + "/api/Login." + extension; // Constructing URL for login API endpoint.
  
    let xhr = new XMLHttpRequest(); // Creating XMLHttpRequest object.
    xhr.open("POST", url, true); // Opening POST request to the specified URL asynchronously.
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8"); // Setting request header.
  
    try {
      xhr.onreadystatechange = async function () {
        if (this.readyState == 4 && this.status == 200) {
          let jsonObject = JSON.parse(xhr.responseText); // Parsing response JSON.
          UserID = jsonObject.id; // Assuming server responds with user ID.
          userFirstName = jsonObject.FirstName; // Assuming server responds with first name.
          userLastName = jsonObject.LastName; // Assuming server responds with last name.
          sessionStorage.setItem("UserID", UserID); // Storing user ID in session storage.
          sessionStorage.setItem("userFirstName", userFirstName); // Storing first name in session storage.
          sessionStorage.setItem("userLastName", userLastName); // Storing last name in session storage.
  
          if (UserID < 1) { // Assuming UserID less than 1 indicates authentication failure.
            document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
            return;
          }
  
          saveCookie(); // Assuming this function saves user data in a cookie.
          const getContactsResult = await getContacts(""); // Assuming this function fetches user contacts.
          console.log(getContactsResult); // Logging contacts fetched from server.
          window.location.href = "landing.html"; // Redirecting user to landing page after successful login.
          console.log("cookie on landing= " + document.cookie); // Logging cookies after redirection.
        }
      };
      xhr.send(jsonPayload); // Sending JSON data to server.
    } catch (err) {
      document.getElementById("loginResult").innerHTML = err.message; // Handling errors and displaying error message.
    }
  }
  

function saveCookie() {
  let minutes = 500;
  let date = new Date();
  date.setTime(date.getTime() + minutes * 60 * 1000);
  document.cookie =
    "FirstName=" +
    FirstName +
    ",LastName=" +
    LastName +
    ",UserID=" +
    UserID +
    ";expires=" +
    date.toGMTString();
  console.log("cookie= " + document.cookie);
}

function readCookie() {
  UserID = -1;
  let data = document.cookie;
  let splits = data.split(",");
  for (var i = 0; i < splits.length; i++) {
    let thisOne = splits[i].trim();
    let tokens = thisOne.split("=");
    if (tokens[0] == "FirstName") {
      FirstName = tokens[1];
    } else if (tokens[0] == "LastName") {
      LastName = tokens[1];
    } else if (tokens[0] == "UserID") {
      UserID = parseInt(tokens[1].trim());
    }
  }

  if (UserID < 0) {
    window.location.href = "index.html";
  } else {
    //document.getElementById("userName").innerHTML = "Logged in as " + FirstName + " " + LastName;
  }
}

function addUser() {
  //readCookie();
  UserID = sessionStorage.getItem("UserID");
  console.log("UserID in addUser:", UserID);
  let login = document.getElementById("userLogin").value; // Replace with actual login field
  let password = document.getElementById("userPassword").value; // Replace with actual password field
  let FirstName = document.getElementById("userFirst").value;
  let LastName = document.getElementById("userLast").value;
  let email = document.getElementById("userEmail").value;
  //document.getElementById("userAddResult").innerHTML = "";

  let tmp = {
    login: login,
    password: password,
    FirstName: FirstName,
    LastName: LastName,
    email: email,
    UserID: UserID,
  };
  let jsonPayload = JSON.stringify(tmp);
  console.log("jsonPayload= " + jsonPayload);

  let url = "http://" + urlBase + "/api/AddUser." + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = async function () {
      if (this.readyState == 4 && this.status == 200) {
        console.log("User has been added");
        //document.getElementById("userAddResult").innerHTML = "User has been added";
        alert("User has been added successfully");
        // You may need to update the following lines based on your application's needs
        const getUsersResult = await getUsers(""); // Adjust this line based on your retrieval method
        console.log(getUsersResult);
        loadUsers(6); // Adjust this line based on your display method
        window.location.reload();
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    console.log(err.message);
    document.getElementById("userAddResult").innerHTML = err.message;
  }
}

function doRegister() {
  generateHtmlContent();
  // reset required red borders
  document.getElementById("registerFirstName").className = "ele";
  document.getElementById("registerLastName").className = "ele";
  document.getElementById("registerLogin").className = "ele";
  document.getElementById("registerPassword").className = "ele";

  // collect values from form
  let FirstName = document.getElementById("registerFirstName").value;
  let LastName = document.getElementById("registerLastName").value;
  let login = document.getElementById("registerLogin").value;
  let password = document.getElementById("registerPassword").value;

  if (FirstName === "" || LastName === "" || login === "" || password === "") {
    document.getElementById("registerResult").innerHTML =
      "Please fill out all fields";
    return;
  }

  // create json payload
  let tmp = {
    login: login,
    password: password,
    FirstName: FirstName,
    LastName: LastName,
    email: "", // Add the email field if required
  };

  // resets fields
  UserID = 0;
  FirstName = "";
  LastName = "";
  document.getElementById("registerResult").innerHTML = "";

  let jsonPayload = JSON.stringify(tmp);
  console.log("jsonPayload= " + jsonPayload);

  let url = "http://" + urlBase + "/api/AddUser." + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let jsonObject = JSON.parse(xhr.responseText);
        UserID = jsonObject.UserID;

        if (UserID < 1) {
          let err = jsonObject.error;
          document.getElementById("registerResult").innerHTML = err;
          return;
        }

        window.location.reload();
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("registerResult").innerHTML = err.message;
  }
}

function openPopup(popupId) {
  document.getElementById(popupId).style.display = "flex";
}

function closePopup(popupId) {
  document.getElementById(popupId).style.display = "none";
}
