const urlBase = 'http://143.198.135.118/api';
const extension = 'php';

function joinRSO(RSOID) {
	let storedUserID = String(localStorage.getItem("userID")); // Retrieve user ID from local storage
	let rsoID = String(RSOID); // Convert RSOID to string
	let request = "1"; // it is a request

	let formData = {
		UserID: storedUserID,
		RsoID: rsoID,
		Request: request
	};



	let jsonPayload = JSON.stringify(formData);
	document.getElementById("youKnow").innerText = jsonPayload;
	document.getElementById("createUniversityResult").innerHTML = "";


	let xhr = new XMLHttpRequest();
	let url = urlBase + '/RegisterRSO.' + extension;

	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {

				document.getElementById("joinRSOResult").innerHTML = "Joined successfully";

				// Optionally, you can redirect the user to the login page after successful registration
				//window.location.reload();
				//clearFormFields();
			}
		};
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

