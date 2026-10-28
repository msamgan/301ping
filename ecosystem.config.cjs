// eslint-disable-next-line no-undef
module.exports = {
    apps: [
        {
            name: "laravel-queue-01",
            script: "artisan",
            args: "queue:work --sleep=3 --tries=3 --max-time=3600",
            instances: 1,
            exec_mode: "fork",
            interpreter: "/usr/bin/php",
            autorestart: true,
            watch: false,
            max_memory_restart: "100M",
            error_file: "./storage/logs/queue.error.log",
            out_file: "./storage/logs/queue.out.log",
            pid_file: "./storage/logs/queue.pid.log",
            cwd: "/home/ping301/htdocs/301p.ing/current/public"
        }
    ]
}
