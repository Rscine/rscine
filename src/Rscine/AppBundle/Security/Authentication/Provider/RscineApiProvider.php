<?php

namespace Rscine\AppBundle\Security\Authentication\Provider;

use Psr\Cache\CacheItemPoolInterface;
use Symfony\Component\Security\Core\Authentication\Provider\AuthenticationProviderInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Exception\NonceExpiredException;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;

use Rscine\AppBundle\Security\Authentication\Token\RscineApiToken;

class RscineApiProvider implements AuthenticationProviderInterface
{
    private $userProvider;
    private $cachePool;

    public function __construct(UserProviderInterface $userProvider, CacheItemPoolInterface $cachePool)
    {
        $this->userProvider = $userProvider;
        $this->cachePool = $cachePool;
    }

    /**
     * @{inheritDoc}
     */
    public function authenticate(TokenInterface $token)
    {
        $user = true;
        // $user = $this->userProvider->loadUserByUsername($token->getUsername());

        if ($user) {
            $authenticatedToken = new RscineApiToken($user->getRoles());
            $authenticatedToken->setUser($user);

            return $authenticatedToken;
        }

        throw new AuthenticationException('The authentication failed.');
    }

    /**
     * @{inheritDoc}
     */
    public function supports(TokenInterface $token)
    {
        return $token instanceof RscineApiToken;
    }
}