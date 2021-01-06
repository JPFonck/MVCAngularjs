<?php
$connect = mysqli_connect("localhost", "root", "", "dbtransportes");
$data = json_decode(file_get_contents("php://input"));
if(!empty($data))
{
	$nombre = mysqli_real_escape_string($connect, $data->nombre);
	$descripcion= mysqli_real_escape_string($connect, $data->descripcion);
	if($nombre == null){
		echo"Nombre Requerido";
	}
	else if($descripcion==null){
		echo"Descripción Requerida";
	}
	//VALIDAR OTROS CAMPOS
	else {
		$nombre = mysqli_real_escape_string($connect, $data->nombre);
		$descripcion= mysqli_real_escape_string($connect, $data->descripcion);
		$boton= $data->boton;
		if($boton=="Agregar")
		{
			$query = "INSERT INTO tblEmpresa(nombre, descripcion) VALUES ('$nombre','$descripcion')";
			if(mysqli_query($connect, $query))
			{
				echo "Empresa Agregada";
			}
			else
			{
				echo 'Error';
			}
		}
		if($boton=="Editar")
		{
			$idEmpresa = $data->idEmpresa;
			$query = "UPDATE tblEmpresa SET nombre='$nombre', descripcion='$descripcion' WHERE idEmpresa='$idEmpresa'";
			if(mysqli_query($connect, $query))
			{
				echo 'Empresa Editada';
			}
			else
			{
				echo 'Error';
			}
		}
	}

}
?>