sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Filter",
    "../utils/formatter",
    "../classes/service",
    "sap/m/library",
    "sap/ui/core/Fragment",
    "sap/ui/export/Spreadsheet", 
    "sap/m/MessageBox",          
    "sap/m/MessageToast"
],
function (Controller, JSONModel, FilterOperator, Filter, formatter, service, library, Fragment, Spreadsheet,  MessageBox, MessageToast) {
    "use strict";

    return Controller.extend("sbx.rla.bc.appstore.controller.catalogo", {

        formatter: formatter,
        service: service,
        oReqVal_Popup:  null,

        onInit: async function () { 

            // dados adicionais da worklist
            this.Products;        // dados da tabela
            this.productsContext; // dados visíveis da tabela

            // dados para arquivos excel
            this.oExcelFile;      // arquivo excel
            this.excelColumns;    // colunas do excel
            this.excelSettings;   // configurações do excel
            this.excelBlob;       // excel convertido para blob
            this.excelBase64;     // excel em base64
            this.excelJson;       // dados da tabela em Json 
            this.excelWorkBook;   // arquivo excel para backend

            // dados para atualizacao de estoque
            this.orderQuantity; // quantidade do pedido
            this.orderPath;     // caminho para pedido
            this.oRequestOrder; // corpo da requisição
            this.oJSONOrder;    // requisicao json

            // parametros de entrada para carregamento de serviço
            this.oModel     = this.getOwnerComponent().getModel(); 
            this.oView      = this.getView();
            this.modelsData = ["categoriaCollection", "produtosCollection"];
            this.urlNames   = ["/CategoriaSet", "/ProdutoSet"];

            //classe de carregamento de serviço
            this.oView.setBusy(true); 
            this.oService = new service(this.oModel, this.oView, this.modelsData, this.urlNames);
            await this.oService.loadService();

            //criacao do filtro e atualização de produtos em estoque
            this.aFilters = []; 
            this.updateStockCounts();
            this.oView.setBusy(false);
        },

        testButton: function(oEvent) {
            this._setExcelProdutos(oEvent);
        },

        getOrderRequest: function () {
<<<<<<< HEAD

=======
>>>>>>> 2e3a2bc (002)
            if (!this.oReqVal_Popup) {
                Fragment.load({
                    id: this.getView().getId() + "orderPopup",
                    name: "sbx.rla.bc.appstore.fragments.orderPopup",
                    controller: this,
                }).then(function (oFragment) {
                    this.oReqVal_Popup = oFragment;
                    this.getView().addDependent(this.oReqVal_Popup);
                    this.oReqVal_Popup.open();
                }.bind(this)).catch(function (error) {
                    MessageBox.error("Erro ao carregar o fragmento: " + error.message);
                });
            } else {
                this.oReqVal_Popup.open();
            }
        },

        onCancelOrder: function() {
            if (this.oReqVal_Popup) {
                this.oReqVal_Popup.close();
            }
        },

<<<<<<< HEAD
        onSendOrder: function() {

            // recebe a quantidade do fragment
            var newInput = Fragment.byId(this.getView().getId() + "orderPopup", "quantityInput");
            var newQuantity  = newInput.getValue();
            
            // encerra o fragment
            this.oReqVal_Popup.close();
            
            // recebe os produtos selecionados
            this._getTableContent();
            this._getTableContext();

            //verifica se há dados enviados da tabela
=======
        _getQuantityStock: function() {

            // recebe a quantidade do fragment
            var newInput = Fragment.byId(this.getView().getId() + "orderPopup", "quantityInput");
            this.orderQuantity = newInput.getValue();
            
            this.oReqVal_Popup.close();
        },

        _setJSONOrder: function() {
            
        },

        onSendOrder: async function() {

            this._getQuantityStock(); // recebe a quantidade
            this._getTableContent();  // recebe dados selecionados da tabela
            this._getTableContext();  // recebe dados atuais da tabela selecionados
            
>>>>>>> 2e3a2bc (002)
            if (!this.Products || this.Products.length === 0) {
                MessageBox.information("Selecione um produto do Catálogo");
                return;
            }
<<<<<<< HEAD

            this.productsContext.forEach(function (oProduct) {

                debugger;

                var sPath = "/ProdutoSet(IdProduto='" + oProduct.IdProduto + "',IdCategoria='" + oProduct.IdCategoria + "')"; 
        
                var oPayload = {
                    "Descricao":      oProduct.Descricao,
                    "PrecoUnitario":  oProduct.PrecoUnitario,
                    "Estoque":        oProduct.Estoque, 
                    "DataEntrada":    oProduct.DataEntrada instanceof Date ? oProduct.DataEntrada.toISOString().slice(0, 10) + "T00:00:00" : oProduct.DataEntrada,
                    "DataAlteracao":  oProduct.DataAlteracao instanceof Date ? oProduct.DataAlteracao.toISOString().slice(0, 10) + "T00:00:00" : oProduct.DataAlteracao,
                    "Username":       oProduct.Username
                };

                console.log("Requisição enviada:", oPayload);
                console.log("sPath:", sPath);
                console.log("Payload:", oPayload);

                this.oModel.update(sPath, oPayload, {
                    method: "PUT", 
                    success: function () {
                        MessageToast.show("Produto " + oProduct.IdProduto + " atualizado com sucesso.");
                    },
                    error: function (oError) {
                        MessageBox.error("Erro ao atualizar produto " + oProduct.IdProduto);
                    }
                });

            }.bind(this));
=======
        
            // itera por produtos selecionados
            // o foreach nao permite await em requisicoes
            for (let oProduct of this.productsContext) {

                this.orderPath = "/ProdutoSet(IdProduto='" + oProduct.IdProduto + "',IdCategoria='" + oProduct.IdCategoria + "')";
                
                // corpo da requisição (json)
                this.oRequestOrder = {
                    "IdProduto": oProduct.IdProduto,
                    "IdCategoria": oProduct.IdCategoria,
                    "Descricao": oProduct.Descricao,
                    "PrecoUnitario": oProduct.PrecoUnitario,
                    "Estoque": oProduct.Estoque + Number(this.orderQuantity), // Atualiza o estoque
                    "DataEntrada": oProduct.DataEntrada instanceof Date ? oProduct.DataEntrada.toISOString().slice(0, 10) + "T00:00:00" : oProduct.DataEntrada,
                    "DataAlteracao": oProduct.DataAlteracao instanceof Date ? oProduct.DataAlteracao.toISOString().slice(0, 10) + "T00:00:00" : oProduct.DataAlteracao,
                    "Username": oProduct.Username
                };

                this.oJSONOrder = new JSONModel(this.oRequestOrder);

                // atualiza o estoque
                await new Promise((resolve, reject) => {
                    this.oModel.update(this.orderPath, this.oJSONOrder.getData(), {
                        method: "PUT",
                        success: function () {
                            resolve(); 
                            MessageToast.show("Produto " + oProduct.IdProduto + " atualizado com sucesso.");
                        },
                        error: function (oError) {
                            reject(oError); 
                            MessageBox.error("Erro ao atualizar produto " + oProduct.IdProduto);
                        }
                    });
                });
            }
>>>>>>> 2e3a2bc (002)
        },

        //----------------------------------------------------------------------------
        //                           Informações da Tabela
        //----------------------------------------------------------------------------

        _getTableContent: function() {

            var oTable = this.oView.byId("tabelaProdutos");
            this.Products = oTable.getSelectedItems();
        },

        _getTableContext: function() {

            this.productsContext = this.Products.map(function (oItem) {
                var oContext = oItem.getBindingContext("produtosCollection");
                return oContext ? oContext.getObject() : {};
            })
        },

        //----------------------------------------------------------------------------
        //                          Arquivos Excel Frontend
        //----------------------------------------------------------------------------

        _setExcelColumns: function() {

            this.excelColumns = [];

            this.excelColumns = [
                { label: "Descrição",        property: "Descricao",     type: "string"},
                { label: "Username",         property: "Username",      type: "string"},
                { label: "Data Entrada",     property: "DataEntrada",   type: "date"},
                { label: "Data Modificação", property: "DataAlteracao", type: "date"},
                { label: "Preço Unitário",   property: "PrecoUnitario", type: "number", scale: 2, format: "#,##0.00", delimiter: true},
                { label: "Estoque",          property: "Estoque",       type: "string"}
            ];
        },

        _setExcelSettings: function() {
            this.excelSettings = { workbook: { columns: this.excelColumns }, dataSource: this.productsContext, filename: "Produtos.xlsx"};
        },

        _exportExcel: function() {

            this.oExcelFile = new Spreadsheet(this.excelSettings);

            this.oExcelFile.build().then(function() {
                MessageToast.show("Exportação concluída com sucesso!");
            })
            .catch(function () {
                MessageBox.error("Erro ao exportar os dados para o Excel.");
            })
            .finally(function () {
                this.oExcelFile.destroy();
            });
        },

        setExcelProdutostoFrontend: function () {

            this._getTableContent(); // vínculo com a tabela
            this._setExcelColumns(); // configurações de colunas
            this._getTableContext(); // conteúdo visível da tabela

            //verifica se há dados enviados da tabela
            if (!this.productsContext || this.productsContext.length === 0) {
                MessageBox.information("Selecione um produto do Catálogo");
                return;
            }

            this._setExcelSettings(); // configurações gerais do excel
            this._exportExcel();      // carregamento do arquivo

        },

        //----------------------------------------------------------------------------
        //                          Arquivos Excel Backend
        //----------------------------------------------------------------------------

        _importLibXLSX: function () {

            return new Promise(function (resolve, reject) {
                if (typeof XLSX === "undefined") {
                    jQuery.sap.includeScript(
                        "https://cdn.sheetjs.com/xlsx-0.20.0/package/dist/xlsx.full.min.js",
                        "XLSX_LOADER",
                        function () {
                            resolve();
                        }
                    );
                } else {
                    resolve();
                }
            });
        },

        _setContexttoJSON: function() {

            var aProductsData = this.productsContext; 

            this.excelJson = aProductsData.map(function(oProduct) {

                return {
                    Descricao: oProduct.Descricao,
                    Username: oProduct.Username,
                    DataEntrada: oProduct.DataEntrada,
                    DataModificacao: oProduct.DataAlteracao,
                    PrecoUnitario: oProduct.PrecoUnitario,
                    Estoque: oProduct.Estoque
                };
            });

            console.log("Json: ", this.excelJson);
        },

        _createWorkbook: function() {

            var ws = XLSX.utils.json_to_sheet(this.excelJson);

            this.excelWorkBook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(this.excelWorkBook, ws, "Produtos");
        },

        _createBlobfromExcelFile: function () {

            var arrayBuffer = XLSX.write(this.excelWorkBook, { bookType: "xlsx", type: "array" });
            this.excelBlob = new Blob([arrayBuffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            });

            console.log("URL do Blob: ", this.excelBlob);
        },

        _convertExcelBlobtoBase64: function () {

            return new Promise(function (resolve, reject) {
                var reader = new FileReader();
                reader.onloadend = function () {
                    var base64data = reader.result.split(",")[1];
                    this.excelBase64 = base64data;
                    console.log("Base64 gerado:", this.excelBase64);
                    resolve(); 
                }.bind(this);
                reader.onerror = reject;
                reader.readAsDataURL(this.excelBlob);
            }.bind(this));
        },

        _sendFiletoBackEnd: function() {

            return new Promise(function (resolve, reject) {

                var sBase64 = this.excelBase64;

                this.oModel.callFunction("/ZRLA_Import_File", {
                    method: "GET",
                    urlParameters: {
                        "Stringlink": sBase64
                    }, 
                    success: function (oData) {
                        MessageToast.show("Arquivo enviado com sucesso!");
                        resolve(oData);
                    },
                    error: function (oError) {
                        MessageBox.error("Erro ao enviar o arquivo para o backend.");
                        reject(oError);
                    },
                });
            }.bind(this));
        },

        setExcelProdutostoBackend: async function() {

            await this._importLibXLSX(); // importa biblioteca xlsx
            this._getTableContent();     // vínculo com a tabela
            this._setExcelColumns();     // configurações de colunas
            this._getTableContext();     // conteúdo visível da tabela
            this._setContexttoJSON();    // conteúdo da tabela em JSON

            // verifica se há dados enviados da tabela
            if (!this.productsContext || this.productsContext.length === 0) {
                MessageBox.information("Selecione um produto do Catálogo");
                return;
            }

            this._createWorkbook();                 // cria arquivo excel a partir do json
            this._createBlobfromExcelFile();        // gera o blob a partir do arquivo
            await this._convertExcelBlobtoBase64(); // converte blob para base64«
            await this._sendFiletoBackEnd();        // envia arquivo via serviço
        },

        //----------------------------------------------------------------------------
        //                           Contagem de Estoque
        //----------------------------------------------------------------------------
        updateStockCounts: function () {

            //recebe todas as linhas da tabela em carregamento
            var oTable    = this.getView().byId("tabelaProdutos");
            var oBinding  = oTable.getBinding("items");
            var aContexts = oBinding.getContexts();

            //contadores de status
            var bomCount     = 0;
            var alertaCount  = 0;
            var criticoCount = 0;
            var totalCount   = 0;

            //conta o status das colunas de estoque
            aContexts.forEach(function (oContext) {
                var item = oContext.getObject();
                if (item.Estoque > 100) {
                    bomCount++;
                    totalCount++;
                } else if (item.Estoque >= 50 && item.Estoque <= 100) {
                    alertaCount++;
                    totalCount++;
                } else if (item.Estoque <= 49) {
                    criticoCount++;
                    totalCount++;
                }
            });

            //cria um novo model para os icons
            var oModelEstoque = new JSONModel({
                bomCount:     bomCount,
                alertaCount:  alertaCount,
                criticoCount: criticoCount,
                totalCount:   totalCount
            });

            //popula o model com os contadores
            this.getView().setModel(oModelEstoque, "stockCounts");
        },

        //------------------------------------
        //             FILTROS 
        //------------------------------------
        onSearchFilters: function() {

            var oView  = this.getView();
            var oTable = oView.byId("tabelaProdutos");

            //reinicia filtro
            this.aFilters = [];

            //recebe os filtros
            this._getFilterCategoria();
            this._getFilterNumProd();
            this._getFilterEstoque();

            //aplica filtros na tabela
            var oBinding = oTable.getBinding("items");
            oBinding.filter(this.aFilters);

            //atualiza contragem de estoque
            this.updateStockCounts();
        },

        _getFilterCategoria: function () {

            //filtro de categoria
            var oComboBox   = this.oView.byId("comboCategoria1");
            var idCategoria = oComboBox.getSelectedKey();

            if (idCategoria) {
                this.aFilters.push(new Filter("IdCategoria", FilterOperator.EQ, idCategoria));
            }
        },

        _getFilterNumProd: function() {

            //filtro do numero do produto
            var oInput     = this.oView.byId("searchField");
            var NumProduto = oInput.getValue();

            if (NumProduto) {
                this.aFilters.push(new Filter("IdProduto", FilterOperator.EQ, NumProduto));
            }
        },

        _getFilterEstoque: function() {

            //filtro de estoque
            var oIconTabBar  = this.oView.byId("iconTabBar");
            var sSelectedKey = oIconTabBar.getSelectedKey();

            if (sSelectedKey) {
                var stockFilter;
                switch (sSelectedKey) {
                    case "Bom":
                        stockFilter = new Filter("Estoque", FilterOperator.GT, 100);
                        break;
                    case "Alerta":
                        stockFilter = new Filter("Estoque", FilterOperator.BT, 50, 100);
                        break;
                    case "Crítico":
                        stockFilter = new Filter("Estoque", FilterOperator.LE, 49);
                        break;
                }
            
                if (stockFilter) {
                    this.aFilters.push(stockFilter);
                }
            }
        }

    });
});
