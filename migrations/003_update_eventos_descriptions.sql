-- Update: Corregir descripciones y detalles de eventos
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

UPDATE eventos SET 
  descripcion = 'Celebra este importante logro académico con una fiesta memorable. Incluye animación profesional, música en vivo, servicios de catering y un ambiente festivo perfecto para compartir con compañeros, profesores y familia.'
WHERE id_evento = 1 AND titulo = 'Fiesta de Graduación';

UPDATE eventos SET 
  descripcion = 'Una noche mágica y elegante para marcar un momento especial. Incluye decoración temática personalizada, vals tradicional, animación de calidad y servicio de banquete para crear recuerdos inolvidables.'
WHERE id_evento = 2 AND titulo = 'Fiesta de 15 Años';

UPDATE eventos SET 
  descripcion = 'Fortalece el trabajo en equipo y celebra los logros anuales con estilo. Incluye presentaciones audiovisuales profesionales, cena formal, espacios de networking y entretenimiento para toda la empresa.'
WHERE id_evento = 3 AND titulo = 'Fiesta de Empresa';

UPDATE eventos SET 
  descripcion = 'El día de tu vida merece ser perfecto. Nos encargamos de la decoración romántica, servicios de banquete, animación profesional, fotografia y todos los detalles para que vivas un momento inolvidable con tus seres queridos.'
WHERE id_evento = 4 AND titulo = 'Boda';
