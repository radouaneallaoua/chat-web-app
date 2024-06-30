<?php
require_once "../dao/daoUser.php";
require_once  "../dao/daoEmployee.php";
require_once "../dao/daoGroupMembers.php";
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require '../vendor/autoload.php';

function sendPassword($email, $token)
{
    $mail = new PHPMailer(true);
    $mail->SMTPDebug = 0;
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'radouaneallaoua@gmail.com';
    $mail->Password   = 'icmfueneoghxakrk';
    $mail->SMTPSecure = 'ssl';
    $mail->Port       = 465;
    $mail->setFrom('radouaneallaoua@gmail.com', "reset your password");
    $mail->addAddress($email);
    $mail->isHTML(true);
    $mail->Subject = 'Reset Password Notification';
    $mail->Body    = "<p>Click on the link and enter <strong>$token</strong> <p>
                        <a  href='http://localhost:3000/InsertCode?item=%dtdgskldskd9$token#erafdgjf%%'>Click here </a>";
    if ($mail->send()) {
        header('Content-Type: application/json');
        echo json_encode(array(
            'status' => 'success',
            'token' => $token,
            'message' => 'An email is sent to you.Check out your email '
        ));
    } else {
        header('Content-Type: application/json');
        echo json_encode(array(
            'status' => 'error',
            'message' => 'Something went wrong '
        ));
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_GET['action'])) {
        $action = $_GET['action'];
        switch ($action) {
            case 'addUser': {
                    if (isset($_POST['name'], $_POST['surname'], $_POST['email'], $_POST['age'], $_POST['password'], $_POST['service'], $_POST['office'], $_FILES['image'])) {
                        $name = $_POST['name'];
                        $surname = $_POST['surname'];
                        $email = $_POST['email'];
                        $age = $_POST['age'];
                        $password = $_POST['password'];
                        $office = $_POST['office'];
                        $service = $_POST['service'];
                        $image = $_FILES['image'];
                        $targetDir = "C:\\xampp\\htdocs\\images\\";
                        $targetFile = $targetDir . basename($image['name']);
                        move_uploaded_file($image['tmp_name'], $targetFile);
                        $imagePath = "images\\" . $image['name'];
                        $conn1 = new DaoEmployee();
                        $numberOfEmployees = $conn1->numberOfEmployees();
                        if ($conn1->insertNewEmployee((int)$numberOfEmployees + 1, $name, $surname, $email, $imagePath, $age, $office, $service)) {
                            $conn2 = new DaoUser();
                            $numberOfUsers = $conn2->numberOfUsers();
                            if ($conn2->insertNewUser((int)$numberOfUsers + 1, (int)$numberOfEmployees + 1, $password, 3, null)) {
                                header('Content-Type: application/json');
                                echo json_encode([
                                    'status' => 'success',
                                    'message' => "user saved successfully"
                                ]);
                            } else {
                                header('Content-Type: application/json');
                                echo json_encode([
                                    'state' => 'failure',
                                    'message' => "Something went wrong !! User not saved"
                                ]);
                            }
                        } else {
                            header('Content-Type: application/json');
                            echo json_encode([
                                'state' => 'failure',
                                'message' => "Something went wrong !! User not saved"
                            ]);
                        }
                    } else {
                        header('Content-Type: application/json');
                        echo json_encode([
                            'state' => 'failure',
                            'message' => "Something went wrong !! User not saved"
                        ]);
                    }
                    break;
                }
            case 'reset': {
                    if (isset($_POST['email'], $_POST['confirmEmail'])) {
                        $email = $_POST['email'];
                        $comfirmEmail = $_POST['confirmEmail'];
                        if ($email === $comfirmEmail) {
                            $dbh = new DaoUser();
                            $result = $dbh->findUserFromEmail($email);
                            if ($result !== []) {
                                $token = uniqid();
                                if ($dbh->updateUserToken($email, $token)) {
                                    sendPassword($email, $token);
                                } else {
                                    header('Content-Type: application/json');
                                    echo json_encode(array(
                                        'status' => 'error',
                                        'message' => 'Something went wrong '
                                    ));
                                }
                            } else {
                                header('Content-Type: application/json');
                                echo json_encode(array(
                                    'status' => 'missingInfo',
                                    'message' => "Email doesn't exists"
                                ));
                            }
                        } else {
                            header('Content-Type: application/json');
                            echo json_encode(array(
                                'status' => 'noMatching',
                                'message' => 'Emails are not matched'
                            ));
                        }
                    } else {

                        header('Content-Type: application/json');
                        echo json_encode(array(
                            'status' => 'imcomplete',
                            'message' => 'Enter informations completely'
                        ));
                    }
                    break;
                }
            case 'InsertNewPassword': {
                    if (isset($_POST['password'], $_POST['newPassword'], $_POST['token'])) {
                        $password = $_POST['password'];
                        $newPassword = $_POST['newPassword'];
                        $token = $_POST['token'];
                        if ($password === $newPassword) {
                            $dbh2 = new DaoUser();
                            $user = $dbh2->findUserToken($token);
                            if ($user !== []) {
                                if ($dbh2->updateUserPassword($user['employee']['email'], $newPassword)) {
                                    if ($dbh2->resetToken($user['employee']['email'])) {
                                        header('Content-Type: application/json');
                                        echo json_encode([
                                            'status' => 'success',
                                            'message' => 'Password updated successfully '
                                        ]);
                                    } else {
                                        header('Content-Type: application/json');
                                        echo json_encode([
                                            'status' => 'error',
                                            'message' => 'Something went wrong'
                                        ]);
                                    }
                                } else {
                                    header('Content-Type: application/json');
                                    echo json_encode([
                                        'status' => 'error',
                                        'message' => 'Something went wrong'
                                    ]);
                                }
                            } else {
                                header('Content-Type: application/json');
                                echo json_encode([
                                    'status' => 'error',
                                    'message' => 'Something went wrong'
                                ]);
                            }
                        } else {
                            header('Content-Type: application/json');
                            echo json_encode([
                                'status' => 'noMatching',
                                'message' => 'The passwords are not matched'
                            ]);
                        }
                    } else {

                        header('Content-Type: application/json');
                        echo json_encode([
                            'status' => 'error',
                            'message' => 'Something went wrong'
                        ]);
                    }

                    break;
                }
            case 'login': {
                    if (isset($_POST['name'], $_POST['surname'], $_POST['password'])) {
                        $name = $_POST['name'];
                        $password = $_POST['password'];
                        $surname = $_POST['surname'];
                        $dbh1000 = new DaoUser();
                        $userInfos = $dbh1000->findUser($name, $surname, $password);
                        if ($userInfos !== []) {
                            header('Content-Type: application/json');
                            echo json_encode([
                                'status' => 'success',
                                'message' => 'You are logging successfully!!',
                                'user' => $userInfos
                            ]);
                        } else {
                            header('Content-Type: application/json');
                            echo json_encode([
                                'status' => 'error',
                                'message' => 'Name || Surname || Password is incorrect'
                            ]);
                        }
                    } 
                    break;
                }

            case 'addActiveUser': {
                    if (isset($_POST['userId'])) {
                        $userId = $_POST['userId'];
                        $conn10 = new DaoUser();
                        $numberOfActiveUsers = $conn10->numberOfActiveUsers();
                        if ($conn10->insertActiveUser((int)$numberOfActiveUsers + 1, (int)$userId)) {
                            header('Content-Type: application/json');
                            echo json_encode([
                                'status' => 'success',
                                'message' => 'active added successfully'
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
            case 'removeActiveUser': {
                    if (isset($_POST['userId'])) {
                        $userId = $_POST['userId'];
                        $conn11 = new DaoUser();
                        if ($conn11->removeActiveUser((int)$userId)) {
                            header('Content-Type: application/json');
                            echo json_encode([
                                'status' => 'success',
                                'message' => 'active removed successfully'
                            ]);
                        } else {
                            header('Content-Type: application/json');
                            echo json_encode([
                                'status' => 'failure',
                                'message' => 'Something went wrong'
                            ]);
                        }
                        $conn11 = null;
                    } else {
                        header('Content-Type: application/json');
                        echo json_encode([
                            'status' => 'failure',
                            'message' => 'Something went wrong'
                        ]);
                    }
                    break;
                }
            case 'allActiveUsers': {
                    $conn12 = new DaoUser();
                    $infos = $conn12->getAllActiveUsers();
                    if ($infos !== []) {
                        header('Content-Type: application/json');
                        echo json_encode([
                            'status' => 'success',
                            'users' => $infos,
                        ]);
                    } else {
                        header('Content-Type: application/json');
                        echo json_encode([
                            'status' => 'failure',
                            'message' => 'Something went wrong'
                        ]);
                    }
                    $conn12 = null;
                    break;
                }
            case 'office_service': {
                    if (isset($_POST['office'], $_POST['service'])) {
                        $office = $_POST['office'];
                        $service = $_POST['service'];
                        $conn2 = new DaoUser();
                        $users = $conn2->getAllUsers();
                        if ($users !== []) {
                            $targetUsers = [];
                            foreach ($users as $user) {
                                if (
                                    $user['employee']['office'] === (int)$office
                                    &&  $user['employee']['service'] === (int) $service
                                ) {
                                    array_push($targetUsers, $user);
                                }
                            }
                            header('Content-Type: application/json');
                            echo json_encode([
                                'status' => 'success',
                                'users' => $targetUsers
                            ]);
                        } else {
                            header('Content-Type: application/json');
                            echo json_encode([
                                'status' => 'empty',
                                'users' => []
                            ]);
                        }
                    }
                    break;
                }
            case 'office': {
                    if (isset($_POST['office'])) {
                        $office = $_POST['office'];
                        $conn3 = new DaoUser();
                        $users = $conn3->getAllUsers();
                        if ($users !== []) {
                            $targetUsers = [];
                            foreach ($users as $user) {
                                if ($user['employee']['office'] === (int)$office) {
                                    array_push($targetUsers, $user);
                                }
                            }
                            header('Content-Type: application/json');
                            echo json_encode([
                                'status' => 'success',
                                'users' => $targetUsers
                            ]);
                        } else {
                            header('Content-Type: application/json');
                            echo json_encode([
                                'status' => 'empty',
                                'users' => []
                            ]);
                        }
                    }
                    break;
                }
            case 'allUsers': {
                    $conn4 = new DaoUser();
                    $users = $conn4->getAllUsers();
                    if ($users !== []) {
                        header('Content-Type: application/json');
                        echo json_encode([
                            'status' => 'success',
                            'users' => $users
                        ]);
                    }
                    break;
                }
            case 'deleteUsers': {
                    if (isset($_POST['usersToDelete'])) {
                        $users = explode(',', $_POST['usersToDelete']);
                        $conn5 = new DaoUser();
                        $state = true;
                        foreach ($users as $user) {
                            if (!$conn5->deleteUserWithId((int)$user)) {
                                $state = false;
                                break;
                            }
                        }
                        if (!$state) {
                            header('Content-Type: application/json');
                            echo json_encode([
                                'status' => 'failure',
                                'message' => 'Something went wrong1'
                            ]);
                        } else {
                            header('Content-Type: application/json');
                            echo json_encode([
                                'status' => 'success',
                                'message' => 'Users Deleted successfully!!!'
                            ]);
                        }
                    }
                    break;
                }

            case 'editUser': {
                    if (isset($_POST['userId'], $_POST['role'], $_POST['office'], $_POST['service'])) {
                        $id = $_POST['userId'];
                        $role = $_POST['role'];
                        $office = $_POST['office'];
                        $service = $_POST['service'];
                        $conn7 = new DaoUser();
                        $conn8 = new DaoEmployee();
                        $infos = $conn7->getUserInfos($id);
                        if ($conn8->updateEmployee(
                            $infos['employee']['id'],
                            $infos['employee']['name'],
                            $infos['employee']['surname'],
                            $infos['employee']['email'],
                            $infos['employee']['image'],
                            $infos['employee']['age'],
                            $office,
                            $service
                        )) {
                            if ($conn7->updateUser(
                                $id,
                                $infos['employee']['id'],
                                $infos['employee']['name'],
                                $infos['employee']['surname'],
                                $infos['employee']['email'],
                                $infos['employee']['image'],
                                $infos['employee']['age'],
                                $office,
                                $service,
                                $infos['password'],
                                $role,
                                $infos['token']
                            )) {
                                header('Content-Type: application/json');
                                echo json_encode([
                                    'status' => 'success',
                                    'message' => 'User Updated successfully '
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
                    }
                    break;
                }
        }
    }
}
