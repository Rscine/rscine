<?php

namespace Rscine\AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class MainController extends Controller
{
    /**
     * @Route("/", name="homepage")
     */
    public function mainAction(Request $request)
    {
        return $this->render('RscineAppBundle::index.html.twig', []);
    }
}
