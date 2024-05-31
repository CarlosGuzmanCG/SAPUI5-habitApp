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
            onInit: function () {
                //var oModel = new sap.ui.model.json.JSONModel();
                var oModel = new JSONModel(); 
                oModel.setData(//{ 
                    //actividades:
                    [
                        { Text : 'Prueba desde modelo' }
                    ]
                //}
                );
                //this.getView().setModel(oModel,'Pendientes');
                this.setModel(oModel,'pendientes'); //Carga a la vista
                //debbuger;
            },

            onAddTask: function(oEvet){
                var oModel = this.getModel('pendientes');
                var oDatos = oModel.getData(); // obtenemos los datos actualizados

                oDatos.push({Text : 'Prueba desde modelo'});

                oModel.setData(oDatos);

            },

            onDeleteTask: function(oEvent){
                var oModel = oEvent.getParameter('listItem').getBindingContext('pendientes').getModel();
                debugger
                var sPath = oEvent.getParameter('listItem').getBindingContext('pendientes').getPath();

                var posicionAEliminar = sPath.split('/')[1];
                var oData = oModel.getData();
                var oNewData = [];
                for(var x = 0; x < oData.length; x++){
                    if(x ==  posicionAEliminar) continue;
                    oNewData.push(oData[x]);
                }

                oModel.setData(oNewData);
            }
        });
    });
