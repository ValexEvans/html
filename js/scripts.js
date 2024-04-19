const urlBase = 'http://143.198.135.118/api';
const extension = 'php';

let UserID = 0;
let FirstName = "";
let LastName = "";


let EventID = 0;
let Category = "";
let Time = "";
let Date = "";
let Location = "";
let ContactPhone = "";
let Visibility = "";
let OrganizerID = 0;
let UniID = 0;


// doLogin will log in a student, admin, or super-admin
function doLogin() {
	// UserID = 0;
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
				var userID = jsonObject.UserID; // Assuming you have the user's ID
				var userRole = jsonObject.Role;
				localStorage.setItem("userID", userID); // Save user ID to local storage
				localStorage.setItem("userRole", userRole);

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
				// saveCookie();




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




function clearFormFields() {
	// for addEvent
	document.getElementById("eventName").value = "";
	document.getElementById("eventCategory").value = "";
	document.getElementById("eventDescription").value = "";
	document.getElementById("eventTime").value = "";
	document.getElementById("eventDate").value = "";
	document.getElementById("eventLocation").value = "";
	document.getElementById("eventPhone").value = "";
	document.getElementById("eventType").value = "";
	// for submitUniversityForm
	// document.getElementById("universityName").value = "";
	// document.getElementById("location").value = "";
	// document.getElementById("description").value = "";
	// document.getElementById("numberOfStudents").value = "";
}


function addEvent() {
	let storedUserID = localStorage.getItem("userRole").value;
	let eventName = document.getElementById('eventName').value;
	let eventCategory = document.getElementById('eventCategory').value;
	let eventDescription = document.getElementById('eventDescription').value;
	let eventTime = document.getElementById('eventTime').value;
	let eventDate = document.getElementById('eventDate').value;
	let eventLocation = document.getElementById('eventLocation').value;
	let eventPhone = document.getElementById('eventPhone').value;
	let eventType = document.getElementById('eventType').value;
	let eventUniversity = parseInt(document.getElementById('eventUniversity').value, 10);
	let request = true;

	let tmp =
	{
		event_name: eventName,
		category: eventCategory,
		description: eventDescription,
		time: eventTime,
		date: eventDate,
		location: eventLocation,
		contact_phone: eventPhone,
		event_type: eventType,
		university_id: eventUniversity,
		request: request
	};

	let jsonPayload = JSON.stringify(tmp);
	// document.getElementById("addEventTest").innerHTML = jsonPayload;

	let url = urlBase + '/AddEvent.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				document.getElementById("addEventReval").innerHTML = "Added events successfully";
			}
		};
		xhr.send(jsonPayload);
		
	}
	catch (err) {
		// console.error('Error adding events:', err);
		document.getElementById("addEventReval").innerHTML = "Error adding events";
	}

	setTimeout(function() {
		window.location.reload();
		clearFormFields();
	}, 1000); // 1000 milliseconds = 1 second
	
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
	// if (event.Request != 1) {
	//     return null;
	// }


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

	const eventTypeElement = document.createElement('p');
	eventTypeElement.textContent = `EventType: ${event.EventType}`;
	eventElement.appendChild(eventTypeElement);

	const requestElement = document.createElement('p');
	requestElement.textContent = `Request: ${event.Request}`;
	eventElement.appendChild(requestElement);

	// const organizerIdElement = document.createElement('p');
	// organizerIdElement.textContent = `OrganizerID: ${event.OrganizerID}`;
	// eventElement.appendChild(organizerIdElement);

	return eventElement;
}






function submitUniversityForm() {
	let UniversityName = document.getElementById("universityName").value;
	let Location = document.getElementById("location").value;
	let Description = document.getElementById("description").value;
	let NumberOfStudents = document.getElementById("numberOfStudents").value;
	// let Pictures = document.getElementById("pictures").files;

	let formData = {
		Name: UniversityName,
		Location: Location,
		Description: Description,
		NumberOfStudents: NumberOfStudents
	};

	let jsonPayload = JSON.stringify(formData);
	document.getElementById("jsonPayload").innerText = jsonPayload;
	document.getElementById("createUniversityResult").innerHTML = "";

	// for (let i = 0; i < pictures.length; i++) {
	//     formData.append("Pictures[]", pictures[i]);
	// }

	let xhr = new XMLHttpRequest();
	let url = urlBase + '/University.' + extension;

	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {

				document.getElementById("createUniversityResult").innerHTML = "University added successfully";

				// Optionally, you can redirect the user to the login page after successful registration
				window.location.reload();
				clearFormFields();
			}
		};
		xhr.send(jsonPayload);
	} catch (err) {
		document.getElementById("createUniversityResult").innerHTML = err.message;
	}
}


// function submitStudentForm() {
// 	let firstName = document.getElementById("firstName").value;
// 	let lastName = document.getElementById("lastName").value;
// 	let login = document.getElementById("login").value;
// 	let password = document.getElementById("password").value;
// 	let universityName = document.getElementById("universityName").value;
// 	let userRole = "Student";

// 	let formData = {
// 		FirstName: firstName,
// 		LastName: lastName,
// 		Login: login,
// 		Password: password,
// 		Role: userRole,
// 		UniversityName: universityName
// 	};

// 	firstName = "";
// 	lastName = "";
// 	login = "";
// 	password = "";
// 	universityName = "";
// 	userRole = "";

// 	let jsonPayload = JSON.stringify(formData);
// 	document.getElementById("addUserResult").innerHTML = "";

// 	let xhr = new XMLHttpRequest();
// 	let url = urlBase + '/StudentRegister.' + extension;

// 	xhr.open("POST", url, true);
// 	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
// 	try {
// 		xhr.onreadystatechange = function () {
// 			if (this.readyState == 4 && this.status == 200) {

// 				document.getElementById("addUserResult").innerHTML = "Student added successfully";

// 			}
// 		};
// 		xhr.send(jsonPayload);
// 	} catch (err) {
// 		document.getElementById("addUserResult").innerHTML = err.message;
// 	}

// }

// function submitAdminForm() {
// 	let firstName = document.getElementById("firstName").value;
// 	let lastName = document.getElementById("lastName").value;
// 	let login = document.getElementById("login").value;
// 	let password = document.getElementById("password").value;
// 	let universityName = document.getElementById("universityName").value;
// 	let userRole = "Admin";

// 	let formData = {
// 		FirstName: firstName,
// 		LastName: lastName,
// 		Login: login,
// 		Password: password,
// 		Role: userRole,
// 		UniversityName: universityName
// 	};


// 	let jsonPayload = JSON.stringify(formData);
// 	document.getElementById("addUserResult").innerHTML = "";

// 	let xhr = new XMLHttpRequest();
// 	let url = urlBase + '/AdminRegister.' + extension;

// 	xhr.open("POST", url, true);
// 	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
// 	try {
// 		xhr.onreadystatechange = function () {
// 			if (this.readyState == 4 && this.status == 200) {

// 				document.getElementById("addUserResult").innerHTML = "Admin added successfully";

// 				// Optionally, you can redirect the user to the login page after successful registration
// 				// window.location.reload();
// 			}
// 		};
// 		xhr.send(jsonPayload);
// 	} catch (err) {
// 		document.getElementById("addUserResult").innerHTML = err.message;
// 	}

// 	firstName = "";
// 	lastName = "";
// 	login = "";
// 	password = "";
// 	universityName = "";
// 	userRole = "";
// }

function clearSubmitFormFields() {
	document.getElementById("userFirstName").value = "";
	document.getElementById("userLastName").value = "";
	document.getElementById("userLogin").value = "";
	document.getElementById("userPassword").value = "";
	document.getElementById("universityName").value = "";
}

function submitForm(userRole) {
	let userFirstName = document.getElementById("userFirstName").value;
	let userLastName = document.getElementById("userLastName").value;
	let userLogin = document.getElementById("userLogin").value;
	let userPassword = document.getElementById("userPassword").value;
	let userUniversityName = document.getElementById("userUniversityName").value;

	let formData = {
		FirstName: userFirstName,
		LastName: userLastName,
		Login: userLogin,
		Password: userPassword,
		Role: userRole,
		UniversityName: userUniversityName
	};

	let jsonPayload = JSON.stringify(formData);
	// document.getElementById("jsonPayload").innerHTML = userFirstName+userLastName+userLogin+userPassword+userRole+userUniversityName;
	document.getElementById("addUserResult").innerHTML = "";

	let xhr = new XMLHttpRequest();
	let url = "";

	if (userRole === "Student") {
		url = urlBase + '/StudentRegister.' + extension;
	} else if (userRole === "Admin") {
		url = urlBase + '/AdminRegister.' + extension;
	}

	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	xhr.onreadystatechange = function () {
		if (this.readyState == 4) {
			if (this.status == 200) {
				// Check if the response indicates success
				let response = JSON.parse(xhr.responseText);
				if (response.success) {
					// Data added successfully
					// document.getElementById("addUserResult").innerHTML = userRole + " added successfully";
					clearSubmitFormFields();
				} else {
					// Error occurred on the server side
					//document.getElementById("addUserResult").innerHTML = "Error: " + response.message;
				}
			} else {
				// Error occurred in the request itself
				//document.getElementById("addUserResult").innerHTML = "Error: " + xhr.statusText;
			}
			document.getElementById("addUserResult").innerHTML = userRole + " added successfully";
		}
	};

	xhr.send(jsonPayload);
}

function addRSO() {
	let rsoName = document.getElementById("rsoName").value;
	var storedUserID = localStorage.getItem("userID"); // Retrieve user ID from local storage

	let formData = {
		Name: rsoName,
		UserID: storedUserID
	};

	document.getElementById("RsoReval").innerHTML = storedUserID;

	let jsonPayload = JSON.stringify(formData);
	let xhr = new XMLHttpRequest();
	let url = urlBase + '/AddRSO.' + extension;

	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	xhr.onload = function () {
		if (xhr.status >= 200 && xhr.status < 300) {
			// Request was successful
			document.getElementById("addRsoResult").textContent = "RSO added successfully";
		} else {
			// Request failed
			document.getElementById("addRsoResult").textContent = "Failed to add RSO. Please try again later.";
		}
	};

	xhr.onerror = function () {
		// Network error
		document.getElementById("addRsoResult").textContent = "Network error occurred. Please try again later.";
	};

	try {
		xhr.send(jsonPayload);
	} catch (err) {
		// Exception occurred
		document.getElementById("addRsoResult").textContent = "An error occurred. Please try again later.";
	}
}

function joinRSO(RSOID) {
	let storedUserID = String(localStorage.getItem("userID")); // Retrieve user ID from local storage
	let rsoID = String(RSOID); // Convert RSOID to string

	let formData = {
		UserID: storedUserID,
		RsoID: rsoID
	};

	let jsonPayload = JSON.stringify(formData);

	storedUserID = "";
	rsoID = "";

	let url = urlBase + '/RegisterIntoRSO.' + extension;
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {

				let jsonObject = JSON.parse(xhr.responseText);
				let joinRSOInfo = jsonObject.info;

				document.getElementById("joinRSOResult").innerHTML = joinRSOInfo;
			}
		};
		document.getElementById("testJoinRSO").innerHTML = jsonPayload;
		xhr.send(jsonPayload);
	} catch (err) {
		document.getElementById("joinRSOResult").innerHTML = err.message;
	}

}



// function joinRSO(RSOID) {
// 	var storedUserID = localStorage.getItem("userID"); // Retrieve user ID from local storage
//     let url = urlBase + '/JoinRSO.' + extension;
//     let xhr = new XMLHttpRequest();

//     xhr.open("POST", url, true);
//     xhr.setRequestHeader("Content-Type", "application/json");

//     xhr.onreadystatechange = function () {
//         if (this.readyState == 4 && this.status == 200) {
//             let response = JSON.parse(xhr.responseText);
//             // Handle response as needed
//         }
//     };
// 	let formData = {
// 		UserID: storedUserID,
// 		RSOID: RSOID
// 	};
// 	let jsonPayload = JSON.stringify(formData);
// 	document.getElementById("testJoinRSO").innerHTML = storedUserID + "," +RSOID;


//     xhr.send(jsonPayload);
// }

function RsoFormSelection() {
    let url = urlBase + '/ListRSO.' + extension;
    let xhr = new XMLHttpRequest();

    xhr.open("GET", url, true);

    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(xhr.responseText);
            let selectOptions = '<option value="">Select RSO</option>'; // Default option
            let html = '<table>'; // Start HTML table

            // Iterate through each RSO object in the response
            response.forEach(function (rso) {
                // Append HTML row for each RSO name
                html += '<tr><td>' + rso.Name + '</td><td><button onclick="joinRSO(' + rso.RSOID + ')">Join</button></td></tr>';

                // Add option for select element
                selectOptions += '<option value="' + rso.Name + '">' + rso.Name + '</option>';
            });

            html += '</table>'; // End HTML table

            // Update the HTML element with the generated HTML rows
            document.getElementById("rsoSelectionList").innerHTML = html;

            // Update the select element with options
            document.getElementById("rsoSelectionList").innerHTML = selectOptions;
        }
    };

    xhr.send();
}



function listRSO() {
	// let RsoName = document.getElementById("RsoName").value;

	let url = urlBase + '/ListRSO.' + extension;

	let xhr = new XMLHttpRequest();

	xhr.open("GET", url, true);

	xhr.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			let response = JSON.parse(xhr.responseText);
			let html = '<table>'; // Start HTML table

			// Iterate through each RSO object in the response
			response.forEach(function (rso) {
				// Append HTML row for each RSO name
				html += '<tr><td>' + rso.Name + '</td><td><button onclick="joinRSO(' + rso.RSOID + ')">Join</button></td></tr>';
			});

			html += '</table>'; // End HTML table

			// Update the HTML element with the generated HTML rows
			document.getElementById("listRsoResult").innerHTML = html;

			// Optionally, you can redirect the user to the login page after successful registration
			// window.location.reload();
		}
	};

	xhr.send();
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


function showContent(contentId, event) {
	event.preventDefault(); // Prevent default behavior of anchor tag
	const features = document.querySelectorAll('.feature');
	features.forEach(feature => {
		if (feature.id === contentId) {
			feature.style.display = 'block';
		} else {
			feature.style.display = 'none';
		}
	});
}

document.addEventListener("DOMContentLoaded", function () {
	fetchEvents();
});
