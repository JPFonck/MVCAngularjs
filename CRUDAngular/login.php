<?php

//login.php

include('DBconexion.php');
//include('conexionMYSQL.php');

session_start();

$form_data = json_decode(file_get_contents("php://input"));

$validation_error = '';

if(empty($form_data->email))
{
 $error[] = 'Email es requerido';
}
else
{
 if(!filter_var($form_data->email, FILTER_VALIDATE_EMAIL))
 {
  $error[] = 'Formato de Email invalido';
 }
 else
 {
  $data[':email'] = $form_data->email;
 }
}

if(empty($form_data->password))
{
 $error[] = 'La contraseña es requerida';
}

if(empty($error))
{
 $sql = "SELECT * FROM tbloficinista WHERE email = :email";
 /*$query = "
 SELECT * FROM tblusuario
 WHERE Email = :email
 ";
 */
 $statement = $connect->prepare($sql);
 if($statement->execute($data))
 {
  $result = $statement->fetchAll();
  if($statement->rowCount() > 0)
  {
   foreach($result as $row)
   {
    if($form_data->password==$row["password"])
    {
     $_SESSION["name"] = $row["nombre"];
     $cargo=$row["cargo"];
    }
    else
    {
     $validation_error = 'Contraseña Incorrecta';
    }
   }
  }
  else
  {
   $validation_error = 'Email Incorrecto';
  }
 }
}
else
{
 $validation_error = implode(", ", $error);
}

$output = array(
 'error' => $validation_error,
 'cargo'=> $cargo
);

echo json_encode($output);

?>