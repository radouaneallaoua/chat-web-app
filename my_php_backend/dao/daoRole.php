<?php
require_once "../model/Role.php";

class DaoRole
{
    private $db_conn;
    public function __construct()
    {
        $this->db_conn = new PDO("mysql:host=localhost;dbname=chat", "root", "");
    }

    public function getRoleInfos($id): array
    {
        $query = "SELECT * FROM `role` WHERE `id`=?";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1, $id);
        if ($stm->execute()) {
            $role = $stm->fetch(PDO::FETCH_ASSOC);
            if ($role !== []) {
                return array(
                    'id' => $role['id'],
                    'label' => $role['label']
                );
            } else {
                return [];
            }
        } else {
            return [];
        }
    }

    public function updateLabel($roleId, $roleLabel)
    {
        $query = "UPDATE `role` SET `label`=? WHERE `id`=?";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1, $roleLabel);
        $stm->bindParam(2, $roleId);
        return $stm->execute();
    }
    
    public function getRoleInfosWithLabel($label): array
    {
        $query = "SELECT * FROM `role` WHERE `label`=?";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1, $label);
        if ($stm->execute()) {
            $role = $stm->fetch(PDO::FETCH_ASSOC);
            if ($role !== []) {
                return array(
                    'id' => $role['id'],
                    'label' => $role['label']
                );
            } else {
                return [];
            }
        } else {
            return [];
        }
    }

    public function removeRoleWithLabel($label): bool
    {
        $query = "DELETE FROM `role` WHERE `label`=?";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1, $label);
        return $stm->execute();
    }
    public function removeRoleWithId($id): bool
    {
        $query = "DELETE FROM `role` WHERE `id`=?";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1, $id);
        return $stm->execute();
    }
    public function getAllRolesInfos(): array
    {
        $All = array();
        $query = "SELECT * FROM `role`";
        $stm = ($this->db_conn)->prepare($query);

        if ($stm->execute()) {
            $roles = $stm->fetchAll(PDO::FETCH_ASSOC);
            if ($roles !== []) {
                foreach ($roles as $role) {
                    array_push($All, $this->getRoleInfos((int)$role['id']));
                }
                return $All;
            } else {
                return $All;
            }
        } else {
            return $All;
        }
    }
    public function insertNewRole($id, $label): bool
    {
        $query = "INSERT INTO `role`(`id`,`label`) VALUES(?,?)";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1, $id);
        $stm->bindParam(2, $label);
        return $stm->execute();
    }

    public function numberOfRoles()
    {
        $query = "SELECT MAX(`id`) AS `numberOfRoles` FROM `role`";
        $stm = ($this->db_conn)->prepare($query);
        if ($stm->execute()) {
            $result = $stm->fetch(PDO::FETCH_ASSOC);
            return (int)$result['numberOfRoles'];
        }
    }
}
