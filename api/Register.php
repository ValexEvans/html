<?php

    $inData = getRequestInfo();
    
    $FirstName = $inData["FirstName"];
    $LastName = $inData["LastName"];
    $Login = $inData["login"];
    $Password = $inData["password"];

    $conn = new mysqli("localhost", "PHPUSER", "Val21212@S1n2o3w4w", "DB01");   
    if ($conn->connect_error) {
        returnWithError($conn->connect_error);
    } else {
        $stmt = $conn->prepare("INSERT INTO User (FirstName, LastName, Login, Password) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $FirstName, $LastName, $Login, $Password);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            // Retrieve the UserID of the newly inserted user
            // $UserID = $stmt->insert_id;
			returnWithInfo($FirstName, $LastName, $stmt->insert_id);
        } else {
            returnWithError("0");
        }

        $stmt->close();
        $conn->close();
    }
    
    function getRequestInfo() {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson($obj) {
        header('Content-type: application/json');
        echo $obj;
    }
    
    function returnWithError($err) {
        $retValue = '{"UserID":0, "FirstName":"", "LastName":"", "error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }
    
    function returnWithInfo($info, $UserID) {
        $retValue = '{"UserID":' . $UserID . ', "info":"' . $info . '"}';
        sendResultInfoAsJson($retValue);
    }
    
?>

