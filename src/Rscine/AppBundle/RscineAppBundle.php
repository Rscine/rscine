<?php

namespace Rscine\AppBundle;

use Symfony\Component\HttpKernel\Bundle\Bundle;
use Symfony\Component\DependencyInjection\ContainerBuilder;

use Rscine\AppBundle\DependencyInjection\Security\Factory\RscineApiFactory;

class RscineAppBundle extends Bundle
{
    /**
     * @{inheritDoc}
     */
    public function build(ContainerBuilder $container)
    {
        parent::build($container);

        $extension = $container->getExtension('security');
        $extension->addSecurityListenerFactory(new RscineApiFactory());
    }
}
