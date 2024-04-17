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
    returnWithError($conn->connect_error);
} else {
    // Check if the university exists
    $UniversityID = getUniversityID($conn, $Name);
    if ($UniversityID == null) {
        returnWithError("University not found.");
    } else {
        // Insert admin user into User table with 'Admin' role
        $UserID = insertUser($conn, $FirstName, $LastName, $Login, $Password, $Role);

        // Associate user as an admin with the specified university
        insertAdmin($conn, $UserID, $UniversityID);

        returnWithInfo("Admin added to the university successfully.");
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
    $stmt->execute();

    // Retrieve the UserID of the newly inserted user
    $UserID = $stmt->insert_id;
    $stmt->close();

    return $UserID;
}

function insertAdmin($conn, $UserID, $UniversityID) {
    $stmt = $conn->prepare("INSERT INTO Admin (UserID, UniversityID) VALUES (?, ?)");
    $stmt->bind_param("ii", $UserID, $UniversityID);
    $stmt->execute();
    $stmt->close();
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
