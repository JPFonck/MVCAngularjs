<?php
$connect = mysqli_connect("localhost", "root", "", "dbtransportes");
$data = json_decode(file_get_contents("php://input"));
if(!empty($data))
{
	$nombre = mysqli_real_escape_string($connect, $data->nombre);
	$apellido= mysqli_real_escape_string($connect, $data->apellido);
	$cedula= $data->cedula;
	if($nombre == null){
		echo"Nombre Requerido";
	}
	else if( $apellido==null){
		echo"Apellido Requerido";
	}
	else if($cedula==null){
		echo"Cedula Requerida";
	}
	//VALIDAR OTROS CAMPOS
	else {
		$nombre = mysqli_real_escape_string($connect, $data->nombre);
		$apellido= mysqli_real_escape_string($connect, $data->apellido);
		$cedula = $data->cedula;
		$email = $data->email;
		$telefono= mysqli_real_escape_string($connect, $data->telefono);
		$nacionalidad = $data->nacionalidad;
		$direccion= mysqli_real_escape_string($connect, $data->direccion);
		$tip_licencia= mysqli_real_escape_string($connect, $data->tip_licencia);
		$boton= $data->boton;
		if($boton=="Agregar")
		{
			$query = "INSERT INTO tblsocio(cedula, nombre, apellido, telefono, direccion, nacionalidad, tip_licencia, email) VALUES ('$cedula', '$nombre', '$apellido', '$telefono', '$direccion', '$nacionalidad', '$tip_licencia', '$email')";
			if(mysqli_query($connect, $query))
			{
				echo "Usuario Agregado";
			}
			else
			{
				echo 'Error';
			}
		}
		if($boton=="Editar")
		{
			$idSocio = $data->idSocio;
			$query = "UPDATE tblsocio SET cedula='$cedula',nombre='$nombre',apellido='$apellido',telefono='$telefono',direccion='$direccion',nacionalidad='$nacionalidad',tip_licencia='$tip_licencia',email='$email' WHERE idSocio ='$idSocio'";
			if(mysqli_query($connect, $query))
			{
				echo 'Usuario Editado';
			}
			else
			{
				echo 'Error';
			}
		}
	}

}
?>