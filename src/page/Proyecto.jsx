import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import useProyectos from "../hooks/useProyectos";
import useAdmin from "../hooks/useAdmin";
import MyModalFormularioTarea from "../components/ModalFormularioTarea";
import ModalEliminarTarea from "../components/ModalEliminarTarea";
import Tarea from "../components/Tarea";
import Colaborador from "../components/Colaborador";
import ModalEliminarColaborador from "../components/ModalEliminarColaborador";
import io from "socket.io-client";

let socket;

const Proyecto = () => {
  const { id } = useParams();
  const {
    obtenerProyecto,
    proyecto,
    cargando,
    handleModalTarea,
    alerta,
    submitTareasProyectos,
    eliminarTareaProyecto,
    actualizarTareaProyecto,
    cambioEstadoTarea
  } = useProyectos();

  const admin = useAdmin();

  useEffect(() => {
    obtenerProyecto(id);
  }, []);

  useEffect(() => {
    socket = io(import.meta.env.VITE_BACKEND_URL);
    socket.emit("abrir proyecto", id);
  }, []);

  useEffect(() => {
    socket.on("tarea agregada", (tareanueva) => {
      if (tareanueva.proyecto === proyecto._id) {
        submitTareasProyectos(tareanueva);
      }
    });

    socket.on('tarea eliminada' , tareaEliminada => {
      if(tareaEliminada.proyecto === proyecto._id) {
        eliminarTareaProyecto(tareaEliminada)
      }
    });

    socket.on('tarea actualizada' ,  tarea => {
      if(tarea.proyecto._id === proyecto.id){
        actualizarTareaProyecto(tarea);
      }
    });

    socket.on('estado cambiado tarea' , tarea => {
      if(tarea.proyecto._id === proyecto._id) {
        cambioEstadoTarea(tarea);
      }
    })

  });

  const { nombre } = proyecto;

  if (cargando) return "Cargando ...";

  const { msg } = alerta;

  return (
    <>
      <div className="flex justify-between">
        <h1 className="font-black text-4xl">{nombre}</h1>
        {admin && (
          <div className="flex justify-between items-center gap-2 text-gray-400 hover:text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
              />
            </svg>
            <Link
              to={`/proyectos/editar/${id}`}
              className="uppercase font-bold"
            >
              Editar
            </Link>
          </div>
        )}
      </div>

      {admin && (
        <button
          type="button"
          className="text-sm px-5 py-3 w-full md:w-auto rounded-lg uppercase font-bold bg-sky-400 text-white text-center mt-5 flex gap-2 items-center"
          onClick={handleModalTarea}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-7 h-7"
          >
            <path
              fillRule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z"
              clipRule="evenodd"
            />
          </svg>
          Agregar Tarea
        </button>
      )}

      <p className="font-bold text-xl mt-10"> Tareas del Proyecto </p>

      <div className="bg-white shadow mt-10 rounded-lg">
        {proyecto.tareas?.length ? (
          proyecto.tareas?.map((tarea) => (
            <Tarea key={tarea._id} tarea={tarea} />
          ))
        ) : (
          <p className="text-center my-5 p-10 font-bold text-md">
            No hay tareas por el momento en este proyecto
          </p>
        )}
      </div>

      {admin && (
        <>
          <div className="flex itmes-center justify-between mt-10">
            <p className="font-bold text-xl"> Colaboradores </p>
            <Link
              to={`/proyectos/nuevo-colaborador/${proyecto._id}`}
              className="text-gray-400 hover:text-gray-500 uppercase font-bold"
            >
              Añadir
            </Link>
          </div>

          <div className="bg-white shadow mt-10 rounded-lg">
            {proyecto.colaboradores?.length ? (
              proyecto.colaboradores?.map((colaborador) => (
                <Colaborador key={colaborador._id} colaborador={colaborador} />
              ))
            ) : (
              <p className="text-center my-5 p-10 font-bold text-md">
                No hay colaboradores en este proyecto
              </p>
            )}
          </div>
        </>
      )}

      <MyModalFormularioTarea />
      <ModalEliminarTarea />
      <ModalEliminarColaborador />
    </>
  );
};

export default Proyecto;
