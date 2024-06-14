sap.ui.define(
    [
    "./BaseController",
    "sap/ui/model/json/JSONModel"
    ],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,JSONModel) {
        "use strict";

        return Controller.extend("com.cg.habitapp.controller.MainView", {

            camposTareas: [ 
                'priority',
                'title',
                'description',
                'date_created',
                'date_start',
                'due_date',
                'editable',
                'status'
            ],

            createNewTask: function(){

                var baseRecord = {};

                for(var id_campo = 0; id_campo < this.camposTareas.length; id_campo++){
                    var campo_a_agregar = this.camposTareas[id_campo];
                    baseRecord[campo_a_agregar] = '';
                }

                return baseRecord;

            },

           /* baseRecord:  { //diccionario
                priority: 0,
                title: '',
                description : '',
                date_created: '',
                date_start: '',
                due_date: ''
            },*/
            onModelChange: function(oEvent){
                //debugger;
                var reason = oEvent.getParameter('reason'); //Razón del cambio
                var oModel;

                switch(reason){ //Switch para saber la razón del cambio
                    case 'change': //Se lanza desde un objeto Binding
                        var oModel = oEvent.getSource().getModel(); //Modelo de datos
                        break;
                    case 'propertyChange': //Se lanza desde un modelo
                        var oModel = oEvent.getSource(); //Modelo de datos
                        break;

                }
                debugger;
                //var oModel = oEvent.getSource(); //Modelo de datos
                var sJsonData = oModel.getJSON(); //Obtenemos los datos del modelo
                
                if(!sJsonData) return; //Si no hay datos no hacemos nada

                window.localStorage.setItem('pendientes', sJsonData); //Guardamos los datos en el local storage

                
            },

            onInit: function () {
                //var oModel = new sap.ui.model.json.JSONModel();
                var oModel = new JSONModel(); 
                oModel.setData([]);

                var localStorageData = window.localStorage.getItem('pendientes'); //Obtenemos los datos del local storage

                if(localStorageData){ //Si hay datos en el local storage
                    oModel.setJSON(localStorageData); //Cargamos los datos del local storage
                }else{
                    oModel.loadData('/data/test_task.json'); //Cargamos los datos del archivo json
                }


                this.setModel(oModel,'pendientes'); //Carga a la vista
                oModel.attachEvent('propertyChange', '',  this.onModelChange, this); //this.onModelChange.bind(this) Modificación  del modelo
            },

            onAfterRendering: function(){
             //debugger;

             var oModel = this.getModel('pendientes');   //Modelo de la vista
             var aBindings = oModel.getBindings(); //Obtenemos los bindings del modelo

             for(var x_bindings = 0; x_bindings < aBindings.length; x_bindings++){
                aBindings[x_bindings].attachChange( this.onModelChange, this); //Agregamos un evento a cada binding
             }
            }
            ,

            onAddTask: function(oEvet){
                var oModel = this.getModel('pendientes');
                var oDatos = oModel.getData(); // obtenemos los datos actualizados

                var recordToAdd = this.createNewTask();

                var date = new Date();
                var year = date.getFullYear();
                var month = date.getMonth()+1;
                var day = date.getDate();

                recordToAdd.date_created = year + "-" +  month + "-" + day;
                //recordToAdd.date_created = new Date(); //agregamos una fecha al controlador
                recordToAdd.priority = -1;//Nuevos registros
                recordToAdd.status = 'pending';
                recordToAdd.editable = true;

                oDatos.push( recordToAdd );

                oModel.setData(oDatos);

            },

            onDeleteTask: function(oEvent){
                var oModel = oEvent.getParameter('listItem').getBindingContext('pendientes').getModel();
                //debugger
                var sPath = oEvent.getParameter('listItem').getBindingContext('pendientes').getPath();

                var PosiciónAEliminar = sPath.split('/')[1];
                var oData = oModel.getData();
                var oNewData = [];

                for(var x = 0; x < oData.length; x++){
                    if(x ==  PosiciónAEliminar) continue;
                    oNewData.push(oData[x]);
                }

                oModel.setData(oNewData);
            },

            onEdit: function(oEvent){
                debugger
            },

            /*onPressItem: function(oEvent){
                console.log('onPressItem');
            },*/

            onListItemPress: function(oEvent){
                var oPressedListItemContext = oEvent.getParameter('listItem').getBindingContext('pendientes'); //Contexto de la lista
                var oModel = oPressedListItemContext.getModel(); //
                var sPath = oPressedListItemContext.getPath();

                var position = sPath.split('/')[1];
                var oData = oModel.getData();

                for(var i = 0; i < oData.length;i++){
                    sPath = "/"+i;
                    if(i == position) continue;
                    oModel.setProperty( sPath + '/editable', false );
                }

                sPath = "/"+ position;

                //Modificamos los datos oModel.setData(path, new value)
                oModel.setProperty( sPath + '/editable', true );

            },

            onPressSaveTask: function(oEvent){
                //var oModel = this.getModel('pendientes');
                //var oData = oModel.getData();
                var oData = this.getModel('pendientes').getData(); //Obtenemos los datos del modelo

                var oPressedListItemContext = oEvent.getSource().getBindingContext('pendientes'); //Contexto de la lista
                var oModel = oPressedListItemContext.getModel();  //Modelo de datos
                var sPath = oPressedListItemContext.getPath();  //Path de la tarea

                for(var i = 0; i < oData.length; i++){
                    var sPath = "/"+i;
                    oModel.setProperty( sPath + '/editable', false );
                }

            },

            onPressCompleted: function(oEvent){
                var oPressedListItemContext = oEvent.getSource().getBindingContext('pendientes'); //Contexto de la lista
                var oModel = oPressedListItemContext.getModel(); 
                var sPath = oPressedListItemContext.getPath();

                oModel.setProperty( sPath + '/status', 'completed' );
            },

            onDataChange: function(oEvent){
                var oBindinContext = oEvent.getSource().getBindingContext('pendientes');//.getObjetc();//acceso a datos
                var oData = oBindinContext.getObject();//devolvemos un diccionario con los datos
                //var date = oData.date_created;
                //console.log(date);
                var sPath = oBindinContext.getPath();
                var oModel = oBindinContext.getModel();

                if(!oData.date_start) return;

                if(!oData.due_date) return;

                var fecha_inicio = new Date(oData.date_start);
                var fecha_fin = new Date(oData.due_date);

                if(fecha_inicio > fecha_fin){
                    /*oData.date_start = '';
                    oData.due_date = '';
                    oBindinContext.getModel().setProperty(oBindinContext.getPath(), oData);*/
                    oEvent.getSource().setValueState('Error');
                    oEvent.getSource().setValueStateText('Fecha fin no puede ser menor a la fecha inicio');
                    oModel.setProperty( sPath + '/error', true );
                    //debugger
                }else{
                    oEvent.getSource().setValueState('Success');
                    oEvent.getSource().setValueStateText('');
                    oModel.setProperty( sPath + '/error', false );
                }
            },

            updateTaskPriority: function(){
                var oModel = this.getModel('pendientes');
                var oData = oModel.getData();

                oData.sort( function compare( a , b ) {
                    if( a.priority < b.priority ) {
                        return -1;
                    }
                    if( a.priority > b.priority  ) {
                        return 1;
                    }
                    return 0;
                } );

                for(var x_pendientes = 0; x_pendientes < oData.length; x_pendientes++){
                    oData[x_pendientes].priority = x_pendientes * 100;
                }

                oModel.setData(oData, 'pendientes');
                oModel.refresh(true);
                
            },

            onDropReorderTask: function(oEvent){
                var oDraggedItem = oEvent.getParameter("draggedControl"); //Control que se arrastra
                var oDroppedItem = oEvent.getParameter("droppedControl"); //Control donde se soltó
                var sDropPosition = oEvent.getParameter("dropPosition"); //Posición donde se soltó
                
                var sDraggedPath = oDraggedItem.getBindingContext('pendientes').getPath(); //Path del control que se arrastra
                //var sDroppedPath = oDroppedItem.getBindingContext('pendientes').getPath(); //Path del control donde se soltó
                //var vPath = parseInt(sDroppedPath.replace('/','')); //Posición de la tarea que se arrastra
                var oDroppedData = oDroppedItem.getBindingContext('pendientes').getObject(); //Datos del control donde se soltó
                
                var oModel = oDraggedItem.getBindingContext('pendientes').getModel(); //Modelo de datos


                switch(sDropPosition){
                    case 'Before':
                        oModel.setProperty( sDraggedPath + '/priority', oDroppedData.priority - 1 );
                        //Tomar la prioridad de oDropperdData
                        //Asignar la prioridad a la tarea DraggedItem
                        //Actualizar el resto de tareas con un +1  
                        
                        break;
                    case 'on':
                        oModel.setProperty( sDraggedPath + '/priority', oDroppedData.priority + 1 );
                        //Tomar la prioridad de oDropperdData
                        //Asignar la prioridad a la tarea DraggedItem
                        //Actualizar el resto de tareas con un +1  
                        break;
                    case 'After':
                        oModel.setProperty( sDraggedPath + '/priority', oDroppedData.priority + 1);
                        //Tomar la prioridad de oDropperdData y sumarle 1
                        //Asignar la prioridad a la tarea DraggedItem
                        //Actualizar el resto de tareas con un +1  
                        break;
                }
                //oModel.refresh(true);
                this.updateTaskPriority();

                //debugger
            }
        });
    });
