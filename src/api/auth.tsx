import defaultUser from "../utils/default-user";
import { AxiosClient } from "./axiosClient";

export async function signIn(email: string, password: string) {
  try {
    // Send request
    console.log(email, password);
    
    const {data: {token, usuarioId}} = await AxiosClient.getInstance().post("/autorizacao/login", {
      email,
      password,
    });

    //Add token to local storage
    localStorage.setItem("token", JSON.stringify(token));

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
  } catch {
    return {
      isOk: false,
      message: "Authentication failed",
    };
  }
}

export async function getUser() {
  try {
    // Send request
    //Get Token from local storage
    const token = JSON.parse(localStorage.getItem("token") || "");

    const result = await AxiosClient.getInstance().get("/autorizacao/usuario", {
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
  } catch {
    return {
      isOk: false,
    };
  }
}

export async function createAccount(email: string, password: string) {
  try {
    // Send request
    console.log(email, password);

    return {
      isOk: true,
    };
  } catch {
    return {
      isOk: false,
      message: "Failed to create account",
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
