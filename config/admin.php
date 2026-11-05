<?php

return [
    // Comma-separated list of user IDs allowed to access the admin section.
    'user_ids' => array_values(array_filter(
        array_map('intval', array_filter(array_map('trim', explode(',', (string) env('ADMIN_USER_IDS', ''))))),
    )),
];
