import { AxiosError, AxiosResponse } from "axios";
import defaultUser from "../utils/default-user";
import { AxiosClient } from "./axiosClient";

export async function signIn(email: string, password: string) {
  try {
    // Send request
    console.log(email, password);

    const {
      data: { token, usuarioId },
    } = await AxiosClient.getInstance().post("/autorizacao/login", {
      email,
      password,
    });

    //Add token to local storage
    localStorage.setItem("token", JSON.stringify(token));
    localStorage.setItem("usuarioId", JSON.stringify(usuarioId));

    const user = await AxiosClient.getInstance().get(`/usuarios/${usuarioId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      isOk: true,
      data: {
        email: user.data.props.email,
        avatarUrl: user.data.props.avatarUrl || "",
      },
    };
  } catch (error: AxiosError | any) {
    return {
      isOk: false,
      message: error.response.data.message,
    };
  }
}

export async function getUser() {
  try {
    // Send request
    //Get Token from local storage
    const token = JSON.parse(localStorage.getItem("token") || "");
    const usuarioId = JSON.parse(localStorage.getItem("usuarioId") || "");

    const result = await AxiosClient.getInstance().get(`/usuarios/${usuarioId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      isOk: true,
      data: {
        email: result.data.props.email,
        avatarUrl: result.data.props.avatarUrl || "",
      },
    };
  } catch (error: AxiosError | any){
    if(error instanceof AxiosError){
      if(error.response) {
        return {
          isOk: false,
          message: error.response.data.message,
        };
      }
    }
    return {
      isOk: false,
      message: error.message,
    };
  }
}

export async function createAccount(
  nome: string,
  email: string,
  password: string,
  passwordConfirm: string
) {
  try {
    // Send request

    const result = await AxiosClient.getInstance().post("/usuarios/cadastro", {
      nome,
      email,
      password,
      passwordConfirm,
    });

    console.log(result)
    
    return {
      isOk: true,
    };
  } catch (error: AxiosError | any) {
    return {
      isOk: false,
      message: error.response.data.message,
    };
  }
}

export async function changePassword(email: string, recoveryCode?: string) {
  try {
    // Send request
    console.log(email, recoveryCode);

    return {
      isOk: true,
    };
  } catch {
    return {
      isOk: false,
      message: "Failed to change password",
    };
  }
}

export async function resetPassword(email: string) {
  try {
    // Send request
    console.log(email);

    return {
      isOk: true,
    };
  } catch {
    return {
      isOk: false,
      message: "Failed to reset password",
    };
  }
}
