<?php

namespace Rscine\AppBundle\DependencyInjection\Security\Factory;

use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Reference;
use Symfony\Component\DependencyInjection\DefinitionDecorator;
use Symfony\Component\Config\Definition\Builder\NodeDefinition;
use Symfony\Bundle\SecurityBundle\DependencyInjection\Security\Factory\SecurityFactoryInterface;

class RscineApiFactory implements SecurityFactoryInterface
{
    /**
     * @{inheritDoc}
     */
    public function create(ContainerBuilder $container, $id, $config, $userProvider, $defaultEntryPoint)
    {
        $providerId = 'security.authentication.provider.rscine_api.'.$id;
        $container
            ->setDefinition($providerId, new DefinitionDecorator('rscine_app.security.authentication.provider.rscine_api'))
            ->replaceArgument(0, new Reference($userProvider))
        ;

        $listenerId = 'security.authentication.listener.rscine_api.'.$id;
        $listener = $container->setDefinition($listenerId, new DefinitionDecorator('rscine_app.security.authentication.listener.rscine_api'));

        return array($providerId, $listenerId, $defaultEntryPoint);
    }

    /**
     * @{inheritDoc}
     */
    public function getPosition()
    {
        return 'pre_auth';
    }

    /**
     * @{inheritDoc}
     */
    public function getKey()
    {
        return 'rscine_api';
    }

    /**
     * @{inheritDoc}
     */
    public function addConfiguration(NodeDefinition $node)
    {
    }
}