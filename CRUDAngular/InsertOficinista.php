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
		$cargo= mysqli_real_escape_string($connect, $data->cargo);
		$password=$data->password;
		$boton= $data->boton;
		if($boton=="Agregar")
		{
			$query = "INSERT INTO tbloficinista(cedula, nombre, apellido, telefono, direccion, nacionalidad, email, password, cargo) VALUES ('$cedula', '$nombre','$apellido','$telefono','$direccion','$nacionalidad','$email','$password','$cargo')";
			if(mysqli_query($connect, $query))
			{
				echo "Oficinista Agregado";
			}
			else
			{
				echo 'Error';
			}
		}
		if($boton=="Editar")
		{
			$idOficinista = $data->idOficinista;
			$query = "UPDATE tbloficinista SET cedula='$cedula',nombre='$nombre',apellido='$apellido',telefono='$telefono',direccion='$direccion',nacionalidad='$nacionalidad',email='$email', cargo='$cargo' WHERE idOficinista ='$idOficinista'";
			if(mysqli_query($connect, $query))
			{
				echo 'Oficinista Editado';
			}
			else
			{
				echo 'Error';
			}
		}
	}

}
?>