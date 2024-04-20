<?php

$inData = getRequestInfo();

$UserID = 0;
$FirstName = "";
$LastName = "";
$Role = "";
$UniversityID = "";

$conn = new mysqli("localhost", "PHPUSER", "Val21212@S1n2o3w4w", "DB01"); 	
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    $stmt = $conn->prepare("SELECT UserID, FirstName, LastName, Role FROM User WHERE Login=? AND Password =?");
    $stmt->bind_param("ss", $inData["login"], $inData["password"]);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        $UserID = $row['UserID'];
        $FirstName = $row['FirstName'];
        $LastName = $row['LastName'];
        $Role = $row['Role'];

        // Check if the user is an admin or a student
        if ($Role == 'Admin') {
            $query = "SELECT UniversityID FROM Admin WHERE UserID=?";
        } elseif ($Role == 'Student') {
            $query = "SELECT UniversityID FROM Student WHERE UserID=?";
        } else {
            // Handle the case if the user is a SuperAdmin or any other role that doesn't have a UniversityID
            //returnWithError("Role does not require UniversityID");
            //exit();
        }
        
        if ($Role != 'SuperAdmin') {
        // Retrieve UniversityID based on user's role
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $UserID);
        $stmt->execute();
        $result = $stmt->get_result();

        $UniversityID = $row['UniversityID'];
        returnWithInfo($FirstName, $LastName, $UserID, $Role, $UniversityID);
        }

    } else {
        returnWithError("No Records Found");
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
    $retValue = '{"UserID":0,"FirstName":"","LastName":"","Role":"","UniversityID":0,"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($FirstName, $LastName, $UserID, $Role, $UniversityID)
{
    $retValue = '{"UserID":' . $UserID . ',"FirstName":"' . $FirstName . '","LastName":"' . $LastName . '","Role":"' . $Role . '","UniversityID":' . $UniversityID . ',"error":""}';
    sendResultInfoAsJson($retValue);
}

?>
