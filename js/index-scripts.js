const urlBase = "143.198.135.118";
const extension = "php";

let UserID = 0;
let FirstName = "";
let LastName = "";

async function doLogin() {
    UserID = 0;
    FirstName = "";
    LastName = "";

    let login = document.getElementById("loginName").value;
    let password = document.getElementById("loginPassword").value;

    document.getElementById("loginResult").innerHTML = "";

    let tmp = { login: login, password: password };
    let jsonPayload = JSON.stringify(tmp);

    let url = "http://" + urlBase + "/api/Login." + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = async function () {
            if (this.readyState == 4 && this.status == 200) {
                try {
                    let jsonObject = JSON.parse(xhr.responseText);
                    UserID = jsonObject.UserID;
                    FirstName = jsonObject.FirstName;
                    LastName = jsonObject.LastName;

                    sessionStorage.setItem("UserID", UserID);
                    sessionStorage.setItem("FirstName", FirstName);
                    sessionStorage.setItem("LastName", LastName);

                    if (UserID < 1) {
                        document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
                        return;
                    }

                    saveCookie();
                    const getContactsResult = await getContacts("");
                    console.log(getContactsResult);
                    window.location.href = "landing.html";
                    console.log("cookie on landing= " + document.cookie);
                } catch (error) {
                    console.error("Error parsing JSON:", error);
                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.error("XHR Error:", err);
        document.getElementById("loginResult").innerHTML = err.message;
    }
}

function saveCookie() {
    let minutes = 500;
    let date = new Date();
    date.setTime(date.getTime() + minutes * 60 * 1000);
    document.cookie =
        "FirstName=" +
        encodeURIComponent(FirstName) +
        ",LastName=" +
        encodeURIComponent(LastName) +
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
    for (let i = 0; i < splits.length; i++) {
        let thisOne = splits[i].trim();
        let tokens = thisOne.split("=");
        if (tokens[0] == "FirstName") {
            FirstName = decodeURIComponent(tokens[1]);
        } else if (tokens[0] == "LastName") {
            LastName = decodeURIComponent(tokens[1]);
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

document.addEventListener("DOMContentLoaded", function () {
    const root = document.getElementById('root');
    let isRegistering = false;

    const handleLogin = () => {
        console.log("Logging in...");
        doLogin();
    };

    const handleRegister = () => {
        console.log("Registering...");
    };

    const toggleRegister = () => {
        isRegistering = !isRegistering;
        renderPage();
    };

    const renderPage = () => {
        const containerContent = isRegistering ? getRegisterContainer() : getLoginContainer();
        root.innerHTML = containerContent;

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
                  <button id="registerButton" class="button">Register</button>
                  <p class="toggleText">Already have an account? <a id="loginLink" href="#">Login</a></p>
                </div>
              </div>
            </div>
          `;
    };

    renderPage();
});
