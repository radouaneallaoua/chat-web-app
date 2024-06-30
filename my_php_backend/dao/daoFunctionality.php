<?php
require_once "../model/Functionality.php";

class DaoFunctionality
{
    private $db_conn;

    public function __construct()
    {
         $this->db_conn = new PDO("mysql:host=localhost;dbname=chat","root","");
    }

    public function getFunctionalityInfos($id): array
    {
        $query = "SELECT * FROM `functionality` WHERE `id`=? ";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1, $id);
        if ($stm->execute()) {
            $functionality = $stm->fetch(PDO::FETCH_ASSOC);
            if ($functionality !== []) {
                return array(
                    'id' => $functionality['id'],
                    'label' => $functionality['label']
                );
            } else {
                return [];
            }
        } else {
            return [];
        }
    }

    public function getFunctionalityInfosWithLabel($label): array
    {
        $query = "SELECT * FROM `functionality` WHERE `label`=? ";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1, $label);
        if ($stm->execute()) {
            $functionality = $stm->fetch(PDO::FETCH_ASSOC);
            if ($functionality !== []) {
                return array(
                    'id' => $functionality['id'],
                    'label' => $functionality['label']
                );
            } else {
                return [];
            }
        } else {
            return [];
        }
    }

    public function removeFunctionalityWithLabel($label): bool
    {
        $query = "DELETE FROM  `functionality` WHERE `label`=? ";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1, $label);
        return $stm->execute();
    }
    public function removeFunctionalityWithId(int $id): bool
    {
        $query = "DELETE FROM `functionality` WHERE `id`=?";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1, $id);
        return $stm->execute();
    }
    public function getAllFunctionalitiesInfos(): array
    {
        $All = array();
        $query = "SELECT * FROM `functionality`";
        $stm = ($this->db_conn)->prepare($query);

        if ($stm->execute()) {
            $functionalities = $stm->fetchAll(PDO::FETCH_ASSOC);
            if ($functionalities !== []) {
                foreach ($functionalities as $functionality) {
                    array_push($All, $this->getFunctionalityInfos($functionality['id']));
                }
                return $All;
            } else {
                return $All;
            }
        } else {
            return $All;
        }
    }
    public function insertNewFunctionality($id,$label): bool
    {
        $query = "INSERT INTO `functionality`(`id`,`label`) VALUES(?,?)";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1, $id);
        $stm->bindParam(2, $label);
        return $stm->execute();
    }

    public function deleteFunctionalityWithId($id): bool
    {
        $query = "DELETE FROM `functionality` WHERE `id`=?";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1, $id);
        return $stm->execute();
    }

    public function deleteFunctionalityWithLabel($label): bool
    {
        $query = "DELETE FROM `functionality` WHERE `label`=?";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1, $label);
        return $stm->execute();
    }
}
