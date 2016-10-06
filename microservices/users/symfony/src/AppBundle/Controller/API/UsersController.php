<?php

namespace AppBundle\Controller\API;

use FOS\RestBundle\Controller\FOSRestController;

class UsersController extends FOSRestController
{

    public function getUsersAction()
    {
        $users = $this->getDoctrine()
            ->getRepository('AppBundle:User')
            ->findAll();

        $data = array('users' => $users);
        $view = $this->view($data);

        return $this->handleView($view);
    }
}
