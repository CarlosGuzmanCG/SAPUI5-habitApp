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

            onInit: function () {
                //var oModel = new sap.ui.model.json.JSONModel();
                var oModel = new JSONModel(); 
                oModel.setData([]);

                oModel.loadData('/data/test_task.json');

                this.setModel(oModel,'pendientes'); //Carga a la vista
                //debbuger;
            },

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
                recordToAdd.priority = -1;//Nuevo registro
                recordToAdd.status = 'pending';
                recordToAdd.editable = true;

                oDatos.push( recordToAdd );

                oModel.setData(oDatos);

            },

            onDeleteTask: function(oEvent){
                var oModel = oEvent.getParameter('listItem').getBindingContext('pendientes').getModel();
                //debugger
                var sPath = oEvent.getParameter('listItem').getBindingContext('pendientes').getPath();

                var posicionAEliminar = sPath.split('/')[1];
                var oData = oModel.getData();
                var oNewData = [];

                for(var x = 0; x < oData.length; x++){
                    if(x ==  posicionAEliminar) continue;
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
                var oData = this.getModel('pendientes').getData();

                var oPressedListItemContext = oEvent.getSource().getBindingContext('pendientes'); //Contexto de la lista
                var oModel = oPressedListItemContext.getModel(); 
                var sPath = oPressedListItemContext.getPath();

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
                var oData = oBindinContext.getObject();//dev un diccionario js
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
                    debugger
                }else{
                    oEvent.getSource().setValueState('Success');
                    oEvent.getSource().setValueStateText('');
                    oModel.setProperty( sPath + '/error', false );
                }
            }
        });
    });
