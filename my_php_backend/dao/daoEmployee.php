<?php
require_once "../model/Employee.php";

class DaoEmployee
{
    private $db_conn;
    public function __construct()
    {
        $this->db_conn = new PDO("mysql:host=localhost;dbname=chat","root","");
    }


    public function findEmployee($email): array   
    {
        $query = "SELECT * FROM `employee` WHERE `email`=?";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1, $email);

        if ($stm->execute()) {
            $employee = $stm->fetch(PDO::FETCH_ASSOC);
            if ($employee !== []) {
                return array(
                    'id' => $employee['id'],
                    'name' => $employee['name'],
                    'surname' => $employee['surname'],
                    'email' => $employee['email'],
                    'image' => $employee['image'],
                    'age' => $employee['age'],
                    'office' => $employee['office'],
                    'service' => $employee['service']
                );
            } else {
                return [];
            }
        } else {
            return [];
        }
    }


    public function findEmployeeFromNameAndSurname($name, $surname): array
    {
        $query = "SELECT * FROM `employee` WHERE `name`= ? AND `surname`=?";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1, $name);
        $stm->bindParam(2, $surname);

        if ($stm->execute()) {
            $employee = $stm->fetch(PDO::FETCH_ASSOC);
            if ($employee !== []) {
                return array(
                    'id' => $employee['id'],
                    'name' => $employee['name'],
                    'surname' => $employee['surname'],
                    'email' => $employee['email'],
                    'image' => $employee['image'],
                    'age' => $employee['age'],
                    'office' => $employee['office'],
                    'service' => $employee['service']
                );
            } else {
                return [];
            }
        } else {
            return [];
        }
    }

    public function getEmployeeInfos($id): array
    {
        $query = "SELECT * FROM `employee` WHERE `id`=?";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1, $id);

        if ($stm->execute()) {
            $employee = $stm->fetch(PDO::FETCH_ASSOC);
            if ($employee !== []) {
                return array(
                    'id' => $employee['id'],
                    'name' => $employee['name'],
                    'surname' => $employee['surname'],
                    'email' => $employee['email'],
                    'image' => $employee['image'],
                    'age' => $employee['age'],
                    'office' => $employee['office'],
                    'service' => $employee['service']
                );
            } else {
                return [];
            }
        } else {
            return [];
        }
    }
  
    public function getAllEmployees(): array
    {
        $allEmployees = array();
        $query = "SELECT * FROM `employee`";
        $stm = ($this->db_conn)->prepare($query);
        if ($stm->execute()) {
            $employees = $stm->fetchAll(PDO::FETCH_ASSOC);
            if ($employees !== []) {
                foreach ($employees as $employee) {
                    $id = $employee['id'];
                    $singleEmployeeInfos = $this->getEmployeeInfos((int)$id);
                    array_push($allEmployees, $singleEmployeeInfos);
                }
                return $allEmployees;
            } else {
                return [];
            }
        } else {
            return [];
        }
    }

    public function getAllEmployeesInTheOffice($office): array
    {
        $allEmployees = array();
        $query = "SELECT * FROM `employee` WHERE `office`=?";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1,$office);
        if ($stm->execute()) {
            $employees = $stm->fetchAll(PDO::FETCH_ASSOC);
            if ($employees !== []) {
                foreach ($employees as $employee) {
                    $id = $employee['id'];
                    $singleEmployeeInfos = $this->getEmployeeInfos((int)$id);
                    array_push($allEmployees, $singleEmployeeInfos);
                }
                return $allEmployees;
            } else {
                return [];
            }
        } else {
            return [];
        }
    }
    public function getAllEmployeesInTheOfficeInTheService($office,$service): array
    {
        $allEmployees = array();
        $query = "SELECT * FROM `employee` WHERE `office`=? AND `service`=?";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1, $office);
        $stm->bindParam(2, $service);
        if ($stm->execute()) {
            $employees = $stm->fetchAll(PDO::FETCH_ASSOC);
            if ($employees !== []) {
                foreach ($employees as $employee) {
                    $id = $employee['id'];
                    $singleEmployeeInfos = $this->getEmployeeInfos((int)$id);
                    array_push($allEmployees, $singleEmployeeInfos);
                }
                return $allEmployees;
            } else {
                return [];
            }
        } else {
            return [];
        }
    }
    public function insertNewEmployee($id,$name,$surname,$email,$image,$age,$office,$service)
    {
            $query = "INSERT INTO `employee`(`id`,`name`,`surname`,`email`,`image`,`age`,`office`,`service`) VALUES(?,?,?,?,?,?,?,?)";
            $stm = ($this->db_conn)->prepare($query);
            $stm->bindParam(1, $id);
            $stm->bindParam(2, $name);
            $stm->bindParam(3, $surname);
            $stm->bindParam(4, $email);
            $stm->bindParam(5, $image);
            $stm->bindParam(6,$age);
            $stm->bindParam(7,$office);
            $stm->bindParam(8,$service);
            return $stm->execute();
    }
    public function updateEmployee($id, $name, $surname, $email, $image, $age, $office, $service): bool
    {
       
        $query = "UPDATE `employee` SET `name`=?,`surname`=?,`email`=?,`image`=?,`age`=?,`office`=?,`service`=? WHERE `id`=?";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1,$name);
        $stm->bindParam(2,$surname);
        $stm->bindParam(3,$email);
        $stm->bindParam(4,$image);
        $stm->bindParam(5,$age);
        $stm->bindParam(6, $office);
        $stm->bindParam(7,$service);
        $stm->bindParam(8, $id);
        return $stm->execute();
    }
    public function deleteEmployee($id): bool
    {
        $query = "DELETE FROM `employee` WHERE `id`=?";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1,$id);
        return $stm->execute();
    }

    public function numberOfEmployees()
    {
        $query = "SELECT MAX(`id`) AS `numberOfEmployees` FROM `employee`";
        $stm = ($this->db_conn)->prepare($query);
        if ($stm->execute()) {
            $result = $stm->fetch(PDO::FETCH_ASSOC);
            return (int)$result['numberOfEmployees'];
        }
    }
}
