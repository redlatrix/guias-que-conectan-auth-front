/**
 * T es el tipo de dato que contiene la propiedad 'object'.
 * El servidor siempre devuelve una array de ese tipo: T[].
 */
export interface IApiResponse<T> {
    entity: T;
    errors?: string[];
    result: boolean;
}  