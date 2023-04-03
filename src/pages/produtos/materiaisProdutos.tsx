import React, { useCallback, useEffect, useState } from "react";

import CustomStore from "devextreme/data/custom_store";
import axios, { AxiosError } from "axios";

import DataGrid, {
  Column,
  Editing,
  Popup,
  Form,
} from "devextreme-react/data-grid";
import { SimpleItem } from "devextreme-react/form";

export default function MateriaisProduto(props: any) {
  const [materiais, setMateriais] = useState([]);
  const [unidadeMedidas, setUnidadeMedidas] = useState([]);
  const [materiaisProduto, setMeteriaisProdutos] = useState([]);

  const fecthProduto = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `${baseUrl}/produtos/${props.data.key}`,
        {
          headers: {
            authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token") || ""
            )}`,
          },
        }
      );
      console.log(data)
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
        keyExpr=""
        dataSource={storeMateriaisProdutos}
        showBorders={true}
        focusedRowEnabled={false}
        defaultFocusedRowIndex={0}
        columnAutoWidth={true}
        columnHidingEnabled={true}
        allowColumnResizing={true}
        allowColumnReordering={true}
        width="100%"
        onSaving={async (e) => {
          const produtoId = props.data.key;
          const { material, unidadeMedida } = e.changes[0].data.props;

          return await axios
            .post(
              `${baseUrl}/produtos/${produtoId}`,
              { material, unidadeMedida },
              {
                headers: {
                  authorization: `Bearer ${JSON.parse(
                    localStorage.getItem("token") || ""
                  )}`,
                },
              }
            )
            .catch((err) => {
              if (err) {
                const data = err.response.data.message;
                if (data.length > 1) {
                  throw new Error(data.toUpperCase());
                }
                throw new Error(data.toUpperCase());
              }
            });
        }}
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
              dataField="props.material.id"
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
              dataField={"props.unidadeMedida.id"}
              editorType="dxSelectBox"
              editorOptions={{
                dataSource: unidadeMedidas,
                valueExpr: "unidadeMedida.id",
                displayExpr: "unidadeMedida.nomenclatura",
                customItemCreateEvent: "change",
                placeholder: "Selecione a unidade de medida",
              }}
            />
            <SimpleItem dataField="props.material.quantidade" colSpan={2} />
          </Form>
        </Editing>
        <Column
          dataField="props.material.id"
          caption="Lista de Materiais"
          showInColumnChooser={false}
          width="auto"
          visible={false}
        ></Column>
        <Column
          dataField="props.unidadeMedida.id"
          caption="Unidade de Medida"
          showInColumnChooser={false}
          width="auto"
          visible={false}
        ></Column>
        <Column caption={"Material"} dataField="material.titulo" width="auto" />
        <Column
          caption={"Unidade de Medida"}
          dataField="unidadeMedida.nomemclatura"
          width="auto"
        />
        <Column
          dataField="props.material.quantidade"
          caption="Quantidade Material do Produto"
          dataType="number"
          width="auto"
        />
      </DataGrid>
    </React.Fragment>
  );
}

const baseUrl = process.env.REACT_APP_API_URL;

const storeMateriaisProdutos = new CustomStore({
  key: "_id.value",
  load: async (loadOptions) => {
    // return await axios
    // .get(`${baseUrl}/produtos/${produto.id}`)
    // .catch((err) => {
    //   if (err) {
    //     const data = err.response.data.message;
    //     if (data.length > 1) {
    //       throw new Error(data.toUpperCase());
    //     }
    //     throw new Error(data.toUpperCase());
    //   }
    // });
  },
  insert: async ({ props }) => {
    // const {material, unidadeMedida, produto} = props;
    // // {
    // //     "material": {
    // //         "id": "efba212b-caa6-48ce-b933-07c12c0ecdc5",
    // //         "quantidade": 1
    // //     },
    // //     "unidadeMedida": {
    // //         "id": "f8b1c5ad-bac2-431d-b72b-d9dcc6f15482"
    // //     },
    // //     "produto": {
    // //         "id": "72cb19b2-07a0-4fc2-8d6c-18a8f757328c"
    // //     }
    // // }
    // return await axios
    // .post(`${baseUrl}/produtos/${produto.id}`, {material, unidadeMedida}, {
    //   headers: {
    //     authorization: `Bearer ${JSON.parse(
    //       localStorage.getItem("token") || ""
    //     )}`,
    //   },
    // })
    // .catch((err) => {
    //   if (err) {
    //     const data = err.response.data.message;
    //     if (data.length > 1) {
    //       throw new Error(data.toUpperCase());
    //     }
    //     throw new Error(data.toUpperCase());
    //   }
    // });
  },
  update: async (key, { props }) => {},
  remove: async (key) => {},
});
