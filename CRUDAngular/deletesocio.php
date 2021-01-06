 <?php
 $connect = mysqli_connect("localhost", "root", "", "dbtransportes");
 $data = json_decode(file_get_contents("php://input"));
 if(!empty($data))
 {
      $idSocio = $data->idSocio;
      $query = "DELETE FROM tblsocio WHERE idSocio='$idSocio'";
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