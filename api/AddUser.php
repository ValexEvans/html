<?php

$inData = getRequestInfo();

$FirstName = $inData["FirstName"];
$LastName = $inData["LastName"];
$Login = $inData["login"];
$Password = $inData["password"];
$Role = $inData["Role"];

$conn = new mysqli("localhost", "PHPUSER", "Val21212@S1n2o3w4w", "DB01");
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    $stmt = $conn->prepare("INSERT INTO User (FirstName, LastName, Login, Password, Role) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $FirstName, $LastName, $Login, $Password, $Role);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        // Retrieve the UserID of the newly inserted user
        $userID = $stmt->insert_id;
        returnWithInfo("User registered successfully.", $userID);
    } else {
        returnWithError("Failed to register user.");
    }

    $stmt->close();
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
    $retValue = '{"UserID":0, "error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($info, $userID)
{
    $retValue = '{"UserID":' . $userID . ', "info":"' . $info . '"}';
    sendResultInfoAsJson($retValue);
}

?>
