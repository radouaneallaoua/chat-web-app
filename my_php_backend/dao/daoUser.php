<?php
require_once "../model/User.php";
require_once "../dao/daoEmployee.php";
class DaoUser
{
    private $db_conn;

    public function __construct()
    {
        $this->db_conn = new PDO("mysql:host=localhost;dbname=chat", "root", "");
    }


    public function findUser($name, $surname, $password): array
    {
        $employeePart = new DaoEmployee();
        $exists = $employeePart->findEmployeeFromNameAndSurname($name, $surname);
        $employeePart = null;
        if ($exists != []) {
            $query = "SELECT * FROM `user` WHERE `password`=? AND `employee`=?";
            $stm = ($this->db_conn)->prepare($query);
            $stm->bindParam(1, $password);
            $stm->bindParam(2, $exists['id']);
            if ($stm->execute()) {
                $user = $stm->fetch(PDO::FETCH_ASSOC);
                if ($user != []) {
                    return [
                        'id' => $user['id'],
                        'employee' => $exists,
                        'password' => $user['password'],
                        'role' => $user['role'],
                        'token' => $user['token']
                    ];
                } else {
                    return [];
                }
            } else {
                return [];
            }
        } else {
            return [];
        }
    }


    public function findUserFromEmail($email): array
    {
        $employeePart = new DaoEmployee();
        $employee = $employeePart->findEmployee($email);
        return $employee;
    }

    public function getUserInfos($id): array
    {
        $query = "SELECT * FROM `user` WHERE `id`=? ";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1, $id);

        if ($stm->execute()) {
            $user = $stm->fetch(PDO::FETCH_ASSOC);
            if ($user !== []) {
                $employee = $user['employee'];
                $employeePart = new DaoEmployee();
                $employeeInfos = $employeePart->getEmployeeInfos($employee);
                return array(
                    'id' => $user['id'],
                    'employee' => $employeeInfos,
                    'password' => $user['password'],
                    'role' => $user['role'],
                    'token' => $user['token']
                );
            } else {
                return [];
            }
        } else {
            return [];
        }
    }
    public function deleteUser($employee): bool
    {
        $query = "DELETE FROM `user` WHERE `employee`=?";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1, $employee);
        return $stm->execute();
    }
    public function deleteUserWithId($id): bool
    {
        $query = "DELETE FROM `user` WHERE `id`=?";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1, $id);
        return $stm->execute();
    }

    public function getAllUsers(): array
    {
        $allUsers = array();
        $query = "SELECT * FROM `user`";
        $stm = ($this->db_conn)->prepare($query);
        if ($stm->execute()) {
            $users = $stm->fetchAll(PDO::FETCH_ASSOC);
            if ($users !== []) {
                foreach ($users as $user) {
                    $id = $user['id'];
                    $singleUserInfos = $this->getUserInfos($id);
                    array_push($allUsers, $singleUserInfos);
                }
                return $allUsers;
            } else {
                return [];
            }
        } else {
            return [];
        }
    }
    public function getAllActiveUsers(): array
    {
        $allUsers = array();
        $query = "SELECT * FROM `activeusers`";
        $stm = ($this->db_conn)->prepare($query);
        if ($stm->execute()) {
            $users = $stm->fetchAll(PDO::FETCH_ASSOC);
            if ($users !== []) {
                foreach ($users as $user) {
                    array_push($allUsers, $user['userId']);
                }
                return $allUsers;
            } else {
                return [];
            }
        } else {
            return [];
        }
    }

    public function findUserToken($token): array
    {
        $query = "SELECT * FROM `user` WHERE `token`=?";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1, $token);
        if ($stm->execute()) {
            $user = $stm->fetch(PDO::FETCH_ASSOC);
            if ($user !== []) {
                return $this->getUserInfos((int)$user['id']);
            } else {
                return [];
            }
        } else {
            return [];
        }
    }


    public function updateUserToken($email, $token): bool
    {
        $result = $this->findUserFromEmail($email);
        if ($result !== []) {
            $employeeId = (int)$result['id'];
            $query = "UPDATE `user` SET `token`=? WHERE `employee`=?";
            $stm = ($this->db_conn)->prepare($query);
            $stm->bindParam(1, $token);
            $stm->bindParam(2, $employeeId);
            return $stm->execute();
        } else {
            return false;
        }
    }


    public function updateUserPassword($email, $newPassword): bool
    {
        $employee = new DaoEmployee();
        $result = $employee->findEmployee($email);
        if ($result !== []) {
            $employeeId = (int)$result['id'];
            $query = "UPDATE `user` SET `password`=? WHERE `employee`=?";
            $stm = ($this->db_conn)->prepare($query);
            $stm->bindParam(1, $newPassword);
            $stm->bindParam(2, $employeeId);
            return $stm->execute();
        } else {
            return false;
        }
    }
    public function getAllUsersWithTheRole($roleId): array
    {
        $allIds = [];
        $query = "SELECT `id` FROM `user` WHERE `role`=?";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1, $roleId);

        if ($stm->execute()) {
            $ids = $stm->fetchAll(PDO::FETCH_ASSOC);
            if ($ids !== []) {
                foreach ($ids as $id) {
                    array_push($allIds, (int)$id['id']);
                }
                return $allIds;
            } else {
                return [];
            }
        } else {
            return [];
        }
    }

    public function updateUserRole($userId, $roleId)
    {
        $query = "UPDATE `user` SET `role`=? WHERE `id`=?";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1, $roleId);
        $stm->bindParam(2, $userId);
        return $stm->execute();
    }
    public function resetToken($email): bool
    {
        $employee = new DaoEmployee();
        $result = $employee->findEmployee($email);
        if ($result !== []) {
            $employeeId = (int)$result['id'];
            $query = "UPDATE `user` SET `token`=? WHERE `employee`=?";
            $stm = ($this->db_conn)->prepare($query);
            $stm->bindParam(1, $newPassword);
            $stm->bindParam(2, $employeeId);
            return $stm->execute();
        } else {
            return false;
        }
    }


    public function insertNewUser($id, $employeeId, $password, $role, $token)
    {
        $query = "INSERT INTO `user`(`id`,`employee`,`password`,`role`,`token`)  VALUES(?,?,?,?,?)";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1, $id);
        $stm->bindParam(2, $employeeId);
        $stm->bindParam(3, $password);
        $stm->bindParam(4, $role);
        $stm->bindParam(5, $token);
        return $stm->execute();
    }
    public function insertActiveUser($id, $userId)
    {
        $query = "INSERT INTO `activeusers`(`id`,`userId`)  VALUES(?,?)";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1, $id);
        $stm->bindParam(2, $userId);
        return $stm->execute();
    }

    public function removeActiveUser($userId)
    {
        $query = "DELETE FROM `activeusers` WHERE `userId`=?";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1, $userId);
        return $stm->execute();
    }

    public function updateUser($id, $employeeId, $name, $surname, $email, $image, $age, $office, $service, $password, $role, $token): bool
    {
        $sub = new DaoEmployee();
        if ($sub->updateEmployee($employeeId, $name, $surname, $email, $image, $age, $office, $service)) {
            $sub = null;
            $query = "UPDATE `user` SET `password`=?,`role`=?,`token`=?  WHERE `id`=? AND `employee`=?";
            $stm = ($this->db_conn)->prepare($query);
            $stm->bindParam(1, $password);
            $stm->bindParam(2, $role);
            $stm->bindParam(3, $token);
            $stm->bindParam(4, $id);
            $stm->bindParam(5, $employeeId);
            return $stm->execute();
        } else {
            return false;
        }
    }

    public function numberOfUsers(): int
    {
        $query = "SELECT MAX(`id`) AS `numberOfUsers` FROM `user`";
        $stm = ($this->db_conn)->prepare($query);
        if ($stm->execute()) {
            $result = $stm->fetch(PDO::FETCH_ASSOC);
            return (int)$result['numberOfUsers'];
        }
    }
    public function numberOfActiveUsers()
    {
        $query = "SELECT MAX(`id`) AS `numberOfActiveUsers` FROM `activeusers`";
        $stm = ($this->db_conn)->prepare($query);
        if ($stm->execute()) {
            $result = $stm->fetch(PDO::FETCH_ASSOC);
            return (int)$result['numberOfActiveUsers'];
        }
    }
}
