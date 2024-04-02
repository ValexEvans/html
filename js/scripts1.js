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
              <input id="loginName" class="input" type="password" placeholder="Password">
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
  generateHtmlContent();

  UserID = 0;
  FirstName = "";
  LastName = "";

  let login = document.getElementById("loginName").value;
  let password = document.getElementById("loginPassword").value;
  console.log("user/pass= " + login);
  console.log(password);
  //	var hash = md5( password );

  document.getElementById("loginResult").innerHTML = "";

  let tmp = { login: login, password: password };
  //	var tmp = {login:login,password:hash};
  let jsonPayload = JSON.stringify(tmp);
  console.log("jsonPayload= " + jsonPayload);

  let url = "http://" + urlBase + "/api/Login." + extension;
  //let url = '/var/www/html/LAMPAPI/Login.' + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = async function () {
      if (this.readyState == 4 && this.status == 200) {
        let jsonObject = JSON.parse(xhr.responseText);
        UserID = jsonObject.id;
        userFirstName = jsonObject.FirstName;
        userLastName = jsonObject.LastName;
        sessionStorage.setItem("UserID", UserID);
        sessionStorage.setItem("userFirstName", userFirstName);
        sessionStorage.setItem("userLastName", userLastName);

        if (UserID < 1) {
          document.getElementById("loginResult").innerHTML =
            "User/Password combination incorrect";
          return;
        }

        saveCookie();
        const getContactsResult = await getContacts("");
        console.log(getContactsResult);
        //let contacts = JSON.stringify(contactList);
        //sessionStorage.setItem('contactList', contacts);
        window.location.href = "landing.html";
        console.log("cookie on landing= " + document.cookie);
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("loginResult").innerHTML = err.message;
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
