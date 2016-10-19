<?php

namespace Rscine\AppBundle\Security\Authentication\Token;

use Symfony\Component\Security\Core\Authentication\Token\AbstractToken;

class RscineApiToken extends AbstractToken
{
    public $accessToken;

    public function __construct(array $roles = array())
    {
        parent::__construct($roles);

        $this->setAuthenticated(false);
    }

    public function getCredentials()
    {
        return '';
    }
}