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
            case 'allServices': {
                    $conn1 = new DaoService();
                    $services_infos = $conn1->getAllServicesInfos();
                    if ($services_infos !== []) {
                        header('Content_Type: application/json');
                        echo json_encode(array(
                            'status' => 'success',
                            'infos' => $services_infos,
                        ));
                    } else {
                        header('Content_Type: application/json');
                        echo json_encode(array(
                            'status' => 'failure',
                            'infos' => [],
                        ));
                    }
                    break;
                }
            case "allOfficeServices": {
                    if (isset($_POST['office'])) {
                        $officeId = $_POST['office'];
                        $conn = new DaoService();
                        $officeServices = $conn->getAllServicesBelongingToTheOffice($officeId);
                        if ($officeServices !== []) {
                            header('Content-Type: application/json');
                            echo json_encode([
                                'status' => 'success',
                                'infos' => $officeServices
                            ]);
                        } else {
                            header('Content-Type: application/json');
                            echo json_encode([
                                'status' => 'failure',
                                'infos' => 'Something went wrong'
                            ]);
                        }
                    } else {
                        header('Content-Type: application/json');
                        echo json_encode([
                            'status' => 'failure',
                            'infos' => 'Something went wrong'
                        ]);
                    }

                    break;
                }
            case 'serviceInfos': {
                    if (isset($_POST['service'])) {
                        $serviceId = $_POST['service'];
                        $conn2 = new DaoService();
                        $serviceInfos = $conn2->getServiceInfosWithId($serviceId);
                        if ($serviceInfos !== []) {
                            header('Content_Type: application/json');
                            echo json_encode(array(
                                'status' => 'success',
                                'infos' => $serviceInfos
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
            case 'editOffice': {
                    if (isset($_POST['officeId'], $_POST['officeName'], $_POST['serviceName'], $_POST['services'])) {
                        $officeId = $_POST['officeId'];
                        $officeName = $_POST['officeName'];
                        $serviceName = $_POST['serviceName'];
                        $services = $_POST['services'];
                        $conn3 = new DaoOffice();
                        $conn4 = new DaoService();
                        $state = true;
                        $number = $conn4->getNumberOfServices();
                        if ($services !== []) {
                            if ($conn3->updateOffice((int)$officeId, $officeName)) {
                                $officeServices = $conn4->getAllServicesBelongingToTheOffice((int)$officeId);
                                foreach ($officeServices as $service) {
                                    if (!in_array((int)$service['id'], [$services])) {
                                        if (!$conn4->deleteServiceWithId((int)$service['id'])) {
                                            $state = false;
                                            break;
                                        }
                                    }
                                }
                                foreach ([$services] as $service) {
                                    if (!in_array($service, $officeServices)) {
                                        if (!$conn4->insertNewService($number + 1, ($conn4->getServiceInfosWithId((int)$service))['label'], (int)$officeId)) {
                                            $state = false;
                                            break;
                                        }
                                        $number = $number + 1;
                                    }
                                }
                                if ($serviceName !== "") {
                                    if ($conn4->insertNewService($number + 1, $serviceName, (int)$officeId) && $state) {
                                        header('Content-Type: application/json');
                                        echo json_encode([
                                            'status' => 'success',
                                            'infos' => 'Office edited successfully'
                                        ]);
                                    } else {
                                        header('Content-Type: application/json');
                                        echo json_encode([
                                            'status' => 'failure',
                                            'infos' => 'Something went wrong'
                                        ]);
                                    }
                                }
                            } else {
                                header('Content-Type: application/json');
                                echo json_encode([
                                    'status' => 'failure',
                                    'infos' => 'Something went wrong'
                                ]);
                            }
                        } else {
                            if ($conn4->insertNewService($number + 1, $serviceName, (int)$officeId) && $state) {
                                header('Content-Type: application/json');
                                echo json_encode([
                                    'status' => 'success',
                                    'infos' => 'Office edited successfully'
                                ]);
                            } else {
                                header('Content-Type: application/json');
                                echo json_encode([
                                    'status' => 'failure',
                                    'infos' => 'Something went wrong'
                                ]);
                            }
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
        }
    }
}
