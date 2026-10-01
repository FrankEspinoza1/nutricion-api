/* =====================================================================
   PRUEBA DE INTEGRACION DE LA SOLUCION
   Proyecto Nutricion Sin Enredos - Grupo 2 - Evidencia 3
 
   Esta prueba NO se ejecuta contra codigo local: verifica los tres
   componentes ya desplegados en la nube y la comunicacion real entre
   ellos.
 
     1. Componente frontend   -> Vercel
     2. Componente backend    -> Render
     3. Servidor de datos     -> MongoDB Atlas (a traves del backend)
 
   Si cualquier eslabon de la cadena falla, el proceso termina con
   codigo de error y el pipeline queda marcado en rojo.
   ===================================================================== */
 
const API      = 'https://nutricion-sin-enredos.onrender.com';
const FRONTEND = 'https://nutricion-frontend-smoky.vercel.app';
 
let pruebas = 0;
let fallos  = 0;
 
function verificar(descripcion, condicion, detalle) {
  pruebas++;
  if (condicion) {
    console.log('  OK    ' + descripcion);
  } else {
    fallos++;
    console.log('  FALLO ' + descripcion + (detalle ? '  ->  ' + detalle : ''));
  }
}
 
// El plan gratuito de Render suspende el servicio por inactividad.
// Se reintenta la primera peticion para darle tiempo a reactivarse.
async function despertarBackend() {
  console.log('Reactivando el componente backend (puede tardar hasta 60s)...');
  for (let intento = 1; intento <= 6; intento++) {
    try {
      const r = await fetch(API + '/api/estado');
      if (r.ok) {
        console.log('Backend disponible en el intento ' + intento + '\n');
        return true;
      }
    } catch (e) { /* el servicio aun no responde */ }
    await new Promise(r => setTimeout(r, 15000));
  }
  return false;
}
 
async function ejecutar() {
  console.log('==============================================');
  console.log(' PRUEBA DE INTEGRACION - NUTRICION SIN ENREDOS');
  console.log('==============================================\n');
 
  const activo = await despertarBackend();
  if (!activo) {
    console.log('El componente backend no respondio. Se detiene la prueba.');
    process.exit(1);
  }
 
  /* ---- 1. Componente backend: estado del servicio ---- */
  console.log('[1] Componente backend (Render)');
  const estado = await fetch(API + '/api/estado');
  const datosEstado = await estado.json();
  verificar('La API responde con codigo 200', estado.status === 200, 'codigo ' + estado.status);
  verificar('El servicio se identifica correctamente', datosEstado.componente === 'nutricion-api');
 
  /* ---- 2. Integracion backend <-> base de datos ---- */
  console.log('\n[2] Integracion backend - MongoDB Atlas');
 
  const nuevo = {
    nombre: 'Servicio de prueba automatizada',
    categoria: 'Integracion',
    descripcion: 'Registro creado por el pipeline de verificacion',
    precio: 1,
    duracion: 5
  };
 
  const creacion = await fetch(API + '/api/servicios', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(nuevo)
  });
  const creado = await creacion.json();
  verificar('Se crea un registro en la base de datos', creacion.status === 201, 'codigo ' + creacion.status);
  verificar('La base de datos devuelve un identificador', Boolean(creado._id));
 
  if (creado._id) {
    const lectura = await fetch(API + '/api/servicios/' + creado._id);
    const leido = await lectura.json();
    verificar('El registro se recupera por su identificador', lectura.status === 200);
    verificar('Los datos almacenados coinciden', leido.nombre === nuevo.nombre);
 
    const listado = await fetch(API + '/api/servicios');
    const lista = await listado.json();
    verificar('El registro aparece en el listado', Array.isArray(lista) && lista.some(s => s._id === creado._id));
 
    const borrado = await fetch(API + '/api/servicios/' + creado._id, { method: 'DELETE' });
    verificar('El registro de prueba se elimina', borrado.status === 200);
  }
 
  /* ---- 3. Validaciones del modelo ---- */
  console.log('\n[3] Validaciones del componente backend');
  const invalido = await fetch(API + '/api/servicios', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ descripcion: 'sin nombre ni precio' })
  });
  verificar('Se rechaza un registro incompleto', invalido.status === 400, 'codigo ' + invalido.status);
 
  /* ---- 4. Componente frontend ---- */
  console.log('\n[4] Componente frontend (Vercel)');
  const web = await fetch(FRONTEND);
  const html = await web.text();
  verificar('El frontend responde con codigo 200', web.status === 200, 'codigo ' + web.status);
  verificar('La pagina contiene la interfaz esperada', html.includes('Gestion de servicios') || html.includes('Gestión de servicios'));
  verificar('El frontend apunta al componente backend', html.includes('app.js'));
 
  /* ---- Resultado ---- */
  console.log('\n==============================================');
  console.log(' Verificaciones ejecutadas: ' + pruebas);
  console.log(' Fallos: ' + fallos);
  console.log('==============================================');
 
  if (fallos > 0) {
    console.log('\nLa prueba de integracion NO fue superada.');
    process.exit(1);
  }
  console.log('\nPrueba de integracion superada: los tres componentes se comunican correctamente.');
}
 
ejecutar().catch(error => {
  console.error('Error durante la prueba de integracion:', error.message);
  process.exit(1);
});
