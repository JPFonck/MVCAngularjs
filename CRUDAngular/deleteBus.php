 <?php
 $connect = mysqli_connect("localhost", "root", "", "dbtransportes");
 $data = json_decode(file_get_contents("php://input"));
 if(!empty($data))
 {
      $idBus = $data->idBus;
      $query = "DELETE FROM tblbus WHERE idBus='$idBus'";
      if(mysqli_query($connect, $query))
      {
           echo 'Bus Eliminado';
      }
      else
      {
           echo 'Error';
      }
 }
 ?>