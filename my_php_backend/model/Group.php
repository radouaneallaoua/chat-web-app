<?php
class Group
{
    private  $id;
    private  $name;
    private  $type;
    private $image;
    public function __construct($id, $name, $type, $image)
    {
        $this->id = $id;
        $this->name = $name;
        $this->type = $type;
        $this->image = $image;
    }

    //getters function
    public  function getId()
    {
        return  $this->id;
    }
    public  function getName()
    {
        return  $this->name;
    }
    public  function getType()
    {
        return  $this->type;
    }
    public  function getImage()
    {
        return  $this->image;
    }
  

    //setters function
    public  function setId($newId)
    {
        $this->id = $newId;
    }
    public  function setName($newName)
    {
        $this->name = $newName;
    }
    public  function setType($newType)
    {
        $this->type = $newType;
    }
    public  function setImage($newImage)
    {
        $this->image = $newImage;
    }
    
}
