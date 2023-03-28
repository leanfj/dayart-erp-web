import React, { useCallback, useEffect, useState } from "react";

import CustomStore from "devextreme/data/custom_store";
import DataSource from "devextreme/data/data_source";

import axios, { AxiosError } from "axios";

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
  FormItem,
  MasterDetail,
} from "devextreme-react/data-grid";
import { GroupItem, SimpleItem } from "devextreme-react/form";
import MateriaisProduto from "./materiaisProdutos";

export default function Produtos() {
  const formatMonetary = useCallback((value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      useGrouping: true,
      minimumSignificantDigits: 3,
      minimumFractionDigits: 2,
    }).format(value);
  }, []);

  useEffect(() => {
  }, []);

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
          format={formatMonetary}
        />
        <Column
          dataField="props.valorCusto"
          caption="Valor de Custo"
          dataType="number"
          format={formatMonetary}
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
        console.log(data);
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
    console.log(props);
    return axios
      .post(`${baseUrl}/produtos`, props)
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
    console.log(props);
    return await axios
      .patch(`${baseUrl}/produtos/${key}`, props)
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
    return await axios.delete(`${baseUrl}/produtos/${key}`);
  },
});

const dataSourceProdutos = new DataSource(storeProdutos);