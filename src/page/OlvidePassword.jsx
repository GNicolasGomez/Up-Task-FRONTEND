import { useState } from "react";
import { Link } from "react-router-dom";
import Alerta from "../components/Alerta";

import clienteAxios from "../config/clienteAxios";

const OlvidePassword = () => {
  const [email, setEmail] = useState("");
  const [alerta, setAlerta] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email === "" || email.length < 6) {
      setAlerta({
        msg: "El Email es Obligatorio",
        error: true,
      });
      return;
    }

    try {
      const { data } = await clienteAxios.post(
        `/usuarios/olvide-password`,
        {
          email,
        }
      );

      setAlerta({
        msg: data.msg,
        error:false
      })
      
    } catch (error) {
      setAlerta({
        msg:error.response.data.msg,
        error:true
      });
      setTimeout(()=>{
        setAlerta({});
      },4000)
    }
  };

  const { msg } = alerta;

  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize">
        Recupera tu Cuenta y no pierdas tus{" "}
        <span className="text-slate-700">Proyectos</span>
      </h1>

      {msg && <Alerta alerta={alerta} />}

      <form
        action=""
        className="my-10 bg-white shadow rounded-md p-10"
        onSubmit={handleSubmit}
      >
        <div className="my-5">
          <label
            htmlFor="email"
            className="uppercase text-gray-600 block text-xl font-bold"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email de Registro"
            className="w-full mt-3 p-3 border rounded-xl bg-red-50"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <input
          type="submit"
          value="Enviar instrucciones"
          className="bg-sky-700 mb-5 w-full py-3 text-white uppercase font-bold rounded-md hover:cursor-pointer hover:bg-sky-800 transition-colors"
        />
      </form>

      <nav className="lg:flex lg:justify-between">
        <Link
          className="block text-center my-5 text-slate-500 uppercase text-sm"
          to="/"
        >
          ¿Tienes una cuenta? Inicia Sesión
        </Link>
        <Link
          className="block text-center my-5 text-slate-500 uppercase text-sm"
          to="/registrar"
        >
          ¿No tienes cuenta? Crea una
        </Link>
      </nav>
    </>
  );
};

export default OlvidePassword;
