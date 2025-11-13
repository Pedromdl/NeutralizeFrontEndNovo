import { useState } from "react";
import logoNeutralize from '../images/logohletrabanca.png';
import styles from "./LiberacaoMiofascial.module.css";
import { enviarEventoGA } from "../useGA";

function Depoimento({ texto, autor }) {
  const [expandido, setExpandido] = useState(false);
  const limite = 180;

  const mostrarTexto =
    texto.length > limite && !expandido
      ? texto.slice(0, limite) + "..."
      : texto;

  return (
    <div className={styles.cardDepo}>
      <p className={styles.texto}>{mostrarTexto}</p>
      {texto.length > limite && (
        <button
          onClick={() => setExpandido(!expandido)}
          className={styles.btnLeiaMais}
        >
          {expandido ? "Ler menos" : "Ler mais"}
        </button>
      )}
      <span className={styles.autor}>⭐⭐⭐⭐⭐ — {autor}</span>
    </div>
  );
}

export default function LiberacaoMiofascial() {

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Formulário de exemplo — implemente envio no servidor.");
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img
              className={styles.logoLiberacao}
              src={logoNeutralize}
              alt="Logo Neutralize"
            />
          </div>
        </div>

        <nav className={styles.nav}>
          <a className={styles.um} href="#o-que-e">O que é</a>
          <a className={styles.link} href="#beneficios">Benefícios</a>
          <a className={styles.link} href="#contato">Agendar</a>
        </nav>
      </header>

      <div className={styles.sections}>
        <main className={styles.hero} aria-labelledby="hero-title">
          <div>
            <div className={styles.badges}>
              <span className={styles.badge}>Avaliação individual</span>
              <span className={styles.badge}>Aplicado por fisioterapeuta</span>
            </div>
            <h1 id="hero-title">
              Liberação Miofascial com abordagem clínica e individualizada
            </h1>
            <p className={styles.lead}>
              Avaliação e tratamento voltados à redução de tensões musculares,
              melhora da amplitude de movimento e recuperação funcional.
            </p>
            <div className={styles.ctaRow}>
              <a
                className={`${styles.btn} ${styles.btnPrimaryLiberacao}`}
                href="https://wa.me/554831974163"
                onClick={() => enviarEventoGA("click_whatsapp_liberacao", { pagina: "liberacao" })}
              >
                Agendar Liberação
              </a>
              <a className={`${styles.btn} ${styles.btnGhost}`} href="#evidencia">
                Mais sobre evidência
              </a>
            </div>
            <div
              style={{
                marginTop: 18,
                color: "var(--muted)",
                fontSize: 14,
              }}
            >
              <strong>Local:</strong> Neutralize • Santa Mônica
              <br />
              <span className={styles.small}>
                Avenida Ângelo Crema, 372 — (48) 3197-4163
              </span>
            </div>
          </div>

          {/* FORM */}
          <aside className={styles.card} id="contato">
            <h3 style={{ margin: "0 0 10px 0", color: "white" }}>Agende uma avaliação</h3>
            <p className={styles.small} style={{ margin: "0 0 12px 0" }}>
              Preencha os dados e entraremos em contato.
            </p>

            <form onSubmit={handleSubmit}>
              <div className={styles.formField}>
                <label htmlFor="nome">Nome completo</label>
                <input id="nome" type="text" placeholder="Ex: João Silva" required />
              </div>
              <div className={styles.formField}>
                <label htmlFor="contato">Telefone ou WhatsApp</label>
                <input id="contato" type="tel" placeholder="(48) 3197-4163" required />
              </div>
              <div className={styles.formField}>
                <label htmlFor="motivo">Motivo principal</label>
                <input id="motivo" type="text" placeholder="Ex: rigidez no ombro" />
              </div>
              <div className={styles.formField}>
                <label htmlFor="preferencia">Preferência de horário</label>
                <select id="preferencia">
                  <option>Qualquer horário</option>
                  <option>Manhã</option>
                  <option>Tarde</option>
                  <option>Noite</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button type="submit" className={`${styles.btn} ${styles.btnPrimaryLiberacao}`}>
                  Solicitar contato
                </button>
                <a
                  className={`${styles.btn} ${styles.btnGhost}`}
                  href="https://wa.me/554831974163"
                  target="_blank"
                >
                  Abrir WhatsApp
                </a>
              </div>
            </form>
          </aside>
        </main>

        <section id="o-que-e" className={`${styles.cardLight} ${styles.twoCols}`}>
          <div>
            <h2>O que é a Liberação Miofascial</h2>
            <p className={styles.muted}>
              Técnica manual que visa a mobilização de tecidos que envolvem músculos e
              articulações. Na <strong>Neutralize</strong>, a aplicação é precedida por
              avaliação funcional para orientar intensidade e estratégias
              complementares.
            </p>
            <ul className={styles.muted}>
              <li>Reduzir rigidez e desconforto muscular</li>
              <li>Melhorar amplitude de movimento</li>
              <li>Auxiliar na recuperação e preparo físico</li>
              <li>Contribuir para equilíbrio postural</li>
            </ul>
          </div>
          <aside>
            <div className={styles.cardLight}>
              <h4>Diferenciais clínicos</h4>
              <table className={styles.diffTable}>
                <tbody>
                  <tr>
                    <td className={styles.diffLeft}>Avaliação prévia</td>
                    <td className={styles.diffRight}>Triagem funcional individual</td>
                  </tr>
                  <tr>
                    <td className={styles.diffLeft}>Profissional</td>
                    <td className={styles.diffRight}>Fisioterapeutas especializados</td>
                  </tr>
                  <tr>
                    <td className={styles.diffLeft}>Abordagem</td>
                    <td className={styles.diffRight}>
                      Integrada à reabilitação quando indicado
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </aside>
        </section>

        <section id="beneficios" className={styles.cardLight}>
          <h2>Benefícios esperados</h2>
          <div className={styles.gridBenefits} style={{ marginTop: 12 }}>
            <div className={styles.benefit}>
              <div className={styles.ico}>↔</div>
              <div className={styles.textBenefit}>
                <strong>Aumento de mobilidade</strong>
                <div className={styles.muted} style={{ fontSize: 14 }}>
                  Mais liberdade de movimento.
                </div>
              </div>
            </div>

            <div className={styles.benefit}>
              <div className={styles.ico}>
                <img className={styles.imgBenefit} src="/images/sleep.png" alt="ícone sono" />
              </div>
              <div className={styles.textBenefit}>
                <strong>Redução de tensões</strong>
                <div className={styles.muted} style={{ fontSize: 14 }}>
                  Sensação de relaxamento muscular.
                </div>
              </div>
            </div>

            <div className={styles.benefit}>
              <div className={styles.ico}>⚖</div>
              <div className={styles.textBenefit}>
                <strong>Melhora postural</strong>
                <div className={styles.muted} style={{ fontSize: 14 }}>
                  Equilíbrio e estabilidade funcional.
                </div>
              </div>
            </div>

            <div className={styles.benefit}>
              <div className={styles.ico}>
                <img className={styles.imgBenefit} src="/images/integration.png" alt="ícone integração" />
              </div>
              <div className={styles.textBenefit}>
                <strong>Integração terapêutica</strong>
                <div className={styles.muted} style={{ fontSize: 14 }}>
                  Resultados mais duradouros quando combinada com exercícios.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="evidencia" className={styles.cardLight}>
          <h2>Evidência e responsabilidade clínica</h2>
          <p className={styles.muted}>
            A técnica apresenta resultados em dor, flexibilidade e função, mas sua
            eficácia depende da avaliação e integração com o plano terapêutico. Nossa
            conduta prioriza segurança e ciência.
          </p>
        </section>

        <section className={styles.cardLight}>
          <section className={styles.depoimentos}>
            <h2>O que dizem nossos pacientes</h2>
            <div className={styles.carrossel}>
              <div className={styles.cardsWrapper}>
                <Depoimento texto="Excelente pessoa e profissional..." autor="Felipe M." />
                <Depoimento texto="Excelente profissional! Competente e confiável..." autor="Felipe B." />
                <Depoimento texto="Pedrão sempre foi muito atencioso comigo..." autor="Marcus V." />
                <Depoimento texto="Sou paciente do Pedro há um ano..." autor="Jaciara R." />
                <Depoimento texto="Sou paciente do Pedro realizando reabilitação..." autor="Diego B." />
                <Depoimento texto="Excelente profissional, muito atencioso..." autor="Samuel R." />
                <Depoimento texto="O Pedro é um profissional de excelência!..." autor="Ana Paula R." />
              </div>
            </div>
          </section>
        </section>

        <section className={styles.cardLight}>
          <h2>Perguntas frequentes</h2>
          <details>
            <summary>Quantas sessões são necessárias?</summary>
            <div className={`${styles.muted} ${styles.q}`}>
              Cada pessoa responde de um jeito. Algumas sentem alívio logo nas primeiras sessões,
              enquanto outras precisam de um acompanhamento um pouco mais longo.
              O mais importante é entender o seu caso e ajustar o tratamento conforme a sua evolução.
            </div>
          </details>
          <details>
            <summary>A técnica dói?</summary>
            <div className={`${styles.muted} ${styles.q}`}>
              Pode causar um leve desconforto em alguns momentos, mas sempre dentro do seu limite.
              A ideia não é gerar dor, e sim promover alívio e bem-estar — tudo é feito de forma controlada e respeitosa com o seu corpo.
            </div>
          </details>
          <details>
            <summary>Contraindicações?</summary>
            <div className={`${styles.muted} ${styles.q}`}>
              Em alguns casos, a técnica não é indicada — como em situações de inflamações agudas, tromboses, infecções ou fraturas recentes.
              Por isso, antes de iniciar o tratamento, sempre avaliamos com cuidado o seu quadro para garantir total segurança.
            </div>
          </details>
        </section>

        <section className={styles.cardLight}>
          <h2>Localização</h2>
          <div className={styles.mapContainer}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3535.943206879265!2d-48.50730302460923!3d-27.59529032206891!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xa475ab07f350f3%3A0xeac8fd8584107632!2sNeutralize%20-%20Fisioterapia%20Ortop%C3%A9dica%20e%20Esportiva!5e0!3m2!1spt-BR!2sbr!4v1762958351648!5m2!1spt-BR!2sbr"
              width="100%"
              height="400"
              style={{ border: 0, borderRadius: "12px" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa Neutralize"
            ></iframe>
          </div>
        </section>
      </div>

      <footer>
        <div>
          <div className={styles.muted}>
            Neutralize - Fisioterapia Ortopédica e Esportiva • Atendimento por agendamento
          </div>
        </div>
        <div className={styles.footerCta}>
          <div className={styles.muted} style={{ fontSize: 14 }}>
            Telefone: <strong style={{ color: "var(--accent)" }}>(48) 3197-4163</strong>
          </div>
        </div>
      </footer>
    </div>
  );
}
