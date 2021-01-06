<?php
$connect = mysqli_connect("localhost", "root", "", "dbtransportes");
$data = json_decode(file_get_contents("php://input"));
if(!empty($data))
{
	$f_inicio=$data->f_inicio;
	$f_fin=$data->f_fin;
	$n_personas=$data->n_personas;
	$h_inicio=$data->h_inicio;
	$h_fin=$data->h_fin;
	$idParroquia_i=$data->idParroquia_i;
	$idParroquia_f=$data->idParroquia_f;
	$idBus=$data->idBus;
	$idEmpresa= $data->idEmpresa;
	$idChofer = $data->idChofer;
	$query = "INSERT INTO tbltrabajo (hora_entrada, hora_salida, n_personas, fecha_ingreso, fecha_fin, idBus, idEmpresa, ruta_inicio, ruta_fin, idChofer) VALUES ('$h_inicio','$h_fin','$n_personas','$f_inicio','$f_fin','$idBus','$idEmpresa','$idParroquia_i','$idParroquia_f','$idChofer')";
	//$result = mysqli_query($connect, $query) or trigger_error("Query Failed! SQL: $query - Error: ".mysqli_error($connect), E_USER_ERROR);
	if(mysqli_query($connect, $query))
	{
		echo "TRABAJO CREADO!!";
	}
	else
	{
		echo 'Error';
	}

}
else
{
	echo "DATA VACIA";
}
?>