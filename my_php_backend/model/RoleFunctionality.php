<?php
class RoleFunctionality
{
    private  $id;
    private  $role;
    private $functionality;
    public function __construct($id, $role,$functionality)
    {
        $this->id = $id;
        $this->role = $role;
        $this->functionality=$functionality;
    }

    //getters function
    public  function getId()
    {
        return  $this->id;
    }
    public  function getRole()
    {
        return  $this->role;
    }
    public  function getFunctionality()
    {
        return  $this->functionality;
    }
}
