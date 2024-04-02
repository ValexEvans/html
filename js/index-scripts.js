const urlBase = "143.198.135.118";
const extension = "php";

function doLogin() {
    const userData = {
        UserID: 0,
        FirstName: "",
        LastName: ""
    };

    const login = document.getElementById("loginName").value;
    const password = document.getElementById("loginPassword").value;

    document.getElementById("loginResult").innerHTML = "";

    const jsonPayload = JSON.stringify({ login, password });

    const url = `${urlBase}/api/Login.${extension}`;

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onload = async function () {
        if (this.readyState == 4 && this.status == 200) {
            const jsonObject = JSON.parse(xhr.responseText);
            userData.UserID = jsonObject.UserID;
            userData.FirstName = jsonObject.FirstName;
            userData.LastName = jsonObject.LastName;

            if (userData.UserID < 1) {
                document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
                return;
            }

            saveUserData(userData);
            const getContactsResult = await getContacts("");
            console.log(getContactsResult);
            window.location.href = "landing.html";
        } else {
            document.getElementById("loginResult").innerHTML = "Error occurred while logging in.";
        }
    };

    xhr.onerror = function () {
        document.getElementById("loginResult").innerHTML = "Error occurred while logging in.";
    };

    xhr.send(jsonPayload);
}

function saveUserData(userData) {
    const minutes = 500;
    const date = new Date();
    date.setTime(date.getTime() + minutes * 60 * 1000);
    document.cookie =
        `FirstName=${userData.FirstName}; LastName=${userData.LastName}; UserID=${userData.UserID}; expires=${date.toGMTString()}`;
    console.log("Cookie saved:", document.cookie);
}

function readCookie() {
    let UserID = -1;
    const data = document.cookie;
    const splits = data.split("; ");
    let userData = {};

    for (let i = 0; i < splits.length; i++) {
        const thisOne = splits[i].trim();
        const tokens = thisOne.split("=");
        if (tokens[0] === "FirstName") {
            userData.FirstName = tokens[1];
        } else if (tokens[0] === "LastName") {
            userData.LastName = tokens[1];
        } else if (tokens[0] === "UserID") {
            userData.UserID = parseInt(tokens[1].trim());
        }
    }

    if (userData.UserID < 0) {
        window.location.href = "index.html";
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const root = document.getElementById('root');
    let isRegistering = false;

    const toggleRegister = () => {
        isRegistering = !isRegistering;
        renderPage();
    };

    const renderPage = () => {
        const containerContent = isRegistering ? getRegisterContainer() : getLoginContainer();
        root.innerHTML = containerContent;

        const registerButton = document.getElementById('registerButton');
        const loginLink = document.getElementById('loginLink');
        if (isRegistering) {
            registerButton.addEventListener('click', handleRegister);
            loginLink.addEventListener('click', toggleRegister);
        } else {
            registerButton.addEventListener('click', doLogin);
            loginLink.addEventListener('click', toggleRegister);
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
