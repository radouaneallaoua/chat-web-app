<?php
require_once "../dao/daoEmployee.php";
require_once "../dao/daoUser.php";
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_GET['action'])) {
        $action = $_GET['action'];
        switch ($action) {
            case "addEmployee": {
                    $name = $_POST['name'];
                    $surname = $_POST['surname'];
                    $email = $_POST['email'];
                    $age = $_POST['age'];
                    $office = $_POST['office'];
                    $service = $_POST['service'];
                    $image = $_FILES['image'];
                    $targetDir = "C:\\xampp\\htdocs\\images\\";
                    $targetFile = $targetDir . basename($image['name']);
                    move_uploaded_file($image['tmp_name'], $targetFile);
                    $imagePath = "images\\" . $image['name'];
                    $conn1 = new DaoEmployee();
                    $numberOfEmployees = $conn1->numberOfEmployees();
                    $state = $conn1->insertNewEmployee($numberOfEmployees + 1, $name, $surname, $email, $imagePath, $age, $office, $service);
                    if ($state) {
                        header('Content-Type: application/json');
                        echo json_encode([
                            'status' => 'success',
                            'message' => "Employee added  successfully"
                        ]);
                    } else {
                        header('Content-Type: application/json');
                        echo json_encode([
                            'status' => 'failure',
                            'message' => "Something went wrong !! employee not saved"
                        ]);
                    }
                    break;
                }
            case 'office_service': {
                    if (isset($_POST['office'], $_POST['service'])) {
                        $office = $_POST['office'];
                        $service = $_POST['service'];
                        $conn2 = new DaoEmployee();
                        $employees = $conn2->getAllEmployeesInTheOfficeInTheService($office, $service);
                        if ($employees !== []) {
                            header('Content-Type: application/json');
                            echo json_encode([
                                'status' => 'success',
                                'employees' => $employees
                            ]);
                        } else {
                            header('Content-Type: application/json');
                            echo json_encode([
                                'status' => 'empty',
                                'employees' => []
                            ]);
                        }
                    }
                    break;
                }
            case 'office': {
                    if (isset($_POST['office'])) {
                        $office = $_POST['office'];
                        $conn3 = new DaoEmployee();
                        $employees = $conn3->getAllEmployeesInTheOffice($office);
                        if ($employees !== []) {
                            header('Content-Type: application/json');
                            echo json_encode([
                                'status' => 'success',
                                'employees' => $employees
                            ]);
                        } else {
                            header('Content-Type: application/json');
                            echo json_encode([
                                'status' => 'empty',
                                'employees' => []
                            ]);
                        }
                    }
                    break;
                }
            case 'allEmployees': {
                    $conn4 = new DaoEmployee();
                    $employees = $conn4->getAllEmployees();
                    if ($employees !== []) {
                        header('Content-Type: application/json');
                        echo json_encode([
                            'status' => 'success',
                            'employees' => $employees
                        ]);
                    }
                    break;
                }
            case 'deleteEmployees': {
                    if (isset($_POST['employees'])) {
                        $employees = explode(',', $_POST['employees']);
                        $conn3 = new DaoEmployee();
                        $state = true;
                        foreach ($employees as $employee) {
                            if (!$conn3->deleteEmployee((int)$employee)) {
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
                                'message' => 'Employees Deleted Successfully'
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
            case 'updatePhoto': {
                    if (isset($_FILES['newImage'], $_POST['userId'])) {
                        $userId = $_POST['userId'];
                        $image = $_FILES['newImage'];
                        $targetDir = "C:\\xampp\\htdocs\\images\\";
                        $targetFile = $targetDir . basename($image['name']);
                        move_uploaded_file($image['tmp_name'], $targetFile);
                        $imagePath = "images\\" . $image['name'];
                        $conn4 = new DaoEmployee();
                        $conn5 = new DaoUser();
                        $state = true;
                        $infos = $conn5->getUserInfos((int)$userId);
                        $employee = $infos['employee'];
                        if (!$conn4->updateEmployee(
                            (int)$employee['id'],
                            $employee['name'],
                            $employee['surname'],
                            $employee['email'],
                            $imagePath,
                            (int)$employee['age'],
                            (int)$employee['office'],
                            (int)$employee['service']
                        )) {
                            $state = false;
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
                                'message' => 'Image updated Successfully'
                            ]);
                        }
                    } else {
                        header('Content-Type: application/json');
                        echo json_encode([
                            'status' => 'failure',
                            'message' => 'Something went wrong2'
                        ]);
                    }
                    break;
                }
        }
    }
}
