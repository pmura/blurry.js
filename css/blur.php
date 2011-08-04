<?php
require 'lessphp/lessc.inc.php';

$less = new lessc('blurry.less');

header('Content-Type: text/css');
header('Pragma: no-cache');
echo $less->parse();