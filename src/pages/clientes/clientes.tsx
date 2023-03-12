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
} from "devextreme-react/data-grid";

export default function Clientes() {
  return (
    <React.Fragment>
      <h2 className={"content-block"}>Clientes</h2>

      <DataGrid
        className={"dx-card wide-card"}
        dataSource={dataSource as any}
        showBorders={false}
        focusedRowEnabled={true}
        defaultFocusedRowIndex={0}
        columnAutoWidth={true}
        columnHidingEnabled={true}
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
        />
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
        <Column dataField={"props.nome"} width={"auto"} caption={"Nome"} />
        <Column dataField={"props.email"} width={"auto"} caption={"E-mail"} />
        <Column dataField={"props.genero"} width={"auto"} caption={"Gênero"} />
        <Column
          dataField={"props.telefone"}
          width={"auto"}
          caption={"Telefone"}
        />
        <Column
          dataField={"props.endereco"}
          width={"auto"}
          caption={"Endereço"}
        />
        <Column dataField={"props.cidade"} width={"auto"} caption={"Cidade"} />
        <Column dataField={"props.estado"} width={"auto"} caption={"Estado"} />
        <Column dataField={"props.cep"} width={"auto"} caption={"Cep"} />
        <Column dataField={"props.cpf"} width={"auto"} caption={"CPF"} />
        <Column
          dataField={"props.dataEvento"}
          caption={"Data do Evento"}
          dataType={"date"}
          format={"dd/MM/yyyy"}
        />
      </DataGrid>
    </React.Fragment>
  );
}

const baseUrl = process.env.REACT_APP_API_URL;

const store = new CustomStore({
  key: "_id.value",
  load: async (loadOptions) => {
    return await axios
      .get(`${baseUrl}/clientes`, {
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
      .post(`${baseUrl}/clientes`, props)
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
  update: (key, { props }) => {
    return axios.patch(`${baseUrl}/clientes/${key}`, props).catch((err) => {
      if (err) {
        const data = err.response.data.message;
        if (data.length > 1) {
          throw new Error(data.toUpperCase());
        }
        throw new Error(data.toUpperCase());
      }
    });
  },
  remove: (key) => {
    return axios.delete(`${baseUrl}/clientes/${key}`);
  },
});

const dataSource = new DataSource(store);
