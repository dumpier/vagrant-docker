<?php
require_once "../vendor/autoload.php";

echo "<pre>";
$sendmail_header = "From: from@samurai.jp";
$result = mb_send_mail("to@mysite.test", "title", "message", $sendmail_header);
var_dump($result);

$result = mail("to@mysite.test", "title", "message", $sendmail_header);
var_dump($result);

var_dump(\App\Mail::instance()->send());
echo "</pre>";


echo phpinfo();
