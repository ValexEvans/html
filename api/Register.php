<?php

$inData = getRequestInfo();

$login = $inData["login"];
$password = $inData["password"];
$FirstName = $inData["FirstName"];
$LastName = $inData["LastName"];
$email = $inData["email"]; // Added email field

$conn = new mysqli("localhost", "PHPUSER", "Val21212@S1n2o3w4w", "DB01"); 	
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    // Check if the login or email already exists
    $stmt = $conn->prepare("SELECT * FROM User WHERE Login = ? OR Email = ?");
    $stmt->bind_param("ss", $login, $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        returnWithError("This login or email is already taken");
        $stmt->close();
    } else {
        // Insert new user
        $stmt = $conn->prepare("INSERT INTO User (Login, Password, FirstName, LastName, Email) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("sssss", $login, $password, $FirstName, $LastName, $email);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            $insertedUserID = $stmt->insert_id;
            returnWithInfo($FirstName, $LastName, $email, $insertedUserID);
        } else {
            returnWithError("Error in registering user");
        }

        $stmt->close();
    }

    $conn->close();
}

function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj)
{
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError($err)
{
    $retValue = '{"UserID":0, "FirstName":"", "LastName":"", "email":"", "error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($FirstName, $LastName, $email, $UserID)
{
    $retValue = '{"UserID":' . $UserID . ', "FirstName":"' . $FirstName . '", "LastName":"' . $LastName . '", "email":"' . $email . '", "error":""}';
    sendResultInfoAsJson($retValue);
}
?>
