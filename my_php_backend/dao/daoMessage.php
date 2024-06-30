<?php
require_once '../model/Message.php';

class DaoMessage
{
    private $db_conn;

    public function __construct()
    {
        $this->db_conn = new PDO("mysql:host=localhost;dbname=chat","root", "");
    }


    public function insertNewMessage($id,$sender,$group,$content,$type,$path): bool
    {
        $query = "INSERT INTO `message`(`id`,`sender`,`group`,`content`,`type`,`path`) VALUES (?,?,?,?,?,?)";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1,$id);
        $stm->bindParam(2,$sender);
        $stm->bindParam(3, $group);
        $stm->bindParam(4,$content);
        $stm->bindParam(5,$type);
        $stm->bindParam(6,$path);
        return $stm->execute();
    }


    public function numberOfMessagesInTheGroup($group)
    {
        $query = "SELECT COUNT(*) as `number` FROM `message` WHERE `group`=?";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1, $group);

        if($stm->execute()){
            $row=$stm->fetch(PDO::FETCH_ASSOC);
            return (int)$row['number'];
        }
    }

    public function numberOfMessages()
    {
        $query = "SELECT MAX(`id`) as `number` FROM `message`";
        $stm = ($this->db_conn)->prepare($query);
        if ($stm->execute()) {
            $row = $stm->fetch(PDO::FETCH_ASSOC);
            return (int)$row['number'];
        }
    }

    public function deleteMessage($id)
    {
        $query = "DELETE FROM `message` WHERE `id`=?";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1,$id);

       return $stm->execute();
    }

    public function editMessage($id,$sender,$group,$content,$type,$path)
    {
        $query = "UPDATE `message` SET `sender`=?,`group`=?,`content`=?,`type`=?,`path`=? WHERE `id`=?";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1, $sender);
        $stm->bindParam(2,$group);
        $stm->bindParam(3,$content);
        $stm->bindParam(4,$type);
        $stm->bindParam(5,$path);
        $stm->bindParam(6,$id);
     
        return $stm->execute();
    }

    public function getMessageInfos($id): array
    {
        $query = "SELECT * FROM `message` WHERE `id`= ?";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1, $id);

        if ($stm->execute()) {
            $message = $stm->fetch(PDO::FETCH_ASSOC);
            if ($message !== []) {
                return array(
                    'id' => $message['id'],
                    'sender' => $message['sender'],
                    'group' => $message['group'],
                    'content' => $message['content'],
                    'type'=>$message['type'],
                    'path' => $message['path'],
                    'timestamp' => $message['timestamp']
                );
            } else {
                return [];
            }
        } else {
            return [];
        }
    }

    


    public function getAllMessagesInTheGroup($group): array
    {
        $allMessages = array();
        $query = "SELECT `id` FROM `message` WHERE `group`=?";
        $stm = ($this->db_conn)->prepare($query);
        $stm->bindParam(1, $group);

        if ( $stm->execute()) {
            $rowMessages = $stm->fetchAll(PDO::FETCH_ASSOC);
            if ($rowMessages === []) {
                return [];
            } else {
                foreach ($rowMessages as $message) {
                    $singleMessageInfos = $this->getMessageInfos((int)$message['id']);
                    array_push($allMessages, $singleMessageInfos);
                }
                return $allMessages;
            }
        } else {
            return [];
        }
    }
    
}
