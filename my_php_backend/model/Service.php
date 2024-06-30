<?php

class Service
{
    private  $id;
    private  $label;
    private $office;
    public function __construct($id, $label,$office)
    {
        $this->id = $id;
        $this->label = $label;
        $this->office=$office;
    }

    //getters function
    public  function getId()
    {
        return  $this->id;
    }
    public  function getLabel()
    {
        return  $this->label;
    }
    public  function getOffice()
    {
        return  $this->office;
    }
    public  function setId($newId)
    {
        $this->id= $newId;
    }
    public  function setLabel($newLabel) 
    {
        $this->label=$newLabel;
    }
    public  function setOffice(int $newOffice)
    {
        $this->office=$newOffice;
    }

}
