<?php
class Message
{
    private  $id;
    private  $content;
    private  $sender;
    private $group;
    private $type;
    private $path;
    public function __construct($id, $content, $sender, $group,$type,$path)
    {
        $this->id = $id;
        $this->content = $content;
        $this->sender = $sender;
        $this->group = $group;
        $this->type = $type;
        $this->path = $path;
    }

    //getters function
    public  function getId()
    {
        return  $this->id;
    }
    public  function getContent()
    {
        return  $this->content;
    }
    public  function getSender()
    {
        return  $this->sender;
    }
    public  function getGroup()
    {
        return  $this->group;
    }
    public  function getType()
    {
        return  $this->type;
    }
    public  function getPath()
    {
        return  $this->path;
    }
    
    //setters function
    public  function setId($newMessageId)
    {
        $this->id = $newMessageId;
    }
    public  function setContent($newMessageContent)
    {
        $this->content = $newMessageContent;
    }
    public  function setSender($newSender)
    {
        $this->sender = $newSender;
    }
    public  function setGroup($newGroupId)
    {
        $this->group = $newGroupId;
    }
    public  function setType($newType)
    {
        $this->type = $newType;
    }
    public  function setPath($newPath)
    {
        $this->path = $newPath;
    }
}
