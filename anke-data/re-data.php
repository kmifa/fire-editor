<?php
	//ajaxのセキュリティーを書く

	$name = $_POST['name'];//ポストで受け取れる
	$mail = $_POST['mail'];
	$age  = $_POST['age'];

	$str = "{$name},{$mail},{$age}\n";

	$file = fopen("data/data.csv","a") or die("ファイルが開けません");// dieで処理を終わらす。
	flock($file, LOCK_EX);			// ファイルロック
	fwrite($file, $str);
	flock($file, LOCK_UN);			// ファイルロック解除
	fclose($file);
  
  header('Content-type: application/json; charset=UTF-8');//指定されたデータタイプに応じたヘッダーを出力する
  echo json_encode( $str );

?>