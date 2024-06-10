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
                'due_date'
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
                recordToAdd.priority = 0;//Nuevo registro

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

            onPressItem: function(oEvent){
                debugger
            }
        });
    });
