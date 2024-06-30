<?php
require_once '../model/Group.php';
require_once "../dao/daoGroupMembers.php";
class DaoGroup
{

    private $db_conn;
    public function __construct()
    {
            $this->db_conn = new PDO("mysql:host=localhost;dbname=chat","root","");
    }

    public function createNewGroup($id,$name,$type,$image): bool
    {
        $query = "INSERT INTO `group`(`id`,`name`,`type`,`image`) VALUES (?,?,?,?)";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1, $id);
        $stm->bindParam(2, $name);
        $stm->bindParam(3, $type);
        $stm->bindParam(4, $image);
        return $stm->execute(); 
    }
    public function updateGroup($id, $name, $image): bool
    {
        $query = "UPDATE `group` SET `name`=?,`image`=? WHERE `id`=?";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1, $name);
        $stm->bindParam(2, $image);
        $stm->bindParam(3, $id);
        return $stm->execute();
    }
    public function deleteGroupWithId($id): bool
    {
        $query = "DELETE FROM `group` WHERE `id`=?";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1, $id);
        return $stm->execute();
    }

    public function deleteGroupWithName($name): bool
    {
        $query = "DELETE FROM `group` WHERE `name`=?";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1, $name);
        return $stm->execute();
    }

    public function getGroupInfos($id): array
    {
        $query = "SELECT * FROM `group` WHERE `id`=?";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1, $id);

        if ($stm->execute()) {
            $group = $stm->fetch(PDO::FETCH_ASSOC);
            if ($group !== []) {
                $conn2=new DaoGroupMembers();
                return array(
                    'id' => $group['id'],
                    'name' => $group['name'],
                    'type' => $group['type'],
                    'image' => $group['image'],
                    'numberOfMembers'=>$conn2->numberOfMembersInTheGroup((int)$group['id']),
                    'timestamp'=>$group['timestamp']
                );
            } else {
                return [];
            }
        } else {
            return [];
        }
    }
    public function getAllGroupInfos(): array
    {
        $allGroups=[];
        $query = "SELECT `id` FROM `group`";
        $stm = ($this->db_conn)->prepare($query);
        if ($stm->execute()) {
            $groups = $stm->fetchAll(PDO::FETCH_ASSOC);
            if ($groups !== []) {
               foreach ($groups as $group) {
                    $groupInfos=$this->getGroupInfos((int)$group['id']);
                    array_push($allGroups,$groupInfos);
                }
               return $allGroups; 
            } else {
                return [];
            }
        } else {
            return [];
        }
    }

    public function getNumberOfGroups()
    {
        $query = "SELECT MAX(`id`) as `numberOfGroups`  FROM `group`";
        $stm = ($this->db_conn)->prepare($query);

        if ($stm->execute()) {
            $number = $stm->fetch(PDO::FETCH_ASSOC);
            return (int)$number['numberOfGroups'];
        }
    }


}
