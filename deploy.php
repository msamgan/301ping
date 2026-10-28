<?php

namespace Deployer;

require 'recipe/laravel.php';

// Config

set('repository', 'https://github.com/msamgan/301ping.git');

add('shared_files', []);
add('shared_dirs', []);
add('writable_dirs', []);

// Hosts

host('146.190.32.125')
    ->set('remote_user', 'ping301')
    ->set('deploy_path', '~/htdocs/301p.ing');

desc('Build the assets');
task('deploy:build', function () {
    cd('{{release_path}}');
    run('npm install');
    run('npm run build');
});

task('deploy:optimize', function () {
    cd('{{release_path}}');
    run('php artisan optimize');
    run('php artisan l5-swagger:generate');
});

task('deploy:restartQueue', function () {
    cd('{{release_path}}');
    run('pm2 restart ecosystem.config.cjs');
});

// Hooks
after('deploy:update_code', 'deploy:build');
after('deploy:symlink', 'deploy:optimize');
after('deploy:optimize', 'deploy:restartQueue');

after('deploy:failed', 'deploy:unlock');
