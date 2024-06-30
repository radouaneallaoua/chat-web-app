<?php

require_once "../dao/daoInvitation.php";
require_once "../dao/daoUser.php";
require_once  "../dao/daoGroupMembers.php";
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credentials: true');


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_GET['action'])) {
        $action = $_GET['action'];
        switch ($action) {
            case 'inviteAllInTheOffice': {
                    if (isset($_POST['office'], $_POST['sender'], $_POST['group'])) {
                        $group = $_POST['group'];
                        $sender = $_POST['sender'];
                        $office = $_POST['office'];
                        $conn1 = new daoInvitation();
                        $conn2 = new DaoUser();
                        $users = $conn2->getAllUsers();
                        $targetUsers = [];
                        if ($users !== []) {
                            foreach ($users as $user) {
                                if ($user['employee']['office'] === (int)$office) {
                                    array_push($targetUsers, $user['id']);
                                }
                            }
                        }
                        $state = true;
                        foreach ($targetUsers as $userId) {
                            $number = $conn1->numberOfInvitations();
                            if (!$conn1->addInvitation((int)$number + 1, (int)$sender, (int)$group, (int)$userId, 'waiting')) {
                                $state = false;
                                break;
                            }
                        }
                        if ($state) {
                            header('Content-Type: application/json');
                            echo json_encode(array(
                                'status' => 'success',
                                'message' => 'Invitations has been sent successfully',
                            ));
                        } else {
                            header('Content-Type: application/json');
                            echo json_encode(array(
                                'status' => 'failure',
                                'message' => 'Something went wrong',
                            ));
                        }
                    } else {
                        header('Content-Type: application/json');
                        echo json_encode(array(
                            'status' => 'failure',
                            'message' => 'Something went wrong',
                        ));
                    }
                    break;
                }
            case 'inviteAllInTheOfficeService': {
                    if (isset($_POST['office'], $_POST['service'], $_POST['sender'], $_POST['group'])) {
                        $group = $_POST['group'];
                        $sender = $_POST['sender'];
                        $office = $_POST['office'];
                        $service = $_POST['service'];
                        $conn3 = new daoInvitation();
                        $conn4 = new DaoUser();
                        $users = $conn4->getAllUsers();
                        $targetUsers = [];
                        if ($users !== []) {
                            foreach ($users as $user) {
                                if (
                                    $user['employee']['office'] == (int)$office &&
                                    $user['employee']['service'] == (int)$service
                                ) {
                                    array_push($targetUsers, $user['id']);
                                }
                            }
                        }
                        $state = true;
                        foreach ($targetUsers as $userId) {
                            $number = $conn3->numberOfInvitations();
                            if (!$conn3->addInvitation((int)$number + 1, (int)$sender, (int)$group, (int)$userId, 'waiting')) {
                                $state = false;
                                break;
                            }
                        }
                        if ($state) {
                            header('Content-Type: application/json');
                            echo json_encode(array(
                                'status' => 'success',
                                'message' => 'Invitations has been sent successfully',
                            ));
                        } else {
                            header('Content-Type: application/json');
                            echo json_encode(array(
                                'status' => 'failure',
                                'message' => 'Something went wrong',
                            ));
                        }
                    } else {
                        header('Content-Type: application/json');
                        echo json_encode(array(
                            'status' => 'failure',
                            'message' => 'Something went wrong',
                        ));
                    }
                    break;
                }
            case 'inviteUsers': {
                    if (isset($_POST['office'], $_POST['service'], $_POST['sender'], $_POST['group'], $_POST['usersToInvite'])) {
                        $group = $_POST['group'];
                        $sender = $_POST['sender'];
                        $office = $_POST['office'];
                        $service = $_POST['service'];
                        $users = explode(',', $_POST['usersToInvite']);
                        $conn5 = new daoInvitation();
                        $state = true;
                        foreach ($users as $userId) {
                            $number = $conn5->numberOfInvitations();
                            if (!$conn5->addInvitation((int)$number + 1, (int)$sender, (int)$group, (int)$userId, 'waiting')) {
                                $state = false;
                                break;
                            }
                        }
                        if ($state) {
                            header('Content-Type: application/json');
                            echo json_encode(array(
                                'status' => 'success',
                                'message' => 'Invitations has been sent successfully',
                            ));
                        } else {
                            header('Content-Type: application/json');
                            echo json_encode(array(
                                'status' => 'failure',
                                'message' => 'Something went wrong',
                            ));
                        }
                    } else {
                        header('Content-Type: application/json');
                        echo json_encode(array(
                            'status' => 'failure',
                            'message' => 'Something went wrong',
                        ));
                    }
                    break;
                }

            case 'getAllInvitations': {
                    if (isset($_POST['userId'])) {
                        $userId = $_POST['userId'];
                        $conn6 = new daoInvitation();
                        $whenTheUserIsRecipient = $conn6->findAllInvitationOfTheRecipient((int)$userId);
                        $whenTheUserIsSender = $conn6->findAllInvitationOfTheSender((int)$userId);
                        if ($whenTheUserIsRecipient !== [] &&  $whenTheUserIsSender !== []) {
                            header('Content-Type: application/json');
                            echo json_encode(array(
                                'status' => 'success',
                                'whenTheUserIsRecipient' => $whenTheUserIsRecipient,
                                'whenTheUserIsSender' => $whenTheUserIsSender
                            ));
                        } else if ($whenTheUserIsRecipient !== []) {
                            header('Content-Type: application/json');
                            echo json_encode(array(
                                'status' => 'success',
                                'whenTheUserIsRecipient' => $whenTheUserIsRecipient,
                                'whenTheUserIsSender' => []
                            ));
                        } else if ($whenTheUserIsSender !== []) {
                            header('Content-Type: application/json');
                            echo json_encode(array(
                                'status' => 'success',
                                'whenTheUserIsRecipient' => [],
                                'whenTheUserIsSender' => $whenTheUserIsSender
                            ));
                        } else {
                            header('Content-Type: application/json');
                            echo json_encode(array(
                                'status' => 'success',
                                'whenTheUserIsRecipient' => [],
                                'whenTheUserIsSender' => []
                            ));
                        }
                    } else {
                        header('Content-Type: application/json');
                        echo json_encode(array(
                            'status' => 'failure',
                            'message' => 'something went wrong'
                        ));
                    }
                    break;
                }

            case 'accept': {
                    if (isset($_POST['id'])) {
                        $id = $_POST['id'];
                        $conn7 = new DaoInvitation();
                        $invitationInfos = $conn7->getInfosInvitation((int)$id);
                        if ($conn7->updateInvitationInfos((int)$id, 'accepting')) {
                            $conn8 = new DaoGroupMembers();
                            $number = $conn8->getNumberOfGroupsMembers();
                            if ($conn8->addUserToGroup((int)$number + 1, (int)$invitationInfos['group'], (int)$invitationInfos['recipient'], 3)) {
                                header('Content-Type: application/json');
                                echo json_encode(array(
                                    'status' => 'success',
                                    'message' => 'You have joined the group!!!'
                                ));
                            } else {
                                header('Content-Type: application/json');
                                echo json_encode(array(
                                    'status' => 'failure',
                                    'message' => 'Something went wrong'
                                ));
                            }
                        } else {
                            header('Content-Type: application/json');
                            echo json_encode(array(
                                'status' => 'failure',
                                'message' => 'Something went wrong'
                            ));
                        }
                    } else {
                        header('Content-Type: application/json');
                        echo json_encode(array(
                            'status' => 'failure',
                            'message' => 'Something went wrong'
                        ));
                    }
                    break;
                }
            case 'decline': {
                    if (isset($_POST['id'])) {
                        $id = $_POST['id'];
                        $conn9 = new DaoInvitation();
                        $invitationInfos = $conn9->getInfosInvitation((int)$id);
                        if ($conn9->updateInvitationInfos((int)$id, 'declining')) {
                            header('Content-Type: application/json');
                            echo json_encode(array(
                                'status' => 'success',
                                'message' => 'Invitation was declined!!!'
                            ));
                        } else {
                            header('Content-Type: application/json');
                            echo json_encode(array(
                                'status' => 'failure',
                                'message' => 'Something went wrong'
                            ));
                        }
                    } else {
                        header('Content-Type: application/json');
                        echo json_encode(array(
                            'status' => 'failure',
                            'message' => 'Something went wrong'
                        ));
                    }
                    break;
                }
            case 'delete': {
                    if (isset($_POST['id'])) {
                        $id = $_POST['id'];
                        $conn10 = new DaoInvitation();
                        if ($conn10->deleteInvitation((int)$id)) {
                            header('Content-Type: application/json');
                            echo json_encode(array(
                                'status' => 'success',
                                'message' => 'Invitation had been deleted!!!'
                            ));
                        } else {
                            header('Content-Type: application/json');
                            echo json_encode(array(
                                'status' => 'failure',
                                'message' => 'Something went wrong'
                            ));
                        }
                    } else {
                        header('Content-Type: application/json');
                        echo json_encode(array(
                            'status' => 'failure',
                            'message' => 'Something went wrong'
                        ));
                    }
                    break;
                }
            // case 'invitationsInfos': {
            //         if (isset($_POST['invitationsIds'])) {
            //             $invitations = $_POST['invitationsIds'];
            //             if ($invitations === []) {
            //                 header('Content-Type: application/json');
            //                 echo json_encode(array(
            //                     'status' => 'empty',
            //                     'message' => 'you have no notifications',
            //                 ));
            //             } else {
            //                 header('Content-Type: application/json');
            //                 echo json_encode(array(
            //                     'status' => 'success',
            //                     'infos' => $invitations,
            //                 ));
            //             }
            //         } else {
            //             header('Content-Type: application/json');
            //             echo json_encode(array(
            //                 'status' => 'failure',
            //                 'message' => 'Something went wrong'
            //             ));
            //         }
            //         break;
            //     }
        }
    }
}
