import { Client } from "@notionhq/client";

// Inicializamos el cliente leyendo la variable de entorno de Railway de forma segura
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

/**
 * 1. Skill para BUSCAR y VER datos en cualquier base de datos de tu Hospitality HQ
 */
export async function consultarBaseDatos({ databaseId, filtroProperty, filtroValor }) {
  try {
    const queryOptions = { database_id: databaseId || process.env.NOTION_DATABASE_ID };

    if (filtroProperty && filtroValor) {
      queryOptions.filter = {
        property: filtroProperty,
        rich_text: {
          contains: filtroValor,
        },
      };
    }

    const response = await notion.databases.query(queryOptions);
    return JSON.stringify(response.results.map(page => ({
      id: page.id,
      propiedades: page.properties
    })), null, 2);
  } catch (error) {
    return `Error al consultar la base de datos: ${error.message}`;
  }
}

/**
 * 2. Skill para MODIFICAR o Actualizar cualquier página/fila existente en Hospitality HQ
 */
export async function modificarElementoNotion({ pageId, propiedadesActualizadas }) {
  try {
    const response = await notion.pages.update({
      page_id: pageId,
      properties: propiedadesActualizadas,
    });
    return `¡Elemento con ID ${pageId} modificado con éxito en Hospitality HQ!`;
  } catch (error) {
    return `Error al modificar el elemento: ${error.message}`;
  }
}

/**
 * 3. Skill para CREAR nuevos registros (Reservas, tareas, gastos, etc.)
 */
export async function crearRegistroNotion({ databaseId, propiedades }) {
  try {
    const response = await notion.databases.create({
      parent: { database_id: databaseId || process.env.NOTION_DATABASE_ID },
      properties: propiedades,
    });
    return `Nuevo registro creado con éxito. ID: ${response.id}`;
  } catch (error) {
    return `Error al crear el registro: ${error.message}`;
  }
}
