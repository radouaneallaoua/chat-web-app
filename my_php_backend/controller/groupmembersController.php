<?php
require_once "../dao/daoGroupMembers.php";

header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_GET['action'])) {
        $action = $_GET['action'];
        $conn = new DaoGroupMembers();
        switch ($action) {
            case 'userGroups':{
                if(isset($_POST['user'])){
                    $user=$_POST['user'];
                    $groups=$conn->findUserGroups((int)$user);
                    header('Content-Type: application/json');
                    echo json_encode([
                        'status'=>'success',
                        'groups'=>$groups
                    ]);
                }
                break;
            }
            case 'groupMembers':{
              if(isset($_POST['groupId'])){
                $id= $_POST['groupId'];
                $members=$conn->getAllUsersInfosBelongingToTheGroup($id);
                header('Content-Type: application/json');
                echo json_encode($members);
              }
                break;
            }
            case 'allIdsGroupMembers': {
                    if (isset($_POST['groupId'])) {
                        $groupId = $_POST['groupId'];
                        $members = $conn->getGroupMembersIds((int)$groupId);
                        header('Content-Type: application/json');
                        echo json_encode($members);
                    }
                    break;
                }
            case 'addUser':{
                if(isset($_POST['groupId'],$_POST['userId'])){
                     $groupId= $_POST['groupId'];
                     $userId= $_POST['userId'];
                     $number=$conn->getNumberOfGroupsMembers();
                   if($conn->addUserToGroup((int)$number+1,(int)$groupId,(int)$userId,3)){
                            header('Content-Type: application/json');
                            echo json_encode([
                                'status' => 'success',
                                'message' => 'User added successfully'
                            ]);
                   } else {
                            header('Content-Type: application/json');
                            echo json_encode([
                                'status' => 'failure',
                                'message' => 'Something went wrong'
                            ]);
                        }
                }else{
                    header('Content-Type: application/json');
                    echo json_encode([
                        'status' => 'failure',
                        'message' => 'Something went wrong'
                    ]);
                }
                break;
            }
            case 'addAdmin': {
                    if (isset($_POST['groupId'], $_POST['userId'])) {
                        $groupId = $_POST['groupId'];
                        $userId = $_POST['userId'];
                        $number2 = $conn->getNumberOfGroupsMembers();
                        if ($conn->addUserToGroup((int)$number2+ 1, (int)$groupId, (int)$userId, 2)) {
                            header('Content-Type: application/json');
                            echo json_encode([
                                'status' => 'success',
                                'message' => 'Admin added successfully'
                            ]);
                        } else {
                            header('Content-Type: application/json');
                            echo json_encode([
                                'status' => 'failure',
                                'message' => 'Something went wrong'
                            ]);
                        }
                    } else {
                        header('Content-Type: application/json');
                        echo json_encode([
                            'status' => 'failure',
                            'message' => 'Something went wrong'
                        ]);
                    }
                    break;
                }
            case 'removeMember': {
                    if (isset($_POST['groupId'], $_POST['userId'])) {
                        $groupId = $_POST['groupId'];
                        $userId = $_POST['userId'];
                        if ($conn->removeUserFromGroup((int)$groupId,(int)$userId)) {
                            header('Content-Type: application/json');
                            echo json_encode([
                                'status' => 'success',
                                'message' => 'Member removed successfully'
                            ]);
                        } else {
                            header('Content-Type: application/json');
                            echo json_encode([
                                'status' => 'failure',
                                'message' => 'Something went wrong'
                            ]);
                        }
                    } else {
                        header('Content-Type: application/json');
                        echo json_encode([
                            'status' => 'failure',
                            'message' => 'Something went wrong'
                        ]);
                    }
                    break;
                }
            case 'changeUserGroupRoleToAdmin': {
                    if (isset($_POST['groupId'], $_POST['userId'])) {
                        $groupId = $_POST['groupId'];
                        $userId = $_POST['userId'];
                        if ($conn->setMemberRoleInTheGroup((int)$groupId, (int)$userId,2)) {
                            header('Content-Type: application/json');
                            echo json_encode([
                                'status' => 'success',
                                'message' => 'Member is an Admin now'
                            ]);
                        } else {
                            header('Content-Type: application/json');
                            echo json_encode([
                                'status' => 'failure',
                                'message' => 'Something went wrong'
                            ]);
                        }
                    } else {
                        header('Content-Type: application/json');
                        echo json_encode([
                            'status' => 'failure',
                            'message' => 'Something went wrong'
                        ]);
                    }
                    break;
                }
            case 'changeUserGroupRoleToUser': {
                    if (isset($_POST['groupId'], $_POST['userId'])) {
                        $groupId = $_POST['groupId'];
                        $userId = $_POST['userId'];
                        if ($conn->setMemberRoleInTheGroup((int)$groupId, (int)$userId, 3)) {
                            header('Content-Type: application/json');
                            echo json_encode([
                                'status' => 'success',
                                'message' => 'Member is a Simple Member now'
                            ]);
                        } else {
                            header('Content-Type: application/json');
                            echo json_encode([
                                'status' => 'failure',
                                'message' => 'Something went wrong'
                            ]);
                        }
                    } else {
                        header('Content-Type: application/json');
                        echo json_encode([
                            'status' => 'failure',
                            'message' => 'Something went wrong'
                        ]);
                    }
                    break;
                }
        }
    }
}
