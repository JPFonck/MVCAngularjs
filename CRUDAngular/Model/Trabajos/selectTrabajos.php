<?php
$connect = mysqli_connect("localhost", "root", "", "dbtransportes");
 $output = array();
 $data = json_decode(file_get_contents("php://input"));
 $varinfo= $data->varinfo;
 if ($varinfo==0) {
 	$query = "SELECT tbltrabajo.*,
			CONCAT(inicio.nombre,' - ' ,fin.nombre) AS ruta,
			CONCAT(tblsocio.apellido,' ', tblsocio.nombre) AS socio,
			tblempresa.nombre as empresa,
			CASE WHEN tbltrabajo.idChofer IS NULL
			THEN 'SIN CHOFER'
			ELSE (SELECT tblchofer.nombre FROM tblchofer where tblchofer.idChofer=tbltrabajo.idChofer)
			END as chofer
			FROM tbltrabajo
			INNER JOIN tblparroquia as inicio on inicio.idParroquia=tbltrabajo.ruta_inicio
			INNER JOIN tblparroquia as fin on fin.idParroquia=tbltrabajo.ruta_fin
			INNER JOIN tblbus on tblbus.idBus=tbltrabajo.idBus
			INNER JOIN tblsocio on tblsocio.idSocio=tblbus.idSocio
			INNER JOIN tblempresa on tblempresa.idEmpresa=tbltrabajo.idEmpresa";
 }
 if ($varinfo==1) {
 	$idTrabajo=$data->idTrabajo;
 	$query = "SELECT tbltrabajo.*,
			CONCAT(inicio.nombre,' - ' ,fin.nombre) AS ruta,
			CONCAT(tblsocio.apellido,' ', tblsocio.nombre) AS socio,
			tblempresa.nombre as empresa,
			CASE WHEN tbltrabajo.idChofer IS NULL
			THEN 'SIN CHOFER'
            ELSE (SELECT CONCAT(tblchofer.apellido,' ', tblchofer.nombre) FROM tblchofer where 	tblchofer.idChofer=tbltrabajo.idChofer)
			END as chofer
			FROM tbltrabajo
			INNER JOIN tblparroquia as inicio on inicio.idParroquia=tbltrabajo.ruta_inicio
			INNER JOIN tblparroquia as fin on fin.idParroquia=tbltrabajo.ruta_fin
			INNER JOIN tblbus on tblbus.idBus=tbltrabajo.idBus
			INNER JOIN tblsocio on tblsocio.idSocio=tblbus.idSocio
			INNER JOIN tblempresa on tblempresa.idEmpresa=tbltrabajo.idEmpresa
            WHERE idTrabajo=$idTrabajo";
 }
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