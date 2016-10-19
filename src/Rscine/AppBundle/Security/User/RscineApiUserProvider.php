<?php

namespace Rscine\Security\User;

use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\Exception\UsernameNotFoundException;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;

use Rscine\AppBundle\Security\User\RscineApiUser;

class RscineApiUserProvider implements UserProviderInterface
{
    /**
     * @{inheirtDoc}
     */
    public function loadUserByUsername($username)
    {
        // make a call to your webservice here
        // $userData = ...
        // pretend it returns an array on success, false if there is no user

        if ($userData) {
            $password = 'cormag';
            $username = 'cormag';
            $salt = '';
            $roles = [];

            return new RscineApiUser($username, $password, $salt, $roles);
        }

        throw new UsernameNotFoundException(
            sprintf('Username "%s" does not exist.', $username)
        );
    }

    public function refreshUser(UserInterface $user)
    {
        if (!$user instanceof RscineApiUser) {
            throw new UnsupportedUserException(
                sprintf('Instances of "%s" are not supported.', get_class($user))
            );
        }

        return $this->loadUserByUsername($user->getUsername());
    }

    public function supportsClass($class)
    {
        return $class === 'AppBundle\Security\User\WebserviceUser';
    }
}