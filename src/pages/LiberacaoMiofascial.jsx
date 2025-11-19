import { useState, useEffect } from "react";
import logoNeutralize from '../images/logohletrabanca.png';
import styles from "./LiberacaoMiofascial.module.css";
import { enviarEventoGA } from "../useGA";
import "../assets/page_animations/LiberacaoMiofascialAnimation.css"

function Depoimento({ texto, autor }) {
  const [expandido, setExpandido] = useState(false);
  const limite = 180;

  const mostrarTexto =
    texto.length > limite && !expandido
      ? texto.slice(0, limite) + "..."
      : texto;

  return (
    <div className={`${styles.cardDepo} fadeInUp`}>
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

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.lightwidget.com/widgets/lightwidget.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("show");
        });
      },
      { threshold: 0.2 }
    );

    document
      .querySelectorAll(".fadeInUp")
      .forEach((el) => obs.observe(el));
  }, []);

  return (
    <div className={styles.container}>

      <header className={`${styles.header} fadeInUp`}>
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
        <main className={`${styles.hero} fadeInUp`} aria-labelledby="hero-title">
          <div>
            <div className={`${styles.badges} fadeInUp`}>
              <span className={styles.badge}>Avaliação individual</span>
              <span className={styles.badge}>Aplicado por fisioterapeuta</span>
            </div>

            {/* HERO IMG COM ANIMAÇÃO */}
            <img
              className={`${styles.imgHero} fadeInUp`}
              onLoad={(e) => e.target.classList.add("loaded")}
              src="/images/liberacao.png"
              alt="liberacao"
            />

            <h1 id="hero-title" className="fadeInUp">
              Liberação Miofascial com abordagem clínica e individualizada
            </h1>

            <p className={`${styles.lead} fadeInUp`}>
              Avaliação e tratamento voltados à redução de tensões musculares,
              melhora da amplitude de movimento e recuperação funcional.
            </p>

            <div className={`${styles.ctaRow} fadeInUp`}>
              <a
                className={`${styles.btn} ${styles.btnPrimaryLiberacao}`}
                href="https://wa.me/554831974163"
                onClick={() =>
                  enviarEventoGA("click_whatsapp_liberacao", {
                    pagina: "liberacao",
                  })
                }
              >
                Agendar Liberação
              </a>
              <a className={`${styles.btn} ${styles.btnGhost}`} href="#evidencia">
                Mais sobre evidência
              </a>
            </div>

            <div
              className="fadeInUp"
              style={{
                marginTop: 18,
                color: "var(--muted)",
                fontSize: 14,
              }}
            >
              <strong>Local:</strong> Neutralize • Santa Mônica
              <br />
              <span className={styles.small}>
                Avenida Ângelo Crema, 372
              </span>
            </div>
          </div>

          {/* FORM */}
          <aside className={`${styles.card} fadeInUp`} id="contato">
            <h3 style={{ margin: "0 0 10px 0", color: "white" }}>
              Agende uma avaliação
            </h3>
            <p className={styles.small} style={{ margin: "0 0 12px 0" }}>
              Preencha os dados e entraremos em contato.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();

                const nome = e.target.nome.value;
                const contato = e.target.contato.value;
                const motivo = e.target.motivo.value || "Não informado";
                const preferencia = e.target.preferencia.value;

                const mensagem = `Olá, meu nome é ${nome}.\nTelefone/WhatsApp: ${contato}\nMotivo: ${motivo}\nPreferência de horário: ${preferencia}`;

                const url = `https://wa.me/554831974163?text=${encodeURIComponent(
                  mensagem
                )}`;
                window.open(url, "_blank");
              }}
            >
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
              <div style={{ gap: 8, marginTop: 8, justifySelf: "center" }}>
                <button
                  type="submit"
                  className={`${styles.btn} ${styles.btnPrimaryLiberacao}`}
                >
                  Solicitar contato
                </button>
              </div>
            </form>
          </aside>
        </main>

        <section id="o-que-e" className={`${styles.cardLight} ${styles.twoCols} fadeInUp`}>
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

          <aside className="fadeInUp">
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

        <section id="beneficios" className={`${styles.cardLight} fadeInUp`}>
          <h2>Benefícios esperados</h2>
          <div className={styles.gridBenefits} style={{ marginTop: 12 }}>

            <div className={`${styles.benefit} fadeInUp`}>
              <div className={styles.ico}>↔</div>
              <div className={styles.textBenefit}>
                <strong>Aumento de mobilidade</strong>
                <div className={styles.muted} style={{ fontSize: 14 }}>
                  Mais liberdade de movimento.
                </div>
              </div>
            </div>

            <div className={`${styles.benefit} fadeInUp`}>
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

            <div className={`${styles.benefit} fadeInUp`}>
              <div className={styles.ico}>
                <img className={styles.imgBenefit} src="/images/balance.png" alt="ícone balance" />
              </div>
              <div className={styles.textBenefit}>
                <strong>Melhora postural</strong>
                <div className={styles.muted} style={{ fontSize: 14 }}>
                  Equilíbrio e estabilidade funcional.
                </div>
              </div>
            </div>

            <div className={`${styles.benefit} fadeInUp`}>
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

        <section id="evidencia" className={`${styles.cardLight} fadeInUp`}>
          <div className={styles.evidenciaWrapper}>
            <div className={`${styles.texto} fadeInUp`}>
              <h2>Evidência e responsabilidade clínica</h2>
              <p className={styles.muted}>
                A técnica apresenta resultados em dor, flexibilidade e função, mas sua
                eficácia depende da avaliação e integração com o plano terapêutico. Nossa
                conduta prioriza segurança e ciência.
              </p>
            </div>

            <video controls autoPlay muted loop className="fadeInUp">
              <source src="/videos/liberacao.mp4" type="video/mp4" />
              Seu navegador não suporta o elemento de vídeo.
            </video>
          </div>
        </section>

        <section className={`${styles.cardLight} fadeInUp`}>
          <section className={styles.depoimentos}>
            <h2>O que dizem nossos pacientes</h2>
            <div className={styles.carrossel}>
              <div className={styles.cardsWrapper}>

                {/* Cada depoimento já tem fadeInUp dentro do componente */}

                <Depoimento texto="“Excelente pessoa e profissional. Comecei fazendo liberação miofascial e hoje faço fortalecimento específico para triathlon com ele. Super recomendo.”" autor="Felipe M." />
                <Depoimento texto="Excelente profissional! Competente e confiável. Recomendo fortemente, em especial para atletas amadores de corrida/triatlo.”" autor="Felipe B." />
                <Depoimento texto="Pedrão sempre foi muito atencioso comigo desde o primeiro contato. Fui para tratar uma canelite e, com exercícios e liberação, ele fez com que eu voltasse a correr sem dores. Sempre indico para amigos e familiares 🙌.”" autor="Marcus V." />
                <Depoimento texto="“Sou paciente do Pedro há um ano. Cheguei com um probleminha no joelho e ele curou em dois meses! Continuei fazendo fisioterapia preventiva pois confio totalmente no trabalho dele. Melhor profissional, recomendo demais!”" autor="Jaciara R." />
                <Depoimento texto="Faço reabilitação do joelho após rompimento do LCA e não tenho dúvidas que estou com o profissional certo. O Pedro explica tudo, tem muita calma e dedicação. A clínica também é super acolhedora.”" autor="Diego B." />
                <Depoimento texto="Excelente profissional, sempre atencioso e buscando evolução. Trabalho com ele há mais de 2 anos, focando em fortalecimento, mobilidade e liberação. Melhorou muito minha prática de ciclismo e corrida.”" autor="Samuel R." />
                <Depoimento texto="“Eu estava com muita dor na cervical e depois da massagem me senti leve, relaxada e sem dor. Além de ótimo profissional, o Pedro é um querido! Super recomendado!”" autor="Ana Paula R." />

              </div>
            </div>
          </section>
        </section>

        <section className={`${styles.cardLight} fadeInUp`}>
          <h2>Nosso Instagram</h2>
              <p className={styles.muted}>
            Siga-nos nas redes sociais!
            </p>
          <iframe
            src="//lightwidget.com/widgets/9c08a4d6893a5828b80710419a9c68c4.html"
            className="lightwidget-widget"
            scrolling="no"
            style={{ width: "100%", border: "0", overflow: "hidden" }}
            allowTransparency={true}
          ></iframe>
        </section>

        <section className={`${styles.cardLight} fadeInUp`}>
          <h2>Perguntas frequentes</h2>
          <details className="fadeInUp">
            <summary>Quantas sessões são necessárias?</summary>
            <div className={`${styles.muted} ${styles.q}`}>
              Cada pessoa responde de um jeito. Algumas sentem alívio logo nas primeiras...
            </div>
          </details>

          <details className="fadeInUp">
            <summary>A técnica dói?</summary>
            <div className={`${styles.muted} ${styles.q}`}>
              Pode causar um leve desconforto em alguns momentos...
            </div>
          </details>

          <details className="fadeInUp">
            <summary>Contraindicações?</summary>
            <div className={`${styles.muted} ${styles.q}`}>
              Em alguns casos, a técnica não é indicada — como...
            </div>
          </details>
        </section>

        <section className={`${styles.cardLight} fadeInUp`}>
          <h2>Localização</h2>
          <div className={styles.mapContainer}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3535.943206879265!2d-48.50730302460923!3d-27.59529032206891!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xa475ab07f350f3%3A0xeac8fd8584107632!2sNeutralize%20-%20Fisioterapia%20Ortop%C3%A9dica%20e%20Esportiva!5e0!3m2!1spt-BR!2sbr!4v1763591375683!5m2!1spt-BR!2sbr"
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

      <footer className="fadeInUp">
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
