import React, { useCallback, useEffect, useState } from "react";
import "./home.scss";
import Card from "./card/card";
import { AxiosClient } from "../../api/axiosClient";

export default function Home() {
  const [clientes, setClientes] = useState(0);
  const [produtos, setProdutos] = useState(0);


  const fetchData = useCallback(async () => {

    const token = JSON.parse(localStorage.getItem("token") || "");

    const [clientes, produtos] = await Promise.all([
      AxiosClient.getInstance()
        .get("/clientes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => response.data.length),

     AxiosClient.getInstance()
        .get("/produtos", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => response.data.length),
    ]);

    setClientes(clientes);
    setProdutos(produtos);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <React.Fragment>
      <h2 className={"content-block"}>Home</h2>
      <div className={"content-block"}>
        <div className="home-cards">
          <Card
            title="Clientes Cadastrados"
            value={clientes}
            buttonText="Cadastrar Cliente"
            icon="dx-icon-card"
            page="/clientes"
          />
          <Card
            title="Produtos Cadastrados"
            value={produtos}
            buttonText="Cadastrar Produto"
            icon="dx-icon-product"
            page="/produtos"
          />
        </div>
      </div>
    </React.Fragment>
  );
}
