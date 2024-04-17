const urlBase = 'http://143.198.135.118/api';
const extension = 'php';

let UserID = 0;
let FirstName = "";
let LastName = "";


let EventID = 0;
let Name = "";
let Category = "";
let Description = "";
let Time = "";
let Date = "";
let Location = "";
let ContactPhone = "";
let Visibility = "";
let OrganizerID = 0;

function doLogin() {
	UserID = 0;
	FirstName = "";
	LastName = "";
	Role = "";

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


				Role = jsonObject.Role;
				// Redirect the user based on the role
				switch (Role) {
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
						console.error('Unexpected role:', Role);
						break;
				}
				saveCookie();


			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

// doRegister will register all as a student
function doRegister() {
	let FirstName = document.getElementById("registerFirstName").value;
	let LastName = document.getElementById("registerLastName").value;
	let login = document.getElementById("registerLogin").value;
	let password = document.getElementById("registerPassword").value;
	let Role = "Student";

	// var hash = md5(password);

	document.getElementById("registerResult").innerHTML = "";

	let userData = {
		FirstName: FirstName,
		LastName: LastName,
		login: login,
		password: password,
		Role: Role
	};

	let jsonPayload = JSON.stringify(userData);

	UserID = 0;
	FirstName = "";
	LastName = "";
	Role = "";

	

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

				document.getElementById("registerResult").innerHTML = "User registered successfully.";

				// Optionally, you can redirect the user to the login page after successful registration
				window.location.reload();
			}
		};
		xhr.send(jsonPayload);
	} catch (err) {
		document.getElementById("registerResult").innerHTML = err.message;
	}
}



function fetchEvents() {
	let EventID = 0;
    let tmp = { EventID: EventID };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/ListEvents.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let events = JSON.parse(xhr.responseText);
                displayEvents(events);
            }
        };
        xhr.send(jsonPayload);
    }
    catch (err) {
        console.error('Error fetching events:', err);
    }
}

function displayEvents(events) {
    const eventsContainer = document.getElementById('events-container');
    events.forEach(event => {
        const eventElement = createEventElement(event);
        eventsContainer.appendChild(eventElement);
    });
}

function createEventElement(event) {
    const eventElement = document.createElement('div');
    eventElement.classList.add('event');
    
    const nameElement = document.createElement('h3');
    nameElement.textContent = event.Name;
    eventElement.appendChild(nameElement);
    
    const categoryElement = document.createElement('p');
    categoryElement.textContent = `Category: ${event.Category}`;
    eventElement.appendChild(categoryElement);
    
    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = event.Description;
    eventElement.appendChild(descriptionElement);
    
    const timeElement = document.createElement('p');
    timeElement.textContent = `Time: ${event.Time}`;
    eventElement.appendChild(timeElement);
    
    const dateElement = document.createElement('p');
    dateElement.textContent = `Date: ${event.Date}`;
    eventElement.appendChild(dateElement);
    
    const locationElement = document.createElement('p');
    locationElement.textContent = `Location: ${event.Location}`;
    eventElement.appendChild(locationElement);
    
    const contactElement = document.createElement('p');
    contactElement.textContent = `Contact Phone: ${event.ContactPhone}`;
    eventElement.appendChild(contactElement);
    
    const visibilityElement = document.createElement('p');
    visibilityElement.textContent = `Visibility: ${event.Visibility}`;
    eventElement.appendChild(visibilityElement);
    
    return eventElement;
}

function submitUniversityForm() {
    let Name = document.getElementById("name").value;
    let Location = document.getElementById("location").value;
    let Description = document.getElementById("description").value;
    let NumberOfStudents = document.getElementById("numberOfStudents").value;
    // let Pictures = document.getElementById("pictures").files;

	let formData = {
		Name: Name,
		Location: Location,
		Description: Description,
		NumberOfStudents: NumberOfStudents,
		// Pictures: Pictures
	};

	let jsonPayload = JSON.stringify(formData);


    // let formData = new FormData();
    // formData.append("Name", name);
    // formData.append("Location", location);
    // formData.append("Description", description);
    // formData.append("NumberOfStudents", numberOfStudents);
    // for (let i = 0; i < pictures.length; i++) {
    //     formData.append("Pictures[]", pictures[i]);
    // }

    let xhr = new XMLHttpRequest();
	let url = urlBase + '/University.' + extension;
    // xhr.open("POST", url, true);
    // xhr.onreadystatechange = function () {
    //     if (xhr.readyState === 4 && xhr.status === 200) {
    //         let response = xhr.responseText;
    //         // Handle the response from the PHP file as needed
    //         console.log(response);
    //     }
    // };
    // xhr.send(formData);

	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {

				document.getElementById("createUniversityResult").innerHTML = "User registered successfully.";

				// Optionally, you can redirect the user to the login page after successful registration
				// window.location.reload();
			}
		};
		xhr.send(jsonPayload);
	} catch (err) {
		document.getElementById("createUniversityResult").innerHTML = err.message;
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

// function switchContent() {
//     var content1 = document.getElementById('loginForm');
//     var content2 = document.getElementById('registerForm');

//     if (content1.classList.contains('active')) {
//         content1.classList.remove('active');
//         content1.classList.add('inactive');
//         content2.classList.remove('inactive');
//         content2.classList.add('active');
//     } else {
//         content2.classList.remove('active');
//         content2.classList.add('inactive');
//         content1.classList.remove('inactive');
//         content1.classList.add('active');
//     }
// }