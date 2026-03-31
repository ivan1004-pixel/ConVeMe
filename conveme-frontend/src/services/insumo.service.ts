import { convemeApi } from '../api/convemeApi';

// 1. OBTENER TODOS LOS INSUMOS (MATERIA PRIMA)
export const getInsumos = async () => {
    const query = `
    query {
        insumos {
            id_insumo
            nombre
            unidad_medida
            stock_actual
            stock_minimo_alerta
        }
    }
    `;
    const { data } = await convemeApi.post('', { query });

    if (data.errors) {
        throw new Error(data.errors[0].message);
    }

    return data.data.insumos;
};
