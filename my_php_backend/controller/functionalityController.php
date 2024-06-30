<?php
require_once "../dao/daoFunctionality.php";
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');




if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_GET['action'])) {
        $action = $_GET['action'];
        switch ($action) {
            case "allFunctionalities": {
                    $conn = new DaoFunctionality();
                    $functionalities = $conn->getAllFunctionalitiesInfos();
                    if ($functionalities !== []) {
                        header('Content-Type: application/json');
                        echo json_encode([
                            'status' => 'success',
                            'infos' => $functionalities
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
        }
    }
}
