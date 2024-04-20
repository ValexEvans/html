function rsoRequest() {
	let rsoName = document.getElementById("rsoName").value;
	var storedUserID = localStorage.getItem("userID"); // Retrieve user ID from local storage
    let request = "1";

	let formData = {
		Name: rsoName,
		UserID: storedUserID,
        Request: request
	};

	document.getElementById("requestRso").innerHTML = storedUserID;

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



