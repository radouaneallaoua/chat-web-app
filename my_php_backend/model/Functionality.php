<?php
class Functionality
{
    private  $id;
    private  $label;
    public function __construct($id, $label)
    {
        $this->id = $id;
        $this->label = $label;
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
}
