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
} from "devextreme-react/data-grid";
// import { Form } from "devextreme-react";
import {
  ButtonItem,
  EmptyItem,
  GroupItem,
  SimpleItem,
} from "devextreme-react/form";

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

  const [materiais, setMateriais] = useState([]);
  const [isPopupMateriaisVisible, setPopupMateriaisVisibility] = useState(true);

  const togglePopup = () => {
    setPopupMateriaisVisibility(!isPopupMateriaisVisible);
  };

  const token = JSON.parse(localStorage.getItem("token") || "");

  const fetchMateriais = useCallback(async () => {
    try {
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

  useEffect(() => {
    fetchMateriais();
  }, []);

  // React.useEffect(() => {
  //   async function fetchData() {
  //     await axios
  //       .get(`${baseUrl}/materiais`, {
  //         headers: {
  //           authorization: `Bearer ${JSON.parse(
  //             localStorage.getItem("token") || ""
  //           )}`,
  //         },
  //       })
  //       .then(({ data }) => {
  //         console.log(data);
  //         setMateriais(data);
  //       })
  //       .catch((err) => {
  //         if (err) {
  //           const data = err.response.data.message;
  //           if (data.length > 1) {
  //             throw new Error(data.toUpperCase());
  //           }
  //           throw new Error(data.toUpperCase());
  //         }
  //       });
  //   }
  //   fetchData();
  // }, []);

  return (
    <React.Fragment>
      <h2 className="content-block">Produtos</h2>
      <DataGrid
        className="dx-card wide-card"
        keyExpr="_id.value"
        dataSource={dataSource}
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
              <ButtonItem
                colSpan={2}
                horizontalAlignment="right"
                buttonOptions={{
                  text: "Adcionar Materiais",
                  type: "default",
                  onClick: togglePopup,
                }}
              />
              <SimpleItem dataField="props.materiais.id" />
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
        <Column dataField="props.codigo" caption="Código" />
        <Column dataField="props.descricao" caption="Descrição" />

        <Column
          dataField="props.valorVenda"
          dataType="number"
          format={formatMonetary}
        />
        <Column
          dataField="props.valorCusto"
          dataType="number"
          format={formatMonetary}
        />
        <Column dataField="props.prazoProducao" />
        <Column dataField="props.materiais.id" visible={false}>
          <FormItem
            editorType="dxDataGrid"
            colSpan={2}
            editorOptions={{
              width: "100%",
              dataSource: materiais,
              columns: ["material.id", "material.titulo", "material.descricao"],
              // valueExpr: "material.id",
              // displayExpr: "material.titulo",
              // placeholder: "Selecione os materiais",
            }}
          />
        </Column>
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
    return axios
      .post(`${baseUrl}/Produtos`, props)
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
