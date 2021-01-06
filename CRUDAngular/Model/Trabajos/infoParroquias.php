<?php
$connect = mysqli_connect("localhost", "root", "", "dbtransportes");
$data = json_decode(file_get_contents("php://input"));
$output = array();
if(!empty($data))
{
	$idIni = $data->idIni;
	$idFin = $data->idFin;
	$query = "SELECT *
	FROM tblparroquia
	WHERE idParroquia IN ($idIni,$idFin)";
	//$result = mysqli_query($connect, $query) or trigger_error("Query Failed! SQL: $query - Error: ".mysqli_error($connect), E_USER_ERROR);
	$result = mysqli_query($connect, $query);
	if(mysqli_num_rows($result) > 0)
	{
		while($row = mysqli_fetch_array($result))
		{
			$output[] = $row;
		}
		echo json_encode($output);
	}
	else
	{
		echo 'Error en la consulta';
	}
}
else
{
	echo "DATA VACIA";
}
?>