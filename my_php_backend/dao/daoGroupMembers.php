<?php
require_once "../model/GroupMembers.php";
require_once "../dao/daoGroup.php";
require_once "../dao/daoUser.php";
require_once "../dao/daoRole.php";
class DaoGroupMembers
{
    private $db_conn;

    public function __construct()
    {
        $this->db_conn = new PDO("mysql:host=localhost;dbname=chat","root","");
    }

    public function findUserGroups($userId): array 
    {
        $userGroups = array();
        $query = "SELECT `group`,`start`,`end` FROM `group_members` WHERE `member`=?";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1, $userId);

        if ($stm->execute()) {
            $rows = $stm->fetchAll(PDO::FETCH_ASSOC);
            if($rows ===[]){
                return [];
            }else{
                $subConn=new DaoGroup();
                foreach ($rows as $row) {
                    $singleGroupInfos=$subConn->getGroupInfos((int)$row['group']);
                    array_push($userGroups,['group'=> $singleGroupInfos,'start'=>$row['start'],'end'=>$row['end']]);
                }
                return $userGroups;
            }
        }else{
            return [];
        }
    }
    public function isUserInTheGroup($userId,$groupId): bool
    {
        $query = "SELECT * FROM `group_members` WHERE `member`=? AND `group`=?";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1, $userId);
        $stm->bindParam(2,$groupId);
        if ($stm->execute()) {
            $rows = $stm->fetchAll(PDO::FETCH_ASSOC);
            return $rows === [];
        } 
    }
    
    public function findDateOfIntegrationAndLeavingOtTheUserInTheGroup($group,$member): array
    {
        $query = "SELECT `start`,`end` FROM `group_members` WHERE `group`=? AND `member`=?";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1, $group);
        $stm->bindParam(2, $member);
        if ($stm->execute()) {
            $row = $stm->fetch(PDO::FETCH_ASSOC);
            if ($row === []) {
                return [];
            } else {
                return [
                    'group'=>$group,
                    'member'=>$member,
                    'start'=>$row['start'],
                    'end'=>$row['end']
                ];
            }
        } else {
            return [];
        }
    }
    
    public function findUserGroupsWithTheRole($userId,$role): array
    { 
        $Groups = array();
        $query = "SELECT `group`,`start`,`end` FROM `group_members` WHERE `member`=? AND `role`=?";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1, $userId);
        $stm->bindParam(2, $role);
        if ($stm->execute()) {
            $rows = $stm->fetchAll(PDO::FETCH_ASSOC);
            if ($rows === []) {
                return [];
            } else {
                $conn=new DaoGroup();
                foreach ($rows as $row) {
                    $groupInfos=$conn->getGroupInfos((int)$row['group']);
                    array_push($Groups, ['group' => $groupInfos, 'start' => $row['start'], 'end' => $row['end']]);
                }
                $conn=null;
                return $Groups;
            }
        } else {
            return [];
        }
    }

    public function findUsersWhoHaveTheRoleInTheGroup($group,$role): array
    {
        $usersInfos = array();
        $query = "SELECT `member` FROM `group_members` WHERE `group`=? AND `role`=?";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1, $group);
        $stm->bindParam(2, $role);
        if ($stm->execute()) {
            $rows = $stm->fetchAll(PDO::FETCH_ASSOC);
            if ($rows === []) {
                return [];
            } else {
                $conn=new DaoUser();
                foreach ($rows as $row) {
                    $userInfos=$conn->getUserInfos((int)$row['member']);
                    array_push($usersInfos,$userInfos);
                }
                $conn=null;
                return $usersInfos;
            }
        } else {
            return [];
        }
    }

    public function addUserToGroup($id,$group,$member,$role): bool
    {
        $query = "INSERT INTO `group_members`(`id`,`group`,`member`,`role`) VALUES(?,?,?,?)";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1, $id);
        $stm->bindParam(2, $group);
        $stm->bindParam(3,$member);
        $stm->bindParam(4,$role);
        return $stm->execute();
    }

    public function removeUserFromGroup($group,$member): bool
    {
        $query = "DELETE FROM `group_members` WHERE `group`=? AND `member`=?";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1, $group);
        $stm->bindParam(2, $member);
        return $stm->execute();
    }
    public function getGroupMembersIds($group): array
    {
        $allIds=[];
        $query = "SELECT `member` FROM `group_members` WHERE `group`=?";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1, $group);
        $stm->execute();
        $ids=$stm->fetchAll(PDO::FETCH_ASSOC);
       if($ids!==[]){
            foreach ($ids as $id) {
                array_push($allIds,$id['member']);
            }
            return $allIds;
       }else{
        return [];
       }
    }

    public function setMemberRoleInTheGroup($group, $member,$newRole): bool
    {
        $query = "UPDATE `group_members` SET `role`=? WHERE `group`=? AND `member`=?";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1,$newRole);
        $stm->bindParam(2, $group);
        $stm->bindParam(3, $member);
        return $stm->execute();
    }
    public function numberOfMembersInTheGroup($group)
    {
        $query = "SELECT COUNT(*) as `numberOfMembers` FROM `group_members` WHERE `group`=?";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1, $group);

        if ($stm->execute()) {
            $result = $stm->fetch(PDO::FETCH_ASSOC);
            return (int)$result['numberOfMembers'];
        } 
    }
   
    public function getAllUsersInfosBelongingToTheGroup($group): array
    // [ ['member'=>['id'=>userId,'employee'=>id],'role'=>role], ]  
    {
        $allInfos = array();
        $query = "SELECT `member`,`role`  FROM `group_members` WHERE `group`=?";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1, $group);

        if($stm->execute()) {
            $members_roles = $stm->fetchAll(PDO::FETCH_ASSOC);
            if ($members_roles !== []) {
                $conn=new DaoUser();
                $conn2=new DaoRole();
                foreach ($members_roles as $member_role) {
                    $user_role_table = ['member'=>$conn->getUserInfos((int)$member_role['member']),'role'=>$conn2->getRoleInfos((int)$member_role['role'])];
                    array_push($allInfos,$user_role_table);
                }
                $conn=null;
                $conn2=null;
                return $allInfos;
            } else {
                return [];
            }
        } else {
            return [];
        }
    }
    public function getNumberOfGroupsMembers()
    {
        $query = "SELECT MAX(`id`) as `numberOfGroupsMembers`  FROM `group_members`";
        $stm = ($this->db_conn)->prepare($query);

        if ($stm->execute()) {
            $number = $stm->fetch(PDO::FETCH_ASSOC);
            return (int)$number['numberOfGroupsMembers'];
        }
    }
}
