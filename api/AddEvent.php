<?php

$inData = getRequestInfo();

$OrganizerID = 0;
$EventID = 0;
$EventName = "";
$Category = "";
$Description = "";
$Time = "";
$Date = "";
$Location = "";
$ContactPhone = "";
$EventType = "";
$UniversityID = 0;

$conn = new mysqli("localhost", "PHPUSER", "Val21212@S1n2o3w4w", "DB01");
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {

    $OrganizerID = $inData["organizer_id"];
    $EventName = $inData["event_name"];
    $Category = $inData["category"];
    $Description = $inData["description"];
    $Time = $inData["time"];
    $Date = $inData["date"];
    $Location = $inData["location"];
    $ContactPhone = $inData["contact_phone"];
    $EventType = $inData["event_type"];
    $UniversityID = $inData["university_id"];

    $stmt = $conn->prepare("INSERT INTO Events (Name, Category, Description, Time, Date, Location, ContactPhone, EventType, OrganizerID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssssssi", $EventName, $Category, $Description, $Time, $Date, $Location, $ContactPhone, $EventType, $OrganizerID);
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
