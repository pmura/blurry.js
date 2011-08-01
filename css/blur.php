<?php
require 'lessphp/lessc.inc.php';

$less = new lessc('blur.less');

header('Content-Type: text/css');
header('Pragma: no-cache');
echo $less->parse();