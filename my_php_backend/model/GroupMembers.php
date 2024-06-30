<?php
class GroupMembers
{
    private  $id;
    private  $group;
    private  $member;
    private $role;
    public function __construct($id, $group, $member, $role)
    {
        $this->id = $id;
        $this->group = $group;
        $this->member = $member;
        $this->role = $role;
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
    public  function getMember()
    {
        return  $this->member;
    }
    public  function getRole()
    {
        return  $this->role;
    }

    //setters function
    public  function setId($newGroupMemberId)
    {
        $this->id = $newGroupMemberId;
    }
    public  function setGroup($newGroupId)
    {
        $this->group = $newGroupId;
    }
    public  function setMember($newMemberId)
    {
        $this->member =$newMemberId;
    }
    public  function setRole($newRole)
    {
        $this->role = $newRole;
    }
}
