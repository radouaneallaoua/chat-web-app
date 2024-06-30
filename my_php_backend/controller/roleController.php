<?php
require_once "../dao/daoRole.php";
require_once "../dao/daoRoleFunctionality.php";
require_once "../dao/daoUser.php";
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');




if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_GET['action'])) {
        $action = $_GET['action'];
        switch ($action) {
            case "allRoles": {
                    $conn = new DaoRole();
                    $roles = $conn->getAllRolesInfos();
                    if ($roles !== []) {
                        header('Content-Type: application/json');
                        echo json_encode([
                            'status' => 'success',
                            'infos' => $roles
                        ]);
                    } else {
                        header('Content-Type: application/json');
                        echo json_encode([
                            'status' => 'failure',
                            'infos' => 'Something went wrong'
                        ]);
                    }
                    break;
                }
            case 'addRole': {
                    if (isset($_POST['roleName'], $_POST['functionalities'])) {
                        $roleName = $_POST['roleName'];
                        $functionalities = $_POST['functionalities'];
                        $state1 = true;
                        $conn1 = new DaoRole();
                        $numberOfRoles = $conn1->numberOfRoles();
                        $result = $conn1->insertNewRole($numberOfRoles + 1, $roleName);
                        if ($result) {
                            $conn2 = new DaoRoleFunctionality();
                            $number = $conn2->numberOfItems();
                            foreach ([$functionalities] as $functionality) {
                                $state = $conn2->insertNewRoleFunctionality($number + 1, $numberOfRoles + 1, (int)$functionality);
                                if (!$state) {
                                    $state1 = false;
                                    break;
                                }
                            }
                            if (!$state1) {
                                header('Content-Type: application/json');
                                echo json_encode([
                                    'status' => 'failure',
                                    'message' => 'Something went wrong'
                                ]);
                            } else {
                                header('Content-Type: application/json');
                                echo json_encode([
                                    'status' => 'success',
                                    'message' => 'Role added successfully!!'
                                ]);
                            }
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
            case 'deleteRoles': {
                    if (isset($_POST['rolesToDelete'])) {
                        $roles = explode(',', $_POST['rolesToDelete']);
                        $state1 = true;
                        $state2 = true;
                        $conn3 = new DaoRole();
                        $conn4 = new DaoUser();
                        foreach ($roles as $role) {
                            $usersWhoHaveTheRoles = $conn4->getAllUsersWithTheRole((int)$role);
                            if ($usersWhoHaveTheRoles !== []) {
                                foreach ($usersWhoHaveTheRoles as $user) {
                                    if (!$conn4->updateUserRole($user, 3)) {
                                        $state1 = false;
                                        break;
                                    }
                                }
                                if (!$state1) {
                                    break;
                                } else {
                                    if (!$conn3->removeRoleWithId((int)$role)) {
                                        $state2 = false;
                                        break;
                                    }
                                }
                            } else {
                                if (!$conn3->removeRoleWithId((int)$role)) {
                                    $state2 = false;
                                    break;
                                }
                            }
                        }
                        if ($state1 && $state2) {
                            header('Content-Type: application/json');
                            echo json_encode([
                                'status' => 'success',
                                'message' => 'Roles deleted successfully'
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
            case 'editRole': {
                    if (isset($_POST['roleId'], $_POST['roleName'], $_POST['functionalities'])) {
                        $roleId = $_POST['roleId'];
                        $roleName = $_POST['roleName'];
                        $newFunctionalities = explode(',', $_POST['functionalities']);
                        $state10 = true;
                        $conn5 = new DaoRole();
                        $conn6 = new DaoRoleFunctionality();
                        
                        if ($conn5->updateLabel((int)$roleId, $roleName)) {
                            if ($conn6->removeAllRoleFunctionalities((int)$roleId)) {
                                if ($newFunctionalities !== []) {
                                    foreach ($newFunctionalities as $functionality) {
                                        $number = $conn6->numberOfItems();
                                        if (!$conn6->insertNewRoleFunctionality((int)$number + 1, (int)$roleId, (int)$functionality)) {
                                            $state10 = false;
                                            break;
                                        }
                                    }
                                }
                                if ($state10) {
                                    header('Content-Type: application/json');
                                    echo json_encode([
                                        'status' => 'success',
                                        'message' => 'Role edited successfully!!'
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
