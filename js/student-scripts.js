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
	document.getElementById("jsonPayload").innerText = jsonPayload;
	document.getElementById("createUniversityResult").innerHTML = "";

	// for (let i = 0; i < pictures.length; i++) {
	//     formData.append("Pictures[]", pictures[i]);
	// }

	let xhr = new XMLHttpRequest();
	let url = urlBase + '/RegisterIntoRSO.' + extension;

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



function listRsoSelect() {
    let url = urlBase + '/ListRSO.' + extension;
    let xhr = new XMLHttpRequest();

    xhr.open("GET", url, true);

    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(xhr.responseText);
            let selectOptions = '<option value="">Select RSO</option>'; // Default option


            // Iterate through each RSO object in the response
            response.forEach(function (rso) {
               
                // Add option for select element
                selectOptions += '<option value="' + rso.Name + '" variable="' + rso.RSOID +  '">' + rso.Name + '</option>';
            });





            // Update the select element with options
            document.getElementById("rsoSelectionList").innerHTML = selectOptions;
        }
    };

    xhr.send();
}