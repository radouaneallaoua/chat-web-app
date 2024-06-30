<?php
require_once "../dao/daoGroup.php";
require_once "../dao/daoRole.php";
require_once "../dao/daoUser.php";
require_once "../dao/daoGroupMembers.php";
require_once "../dao/daoMessage.php";
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_GET['action'])) {
        $action = $_GET['action'];
        switch ($action) {
            case "createGroup": {
                    if (isset($_POST['name'], $_POST['type'], $_FILES['image'])) {
                        $name = $_POST['name'];
                        $type = $_POST['type'];
                        $image = $_FILES['image'];
                        $targetDir = "C:\\xampp\\htdocs\\images\\";
                        $targetFile = $targetDir . basename($image['name']);
                        move_uploaded_file($image['tmp_name'], $targetFile);
                        $imagePath = "images\\".$image['name'];
                        $conn = new DaoGroup();
                        $numberOfGroups = $conn->getNumberOfGroups();
                        $result = $conn->createNewGroup($numberOfGroups + 1, $name, $type, $imagePath);
                        if ($result) {
                            if ($type === "public") {
                                $conn1 = new DaoGroupMembers();
                                $dbh=new DaoUser();
                                $st=true;
                                $allUsers=$dbh->getAllUsers();
                                foreach($allUsers as $user){
                                    $number = $conn1->getNumberOfGroupsMembers();
                                    if($user['id']==1){
                                    $conn1->addUserToGroup($number + 1, $numberOfGroups + 1, 1, 1);
                                    }else{
                                        if(!$conn1->addUserToGroup($number + 1, $numberOfGroups + 1, $user['id'], 3)){
                                            $st=false;
                                        }
                                    }
                                }
                               if($st)
                                {
                                    header('Content-Type: application/json');
                                    echo json_encode([
                                        'status' => 'success',
                                        'message' => 'Group created successfully'
                                    ]);
                                } else {
                                    header('Content-Type: application/json');
                                    echo json_encode([
                                        'status' => 'failure',
                                        'message' => 'Something sent wrong'
                                    ]);
                                }
                            }else{
                                header('Content-Type: application/json');
                                echo json_encode([
                                    'status' => 'success',
                                    'message' => 'Group created successfully'
                                ]);
                            }
                        } else {
                            header('Content-Type: application/json');
                            echo json_encode([
                                'status' => 'failure',
                                'message' => 'Something went wrong'
                            ]);
                        }
                    }
                    break;
                }

            case 'deleteGroups': {
                    if (isset($_POST['groupsToDelete'])) {
                        $groupsToDelete = $_POST['groupsToDelete'];
                        $conn1 = new DaoGroup();
                        $state = true;
                        foreach ([$groupsToDelete] as $group) {
                            if (!$conn1->deleteGroupWithId((int)$group)) {
                                $state = false;
                                break;
                            }
                        }
                        if (!$state) {
                            header('Content-Type: application/json');
                            echo json_encode([
                                'status' => 'failure',
                                'message' => 'Something went wrong'
                            ]);
                        } else {
                            header('Content-Type: application/json');
                            echo json_encode([
                                'status' => 'success',
                                'message' => 'Groups Deleted Successfully'
                            ]);
                        }
                    }
                    break;
                }
            case 'editPublicGroup': {
                    if (isset($_POST['groupId'], $_POST['newName'], $_FILES['newImage'])) {
                        $groupId = $_POST['groupId'];
                        $name = $_POST['newName'];
                        $image=$_FILES['newImage'];
                        $targetDir = "C:\\xampp\\htdocs\\images\\";
                        $targetFile = $targetDir . basename($image['name']);
                        move_uploaded_file($image['tmp_name'], $targetFile);
                        $imagePath = "images\\" . $image['name'];
                        $conn2 = new DaoGroup();
                        if ($conn2->updateGroup((int)$groupId, $name, $imagePath)) {
                            header('Content-Type: application/json');
                            echo json_encode([
                                'status' => 'success',
                                'message' => 'Group updated successfully'
                            ]);
                        } else {
                            header('Content-Type: application/json');
                            echo json_encode([
                                'status' => 'failure',
                                'message' => 'Something sent wrong'
                            ]);
                        }
                    }else{
                        header('Content-Type: application/json');
                        echo json_encode([
                            'status' => 'failure',
                            'message' => 'Something sent wrong'
                        ]);
                    }
                    break;
                }
            case 'editPrivateGroup': {
                    if (isset($_POST['groupId'], $_POST['newName'], $_FILES['newImage'])) {
                        $groupId = $_POST['groupId'];
                        $name = $_POST['newName'];
                        $image = $_FILES['newImage'];
                        $targetDir = "C:\\xampp\\htdocs\\images\\";
                        $targetFile = $targetDir . basename($image['name']);
                        move_uploaded_file($image['tmp_name'], $targetFile);
                        $imagePath = "images\\" . $image['name'];
                        $conn2 = new DaoGroup();
                        if ($conn2->updateGroup((int)$groupId, $name, $imagePath)) {
                            header('Content-Type: application/json');
                            echo json_encode([
                                'status' => 'success',
                                'message' => 'Group updated successfully'
                            ]);
                        } else {
                            header('Content-Type: application/json');
                            echo json_encode([
                                'status' => 'failure',
                                'message' => 'Something sent wrong1'
                            ]);
                        }
                    } else {
                        header('Content-Type: application/json');
                        echo json_encode([
                            'status' => 'failure',
                            'message' => 'Something sent wrong2'
                        ]);
                    }
                    break;
                }
            case 'getAllMessages': {
                    if (isset($_POST['id'])) {
                        $id = $_POST['id'];
                        $conn = new DaoMessage();
                        $infos = $conn->getAllMessagesInTheGroup($id);
                        header('Content-Type: application/json');
                        echo json_encode([
                            'status' => 'success',
                            'data' => $infos
                        ]);
                    }
                    break;
                }
            case 'allGroups': {
                    $conn3 = new DaoGroup();
                    $groups = $conn3->getAllGroupInfos();
                    header('Content-Type: application/json');
                    echo json_encode([
                        'status' => 'success',
                        'groups' => $groups
                    ]);
                    break;
                }
        }
    }
}
