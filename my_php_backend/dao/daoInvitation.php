<?php
require_once "../model/Invitation.php";

class DaoInvitation
{
    private $db_conn;

    public function __construct()
    {
      
         $this->db_conn = new PDO("mysql:host=localhost;dbname=chat","root","");
    }

    public function addInvitation($id,$sender,$group,$recipient,$status): bool
    {
        $query = "INSERT INTO `invitation` (`id`,`sender`,`group`,`recipient`,`status`) VALUES (?,?,?,?,?)";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1, $id);
        $stm->bindParam(2, $sender);
        $stm->bindParam(3, $group);
        $stm->bindParam(4, $recipient);
        $stm->bindParam(5, $status);
        return  $stm->execute();
    }
    
    public function deleteInvitation($invitationId): bool
    {
        $query = "DELETE FROM `invitation` WHERE `id`=?";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1, $invitationId);
        return  $stm->execute();
    }

    public function getInfosInvitation($id): array
    {
        $query = "SELECT * FROM `invitation` WHERE `id`= ?";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1, $id);

        if ($stm->execute()) {
            $invitation = $stm->fetch(PDO::FETCH_ASSOC);
            if ($invitation !== []) {
                return array(
                    'id' => $invitation['id'],
                    'sender' => $invitation['sender'],
                    'group' => $invitation['group'],
                    'recipient' => $invitation['recipient'],
                    'status' => $invitation['status'],
                    'timestamp' => $invitation['timestamp'],
                );
            } else {
                return [];
            }
        } else {
            return [];
        }
    }
    public function updateInvitationInfos($id,$status)
    {
          $query="UPDATE `invitation` SET `status`=? WHERE `id`=?";
          $stm=($this->db_conn)->prepare($query);
          $stm->bindParam(1,$status);
          $stm->bindParam(2, $id); 
          return $stm->execute();
    }
    public function findAllInvitationOfTheGroup($group):array
    {
        $invitations = array();
        $query = "SELECT `id` FROM `invitation` WHERE `group`=? ";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1, $group);

        if ($stm->execute()) {
            $rows= $stm->fetchALL(PDO::FETCH_ASSOC);
            if($rows === []){
                return [];
            }else{
                foreach($rows as $row){
                    $singleInvitationInfos=$this->getInfosInvitation((int)$row['id']);
                    array_push($invitations,$singleInvitationInfos);
                }
                return $invitations;
            }
        } else {
            return [];
        }
    }

    public function findAllInvitationOfTheRecipient($recipientId): array
    {
        $invitations = array();
        $query = "SELECT `id` FROM `invitation` WHERE `recipient`=?";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1,$recipientId);

        if ($stm->execute()) {
            $rows = $stm->fetchALL(PDO::FETCH_ASSOC);
            if ($rows === []) {
                return [];
            } else {
                foreach ($rows as $row) {
                    $singleInvitationInfos=$this->getInfosInvitation((int)$row['id']);
                    array_push($invitations,$singleInvitationInfos);
                }
                return $invitations;
            }
        } else {
            return [];
        }
    }
    public function findAllInvitationOfTheSender($senderId): array
    {
        $invitations = array();
        $query = "SELECT `id` FROM `invitation` WHERE `sender`=? ";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1, $senderId);

        if ($stm->execute()) {
            $rows = $stm->fetchALL(PDO::FETCH_ASSOC);
            if ($rows === []) {
                return [];
            } else {
                foreach ($rows as $row) {
                    $singleInvitationInfos = $this->getInfosInvitation((int)$row['id']);
                    array_push($invitations, $singleInvitationInfos);
                }
                return $invitations;
            }
        } else {
            return [];
        }
    }

    public function numberOfInvitations()
    {
        $query = "SELECT MAX(`id`) as `number` FROM `invitation`";
        $stm = ($this->db_conn)->prepare($query);
        
        if ($stm->execute()) {
            $row = $stm->fetch(PDO::FETCH_ASSOC);
            return (int)$row['number'];
        }
    }

}
