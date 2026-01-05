# Instrucciones de Despliegue en Render

## Estado Actual

El código del backend ha sido actualizado y enviado a GitHub (commit `5fcd070`). Sin embargo, el backend en Render sigue devolviendo error 500 en todos los endpoints de autenticación.

## Problema Identificado

Tienes **DOS servicios diferentes en Render** con configuraciones distintas:

### Servicio 1 (Probablemente el correcto)
- `NODE_ENV=development`
- `PORT=4000`
- `DATABASE_URL`: ✓ Configurado
- `JWT_SECRET`: ✓ Configurado
- `REFRESH_TOKEN_SECRET`: ✓ Configurado
- ⚠️ Falta `MAILERSEND_API_KEY` y `MAILERSEND_SENDER_EMAIL`

### Servicio 2 "mail2"
- `NODE_ENV=production`
- `PORT=3000`
- `FRONTEND_URL`: Hardcodeada a URL de preview de Vercel (incorrecta)
- Tiene configuración de MailerSend
- JWT y REFRESH secrets diferentes

## Acciones Requeridas

### 1. Verificar cuál servicio está activo

Ve al dashboard de Render (https://dashboard.render.com) y:

1. Identifica cuál de los dos servicios responde en `https://backend2-7u6r.onrender.com`
2. Verifica que el servicio esté conectado al repositorio `https://github.com/sebbass28/backend2.git`
3. Verifica que esté configurado para desplegar desde la rama `main`

### 2. Forzar un nuevo despliegue

**Opción A: Desde el Dashboard de Render**
1. Ve a tu servicio activo
2. Click en "Manual Deploy" → "Deploy latest commit"
3. Espera a que el despliegue termine (5-10 minutos)

**Opción B: Habilitar Auto-Deploy**
1. Ve a Settings del servicio
2. En "Build & Deploy" verifica que "Auto-Deploy" esté en "Yes"
3. Si estaba deshabilitado, actívalo y guarda

### 3. Revisar los logs

Una vez que el despliegue termine:

1. Ve a "Logs" en el dashboard de Render
2. Busca los nuevos logs que empiezan con `[LOGIN]` o `[REGISTER]`
3. Si ves un error 500, los logs mostrarán exactamente qué está fallando:
   - `[LOGIN ERROR] Message: ...` mostrará el mensaje de error
   - `[LOGIN ERROR] Stack: ...` mostrará dónde ocurrió el error

### 4. Completar variables de entorno (Servicio 1)

Si estás usando el Servicio 1, necesitas agregar las variables de MailerSend para que el endpoint de "forgot-password" funcione:

```
MAILERSEND_API_KEY=mlsn.your_api_key_here
MAILERSEND_SENDER_EMAIL=your_email@yourdomain.com
MAILERSEND_SENDER_NAME=FinanceFlow
FRONTEND_URL=https://tu-dominio-production.vercel.app
```

### 5. Verificar la base de datos

Si los logs muestran errores de base de datos, verifica:

1. Que la variable `DATABASE_URL` esté correcta
2. Que las tablas `users` y `refresh_tokens` existan en tu base de datos Supabase
3. Conecta a tu base de datos y ejecuta:

```sql
-- Verificar que las tablas existen
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';

-- Ver estructura de la tabla users
\d users

-- Ver estructura de la tabla refresh_tokens
\d refresh_tokens
```

## Cómo Verificar que Funciona

Una vez desplegado, prueba los endpoints:

```bash
# Health check
curl https://backend2-7u6r.onrender.com/health

# Debería devolver:
# {"ok":true,"env":"development"}  (o "production")

# Test login (con credenciales reales de tu BD)
curl -X POST https://backend2-7u6r.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"tu@email.com","password":"tupassword"}'

# Si funciona, devolverá:
# {"user":{...},"token":"...","refreshToken":"..."}

# Si falla, busca en los logs de Render las líneas que empiezan con [LOGIN ERROR]
```

## Próximos Pasos

1. **Primero**: Fuerza el despliegue manual en Render
2. **Segundo**: Revisa los logs para ver si hay errores específicos
3. **Tercero**: Compárteme los logs si sigues viendo errores
4. **Cuarto**: Una vez que el backend funcione, actualiza `FRONTEND_URL` a tu URL de producción de Vercel (no a un preview)

## Notas Importantes

- El código ya está en GitHub con todos los fixes de CORS y logging detallado
- El problema actual es que Render no está desplegando el código nuevo
- Los logs detallados nos dirán exactamente qué está fallando
- NO uses el preview URL de Vercel como `FRONTEND_URL`, usa tu URL de producción final
