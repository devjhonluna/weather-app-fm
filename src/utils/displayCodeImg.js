/**
 * Crea un componente de datos de Alpine.js para gestionar la visualización de imágenes basadas en un código.
 * @param {{ imageMap: Record<number, string> }} props - Propiedades pasadas al inicializar el componente.
 * @param {Record<number, string>} props.imageMap - Un objeto que mapea un código numérico a la URL de una imagen.
 * @returns {{ imageMap: Record<number, string>, getImageCode: (function(number): string) }}
 */
export default (props) => ({
  imageMap: props.imageMap,
  /**
   * Obtiene la URL de la imagen para un código dado.
   * Si el código no se encuentra, devuelve la imagen para el código '0' como valor por defecto.
   * @param {number} code - El código para buscar en el mapa de imágenes.
   * @returns {string} La URL de la imagen correspondiente.
   */
  getImageCode(code) {
    return this.imageMap[code] || this.imageMap[0];
  },
});