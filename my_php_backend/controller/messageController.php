<?php
include_once "../dao/daoMessage.php";
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_GET['action'])) {
        $action = $_GET['action'];
        $dbh = new DaoMessage();
        switch ($action) {
            case 'insertMessage': {
                    if (isset($_POST['userId'], $_POST['groupId'], $_POST['message'])) {
                        $userId = $_POST['userId'];
                        $groupId = $_POST['groupId'];
                        $message = $_POST['message'];
                        $numberOfMessages = $dbh->numberOfMessages();
                        $state= $dbh->insertNewMessage($numberOfMessages +1,$userId,$groupId,$message,null,null);
                        if ($state) {
                            header('Content-Type: application/json');
                            echo json_encode([
                                'status' => 'success',
                                'message'=>'message inserted'
                            ]);
                           
                        } else {
                            header('Content-Type: application/json');
                            echo json_encode([
                                'status' => 'error',
                                'message' =>'message not inserted'
                            ]);
                    
                        }
                    }else{
                        header('Content-Type: application/json');
                        echo json_encode([
                            'status' => 'error',
                            'message' => 'message not inserted'
                        ]);
                    }
                    break;
                }
            case 'sendFile': {
                   if (isset($_POST['userId'], $_POST['groupId'], $_FILES['file'])) {
                        $userId = $_POST['userId'];
                        $groupId = $_POST['groupId'];
                        $file = $_FILES['file'];
                        $fileName = $file['name'];
                        $fileType = $file['type'];
                        $fileSize = $file['size'];
                        $fileTmpName = $file['tmp_name'];
                        $targetDir = "C:\\xampp\\htdocs\\images\\";
                        $targetFile = $targetDir . basename($fileName);
                        move_uploaded_file($fileTmpName, $targetFile);
                        $imagePath = "images\\" .$fileName;
                        $numberOfMessages = $dbh->numberOfMessages();
                        $state = $dbh->insertNewMessage((int)$numberOfMessages + 1,(int)$userId,(int)$groupId, null, $fileType, $imagePath);
                        if ($state) {
                            header('Content-Type: application/json');
                            echo json_encode([
                                'status' => 'success',
                                'message' => 'file inserted'
                            ]);
                        } else {
                            header('Content-Type: application/json');
                            echo json_encode([
                                'status' => 'error',
                                'message' => 'file not inserted'
                            ]);
                        }
                    } else {
                        header('Content-Type: application/json');
                        echo json_encode([
                            'status' => 'error',
                            'message' => 'file not inserted2'
                        ]);
                    }
                    break;
                }
              case 'deleteMessage':{
                if(isset($_POST['messageId'])){
                    $messageId= $_POST['messageId'];
                    if(!$dbh->deleteMessage((int)$messageId)){
                            header('Content-Type: application/json');
                            echo json_encode([
                                'status' => 'success',
                                'message' => 'message deleted'
                            ]);
                    }else{
                            header('Content-Type: application/json');
                            echo json_encode([
                                'status' => 'error',
                                'message' => 'message not deleted'
                            ]);
                    }

                }else{
                        header('Content-Type: application/json');
                        echo json_encode([
                            'status' => 'error',
                            'message' => 'message not deleted'
                        ]);
                }
                break;
              }
           
            }
        }
}
