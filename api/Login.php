<?php
	// Function to get request information from JSON input
	function getRequestInfo() {
		return json_decode(file_get_contents('php://input'), true);
	}

	// Function to send JSON response
	function sendResultInfoAsJson($obj) {
		header('Content-type: application/json');
		echo json_encode($obj);
	}

	// Function to return error response
	function returnWithError($err) {
		sendResultInfoAsJson(array("error" => $err));
	}

	// Function to return success response
	function returnWithInfo($userID, $firstName, $lastName, $roleType) {
		sendResultInfoAsJson(array(
			"UserID" => $userID,
			"FirstName" => $firstName,
			"LastName" => $lastName,
			"RoleType" => $roleType,
			"error" => ""
		));
	}

	// Establishing connection to the database
	$conn = new mysqli("localhost", "PHPUSER", "Val21212@S1n2o3w4w", "DB01"); 	
	if ($conn->connect_error) {
		returnWithError($conn->connect_error);
	} else {
		// Retrieving login credentials from request
		$inData = getRequestInfo();
		$login = $inData["login"];
		$password = $inData["password"];

		// Prepare and execute SQL query to retrieve user information
		$stmt = $conn->prepare("SELECT UserID, FirstName, LastName, RoleType FROM user WHERE Login=? AND Password =?");
		$stmt->bind_param("ss", $login, $password);
		$stmt->execute();
		$result = $stmt->get_result();

		// Check if user exists
		if ($row = $result->fetch_assoc()) {
			returnWithInfo($row['UserID'], $row['FirstName'], $row['LastName'], $row['RoleType']);
		} else {
			returnWithError("No Records Found");
		}

		$stmt->close();
		$conn->close();
	}
?>
