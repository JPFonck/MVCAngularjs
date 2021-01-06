<?php
$connect = mysqli_connect("localhost", "root", "", "dbtransportes");
$data = json_decode(file_get_contents("php://input"));
if(!empty($data))
{
	$modelo = mysqli_real_escape_string($connect, $data->modelo);
	$marca= mysqli_real_escape_string($connect, $data->marca);
	$capacidad= $data->capacidad;
	if($modelo == null){
		echo"Modelo Requerido";
	}
	else if($marca==null){
		echo"Marca Requerida";
	}
	else if($capacidad==null){
		echo"capacidad";
	}
	//VALIDAR OTROS CAMPOS
	else {
		$modelo = mysqli_real_escape_string($connect, $data->modelo);
		$marca= mysqli_real_escape_string($connect, $data->marca);
		$capacidad= $data->capacidad;
		$ano_fab = $data->ano_fab;
		$placa= mysqli_real_escape_string($connect, $data->placa);
		$idParroquia = $data->idParroquia;
		$idSocio = $data->idSocio;
		$boton= $data->boton;
		if($boton=="Agregar")
		{
			$query = "INSERT INTO tblbus(marca, modelo, ano_fab, capacidad, placa, idParroquia, idSocio) VALUES ('$marca','$modelo','$ano_fab','$capacidad','$placa', '$idParroquia', '$idSocio')";
			if(mysqli_query($connect, $query))
			{
				echo "Bus Agregado";
			}
			else
			{
				echo 'Error';
			}
		}
		if($boton=="Editar")
		{
			$idBus = $data->idBus;
			$query = "UPDATE tblbus SET marca='$marca',modelo='$modelo',ano_fab='$ano_fab',capacidad='$capacidad',placa='$placa',idParroquia='$idParroquia',idSocio='$idSocio' WHERE idBus='$idBus'";
			if(mysqli_query($connect, $query))
			{
				echo 'Bus Editado';
			}
			else
			{
				echo 'Error';
			}
		}
	}

}
?>