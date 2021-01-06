 <?php
 $connect = mysqli_connect("localhost", "root", "", "dbtransportes");
 $data = json_decode(file_get_contents("php://input"));
 if(!empty($data))
 {
      $id = $data->id;
      $query = "DELETE FROM tbltrabajo WHERE id='$id'";
      if(mysqli_query($connect, $query))
      {
           echo 'Usuario Eliminado';
      }
      else
      {
           echo 'Error';
      }
 }
 ?>