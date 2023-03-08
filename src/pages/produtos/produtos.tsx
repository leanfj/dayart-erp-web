import React from "react";

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
  FormItem,
} from "devextreme-react/data-grid";

export default function Produtos() {
  return (
    <React.Fragment>
      <h2 className={"content-block"}>Produtos</h2>

      <DataGrid
        className={"dx-card wide-card"}
        dataSource={dataSource as any}
        showBorders={false}
        focusedRowEnabled={true}
        defaultFocusedRowIndex={0}
        columnAutoWidth={true}
        columnHidingEnabled={true}
        allowColumnResizing={true}
        allowColumnReordering={true}
        width={"100%"}
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
          <Popup showTitle={true} title="Cadastre o Produto" />
        </Editing>
        <FilterRow visible={true} />

        <ColumnChooser enabled={true} mode={"select"} />

        <SearchPanel visible={true} />

        <Column
          dataField={"_id.value"}
          width={90}
          caption={"Id"}
          visible={false}
          allowEditing={false}
          formItem={{ visible: false }}
        />
        <Column dataField={"props.titulo"} width={130} caption={"Titulo"} />
        <Column dataField={"props.codigo"} width={130} caption={"Código"} />
        <Column
          dataField={"props.descricao"}
          width={130}
          caption={"Descrição"}
        />

        <Column
          dataField={"props.valorVenda"}
          width={130}
          caption={"Valor Venda"}
          dataType={"number"}
        />
        <Column
          dataField={"props.valorCusto"}
          width={130}
          caption={"Valor Custo"}
          dataType={"number"}
        />
        <Column dataField={"props.materiais"} width={130} caption={"Materiais"}>
          <FormItem
            helpText={"Materiais utilizados no produto separado por ;"}
          />
        </Column>
        <Column
          dataField={"props.prazoProducao"}
          width={130}
          caption={"Prazo Producão"}
        />
        <Column
          dataField={"props.valorElo7"}
          width={130}
          caption={"Valor Elo7"}
          dataType={"number"}
        />
      </DataGrid>
    </React.Fragment>
  );
}

const baseUrl = process.env.REACT_APP_API_URL;

const store = new CustomStore({
  key: "_id.value",
  onRemoved: async (key) => {},
  load: async (loadOptions) => {
    return await axios
      .get(`${baseUrl}/Produtos`, {
        headers: {
          authorization: `Bearer ${JSON.parse(
            localStorage.getItem("token") || ""
          )}`,
        },
      })
      .then((data) => {
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
      .post(`${baseUrl}/Produtos`, props)
      .then((data) => data)
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
      .patch(`${baseUrl}/Produtos/${key}`, props)
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
    return await axios.delete(`${baseUrl}/Produtos/${key}`);
  },
});

const dataSource = new DataSource(store);
