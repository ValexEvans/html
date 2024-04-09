<?php

$inData = getRequestInfo();

$searchTerm = $inData["searchTerm"];

$conn = new mysqli("localhost", "PHPUSER", "Val21212@S1n2o3w4w", "DB01");
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    // Search for users whose first name, last name, or login match the search term
    $stmt = $conn->prepare("SELECT * FROM User WHERE FirstName LIKE ? OR LastName LIKE ? OR Login LIKE ?");
    $searchTerm = "%" . $searchTerm . "%";
    $stmt->bind_param("sss", $searchTerm, $searchTerm, $searchTerm);
    $stmt->execute();

    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $users = array();
        while ($row = $result->fetch_assoc()) {
            $users[] = $row;
        }
        returnWithInfo($users);
    } else {
        returnWithError("No users found.");
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
    echo json_encode($obj);
}

function returnWithError($err)
{
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($info)
{
    sendResultInfoAsJson($info);
}

?>
