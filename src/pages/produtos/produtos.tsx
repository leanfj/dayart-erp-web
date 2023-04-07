import React from "react";

import CustomStore from "devextreme/data/custom_store";
import DataSource from "devextreme/data/data_source";

import axios from "axios";

import DataGrid, {
  Column,
  Pager,
  Paging,
  FilterRow,
  Editing,
  ColumnChooser,
  SearchPanel,
  Popup,
  Form,
  MasterDetail,
} from "devextreme-react/data-grid";
import { GroupItem, SimpleItem } from "devextreme-react/form";
import MateriaisProduto from "./materiaisProdutos";
import formatMonetary from "../../utils/formatMonetary";

export default function Produtos() {

  return (
    <React.Fragment>
      <h2 className="content-block">Produtos</h2>
      <DataGrid
        className="dx-card wide-card"
        keyExpr="_id.value"
        dataSource={dataSourceProdutos}
        showBorders={false}
        focusedRowEnabled={true}
        defaultFocusedRowIndex={0}
        columnAutoWidth={true}
        columnHidingEnabled={true}
        allowColumnResizing={true}
        allowColumnReordering={true}
        width="100%"
      >
        <Paging defaultPageSize={10} />
        <Pager showPageSizeSelector={true} showInfo={true} />
        <Editing
          mode="popup"
          allowUpdating={true}
          allowDeleting={true}
          allowAdding={true}
          confirmDelete={true}
          useIcons={true}
        >
          <Popup showTitle={true} title="Cadastro de Produto" />
          <Form>
            <GroupItem colCount={2} colSpan={2}>
              <SimpleItem dataField="props.titulo" />
              <SimpleItem dataField="props.descricao" />
              <SimpleItem dataField="props.codigo" />
              <SimpleItem dataField="props.valorVenda" />
              <SimpleItem dataField="props.valorCusto" />
              <SimpleItem dataField="props.prazoProducao" />
            </GroupItem>
          </Form>
        </Editing>
        <FilterRow visible={true} />

        <ColumnChooser enabled={true} mode="select" />

        <SearchPanel visible={true} />

        <Column
          dataField="_id.value"
          visible={false}
          allowEditing={false}
          formItem={{ visible: false }}
        />
        <Column dataField="props.titulo" caption="Título" />
        <Column
          dataField="props.codigo"
          caption="Código"
          allowEditing={false}
        />
        <Column dataField="props.descricao" caption="Descrição" />

        <Column
          dataField="props.valorVenda"
          caption="Valor de Venda"
          dataType="number"
          format={{
            formatter: (value: number) => formatMonetary(value),
          }}
        />
        <Column
          dataField="props.valorCusto"
          caption="Valor de Custo"
          dataType="number"
          format={{
            formatter: (value: number) => formatMonetary(value),
          }}
        />
        <Column dataField="props.prazoProducao" caption="Prazo Produção" />
        <MasterDetail 
          enabled={true}
          component={MateriaisProduto}
        />
      </DataGrid>
    </React.Fragment>
  );
}

const baseUrl = process.env.REACT_APP_API_URL;

const storeProdutos = new CustomStore({
  key: "_id.value",
  load: async (loadOptions) => {
    return await axios
      .get(`${baseUrl}/produtos`, {
        headers: {
          authorization: `Bearer ${JSON.parse(
            localStorage.getItem("token") || ""
          )}`,
        },
      })
      .then(({ data }) => {
        return data;
      })
      .catch((err) => {
        if (err) {
          const data = err.response.data.message;
          if (data.length > 1) {
            throw new Error(data.toUpperCase());
          }
          throw new Error(data.toUpperCase());
        }
      });
  },

  insert: async ({ props }) => {
    return axios
      .post(`${baseUrl}/produtos`, props, {
        headers: {
          authorization: `Bearer ${JSON.parse(
            localStorage.getItem("token") || ""
          )}`,
        },
      })
      .then(({ data }) => data)
      .catch((err) => {
        if (err) {
          const data = err.response.data.message;
          if (data.length > 1) {
            throw new Error(data.toUpperCase());
          }
          throw new Error(data.toUpperCase());
        }
      });
  },
  update: async (key, { props }) => {
    return await axios
      .patch(`${baseUrl}/produtos/${key}`, props, {
        headers: {
          authorization: `Bearer ${JSON.parse(
            localStorage.getItem("token") || ""
          )}`,
        },
      })
      .catch((err) => {
        if (err) {
          const data = err.response.data.message;
          if (data.length > 1) {
            throw new Error(data.toUpperCase());
          }
          throw new Error(data.toUpperCase());
        }
      });
  },
  remove: async (key) => {
    return await axios.delete(`${baseUrl}/produtos/${key}`, {
      headers: {
        authorization: `Bearer ${JSON.parse(
          localStorage.getItem("token") || ""
        )}`,
      },
    });
  },
});

const dataSourceProdutos = new DataSource(storeProdutos);