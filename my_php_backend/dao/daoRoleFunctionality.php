<?php
require_once "../model/RoleFunctionality.php";
require_once "../dao/daoFunctionality.php";
require_once  "../dao/daoRole.php";

class DaoRoleFunctionality
{
    private $db_conn;

    public function __construct()
    {
        $this->db_conn = new PDO("mysql:host=localhost;dbname=chat","root","");
    }

    public function getRoleFunctionalityInfos($id): array
    {
        $query = "SELECT * FROM `role_functionality` WHERE `id`=?";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1, $id);
        if ($stm->execute()) {
            $item = $stm->fetch(PDO::FETCH_ASSOC);
            if ($item !== []) {
                return array(
                    'id' => $item['id'],
                    'role' => $item['role'],
                    'functionality' => $item['functionality']
                );
            } else {
                return [];
            }
        } else {
            return [];
        }
    }

    public function numberOfItems()
    {
        $query = "SELECT MAX(`id`) AS `number` FROM `role_functionality`";
        $stm = ($this->db_conn)->prepare($query);
        if ($stm->execute()) {
            $result = $stm->fetch(PDO::FETCH_ASSOC);
            return (int)$result['number'];
        }
    }

    public function getAllFunctionalitiesOfTheRole($roleId): array
    {
        $All=array();
        $query = "SELECT `functionality` FROM `role_functionality` WHERE `role`=? ";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1, $roleId);
        if ($stm->execute()) {
            $functionalitiesIds = $stm->fetchALL(PDO::FETCH_ASSOC);
            if ($functionalitiesIds !== []) {
                $conn1=new DaoFunctionality();
                foreach ($functionalitiesIds as $functionality) {
                  $functionalityInfos=$conn1->getFunctionalityInfos((int)$functionality['functionality']);
                  array_push($All,$functionalityInfos);      
                }
                $conn1=null;
                return $All;
            } else {
                return [];
            }
        } else {
            return [];
        }
    }
   

    public function removeRoleFunctionality($roleId,$functionalityId)
    {
        $query = "DELETE FROM `role_functionality` WHERE `role`=? AND `functionality`=?";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1, $roleId);
        $stm->bindParam(2, $functionalityId);
        return $stm->execute();
    }
    public function removeAllRoleFunctionalities($roleId)
    {
        $query = "DELETE FROM `role_functionality` WHERE `role`=?";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1, $roleId);
        return $stm->execute();
    }
    public function removeRoleFunctionalityWithId($id): bool
    {
        $query = "DELETE FROM `role_functionality` WHERE `id`=? ";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1, $id);
        return $stm->execute();
    }

    public function getAllRoleFunctionalityInfos(): array
    {
        $All = array();
        $query = "SELECT * FROM `role_functionality`";
        $stm = ($this->db_conn)->prepare($query);

        if ($stm->execute()) {
            $items = $stm->fetchAll(PDO::FETCH_ASSOC);
            if ($items !== []) {
                foreach ($items as $item) {
                    array_push($All, $this->getRoleFunctionalityInfos((int)$item['id']));
                }
                return $All;
            } else {
                return [];
            }
        } else {
            return [];
        }
    }
  
    public function insertNewRoleFunctionality($id,$roleId,$functionalityId): bool
    {
        $query = "INSERT INTO `role_functionality`(`id`,`role`,`functionality`) VALUES(?,?,?)";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1, $id);
        $stm->bindParam(2, $roleId);
        $stm->bindParam(3, $functionalityId);
        return $stm->execute();
    }

}
