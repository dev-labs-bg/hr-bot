<?php

namespace AppBundle\Controller\API;

use FOS\RestBundle\Controller\FOSRestController;
use Symfony\Component\HttpFoundation\Request;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\Controller\Annotations\QueryParam;
use AppBundle\Entity\User;
use AppBundle\Form\Type\UserType;

class UsersController extends FOSRestController
{

    /**
     * @QueryParam(name="skills", description="List of skills comma separated.")
     *
     * @param string $skills
     */
    public function getUsersAction($skills)
    {
        $users = $this->getDoctrine()->getRepository('AppBundle:User');
        if ($skills) {
            $skills = explode(',', $skills);
            $users = $users->getBySkills($skills);
        } else {
            $users = $users->findAll();
        }

        $data = array('users' => $users);
        $view = $this->view($data);

        return $this->handleView($view);
    }

    public function postUsersAction(Request $request)
    {
        $user = new User();
        $form = $this->createForm(UserType::class, $user);

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
