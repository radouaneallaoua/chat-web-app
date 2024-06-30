<?php
require_once "../dao/daoOffice.php";
require_once "../dao/daoService.php";
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');




if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_GET['action'])) {
        $action = $_GET['action'];
        switch ($action) {
            case 'allOffices': {
                    $conn1 = new DaoOffice();
                    $offices_infos = $conn1->getAllOfficesInfos();
                    if ($offices_infos !== []) {
                        header('Content_Type: application/json');
                        echo json_encode(array(
                            'status' => 'success',
                            'infos' => $offices_infos
                        ));
                    } else {
                        header('Content_Type: application/json');
                        echo json_encode(array(
                            'status' => 'failure',
                            'infos' => 'Something went wrong'
                        ));
                    }
                    break;
                }
            case 'officeInfos': {
                    if (isset($_POST['office'])) {
                        $officeId = $_POST['office'];
                        $conn2 = new DaoOffice();
                        $officeInfos = $conn2->getOfficeInfos($officeId);
                        if ($officeInfos !== []) {
                            header('Content_Type: application/json');
                            echo json_encode(array(
                                'status' => 'success',
                                'infos' => $officeInfos
                            ));
                        } else {
                            header('Content_Type: application/json');
                            echo json_encode(array(
                                'status' => 'failure',
                                'infos' => []
                            ));
                        }
                    }
                    break;
                }
            case 'addOffice': {
                    if (isset($_POST['officeName'])) {
                        $officeName = $_POST['officeName'];
                        $conn3 = new DaoOffice();
                        $numberOfOffices = $conn3->getNumberOfOffices();
                        $result = $conn3->insertNewOffice($numberOfOffices + 1, $officeName);
                        if ($result) {
                            header('Content_Type: application/json');
                            echo json_encode(array(
                                'status' => 'success',
                                'message' => 'Office added successfully!!'
                            ));
                        } else {
                            header('Content_Type: application/json');
                            echo json_encode(array(
                                'status' => 'failure',
                                'message' => 'Something went wrong'
                            ));
                        }
                    } else {
                        header('Content_Type: application/json');
                        echo json_encode(array(
                            'status' => 'failure',
                            'message' => 'Something went wrong'
                        ));
                    }
                    break;
                }
            case 'deleteOffices': {
                    if (isset($_POST['officesToDelete'])) {
                        $offices = explode(',', $_POST['officesToDelete']);
                        $conn4 = new DaoOffice();
                        $state = true;
                        foreach ($offices as $office) {
                            if (!$conn4->removeOfficeWithId((int)$office)) {
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
                                'message' => 'Offices deleted successfully!!!'
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
            case 'editOffice': {
                    if (isset($_POST['officeId'], $_POST['officeName'], $_POST['serviceName'], $_POST['services'])) {
                        $officeId = $_POST['officeId'];
                        $officeName = $_POST['officeName'];
                        $newServices = explode(',', $_POST['services']);
                        $addedService = $_POST['serviceName'];
                        $state10 = true;
                        $conn5 = new DaoOffice();
                        $conn6 = new DaoService();
                        if ($conn5->updateLabel((int)$officeId, $officeName)) {
                            if ($conn6->removeAllOfficeServices((int)$officeId)) {
                                if ($newServices !== []) {
                                    foreach ($newServices as $service) {
                                        $number = $conn6->getNumberOfServices();
                                        // $itemInfos = $conn6->getServiceInfosWithId((int)$service);
                                        if (!$conn6->insertNewService((int)$number + 1, "new", (int)$officeId)) {
                                            $state10 = false;
                                            break;
                                        }
                                    }
                                }
                                if ($state10) {
                                    if ($addedService !== "") {
                                        $number2 = $conn6->getNumberOfServices();
                                        if ($conn6->insertNewService((int)$number2 + 1, $addedService, (int)$officeId)) {
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
                                                'status' => 'success',
                                                'message' => 'Role edited successfully!!'
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
