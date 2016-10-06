<?php

namespace AppBundle\Controller\API;

use FOS\RestBundle\Controller\FOSRestController;
use Symfony\Component\HttpFoundation\Request;
use AppBundle\Entity\User;

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

    public function postUsersAction(Request $request)
    {
        $user = new User();

        $form = $this->createFormBuilder($user, array('csrf_protection' => false))
            ->add('email')
            ->add('first_name')
            ->add('last_name')
            ->getForm();

        $data = json_decode($request->getContent(), true);
        $form->submit($data);

        if ($form->isSubmitted() && $form->isValid()) {
            $user = $form->getData();

             $em = $this->getDoctrine()->getManager();
             $em->persist($user);
             $em->flush();
        }


        $data = array('code' => $form->isValid() ? 200 : 400);
        $view = $this->view($data);

        return $this->handleView($view);
    }
}
