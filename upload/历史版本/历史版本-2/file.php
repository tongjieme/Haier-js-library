<?php 
	// echo $_FILES["file"]["tmp_name"];
	// print_r($_FILES);
	// echo $_FILES["file"]["name"].' upload successfully';
	move_uploaded_file($_FILES["file"]["tmp_name"],
      "uploaded/" . $_FILES["file"]["name"]);
	
	header('Content-Type: application/json');
	echo json_encode(array(
		"url" => "uploaded/" . $_FILES["file"]["name"]
	));
 ?>