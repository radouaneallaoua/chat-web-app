<?php
require_once "../model/Service.php";

class DaoService
{
    private $db_conn;

    public function __construct()
    {
        $this->db_conn = new PDO("mysql:host=localhost;dbname=chat","root","");
    }

    public function getServiceInfosWithId($id): array
    {
        $query = "SELECT * FROM `service` WHERE `id`=? ";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1, $id);
        if ($stm->execute()) {
            $service = $stm->fetch(PDO::FETCH_ASSOC);
            if ($service !== []) {
                return array(
                    'id' => $service['id'],
                    'label' => $service['label'],
                    'office'=>$service['office']
                );
            } else {
                return [];
            }
        } else {
            return [];
        }
    }

   
    public function getAllServicesInfos(): array
    {
        $All = array();
        $query = "SELECT * FROM `service`";
        $stm = ($this->db_conn)->prepare($query);
        if ($stm->execute()) {
            $services = $stm->fetchAll(PDO::FETCH_ASSOC);
            if ($services !== []) {
                foreach ($services as $service) {
                    $infos= $this->getServiceInfosWithId((int)$service['id']);
                    array_push($All,$infos);
                }
                return $All;
            } else {
                return [];
            }
        } else {
            return [];
        }
    }

    public function getAllServicesBelongingToTheOffice($officeId): array
    {
        $All = array();
        $query = "SELECT * FROM `service` WHERE `office`= ?";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1,$officeId);
        if ($stm->execute()) {
            $services = $stm->fetchAll(PDO::FETCH_ASSOC);
            if ($services !== []) {
                foreach ($services as $service) {
                    $infos=$this->getServiceInfosWithId((int)$service['id']);
                    array_push($All, $infos);
                }
                return $All;
            } else {
                return $All;
            }
        } else {
            return $All;
        }
    }
    public function removeAllOfficeServices($officeId)
    {
        $query = "DELETE FROM `service` WHERE `office`=?";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1, $officeId);
        return $stm->execute();
    }
    public function insertNewService($id,$label,$office): bool
    {
        $query = "INSERT INTO `service`(`id`,`label`,`office`) VALUES(?,?,?)";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1,$id);
        $stm->bindParam(2,$label);
        $stm->bindParam(3,$office);
        return $stm->execute();
    }

    public function deleteServiceWithId($id): bool
    {
        $query = "DELETE FROM `service` WHERE `id`=?";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1, $id);
        return $stm->execute();
    }

  
    public function getNumberOfServices()
    {
        $query = "SELECT MAX(`id`) as `numberOfServices` FROM `service`";
        $stm = ($this->db_conn)->prepare($query);

        if ($stm->execute()) {
            $number = $stm->fetch(PDO::FETCH_ASSOC);
            return (int)$number['numberOfServices'];
        }
    }

}
