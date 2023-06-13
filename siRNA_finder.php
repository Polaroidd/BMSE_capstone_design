<?php
// AJAX 요청에서 전달된 DNA
$mRNA_seq = $_POST["mRNA_seq"];
$mRNA_name = $_POST["mRNA_n"];

// Python 스크립트를 실행하여 RNA 변환
$command = "./siRNA_finder.py " . $mRNA_seq;
$result = shell_exec($command);
echo $result

?>
