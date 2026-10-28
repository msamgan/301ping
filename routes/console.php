<?php

Schedule::command('hyperlinks:ping redirect')->twiceDaily();
Schedule::command('hyperlinks:ping redirectPlus')->everyTwoHours();
