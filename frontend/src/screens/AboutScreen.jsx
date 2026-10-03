import { abrirTelegram } from '../shared/telegram/index.js';

export default function AboutScreen() {
  return (
    <section className="AboutScreen">
 
      <h2>Acerca del Juego</h2>
      <h3>Aviso legal</h3>
 
      <p className="LegalNotice">
        Esta aventura es un proyecto de fans, sin fines de lucro y sin afiliación con The Pokémon Company,
        Nintendo o Game Freak. Los nombres, imágenes, sonidos y marcas de Pokémon pertenecen a sus
        respectivos titulares. Pokebeck Hub se creó para aprender y divertirse. ¿Tienes ideas, encontraste
        un error o quieres colaborar?<br />
        Súmate a la comunidad y ayúdanos a que esta aventura siga creciendo.
      </p>
 
      <button onClick={abrirTelegram} className="TelegramButton">
        <i className="fab fa-telegram"></i> Telegram
      </button>
 
      <p className="VersionText">Versión 2.2.7 | © 2026 Pokebeck Hub</p>
 
    </section>
  )
}