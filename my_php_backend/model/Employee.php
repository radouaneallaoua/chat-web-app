<?php

class Employee
{
    private  $id;
    private  $name;
    private  $surname;
    private $email;
    private $image;
    private $age;
    private $office;
    private $service;
    public function __construct($id, $name, $surname, $email,$image, $age,$office,$service)
    {
        $this->id = $id;
        $this->name = $name;
        $this->surname = $surname;
        $this->email = $email;
        $this->image = $image;
        $this->age = $age;
        $this->office = $office;
        $this->service = $service;
    }

    //getters function
    public  function getId()
    {
        return $this->id;
    }
    public  function getName()
    {
        return $this->name;
    }
    public  function getSurname()
    {
        return $this->surname;
    }
    public function getEmail()
    {
        return $this->email;
    }
    public  function getAge()
    {
        return  $this->age;
    }
    public  function getImage()
    {
        return  $this->image;
    }
    public  function getOffice()
    {
        return  $this->office;
    }
    public  function getService()
    {
        return  $this->service;
    }
    //setters function
    public  function setId(int $newId)
    {
        $this->id = $newId;
    }
    public  function setAge(int $newAge)
    {
        $this->age = $newAge;
    }
    public  function setName(string $newName)
    {
        $this->name = $newName;
    }
    public  function setSurname(string $newSurname)
    {
        $this->surname = $newSurname;
    }
    public  function setEmail(string $newEmail)
    {
        $this->email = $newEmail;
    }
    public  function setOffice(int $newOffice)
    {
        $this->office = $newOffice;
    }
    public  function setService(int $newService)
    {
        $this->service = $newService;
    }
    public  function setImage(string $newImage)
    {
        $this->image = $newImage;
    }
}
