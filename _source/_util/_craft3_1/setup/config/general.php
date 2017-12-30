<?php
/**
 * General Configuration
 *
 * All of your system's general configuration settings go in here. You can see a
 * list of the available settings in vendor/craftcms/cms/src/config/GeneralConfig.php.
 */

return [
    // Global settings
    '*' => [

        'cacheDuration' => false,
        'cpTrigger' => 'cms',
        'defaultSearchTermOptions' => array(
            'subLeft' => true,
            'subRight' => true,
        ),
        'enableCsrfProtection' => true,
        'generateTransformsBeforePageLoad' => true,
        'omitScriptNameInUrls' => true,
        'securityKey' => getenv('CRAFTENV_SECURITY_KEY'),
        'siteUrl' => getenv('CRAFTENV_SITE_URL'),
        'usePathInfo' => true,
        'custom' => [
            'basePath' => getenv('CRAFTENV_BASE_PATH'),
            'baseUrl' => getenv('CRAFTENV_BASE_URL'),
            'craftEnv' => CRAFT_ENVIRONMENT,
        ]
    ],

    // Live (production) environment
    'live' => [
        // Craft defined config settings
        'allowAutoUpdates' => false,
        'backupOnUpdate' => false,
        'devMode' => false,
        'enableTemplateCaching' => true,
    ],

    // Staging (pre-production) environment
    'staging' => [
        // Craft defined config settings
        'allowAutoUpdates' => false,
        'backupOnUpdate' => false,
        'devMode' => false,
        'enableTemplateCaching' => true,
    ],

    // Local (development) environment
    'local' => [
        // Craft defined config settings
        'allowAutoUpdates' => true,
        'backupOnUpdate' => true,
        'devMode' => true,
        'enableTemplateCaching' => false,
    ],
];