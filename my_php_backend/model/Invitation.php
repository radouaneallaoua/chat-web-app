<?php
class Invitation
{
    private  $id;
    private  $group;
    private  $sender;
    private $recipient;
    private $status;
    public function __construct($id, $group, $sender, $recipient, $status)
    {
        $this->id = $id;
        $this->group = $group;
        $this->sender = $sender;
        $this->recipient = $recipient;
        $this->status = $status;
    }

    //getters function
    public  function getId()
    {
        return  $this->id;
    }
    public  function getGroup()
    {
        return  $this->group;
    }
    public  function getSender()
    {
        return  $this->sender;
    }
    public  function getRecipient()
    {
        return  $this->recipient;
    }
    public  function getStatus()
    {
        return  $this->status;
    }
    
    //setters function
    public  function setId($newInvitationId)
    {
        $this->id =$newInvitationId;
    }
    public  function setGroup($newGroupId)
    {
        $this->group=$newGroupId;
    }
    public  function setSender($newSenderId)
    {
        $this->sender=$newSenderId;
    }
    public  function setRecipient($newRecipientId)
    {
        $this->recipient=$newRecipientId;
    }

    public  function setStatus($newStatus)
    {
        $this->status=$newStatus;
    }
    
}
