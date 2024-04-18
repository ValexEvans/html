<?php

$inData = getRequestInfo();

$FirstName = $inData["FirstName"];
$LastName = $inData["LastName"];
$Login = $inData["Login"];
$Password = $inData["Password"];
$Role = $inData["Role"];
$Name = $inData["UniversityName"];

$conn = new mysqli("localhost", "PHPUSER", "Val21212@S1n2o3w4w", "DB01");

if ($conn->connect_error) {
    returnWithError("Connection failed: " . $conn->connect_error);
} else {
    // Check if all required fields are provided
    if (empty($FirstName) || empty($LastName) || empty($Login) || empty($Password) || empty($Role) || empty($Name)) {
        returnWithError("All fields are required.");
    } else {
        // Check if the university exists
        $UniversityID = getUniversityID($conn, $Name);
        if ($UniversityID == null) {
            returnWithError("University not found.");
        } else {
            // Insert user into User table
            $UserID = insertUser($conn, $FirstName, $LastName, $Login, $Password, $Role);

            if ($UserID === false) {
                returnWithError("Failed to insert user.");
            } else {
                // Associate user as a student with the specified university
                if (insertStudent($conn, $UserID, $UniversityID)) {
                    returnWithInfo("User added to the university successfully.");
                } else {
                    returnWithError("Failed to associate user with the university.");
                }
            }
        }
    }
}

function getRequestInfo() {
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj) {
    header('Content-type: application/json');
    echo $obj;
}

function insertUser($conn, $FirstName, $LastName, $Login, $Password, $Role) {
    $stmt = $conn->prepare("INSERT INTO User (FirstName, LastName, Login, Password, Role) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $FirstName, $LastName, $Login, $Password, $Role);
    $success = $stmt->execute();
    $UserID = ($success) ? $stmt->insert_id : false;
    $stmt->close();
    return $UserID;
}

function insertStudent($conn, $UserID, $UniversityID) {
    $stmt = $conn->prepare("INSERT INTO Student (UserID, UniversityID) VALUES (?, ?)");
    $stmt->bind_param("ii", $UserID, $UniversityID);
    $success = $stmt->execute();
    $stmt->close();
    return $success;
}

function getUniversityID($conn, $Name) {
    $stmt = $conn->prepare("SELECT UniversityID FROM University WHERE Name = ?");
    $stmt->bind_param("s", $Name);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        return $row["UniversityID"];
    } else {
        return null;
    }
}

function returnWithError($err) {
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($info) {
    $retValue = '{"info":"' . $info . '"}';
    sendResultInfoAsJson($retValue);
}

?>
