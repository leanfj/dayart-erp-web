import React, { useCallback } from "react";

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

export default function Materiais() {
  const formatMonetary = useCallback((value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      useGrouping: true,
      minimumSignificantDigits: 3,
      minimumFractionDigits: 2,
    }).format(value);
  }, []);

  return (
    <React.Fragment>
      <h2 className={"content-block"}>materiais</h2>

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
          <Popup showTitle={true} title="Cadastre o Material" />
        </Editing>
        <FilterRow visible={true} />

        <ColumnChooser enabled={true} mode={"select"} />

        <SearchPanel visible={true} />

        <Column
          dataField={"_id.value"}
          width={"auto"}
          caption={"Id"}
          visible={false}
          allowEditing={false}
          formItem={{ visible: false }}
        />
        <Column dataField={"props.titulo"} width={"auto"} caption={"Titulo"} />
        <Column dataField={"props.codigo"} width={"auto"} caption={"Código"} />
        <Column
          dataField={"props.descricao"}
          width={"auto"}
          caption={"Descrição"}
        />

        <Column
          dataField={"props.valor"}
          width={"auto"}
          caption={"Valor"}
          dataType={"number"}
          format={formatMonetary}
        />
        <Column
          dataField={"props.unidadeMedida"}
          width={"auto"}
          caption={"Unidade Medida"}
          dataType={"text"}
          format={formatMonetary}
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
      .get(`${baseUrl}/materiais`, {
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
      .post(`${baseUrl}/materiais`, props, {
        headers: {
          authorization: `Bearer ${JSON.parse(
            localStorage.getItem("token") || ""
          )}`,
        },
      })
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
      .patch(`${baseUrl}/materiais/${key}`, props, {
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
    return await axios.delete(`${baseUrl}/materiais/${key}`, {
      headers: {
        authorization: `Bearer ${JSON.parse(
          localStorage.getItem("token") || ""
        )}`,
      },
    });
  },
});

const dataSource = new DataSource(store);
