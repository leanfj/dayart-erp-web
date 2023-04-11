import React, { useCallback, useEffect, useState } from "react";

import { createStore } from "devextreme-aspnet-data-nojquery";
import axios, { AxiosError } from "axios";
import './materiaisProdutos.scss'
import DataGrid, {
  Column,
  Editing,
  Popup,
  Form,
} from "devextreme-react/data-grid";
import { SimpleItem } from "devextreme-react/form";
import formatMonetary from "../../utils/formatMonetary";

const baseUrl = process.env.REACT_APP_API_URL;

export default function MateriaisProduto(props: any) {
  const [materiais, setMateriais] = useState([]);
  const [unidadeMedidas, setUnidadeMedidas] = useState([]);
  const [materiaisProduto, setMateriaisProdutos] = useState();

  const fecthProduto = useCallback(async () => {
    const storeMateriaisProdutos: any = createStore({
      key: "id",
      loadUrl: `${baseUrl}/produtos/${props.data.key}`,
      insertUrl: `${baseUrl}/produtos/${props.data.key}`,
      insertMethod: "POST",

      onBeforeSend: (method, ajaxOptions) => {
        ajaxOptions.headers = {
          Authorization: `Bearer ${JSON.parse(
            localStorage.getItem("token") || ""
          )}`,
        };
      },
    });

    setMateriaisProdutos(storeMateriaisProdutos);
  }, [materiaisProduto]);

  const fetchMateriais = useCallback(async () => {
    try {
      const token = JSON.parse(localStorage.getItem("token") || "");
      const { data } = await axios.get(`${baseUrl}/materiais`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMateriais(
        data.map((item: any) => {
          return {
            material: {
              id: item._id.value,
              titulo: item.props.titulo,
            },
          };
        })
      );
    } catch (error: AxiosError | any) {
      if (error instanceof AxiosError) {
        if (error.response) {
          return {
            isOk: false,
            message: error.response.data.message,
          };
        }
      }
      return {
        message: error.message,
      };
    }
  }, []);

  const fetchUnidadeMedida = useCallback(async () => {
    try {
      const token = JSON.parse(localStorage.getItem("token") || "");
      const { data } = await axios.get(`${baseUrl}/unidadeMedidas`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUnidadeMedidas(
        data.map((item: any) => {
          return {
            unidadeMedida: {
              id: item._id.value,
              nomenclatura: item.props.nomenclatura,
              nome: item.props.nome,
              categoria: item.props.categoria,
            },
          };
        })
      );
    } catch (error: AxiosError | any) {
      if (error instanceof AxiosError) {
        if (error.response) {
          return {
            isOk: false,
            message: error.response.data.message,
          };
        }
      }
      return {
        message: error.message,
      };
    }
  }, []);

  useEffect(() => {
    fetchMateriais();
    fetchUnidadeMedida();
    fecthProduto();
  }, []);

  return (
    <React.Fragment>
      <DataGrid
        className="dx-card wide-card"
        keyExpr="_id.value"
        dataSource={materiaisProduto}
        showBorders={true}
        focusedRowEnabled={false}
        defaultFocusedRowIndex={0}
        columnAutoWidth={true}
        columnHidingEnabled={true}
        allowColumnResizing={true}
        allowColumnReordering={true}
        width="100%"
        // onSaving={async (e) => {
        //   if (e.changes[0].type === "insert") {
        //     const produtoId = props.data.key;
        //     const { material, quantidade, unidadeMedida }: any =
        //       e.changes[0].data;
        //     /* fecthProduto(); */
        //   } else if (e.changes[0].type === "update") {
        //   } else if (e.changes[0].type === "remove") {
        //   }
        // }}
      >
        <Editing
          mode="popup"
          allowUpdating={true}
          allowDeleting={true}
          allowAdding={true}
          confirmDelete={true}
          useIcons={true}
        >
          <Popup
            showTitle={true}
            title="Cadastro de Materiais"
            maxWidth={600}
            maxHeight={400}
          />
          <Form>
            <SimpleItem
              dataField="material.id"
              colSpan={2}
              editorType="dxSelectBox"
              editorOptions={{
                dataSource: materiais,
                customItemCreateEvent: "change",
                valueExpr: "material.id",
                displayExpr: "material.titulo",
                searchMode: "contains",
                searchExpr: ["material.titulo"],
                minSearchLength: 2,
                showDataBeforeSearch: true,
                searchEnabled: true,
                placeholder: "Selecione um material",
              }}
            />
            <SimpleItem
              dataField={"unidadeMedida.id"}
              editorType="dxSelectBox"
              editorOptions={{
                dataSource: unidadeMedidas,
                valueExpr: "unidadeMedida.id",
                displayExpr: "unidadeMedida.nomenclatura",
                customItemCreateEvent: "change",
                placeholder: "Selecione a unidade de medida",
              }}
            />
            <SimpleItem dataField="quantidade" colSpan={2} />
            <SimpleItem
              dataField="preco"
              colSpan={2}
              editorOptions={{
                format: {
                  type: "currency",
                  precision: 2,
                  currency: "BRL",
                  formatter: (value: number) => formatMonetary(value),
                }
              }}
            />
          </Form>
        </Editing>
        <Column
          dataField="material.id"
          caption="Lista de Materiais"
          showInColumnChooser={false}
          width="auto"
          visible={false}
        ></Column>
        <Column caption={"Material"} dataField="material.titulo" width="auto" />
        <Column
          dataField="unidadeMedida.id"
          caption="Unidade de Medida"
          showInColumnChooser={false}
          width="auto"
          visible={false}
        ></Column>
        <Column
          caption={"Unidade de Medida"}
          dataField="unidadeMedida.nomenclatura"
          width="auto"
        />
        <Column
          dataField="quantidade"
          caption="Quantidade Material do Produto"
          dataType="number"
          width="auto"
        />
        <Column
          dataField="preco"
          caption="Preco Material do Produto"
          dataType="number"
          allowEditing={false}
          format={{
            formatter: (value: number) => formatMonetary(value),
          }}
          width="auto"
        />
      </DataGrid>
    </React.Fragment>
  );
}
