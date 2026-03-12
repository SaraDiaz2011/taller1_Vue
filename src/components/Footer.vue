<template>
  <footer class="netflix-footer">
    <div class="footer-content">
      <p class="footer-top-text">¿Preguntas? Llama al 01 800 917 1564</p>
      
      <div class="footer-links-grid">
        <ul class="footer-links">
          <li><a href="#">Preguntas frecuentes</a></li>
          <li><a href="#">Relaciones con inversionistas</a></li>
          <li><a href="#">Formas de ver</a></li>
          <li><a href="#">Información corporativa</a></li>
          <li><a href="#">Originales de Netflix</a></li>
        </ul>
        <ul class="footer-links">
          <li><a href="#">Centro de ayuda</a></li>
          <li><a href="#">Empleo</a></li>
          <li><a href="#">Términos de uso</a></li>
          <li><a href="#">Contáctanos</a></li>
        </ul>
        <ul class="footer-links">
          <li><a href="#">Cuenta</a></li>
          <li><a href="#">Canjear tarjetas de regalo</a></li>
          <li><a href="#">Privacidad</a></li>
          <li><a href="#">Prueba de velocidad</a></li>
        </ul>
        <ul class="footer-links">
          <li><a href="#">Prensa</a></li>
          <li><a href="#">Comprar tarjetas de regalo</a></li>
          <li><a href="#">Preferencias de cookies</a></li>
          <li><a href="#">Avisos legales</a></li>
        </ul>
      </div>

      <div class="footer-copyright">
        © 1997-2026 Netflix, Inc.
      </div>
    </div>
  </footer>
</template>

<style scoped>
.netflix-footer {
  background-color: #141414;
  color: #808080;
  padding: 4rem 0;
  font-size: 0.85rem;
  border-top: 1px solid #333; /* subtle separator if needed */
  margin-top: 2rem;
}

.footer-content {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 4rem;
}

.footer-top-text {
  margin-bottom: 2rem;
}

.footer-links-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 1rem;
}

.footer-links a {
  color: #808080;
  text-decoration: none;
  transition: text-decoration 0.2s;
}

.footer-links a:hover {
  text-decoration: underline;
}

.footer-copyright {
  margin-top: 2rem;
  font-size: 0.8rem;
}

@media (max-width: 768px) {
  .footer-links-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
