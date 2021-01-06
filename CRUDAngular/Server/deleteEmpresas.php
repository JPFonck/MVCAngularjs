 <?php
 $connect = mysqli_connect("localhost", "root", "", "dbtransportes");
 $data = json_decode(file_get_contents("php://input"));
 if(!empty($data))
 {
    $idEmpresa = $data->idEmpresa;
    $query = "DELETE FROM tblEmpresa WHERE idEmpresa='$idEmpresa'";
    if(mysqli_query($connect, $query))
  {
     echo 'Empresa Eliminada';
 }
 else
 {
     echo 'Error';
 }
}
?>