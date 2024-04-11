const urlBase = 'http://143.198.135.118/api';
const extension = 'php';

let UserID = 0;
let FirstName = "";
let LastName = "";

// Function to call the PHP script and handle the response
function checkUserRole() {
    // URL of the PHP script
    const url = 'http://143.198.135.118/UserRole.php';

    // Data to send in the POST request
    const data = {
        UserID: UserID
    };

    // Options for the fetch request
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    // Make the fetch request
    fetch(url, options)
    .then(response => response.json())
    .then(data => {
        // Check the role received from the PHP script
        const role = data.role;
        // Redirect the user based on the role
        switch (role) {
            case 'Student':
                window.location.href = 'student_landing_page.html';
                break;
            case 'Admin':
                window.location.href = 'admin_landing_page.html';
                break;
            case 'SuperAdmin':
                window.location.href = 'superadmin_landing_page.html';
                break;
            default:
                // Handle any unexpected response
                console.error('Unexpected role:', role);
                break;
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}




function checkUserRole(UserID) {

	let tmp = { login: login, password: password };
	//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);
				UserID = jsonObject.UserID;

				if (UserID < 1) {
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}

				FirstName = jsonObject.FirstName;
				LastName = jsonObject.LastName;

				saveCookie();
				checkUserRole();
				
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("loginResult").innerHTML = err.message;
	}

}







function doLogin() {
	UserID = 0;
	FirstName = "";
	LastName = "";

	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
	//	var hash = md5( password );

	document.getElementById("loginResult").innerHTML = "";

	let tmp = { login: login, password: password };
	//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);
				UserID = jsonObject.UserID;

				if (UserID < 1) {
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}

				FirstName = jsonObject.FirstName;
				LastName = jsonObject.LastName;

				checkUserRole(UserID);

				saveCookie();
				
				
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("loginResult").innerHTML = err.message;
	}

}


function doRegister() {
	let firstName = document.getElementById("registerFirstName").value;
	let lastName = document.getElementById("registerLastName").value;
	let login = document.getElementById("registerLogin").value;
	let password = document.getElementById("registerPassword").value;
	// var hash = md5(password);

	document.getElementById("registerResult").innerHTML = "";

	let userData = {
		FirstName: firstName,
		LastName: lastName,
		login: login,
		password: password
	};

	UserID = 0;
	firstName = "";
	fastName = "";

	let jsonPayload = JSON.stringify(userData);

	let url = urlBase + '/Register.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);
				UserID = jsonObject.UserID;

				if (UserID < 1) {
					document.getElementById("registerResult").innerHTML = "Failed to register user.";
					return;
				}

				// document.getElementById("registerResult").innerHTML = "User registered successfully.";

				// Optionally, you can redirect the user to the login page after successful registration
				window.location.reload();
			}
		};
		xhr.send(jsonPayload);
	} catch (err) {
		document.getElementById("registerResult").innerHTML = err.message;
	}
}


function saveCookie() {
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime() + (minutes * 60 * 1000));
	document.cookie = "FirstName=" + FirstName + ",LastName=" + LastName + ",UserID=" + UserID + ";expires=" + date.toGMTString();
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
		}
		else if (tokens[0] == "LastName") {
			LastName = tokens[1];
		}
		else if (tokens[0] == "UserID") {
			UserID = parseInt(tokens[1].trim());
		}
	}

	if (UserID < 0) {
		window.location.href = "index.html";
	}
	else {
		document.getElementById("userName").innerHTML = "Logged in as " + FirstName + " " + LastName;
	}
}

function doLogout() {
	UserID = 0;
	FirstName = "";
	LastName = "";
	document.cookie = "FirstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

