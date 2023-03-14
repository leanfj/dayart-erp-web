import React, { useCallback, useEffect } from "react";

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
  const [unidadeMedidas, setUnidadeMedidas] = React.useState([]);
  const [unidadeMedida, setUnidadeMedida] = React.useState("");
  
  const formatMonetary = useCallback((value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      useGrouping: true,
      minimumSignificantDigits: 3,
      minimumFractionDigits: 2,
    }).format(value);
  }, []);

  const fetchUnidadeMedida = useCallback(async () => {
    try {
      const token = JSON.parse(localStorage.getItem("token") || "");
      const { data } = await axios.get(`${baseUrl}/unidadeMedidas`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUnidadeMedidas(data);
    } catch (error: AxiosError | any) {
      if(error instanceof AxiosError){
        if(error.response) {
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
    fetchUnidadeMedida()
  }, [fetchUnidadeMedida]);

  const onValueChanged = useCallback((e: any) => {
    setUnidadeMedida(e.value);
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
        <Column
          dataField={"props.codigo"}
          width={"auto"}
          caption={"Código"}
          allowEditing={false}
        />
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
          dataField={"props.valorUnitario"}
          width={"auto"}
          caption={"Valor Unitário"}
          dataType={"number"}
          format={formatMonetary}
        />
        <Column
          dataField={"props.quantidade"}
          width={"auto"}
          caption={"Quantidade"}
          dataType={"number"}
        />
        <Column
          caption={"Unidade Medida"}
          dataField={"props.unidadeMedida.nomenclatura"}
          visible={true}
        >
          <FormItem
            editorType={"dxSelectBox"}
            editorOptions={{
              items: unidadeMedidas,
              valueExpr: "_id.value",
              displayExpr: "props.nomenclatura",
              searchEnabled:  true,
              searchMode: "contains", 
              placeholder: "Selecione a unidade de medida",
              value: unidadeMedida,
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
      .get(`${baseUrl}/materiais`, {
        headers: {
          authorization: `Bearer ${JSON.parse(
            localStorage.getItem("token") || ""
          )}`,
        },
      })
      .then((data) => {
        console.log(data)
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

  insert: async ({props}) => {
    console.log(props)
    const input = {
      titulo: props.titulo,
      codigo: props.codigo,
      descricao: props.descricao,
      valor: props.valor,
      valorUnitario: props.valorUnitario,
      quantidade: props.quantidade,
      unidadeMedidaId: props.unidadeMedida.nomenclatura,
    }
    return axios
      .post(`${baseUrl}/materiais`, input, {
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
