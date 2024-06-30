<?php
require_once "../model/Employee.php";
class User extends Employee{
    private $userId;
    private  $password;
    private $role;
    private $token;
    public function __construct($userId,$employeeId, $name, $surname, $email,$age,$office,$service, $password,$role,$image,$token)
    {
       parent::__construct($employeeId, $name, $surname, $email, $image, $age, $office, $service);
        $this->password= $password;
        $this->role= $role;
        $this->token=$token;
        $this->userId=$userId;
    }

    //getters function
    public  function getId()
    {
        return $this->userId;
    }
    public  function getEmployee()
    {
        return parent::getId();
    }
    public  function getName()
    {
        return parent::getName();
    }
    public  function getSurname()
    {
        return parent::getSurname();
    }
    public  function getEmail()
    {
        return parent::getEmail();
    }
    public  function getPassword()
    {
        return  $this->password;
    }
    public  function getRole()
    {
        return  $this->role;
    }
    public  function getImage()
    {
        return  parent::getImage();
    }
    public  function getToken()
    {
        return  $this->token;
    }
    public  function getOffice()
    {
        return  parent::getOffice();
    }
    public  function getService()
    {
        return  parent::getService();
    }
    public  function getAge()
    {
        return  parent::getAge();
    }
    //setters function
    public  function setId($newUserId)
    {
        $this->userId = $newUserId;
    }
    public  function setPassword($newPassword)
    {
        $this->password=$newPassword;
    }
    public  function setRole($newRole)
    {
        $this->role=$newRole;
    }
    public  function setToken($newToken)
    {
        $this->token = $newToken;
    }
}