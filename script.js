// ===================================
// CREAR PARTÍCULAS DINÁMICAMENTE
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    const particlesContainer = document.querySelector('.particles');
    
    if (particlesContainer) {
        const particleCount = window.innerWidth < 768 ? 30 : 50;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 20 + 's';
            particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
            
            particlesContainer.appendChild(particle);
        }
    }
});

// ===================================
// SMOOTH SCROLL PARA NAVEGACIÓN
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// ===================================
// CALCULADORA DE PRECIOS (VERSIÓN FINAL Y FUNCIONAL)
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    // Seleccionamos los elementos del formulario y el resultado
    const calcButton = document.getElementById('calc-button');
    const calcResult = document.getElementById('calc-result');
    const resultPrice = document.getElementById('result-price');
    
    // Si todos los elementos existen, procedemos
    if (calcButton && calcResult && resultPrice) {
        
        calcButton.addEventListener('click', function() {
            // Obtenemos los 4 selectores del formulario
            const styleSelect = document.getElementById('calc-style');
            const sizeSelect = document.getElementById('calc-size');
            const colorSelect = document.getElementById('calc-color');
            const detailSelect = document.getElementById('calc-detail');

            // Convertimos los valores de los selectores a números flotantes
            // El 'value' del estilo es el precio base en B/N para el tamaño más pequeño
            const basePrice = parseFloat(styleSelect.value); 
            // Los demás son multiplicadores
            const sizeMultiplier = parseFloat(sizeSelect.value);
            const colorMultiplier = parseFloat(colorSelect.value);
            const detailMultiplier = parseFloat(detailSelect.value);
            
            // Fórmula de cálculo: PrecioBase * MultiplicadorTamaño * MultiplicadorColor * MultiplicadorDetalle
            const total = basePrice * sizeMultiplier * colorMultiplier * detailMultiplier;
            
            // Redondeamos el resultado final para evitar decimales extraños
            const finalPrice = Math.round(total);
            
            // Mostramos el resultado formateado como moneda colombiana
            if (finalPrice > 0) {
                // .toLocaleString('es-CO') agrega los puntos de miles (ej: 120.000)
                resultPrice.textContent = `$${finalPrice.toLocaleString('es-CO')}`;
            } else {
                resultPrice.textContent = '$0'; // O un mensaje de error si prefieres
            }
            
            // Mostramos el contenedor del resultado con una animación
            calcResult.classList.add('show');
            
            // Hacemos scroll suave para que el usuario vea el resultado
            calcResult.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }
});

// ===================================
// INICIALIZAR EMAILJS
// ===================================
// IMPORTANTE: Reemplaza estos valores con los tuyos de EmailJS
// Sigue las instrucciones al final de este archivo para configurar tu cuenta
(function() {
    emailjs.init({
        publicKey: "TU_PUBLIC_KEY_AQUI", // Reemplazar con tu Public Key
    });
})();

// ===================================
// MANEJO DEL FORMULARIO DE CONTACTO - EMAIL + WHATSAPP
// ===================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const telefono = document.getElementById('telefono').value;
        const servicio = document.getElementById('servicio').value;
        const mensaje = document.getElementById('mensaje').value;

        // Validaciones
        if (nombre.trim() === '' || email.trim() === '' || mensaje.trim() === '') {
            alert('Por favor completa todos los campos obligatorios.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Por favor ingresa un email válido.');
            return;
        }

        // Deshabilitar botón mientras se envía
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = '<span>Enviando...</span>';

        // Preparar datos para el email
        const templateParams = {
            from_name: nombre,
            from_email: email,
            phone: telefono || 'No proporcionado',
            service: servicio || 'No especificado',
            message: mensaje,
            to_email: 'tu_email@ejemplo.com' // Reemplazar con tu email
        };

        // Enviar email automáticamente usando EmailJS
        emailjs.send('TU_SERVICE_ID', 'TU_TEMPLATE_ID', templateParams)
            .then(function(response) {
                console.log('Email enviado exitosamente!', response.status, response.text);

                // Mostrar mensaje de éxito
                alert(`¡Gracias ${nombre}! Tu mensaje ha sido enviado exitosamente. Te contactaremos pronto.`);

                // Limpiar formulario
                contactForm.reset();

                // Restaurar botón
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;

                // OPCIONAL: También abrir WhatsApp como canal alternativo
                // Descomenta las siguientes líneas si quieres que también se abra WhatsApp
                /*
                const servicioTexto = servicio ? `\n*Servicio:* ${servicio}` : '';
                const telefonoTexto = telefono ? `\n*Teléfono:* ${telefono}` : '';
                const whatsappMessage = `*NUEVA CONSULTA - TATMANTATTO*\n\n` +
                                       `*Nombre:* ${nombre}\n` +
                                       `*Email:* ${email}` +
                                       `${telefonoTexto}` +
                                       `${servicioTexto}\n\n` +
                                       `*Mensaje:*\n${mensaje}`;
                const whatsappNumber = '573506932218';
                const encodedMessage = encodeURIComponent(whatsappMessage);
                window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
                */

            }, function(error) {
                console.log('Error al enviar email:', error);

                // Si falla el email, ofrecer WhatsApp como alternativa
                alert('Hubo un problema al enviar el mensaje. Te redirigiremos a WhatsApp.');

                // Abrir WhatsApp como backup
                const servicioTexto = servicio ? `\n*Servicio:* ${servicio}` : '';
                const telefonoTexto = telefono ? `\n*Teléfono:* ${telefono}` : '';
                const whatsappMessage = `*NUEVA CONSULTA - TATMANTATTO*\n\n` +
                                       `*Nombre:* ${nombre}\n` +
                                       `*Email:* ${email}` +
                                       `${telefonoTexto}` +
                                       `${servicioTexto}\n\n` +
                                       `*Mensaje:*\n${mensaje}`;
                const whatsappNumber = '573506932218';
                const encodedMessage = encodeURIComponent(whatsappMessage);
                window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');

                // Restaurar botón
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
            });
    });
}

/*
===========================================
INSTRUCCIONES PARA CONFIGURAR EMAILJS
===========================================

1. Ve a https://www.emailjs.com/
2. Crea una cuenta gratuita (permite 200 emails/mes)
3. Verifica tu email
4. En el Dashboard:

   A) AGREGAR SERVICIO DE EMAIL:
   - Ve a "Email Services"
   - Click en "Add New Service"
   - Selecciona tu proveedor (Gmail, Outlook, etc.)
   - Conecta tu cuenta
   - Copia el "Service ID" (ejemplo: service_abc123)

   B) CREAR PLANTILLA DE EMAIL:
   - Ve a "Email Templates"
   - Click en "Create New Template"
   - En el contenido del email, usa estas variables:

     Subject: Nueva consulta de {{from_name}} - TATMANTATTO

     Body:
     Has recibido una nueva consulta desde tu sitio web TATMANTATTO:

     Nombre: {{from_name}}
     Email: {{from_email}}
     Teléfono: {{phone}}
     Servicio de interés: {{service}}

     Mensaje:
     {{message}}

   - Guarda la plantilla
   - Copia el "Template ID" (ejemplo: template_xyz789)

   C) OBTENER PUBLIC KEY:
   - Ve a "Account" > "General"
   - Copia tu "Public Key" (ejemplo: user_AbC123XyZ)

5. REEMPLAZA EN ESTE ARCHIVO (líneas arriba):
   - Línea 101: "TU_PUBLIC_KEY_AQUI" → Tu Public Key
   - Línea 141: "tu_email@ejemplo.com" → Tu email donde recibirás mensajes
   - Línea 145: "TU_SERVICE_ID" → Tu Service ID
   - Línea 145: "TU_TEMPLATE_ID" → Tu Template ID

6. ¡Listo! Los mensajes llegarán automáticamente a tu email
*/

// ===================================
// ANIMACIÓN AL HACER SCROLL
// ===================================
function handleScrollAnimation() {
    const elements = document.querySelectorAll('.design-card, .promo-card, .about-container, .info-card, .calculator-form, .calculator-info');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.design-card, .promo-card, .info-card, .calculator-form, .calculator-info');
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    });
    
    handleScrollAnimation();
});

window.addEventListener('scroll', handleScrollAnimation);

// ===================================
// NAVBAR TRANSPARENTE/SÓLIDO AL SCROLL
// ===================================
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    
    if (window.scrollY > 100) {
        nav.style.background = 'rgba(10, 10, 10, 0.98)';
        nav.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.5)';
    } else {
        nav.style.background = 'rgba(10, 10, 10, 0.95)';
        nav.style.boxShadow = 'none';
    }
});

// ===================================
// EFECTO PARALLAX EN EL HERO
// ===================================
window.addEventListener('scroll', function() {
    const heroContent = document.querySelector('.hero-content');
    const particles = document.querySelector('.particles');
    const scrolled = window.pageYOffset;
    
    if (heroContent && scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
        heroContent.style.opacity = 1 - (scrolled / 600);
    }
    
    if (particles && scrolled < window.innerHeight) {
        particles.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// ===================================
// CONTADOR DE CARACTERES EN TEXTAREA
// ===================================
const textarea = document.getElementById('mensaje');
if (textarea) {
    const charCounter = document.createElement('small');
    charCounter.style.color = '#666';
    charCounter.style.marginTop = '5px';
    charCounter.style.display = 'block';
    
    textarea.parentElement.appendChild(charCounter);
    
    textarea.addEventListener('input', function() {
        const currentLength = this.value.length;
        const maxLength = 500;
        
        charCounter.textContent = `${currentLength}/${maxLength} caracteres`;
        
        if (currentLength > maxLength) {
            charCounter.style.color = '#fff';
        } else {
            charCounter.style.color = '#666';
        }
    });
}

// ===================================
// ANIMACIÓN DE TYPING EN EL HERO
// ===================================
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

document.addEventListener('DOMContentLoaded', function() {
    const heroSubtitle = document.querySelector('.hero p');
    if (heroSubtitle) {
        const originalText = heroSubtitle.textContent;
        typeWriter(heroSubtitle, originalText, 50);
    }
});

// ===================================
// INTERACCIÓN CON TARJETAS DE DISEÑO
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    const designCards = document.querySelectorAll('.design-card');

    // Solo hacer las tarjetas clickeables en desktop (no en móvil)
    // Ya que en móvil no llevan a ningún lado
    const isMobile = window.innerWidth <= 768;

    if (!isMobile) {
        designCards.forEach(card => {
            card.addEventListener('click', function() {
                const designTitle = this.querySelector('.design-info h3');
                if (designTitle) {
                    console.log(`Clicked on: ${designTitle.textContent}`);
                }
            });
        });
    }
});

// ===================================
// DETECCIÓN DE DISPOSITIVO MÓVIL
// ===================================
function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || 
           (navigator.userAgent.indexOf('IEMobile') !== -1);
}

if (isMobileDevice()) {
    console.log('Usuario en dispositivo móvil');
}

// ===================================
// PREVENIR ENVÍO DUPLICADO DEL FORMULARIO
// ===================================
let formSubmitting = false;

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        if (formSubmitting) {
            e.preventDefault();
            return false;
        }
    });
}

// ===================================
// ANIMACIÓN DE ENTRADA PARA INFO CARDS
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });
    
    const infoCards = document.querySelectorAll('.info-card');
    infoCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateX(-30px)';
        card.style.transition = 'all 0.5s ease-out';
        observer.observe(card);
    });
});

// ===================================
// CONSOLE LOG DE BIENVENIDA
// ===================================
console.log('%c¡Bienvenido a TATMANTATTO!', 'color: #fff; font-size: 20px; font-weight: bold;');
console.log('%cSitio web premium desarrollado', 'color: #aaa; font-size: 12px;');

// ===================================
// LÓGICA PARA MENÚ DE HAMBURGUESA (VERSIÓN MEJORADA)
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navLinks = document.getElementById('nav-links');

    if (hamburgerBtn && navLinks) {
        hamburgerBtn.addEventListener('click', () => {
            // AÑADIMOS/QUITAMOS 'active' a AMBOS elementos
            hamburgerBtn.classList.toggle('active'); // Para la animación de la 'X'
            navLinks.classList.toggle('active');   // Para mostrar/ocultar el menú
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                // Al hacer clic en un enlace, cerramos todo
                hamburgerBtn.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }
});
