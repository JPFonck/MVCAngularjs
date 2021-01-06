<?php
 $connect = mysqli_connect("localhost", "root", "", "dbtransportes");
 $output = array();
 $query = "SELECT tblbus.* , CONCAT(tblsocio.apellido,' ',tblsocio.nombre) as Socio, tblparroquia.nombre as Parroquia
FROM tblbus
inner join tblparroquia on tblbus.idparroquia=tblparroquia.idparroquia
inner join tblsocio on tblbus.idsocio=tblsocio.idsocio";
 //$query = "SELECT * FROM tblbus";
 $result = mysqli_query($connect, $query);
 if(mysqli_num_rows($result) > 0)
 {
      while($row = mysqli_fetch_array($result))
      {
           $output[] = $row;
      }
      echo json_encode($output);
 }
?>