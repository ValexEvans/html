<?php

$inData = getRequestInfo();

$inData = getRequestInfo();



$UserID = 0;
$RSOID = 0;


$conn = new mysqli("localhost", "PHPUSER", "Val21212@S1n2o3w4w", "DB01");
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {

    $UserID = $inData["UserID"];
    $RSOID = $inData["RsoID"];

    $stmt = $conn->prepare("INSERT INTO Events (Name, Category, Description, Time, Date, Location, ContactPhone, EventType, OrganizerID, Request) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssssssssi", $EventName, $Category, $Description, $Time, $Date, $Location, $ContactPhone, $EventType, $OrganizerID, $Request);
    $stmt->execute();

    // Get the EventID of the newly added event
    $EventID = $stmt->insert_id;



    // Depending on EventType, insert into respective table
    switch ($EventType) {
        case 'Public':
            $SuperAdminID = $OrganizerID;
            $stmt = $conn->prepare("INSERT INTO Public_Events (EventID, SuperAdminID, UniversityID) VALUES (?, ?, ?)");
            $stmt->bind_param("iii", $EventID, $SuperAdminID, $UniversityID);
            $stmt->execute();
            break;
        case 'Private':
            $AdminID = $OrganizerID;
            $stmt = $conn->prepare("INSERT INTO Private_Events (EventID, AdminID, UniversityID) VALUES (?, ?, ?)");
            $stmt->bind_param("iii", $EventID, $AdminID, $UniversityID);
            $stmt->execute();
            break;
        case 'RSO':
            $AdminID = $OrganizerID;
            $stmt = $conn->prepare("INSERT INTO RSO_Events (EventID, AdminID, UniversityID) VALUES (?, ?, ?)");
            $stmt->bind_param("iii", $EventID, $AdminID, $UniversityID);
            $stmt->execute();
            break;
        default:
            echo "Invalid EventType";
    }

    // Execute the respective SQL statement
    if ($stmt->affected_rows > 0) {
        returnWithInfo("Event added successfully", $EventID);
    } else {
        returnWithError($conn->error);
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
    $retValue = array("error" => $err);
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($info, $eventID)
{
    $retValue = array("info" => $info, "EventID" => $eventID);
    sendResultInfoAsJson($retValue);
}

?>
