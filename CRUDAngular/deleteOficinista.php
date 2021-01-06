 <?php
 $connect = mysqli_connect("localhost", "root", "", "dbtransportes");
 $data = json_decode(file_get_contents("php://input"));
 if(!empty($data))
 {
      $idOficinista = $data->idOficinista;
      $query = "DELETE FROM tbloficinista WHERE idOficinista='$idOficinista'";
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