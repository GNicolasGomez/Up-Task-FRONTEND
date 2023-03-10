import useProyectos from "../hooks/useProyectos";

const Colaborador = ({colaborador}) => {

    const {email, nombre } = colaborador;

    const { handleModalEliminarColaborador } = useProyectos();

  return (
    <div className='items-center border-b p-5 flex justify-between'>

        <div className=''>
            <p>{nombre}</p>
            <p className='text-sm text-gray-700'>{email}</p>
        </div>

        <div>
            <button
                type='button'
                className='bg-red-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg '
                onClick={()=> handleModalEliminarColaborador(colaborador)}
            >eliminar</button>

        </div>
    </div>
  )
}

export default Colaborador