<?php
require_once "../model/Office.php";

class DaoOffice
{
    private $db_conn;

    public function __construct()
    {
        $this->db_conn = new PDO("mysql:host=localhost;dbname=chat","root","");
    }

    public function getOfficeInfos($id): array
    {
        $query = "SELECT * FROM `office` WHERE `id`=?";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1, $id);
        if ($stm->execute()) {
            $office = $stm->fetch(PDO::FETCH_ASSOC);
            if ($office !== []) {
                return array(
                    'id' => $office['id'],
                    'label' => $office['label']
                );
            } else {
                return [];
            }
        } else {
            return [];
        }
    }

    public function updateLabel($officeId, $officeLabel)
    {
        $query = "UPDATE `office` SET `label`=? WHERE `id`=?";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1, $officeLabel);
        $stm->bindParam(2, $officeId);
        return $stm->execute();
    }

    public function updateOffice($id,$label){
        $query = "UPDATE `office` SET `label`=? WHERE `id`=?";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1, $label);
        $stm->bindParam(2, $id);
        return $stm->execute();
    }

    public function removeOfficeWithId($id)
    {
        $query = "DELETE FROM `office` WHERE `id`=? ";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1, $id);
        return $stm->execute();
    }
    public function getAllOfficesInfos(): array
    // [['id'=>officeId,'label'=>officeLabel],['id'=>officeId2,'label'=>officeLabel2],...]
    {
        $All = array();
        $query = "SELECT * FROM  office";
        $stm = ($this->db_conn)->prepare($query);

        if ($stm->execute()) {
            $offices = $stm->fetchAll(PDO::FETCH_ASSOC);
            if ($offices !== []) {
                foreach ($offices as $office) {
                    array_push($All, $this->getOfficeInfos((int)$office['id']));
                }
                return $All;
            } else {
                return [];
            }
        } else {
            return [];
        }
    }

    public function insertNewOffice($id,$label): bool
    {
        $query = "INSERT INTO `office`(`id`,`label`) VALUES(?,?)";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1, $id);
        $stm->bindParam(2, $label);
        return $stm->execute();
    }

    public function getNumberOfOffices()
    {
        $query = "SELECT MAX(`id`) as `numberOfOffices`  FROM `office`";
        $stm = ($this->db_conn)->prepare($query);

        if ($stm->execute()) {
            $number = $stm->fetch(PDO::FETCH_ASSOC);
            return (int)$number['numberOfOffices'];
        }
    }

}
