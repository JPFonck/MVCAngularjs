var app = angular.module("myapp", ['ngRoute']);
app.config(function($routeProvider){
	$routeProvider
	.when('/',{
		templateUrl: 'login.html'
	})
	.when('/home',{
		resolve:{
			"check": function($location, $rootScope){
				if(!$rootScope.loged || $rootScope.loginCargo!='Gerente'){
					$location.path('/');
				}
			}
		},
		templateUrl: 'Vistas/home.html'
	})
	.when('/infoTrabajos',{
		resolve:{
			"check": function($location, $rootScope){
				if(!$rootScope.loged || $rootScope.loginCargo!='Gerente'){
					$location.path('/');
				}
			}
		},
		templateUrl: 'Vistas/Trabajos/infoTrabajos.html'
	})
	.when('/createTrabajo',{
		/*resolve:{
			"check": function($location, $rootScope){
				if(!$rootScope.loged || $rootScope.loginCargo!='Gerente'){
					$location.path('/');
				}
			}
		},*/
		templateUrl: 'Vistas/Trabajos/createTrabajo.html'
	})
	.when('/candidatos',{
		/*resolve:{
			"check": function($location, $rootScope){
				if(!$rootScope.loged || $rootScope.loginCargo!='Gerente'){
					$location.path('/');
				}
			}
		},*/
		templateUrl: 'Vistas/Trabajos/seleccionarOp.html'
	})
	.when('/verContrato',{
		/*resolve:{
			"check": function($location, $rootScope){
				if(!$rootScope.loged || $rootScope.loginCargo!='Gerente'){
					$location.path('/');
				}
			}
		},*/
		templateUrl: 'Vistas/Trabajos/verContrato.html'
	})
	.when('/socios',{
		resolve:{
			"check": function($location, $rootScope){
				if(!$rootScope.loged || $rootScope.loginCargo!='Gerente'){
					$location.path('/');
				}
			}
		},
		templateUrl: 'Vistas/socios.html'
	})
	.when('/buses',{
		resolve:{
			"check": function($location, $rootScope){
				if(!$rootScope.loged){
					$location.path('/');
				}
			}
		},
		templateUrl: 'Vistas/buses.html'
	})
	.when('/oficinistas',{
		resolve:{
			"check": function($location, $rootScope){
				if(!$rootScope.loged || $rootScope.loginCargo!='Gerente'){
					$location.path('/');
				}
			}
		},
		templateUrl: 'Vistas/oficinistas.html'
	})
	.when('/empresas',{
		resolve:{
			"check": function($location, $rootScope){
				if(!$rootScope.loged){
					$location.path('/');
				}
			}
		},
		templateUrl: 'Vistas/empresas.html'
	})
	.otherwise({
		redirectTo: '/'
	});
});
app.controller('loginCtrl', function($scope, $location, $rootScope, $http){
	$scope.submitLogin = function(){
		$http({
			method:"POST",
			url:"login.php",
			data:$scope.loginData
		}).success(function(data){

			if(data.error != '')
			{
				$scope.alertMsg = true;
				$scope.alertClass = 'alert-danger';
				$scope.alertMessage = data.error;
			}
			else
			{
				$rootScope.loged=true;
				$location.path('/home');
				$rootScope.loginCargo=data.cargo;
			}
		});
	};
});


app.controller("trabajosController", function($scope, $http, $rootScope, $location){ //CONTROLADOR PRINCIPAL DEL CORE
	$scope.FK=function(){ //METODO PARA OBTENER LAS FOREIGN KEYS EN EL INGRESO DE DATOS
		$http.get("selectParroquias.php")
		.success(function(data){
			$scope.parroquias = data;
		})
		$http.get("Server/selectEmpresas.php")
		.success(function(data){
			$scope.empresas = data;
		})
	}
	$scope.insertar = function(){ //FUNCION PRINCIPAL DEL CORE, SE LLAMA UNA VES QUE SE ESCOGEN LOS REQUESITOS DEL USUARIO
		var curDate= new Date();
		if($scope.idEmpresa=='' || $scope.idEmpresa==null)
		{
			alert("SELECIONE UNA EMPRESA");
		}
		else if($scope.f_inicio=='' || $scope.f_inicio==null)
		{
			alert("INGRESE UNA FECHA CORRECTA");
		}
		else if($scope.f_fin=='' || $scope.f_fin==null)
		{
			alert("INGRESE UNA FECHA CORRECTA");
		}
		else if(new Date($scope.f_fin) < new Date($scope.f_inicio))
		{
			alert("EL FIN DEL CONTRATO NO PUEDE SER ANTES QUE EL INICIO DEL CONTRATO");
		}
		else if(new Date($scope.f_inicio) < curDate)
		{
			alert("EL INICIO DEL CONTRATO NO PUEDE SER ANTES DE LA FECHA ACTUAL");
		}
		else if($scope.n_personas=='' || $scope.n_personas==null || $scope.n_personas < 1)
		{
			alert("EL NUMERO DE PERSONAS ES INCORRECTO");
		}
		else if($scope.h_inicio=='' || $scope.h_inicio==null)
		{
			alert("LA HORA DE INICIO ES INCORRECTA");
		}
		else if($scope.h_fin=='' || $scope.h_fin==null)
		{
			alert("LA HORA DE FIN ES INCORRECTA");
		}
		else if($scope.idParroquia_i=='' || $scope.idParroquia_i==null)
		{
			alert("SELECCIONE UN INICIO DE RUTA");
		}
		else if($scope.idParroquia_f=='' || $scope.idParroquia_f==null)
		{
			alert("SELECCIONE UN FIN DE RUTA");
		}
		else
		{
			$rootScope.tra_idEmpresa=$scope.idEmpresa;
			$rootScope.tra_f_inicio=($scope.f_inicio.toISOString().split("T")[0]);
			$rootScope.tra_f_fin=($scope.f_fin.toISOString().split("T")[0]);
			$rootScope.tra_n_personas=($scope.n_personas);
			//var time=$scope.h_inicio.toTimeString().split(" ")[0];
			$rootScope.tra_h_inicio=($scope.h_inicio.toTimeString().split(" ")[0]);
			$rootScope.tra_h_fin=($scope.h_fin.toTimeString().split(" ")[0]);
			$rootScope.tra_idParroquia_i=($scope.idParroquia_i);
			$rootScope.tra_idParroquia_f=($scope.idParroquia_f);
			//var h_inicio = $scope.h_inicio.toISOString().split("T")[0];
			var bustrabajando= [];
			var ordenBus = [];
			var fechaHorario=[];
			var IdBusFeHo=[];
			var candidatos=[];
			/*{'idEmpresa':$scope.idEmpresa, 'f_inicio':$scope.f_inicio.toISOString().split("T")[0], 'f_fin':$scope.f_fin.toISOString().split("T")[0],
				'n_personas':$scope.n_personas, 'h_inicio':$scope.h_inicio.toTimeString().split(" ")[0] ,'h_fin':$scope.h_fin.toTimeString().split(" ")[0],
				'idParroquia_i':$scope.idParroquia_i, 'idParroquia_f':$scope.idParroquia_f}*/
			$http.post(
				"Model/Trabajos/ConsultaAsignacion.php",
				{'n_personas':$scope.n_personas}
				).success(function(data){
					$scope.trabCap=data;//Bus que trabaja y cumple con la capacidad
					console.log("Buses trabajando y con capacidad",$scope.trabCap);

					for (var i = $scope.trabCap.length - 1; i >= 0; i--) {
						var id=$scope.trabCap[i]["idBus"];
						bustrabajando.push(id);//Id Buses que trabajan y cumplen capacidad
					}
					console.log("id Buses Trabajando",bustrabajando);
					$http.post("Model/Trabajos/consBusSNTrab.php",{'idbuses':bustrabajando, 'n_personas':$scope.n_personas})
					.success(function(data){
						$scope.sntrab=data; //Buses que no trabajan y cumplen con la capacidad
						console.log("Buses con capacidad sin trabajar",$scope.sntrab);
						for (var i = $scope.sntrab.length - 1; i >= 0; i--) {
							ordenBus.push($scope.sntrab[i]); //Agrega los buses a la lista de opciones
						}
						$http.post("Model/Trabajos/BusesTrabajando.php",{'idbuses':bustrabajando})
						.success(function(data){
							$scope.trabajos=data; //Informacion de los trabajos de los buses
							console.log("Informacion buses en trabajo",$scope.trabajos);
							for (var i = $scope.trabajos.length - 1; i >= 0; i--) {
								if($scope.trabajos[i]["hora_salida"]<$scope.h_inicio.toTimeString().split(" ")[0] && $scope.trabajos[i]["hora_entrada"] > $scope.h_fin.toTimeString().split(" ")[0])
								{
									fechaHorario.push($scope.trabajos[i]);//Horario disponible para el trabajo
								}
								else
								{
									if ($scope.trabajos[i]["fecha_fin"] < $scope.f_inicio.toISOString().split("T")[0])
									{
										fechaHorario.push($scope.trabajos[i]);//Horario choca pero la fecha de contrato lo permite
									}
								}
							}
							console.log("Buses que trabajan y cumplen Fecha-Horario",fechaHorario);
							for (var i = fechaHorario.length - 1; i >= 0; i--) {
								var IdBusfech=fechaHorario[i]["idBus"];
								IdBusFeHo.push(IdBusfech); //ID BUSES QUE TRABAJAN PERO TIENEN DISPONIBILIDAD DE FECHA Y HORARIO
							}
							console.log("ID de Buses que trabajan y cumplen Fecha-Horario",IdBusFeHo);
							$http.post("Model/Trabajos/BusesFH.php",{'idbuses':IdBusFeHo})
							.success(function(data){
								$scope.busFeHo=data; //RECIBE LA INFORMACION DE LOS BUSES QUE CUMPLEN FECHA-HORARIO
								console.log("Info Buses cumplen fecha horario",$scope.busFeHo)
								for (var i = $scope.busFeHo.length - 1; i >= 0; i--) {
									if ($scope.busFeHo[i]["idParroquia"]==$scope.idParroquia_i)
									{
										candidatos.push($scope.busFeHo[i]);//INGRESO
									}
								}
								for (var i = ordenBus.length - 1; i >= 0; i--) {
									if (ordenBus[i]["idParroquia"]==$scope.idParroquia_i)
									{
										candidatos.push(ordenBus[i]);
									}
								}
								console.log("Buses residentes de donde inician",candidatos);
								for (var i = $scope.busFeHo.length - 1; i >= 0; i--) {
									if ($scope.busFeHo[i]["idParroquia"]!=$scope.idParroquia_i)
									{
										candidatos.push($scope.busFeHo[i]);
									}
								}
								for (var i = ordenBus.length - 1; i >= 0; i--) {
									if (ordenBus[i]["idParroquia"]!=$scope.idParroquia_i)
									{
										candidatos.push(ordenBus[i]);
									}
								}
								$rootScope.OpBuses=candidatos;
								console.log("Todas las opciones",candidatos);
								$location.path('/candidatos');
							});
						});
					});
				});
			}
		}
		$scope.SelecOp = function(){
			console.log("SCOPE",$rootScope.OpBuses);
			$scope.seleccion=$rootScope.OpBuses;
		}
		$scope.infoContrato= function(idBus,marca,capacidad,ano_fab,placa,idSocio){
			$rootScope.idBusSeleccionado=idBus;
			$rootScope.Bmarca=marca;
			$rootScope.Bcapacidad=capacidad;
			$rootScope.Banio=ano_fab;
			$rootScope.Bplaca=placa;
			$http.post("Model/Trabajos/infoSocio.php",{'idSocio':idSocio})
			.success(function(data){
				$rootScope.infoSocio=data; //TRAE LA INFORMACIÓN DEL SOCIO DUEÑO DEL BUS SELECCIONADO
				$rootScope.nombreSoc=$rootScope.infoSocio[0]["nombreCompleto"];
				$rootScope.telfSoc=$rootScope.infoSocio[0]["telefono"];
				$rootScope.correoSoc=$rootScope.infoSocio[0]["email"];
				$rootScope.cedulaSoc=$rootScope.infoSocio[0]["cedula"];
				console.log("Individual", $rootScope.nombreSoc,$rootScope.correoSoc);
				$http.post("Model/Trabajos/infoEmpresa.php",{'idEmpresa':$rootScope.tra_idEmpresa})
				.success(function(data){
					$rootScope.infoEpresa=data;
					$rootScope.nombEmpresa=$rootScope.infoEpresa[0]["nombre"];
					$rootScope.descEmpresa=$rootScope.infoEpresa[0]["descripcion"];
					$http.post("Model/Trabajos/infoParroquias.php",{'idIni':$rootScope.tra_idParroquia_i, 'idFin':$rootScope.tra_idParroquia_f})
					.success(function(data){
						$rootScope.infoParroquias=data;
						if ($rootScope.tra_idParroquia_i==$rootScope.infoParroquias[0]["idParroquia"])
						{
							$rootScope.Iniruta=$rootScope.infoParroquias[0]["nombre"];
							$rootScope.Finruta=$rootScope.infoParroquias[1]["nombre"];
						}
						else{
							$rootScope.Iniruta=$rootScope.infoParroquias[1]["nombre"];
							$rootScope.Finruta=$rootScope.infoParroquias[0]["nombre"];
						}
						//$rootScope.Iniruta=$rootScope.infoParroquias[0]["nombre"];
						//$rootScope.Finruta=$rootScope.infoParroquias[1]["nombre"];
						console.log("orden ruta",$rootScope.Iniruta,$rootScope.Finruta)
					})
					$location.path('/verContrato');
				});
			});
		}
		$scope.mostrarinfoContrato = function(){
			$http.get("Model/Choferes/SelectChoferes.php")
			.success(function(data){
				var choferes=[];
				$scope.chof = data;
				console.log("Inicio ruta", $rootScope.Iniruta);
				console.log("Chofer Direccion", $scope.chof[0]["direccion"]);
				for (var i = $scope.chof.length - 1; i >= 0; i--) {
					if ($scope.chof[i]["direccion"]==$rootScope.Iniruta)
					{
						choferes.push($scope.chof[i]);
					}
				}
				$scope.choferes = choferes;
				console.log("choferes", $scope.choferes);
			})
			//$rootScope.selChofer = $scope.idChofer;
			$scope.nombreSoc=$rootScope.nombreSoc;
			$scope.telfSoc=$rootScope.telfSoc;
			$scope.correoSoc=$rootScope.correoSoc;
			$scope.cedulaSoc=$rootScope.cedulaSoc;
			$scope.Bmarca=$rootScope.Bmarca;
			$scope.Bcapacidad=$rootScope.Bcapacidad;
			$scope.Banio=$rootScope.Banio;
			$scope.Bplaca=$rootScope.Bplaca;
			$scope.nombEmpresa=$rootScope.nombEmpresa;
			$scope.descEmpresa=$rootScope.descEmpresa;
			$scope.recCap=$rootScope.tra_n_personas;
			$scope.rechora_i=$rootScope.tra_h_inicio;
			$scope.rechora_f=$rootScope.tra_h_fin;
			$scope.recruta_i=$rootScope.Iniruta;
			$scope.recruta_f=$rootScope.Finruta;
			//console.log("DATOS FINALES",$scope.nombreSoc,$scope.telfSoc,$scope.correoSoc,$scope.cedulaSoc,$scope.Bmarca,$scope.Bcapacidad,$scope.Banio,$scope.Bplaca,$scope.nombEmpresa,$scope.recCap,$scope.recruta_i,$scope.recruta_f);

		}
		$scope.crear=function(){
			/*console.log($rootScope.tra_idEmpresa);
			console.log($rootScope.tra_f_inicio);
			console.log($rootScope.tra_f_fin);
			console.log($rootScope.tra_n_personas);
			console.log($rootScope.tra_h_inicio);
			console.log($rootScope.tra_h_fin);
			console.log($rootScope.tra_idParroquia_i);
			console.log($rootScope.tra_idParroquia_f);
			console.log($rootScope.idBusSeleccionado);*/
			$http.post("insert.php",{'idEmpresa':$rootScope.tra_idEmpresa, 'f_inicio':$rootScope.tra_f_inicio, 'f_fin':$rootScope.tra_f_fin,
				'n_personas':$rootScope.tra_n_personas, 'h_inicio':$rootScope.tra_h_inicio,'h_fin':$rootScope.tra_h_fin,
				'idParroquia_i':$rootScope.tra_idParroquia_i, 'idParroquia_f':$rootScope.tra_idParroquia_f, 'idBus':$rootScope.idBusSeleccionado, 'idChofer':$scope.idChofer})
			.success(function(data){
				alert(data);
				console.log("Correcto");
				$location.path('/home');
			});
		}

		$scope.mostrar = function(){
			$rootScope.nombreSoc = null;
			$rootScope.telfSoc = null;
			$rootScope.correoSoc = null;
			$rootScope.cedulaSoc = null;
			$rootScope.Bmarca = null;
			$rootScope.Bcapacidad = null;
			$rootScope.Banio = null;
			$rootScope.Bplaca = null;
			$rootScope.nombEmpresa = null;
			$rootScope.descEmpresa = null;
			$rootScope.tra_n_personas = null;
			$rootScope.tra_h_inicio = null;
			$rootScope.tra_h_fin = null;
			$rootScope.Iniruta = null;
			$rootScope.Finruta = null;
			$scope.varinfo=0;
			$http.post("Model/Trabajos/selectTrabajos.php", {'varinfo':$scope.varinfo})
			.success(function(data){
				$scope.trabajos = data;
			});
		}
		$scope.mostrarinfo = function(){
			data=$rootScope.trabajo;
			$scope.info = data;
		}
		$scope.Editar = function(){
			data=$rootScope.trabajo;

		}
		$scope.cancelar = function(){
			$scope.Nombre = null;
			$scope.Apellido = null;
			$scope.Cedula = null;
			$scope.email = null;
			$scope.password = null;
			$scope.boton="Agregar";
		};
		$scope.information=function(id){
			$scope.varinfo=1;
			$http.post("Model/Trabajos/selectTrabajos.php", {'varinfo':$scope.varinfo, 'idTrabajo':id})
			.success(function(data){
				$rootScope.trabajo=data
				$location.path('/infoTrabajos')
			});
		}
	});
app.controller('navController',function($scope, $http, $rootScope, $location){
	$scope.logout=function(){
		$location.path('/');
		$rootScope.loged=false;
	}
	$scope.sociosview=function(){
		$location.path('/socios')
	}
	$scope.homeview=function(){
		$location.path('/home')
	}
	$scope.busesview=function(){
		$location.path('/buses')
	}
	$scope.oficinistasview=function(){
		$location.path('/oficinistas')
	}
	$scope.empresasview=function(){
		$location.path('/empresas')
	}
	$scope.createTrabajoview=function(){
		$location.path('/createTrabajo')
	}
});
app.controller("sociosController", function($scope, $http, $rootScope, $location){
	$scope.boton="Agregar";
	$scope.insertar = function(){
		if($scope.nombre=='' || $scope.nombre==null)
		{
			alert("El Nombre es requerido");
		}
		else if($scope.apellido==''|| $scope.apellido==null)
		{
			alert("El Apellido es requerido");
		}
		else if($scope.cedula=='' || $scope.cedula==null)
		{
			alert("El numero de Cédula es requerido")
		}
		else if($scope.email=='' || $scope.email==null)
		{
			alert("El Email es requerido");
		}
		else if($scope.telefono=='' || $scope.telefono==null)
		{
			alert("El telefono es requerido")
		}
		else if($scope.nacionalidad=='' || $scope.nacionalidad==null)
		{
			alert("Nacionalidad requerida")
		}
		else if($scope.direccion=='' || $scope.direccion==null)
		{
			alert("Dirección requerida")
		}
		else if($scope.tip_licencia=='' || $scope.tip_licencia==null)
		{
			alert("Tipo de licencia requerida")
		}
		else
		{
			$http.post(
				"insertSocio.php",
				{'nombre':$scope.nombre, 'apellido':$scope.apellido, 'cedula':$scope.cedula,
				'email':$scope.email, 'telefono':$scope.telefono, 'nacionalidad':$scope.nacionalidad,
				'direccion':$scope.direccion,'tip_licencia':$scope.tip_licencia,'boton':$scope.boton, 'idSocio':$scope.idSocio}
				).success(function(data){
					alert(data);
					$scope.idSocio=null;
					$scope.nombre = null;
					$scope.apellido = null;
					$scope.cedula = null;
					$scope.email = null;
					$scope.telefono =null;
					$scope.nacionalidad=null;
					$scope.direccion= null;
					$scope.tip_licencia= null;
					$scope.boton="Agregar";
					$scope.mostrar();
				});
		}
	}
		$scope.mostrar = function(){
			$http.get("selectSocios.php")
			.success(function(data){
				$scope.socios = data;
			});
		}
		$scope.Editar = function(idSocio, nombre, apellido, cedula, email, telefono, nacionalidad, direccion, tip_licencia){
			$scope.boton="Editar";
			$scope.idSocio = idSocio;
			$scope.nombre = nombre;
			$scope.apellido = apellido;
			$scope.cedula = cedula;
			$scope.email = email;
			$scope.telefono =telefono;
			$scope.nacionalidad=nacionalidad;
			$scope.direccion= direccion;
			$scope.tip_licencia= tip_licencia;
		}
		$scope.cancelar = function(){
			$scope.idSocio =null;
			$scope.nombre = null;
			$scope.apellido = null;
			$scope.cedula = null;
			$scope.email = null;
			$scope.telefono = null;
			$scope.nacionalidad = null;
			$scope.direccion = null;
			$scope.tip_licencia = null;
			$scope.boton="Agregar";
		};
		$scope.Eliminar=function(idSocio){
			if(confirm("Esta seguro de eliminar estos datos?"))
			{
				$http.post("deletesocio.php", {'idSocio':idSocio})
				.success(function(data){
					alert(data);
					$scope.mostrar();
				});
			}
			else
			{
				return false;
			}
		}
	});
app.controller("busesController", function($scope, $http, $rootScope, $location){
	$scope.boton="Agregar";
	//FUNCION PARA OBTENER LOS SOCIOS Y PARROQUIAS COMO FK
	$scope.FK=function(){
		$http.get("selectSocios.php")
		.success(function(data){
			$scope.socios = data;
		})
		$http.get("selectParroquias.php")
		.success(function(data){
			$scope.parroquias = data;
		})
	}
	$scope.insertar = function(){
		if($scope.marca==''|| $scope.marca==null)
		{
			alert("Marca del Bus requerida");
		}
		else if($scope.modelo=='' || $scope.modelo==null)
		{
			alert("Modelo del Bus requerido");
		}
		else if($scope.ano_fab==''|| $scope.ano_fab==null)
		{
			alert("Año de fabricación del Bus requerido")
		}
		else if($scope.capacidad=='' || $scope.capacidad==null)
		{
			alert("Capacidad del Bus requerida");
		}
		else if($scope.placa=='' || $scope.placa==null)
		{
			alert("Placa del Bus requerida")
		}
		else if($scope.idParroquia=='' || $scope.idParroquia==null)
		{
			alert("Seleccione un lugar de residencia del bus")
		}
		else if($scope.idSocio=='' || $scope.idSocio==null)
		{
			alert("Seleccione un socio dueño del bus")
		}
		else
		{
			$http.post(
				"insertBus.php",
				{'marca':$scope.marca, 'modelo':$scope.modelo, 'ano_fab':$scope.ano_fab,
				'capacidad':$scope.capacidad, 'placa':$scope.placa, 'idParroquia':$scope.idParroquia,
				'idSocio':$scope.idSocio,'boton':$scope.boton, 'idBus':$scope.idBus}
				).success(function(data){
					alert(data);
					$scope.idBus=null;
					$scope.marca = null;
					$scope.modelo = null;
					$scope.ano_fab = null;
					$scope.capacidad = null;
					$scope.placa =null;
					$scope.idParroquia=null;
					$scope.idSocio= null;
					$scope.boton="Agregar";
					$scope.mostrar();
				});
		}
	}
		$scope.mostrar = function(){
			$http.get("selectBuses.php")
			.success(function(data){
				$scope.buses = data;
			});
		}
		$scope.Editar = function(idBus, marca, modelo, ano_fab, capacidad, placa, idParroquia, idSocio){
			$scope.boton="Editar";
			$scope.idBus=idBus;
			$scope.marca = marca;
			$scope.modelo = modelo;
			$scope.ano_fab = ano_fab;
			$scope.capacidad = capacidad;
			$scope.placa = placa;
			$scope.idParroquia=idParroquia;
			$scope.idSocio= idSocio;
		}
		$scope.cancelar = function(){
			$scope.idBus=null;
			$scope.marca = null;
			$scope.modelo = null;
			$scope.ano_fab = null;
			$scope.capacidad = null;
			$scope.placa =null;
			$scope.idParroquia=null;
			$scope.idSocio= null;
			$scope.boton="Agregar";
		};
		$scope.Eliminar=function(idBus){
			if(confirm("Esta seguro de eliminar estos datos?"))
			{
				$http.post("deleteBus.php", {'idBus':idBus})
				.success(function(data){
					alert(data);
					$scope.mostrar();
				});
			}
			else
			{
				return false;
			}
		}
	});

//	DESDE AQUI OFICINISTA
app.controller("oficinistasController", function($scope, $http, $rootScope, $location){
	$scope.boton="Agregar";
	$scope.insertar = function(){
		if($scope.nombre=='' || $scope.nombre==null)
		{
			alert("El Nombre es requerido");
		}
		else if($scope.apellido=='' || $scope.apellido==null)
		{
			alert("El Apellido es requerido");
		}
		else if($scope.cedula=='' || $scope.cedula==null)
		{
			alert("El numero de Cédula es requerido")
		}
		else if($scope.email=='' || $scope.email==null)
		{
			alert("El Email es requerido");
		}
		else if($scope.telefono=='' || $scope.telefono==null)
		{
			alert("El telefono es requerido")
		}
		else if($scope.nacionalidad=='' || $scope.nacionalidad==null)
		{
			alert("Nacionalidad requerida")
		}
		else if($scope.direccion=='' || $scope.direccion==null)
		{
			alert("Dirección requerida")
		}
		else if($scope.cargo==''|| $scope.cargo==null)
		{
			alert("Tipo de licencia requerida")
		}
		else if($scope.password=='' || $scope.password==null)
		{
			alert("Ingrese una contraseña, luego esta será cambiada por el usuario")
		}
		else
		{
			$http.post(
				"insertOficinista.php",
				{'nombre':$scope.nombre, 'apellido':$scope.apellido, 'cedula':$scope.cedula,
				'email':$scope.email, 'telefono':$scope.telefono, 'nacionalidad':$scope.nacionalidad,
				'direccion':$scope.direccion,'cargo':$scope.cargo, 'password':$scope.password,'boton':$scope.boton, 'idOficinista':$scope.idOficinista}
				).success(function(data){
					alert(data);
					$scope.iOficinista=null;
					$scope.nombre = null;
					$scope.apellido = null;
					$scope.cedula = null;
					$scope.email = null;
					$scope.telefono =null;
					$scope.nacionalidad=null;
					$scope.direccion= null;
					$scope.cargo= null;
					$scope.password=null;
					$scope.boton="Agregar";
					$scope.mostrar();
				});
		}
	}
		$scope.mostrar = function(){
			$http.get("selectOficinistas.php")
			.success(function(data){
				$scope.oficinistas = data;
			});
		}
		$scope.Editar = function(idOficinista, nombre, apellido, cedula, email, telefono, nacionalidad, direccion, cargo){
			$scope.boton="Editar";
			$scope.idOficinista = idOficinista;
			$scope.nombre = nombre;
			$scope.apellido = apellido;
			$scope.cedula = cedula;
			$scope.email = email;
			$scope.telefono =telefono;
			$scope.nacionalidad=nacionalidad;
			$scope.direccion= direccion;
			$scope.cargo= cargo;
			$scope.password="LA CONTRASEÑA UNICAMENTE LA PUEDE MODIFICAR EL USUARIO"
		}
		$scope.cancelar = function(){
			$scope.idOficinista =null;
			$scope.nombre = null;
			$scope.apellido = null;
			$scope.cedula = null;
			$scope.email = null;
			$scope.telefono = null;
			$scope.nacionalidad = null;
			$scope.direccion = null;
			$scope.cargo = null;
			$scope.password=null;
			$scope.boton="Agregar";
		};
		$scope.Eliminar=function(idOficinista){
			if(confirm("Esta seguro de eliminar estos datos?"))
			{
				$http.post("deleteOficinista.php", {'idOficinista':idOficinista})
				.success(function(data){
					alert(data);
					$scope.mostrar();
				});
			}
			else
			{
				return false;
			}
		}
	});

//EMPRESAS
app.controller("empresascontroller", function($scope, $http, $rootScope, $location){
	$scope.boton="Agregar";
	$scope.insertar = function(){
		if($scope.nombre=='' || $scope.nombre==null)
		{
			alert("El Nombre es requerido");
		}
		else if($scope.descripcion=='' || $scope.descripcion==null)
		{
			alert("La descripción de la empresa es requerida");
		}
		else
		{
			$http.post(
				"Server/insertEmpresas.php",
				{'nombre':$scope.nombre, 'descripcion':$scope.descripcion,'boton':$scope.boton, 'idEmpresa':$scope.idEmpresa}
				).success(function(data){
					alert(data);
					$scope.idEmpresa= null;
					$scope.nombre = null;
					$scope.descripcion=null;
					$scope.boton="Agregar";
					$scope.mostrar();
				});
		}
	}
		$scope.mostrar = function(){
			$http.get("Server/selectEmpresas.php")
			.success(function(data){
				$scope.empresas = data;
			});
		}
		$scope.Editar = function(idEmpresa, nombre, descripcion){
			$scope.idEmpresa = idEmpresa;
			$scope.nombre = nombre;
			$scope.descripcion=descripcion;
			$scope.boton = "Editar";
		}
		$scope.cancelar = function(){
			$scope.idEmpresa=null;
			$scope.nombre = null;
			$scope.descripcion = null;
			$scope.boton="Agregar";
		};
		$scope.Eliminar=function(idEmpresa){
			if(confirm("Esta seguro de eliminar estos datos?"))
			{
				$http.post("Server/deleteEmpresas.php", {'idEmpresa':idEmpresa})
				.success(function(data){
					alert(data);
					$scope.mostrar();
				});
			}
			else
			{
				return false;
			}
		}
	});