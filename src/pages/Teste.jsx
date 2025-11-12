import logoNeutralize from '../images/logohletrabanca.png';
import "./Teste.css"

import { useState } from "react";

function Depoimento({ texto, autor }) {
  const [expandido, setExpandido] = useState(false);
  const limite = 180; // número máximo de caracteres antes de cortar

  const mostrarTexto =
    texto.length > limite && !expandido
      ? texto.slice(0, limite) + "..."
      : texto;

  return (
    <div className="card">
      <p>{mostrarTexto}</p>
      {texto.length > limite && (
        <button
          onClick={() => setExpandido(!expandido)}
          className="btn-leiamais"
        >
          {expandido ? "Ler menos" : "Ler mais"}
        </button>
      )}
      <span>⭐⭐⭐⭐⭐ — {autor}</span>
    </div>
  );
}

export default function LiberacaoMiofascial() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Formulário de exemplo — implemente envio no servidor.");
  };

  return (
    <div className="container" role="main">
      <header>
        <div className="brand">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img
            className='logo-liberacao'
              src={logoNeutralize}
              alt="Logo Neutralize"
            />
          </div>
        </div>
        <nav>
          <a href="#o-que-e">O que é</a>
          <a href="#beneficios">Benefícios</a>
          <a href="#contato">Agendar</a>
        </nav>
      </header>

      {/* HERO */}
      

      {/* Seções */}
      <div className="sections">

        <main className="hero" aria-labelledby="hero-title">
        <div>
          <div className="badges">
            <span className="badge">Avaliação individual</span>
            <span className="badge">Aplicado por fisioterapeuta</span>
          </div>
          <h1 id="hero-title">
            Liberação Miofascial com abordagem clínica e individualizada
          </h1>
          <p className="lead">
            Avaliação e tratamento voltados à redução de tensões musculares,
            melhora da amplitude de movimento e recuperação funcional.
          </p>
          <div className="cta-row">
            <a className="btn btn-primary-liberacao" href="#contato">
              Agendar avaliação
            </a>
            <a className="btn btn-ghost" href="#evidencia">
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
            <span className="small">
              Avenida Ângelo Crema, 372 — (48) 3197-4163
            </span>
          </div>
        </div>

        {/* FORM */}
        <aside className="card" id="contato">
          <h3 style={{ margin: "0 0 10px 0", color: "white" }}>Agende uma avaliação</h3>
          <p className="small" style={{ margin: "0 0 12px 0" }}>
            Preencha os dados e entraremos em contato.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="nome">Nome completo</label>
              <input id="nome" type="text" placeholder="Ex: João Silva" required />
            </div>
            <div className="form-field">
              <label htmlFor="contato">Telefone ou WhatsApp</label>
              <input id="contato" type="tel" placeholder="(48) 3197-4163" required />
            </div>
            <div className="form-field">
              <label htmlFor="motivo">Motivo principal</label>
              <input id="motivo" type="text" placeholder="Ex: rigidez no ombro" />
            </div>
            <div className="form-field">
              <label htmlFor="preferencia">Preferência de horário</label>
              <select id="preferencia">
                <option>Qualquer horário</option>
                <option>Manhã</option>
                <option>Tarde</option>
                <option>Noite</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 8, alignItems: "center" }}>
              <button type="submit" className="btn btn-primary-liberacao">
                Solicitar contato
              </button>
              <a
                className="btn btn-ghost"
                href="https://wa.me/554831974163"
                target="_blank"
              >
                Abrir WhatsApp
              </a>
            </div>
          </form>
        </aside>
      </main>

        <section id="o-que-e" className="card-light two-cols">
          <div>
            <h2>O que é a Liberação Miofascial</h2>
            <p className="muted">
              Técnica manual que visa a mobilização de tecidos que envolvem músculos e
              articulações. Na <strong>Neutralize</strong>, a aplicação é precedida por
              avaliação funcional para orientar intensidade e estratégias
              complementares.
            </p>
            <ul className="muted" >
              <li>Reduzir rigidez e desconforto muscular</li>
              <li>Melhorar amplitude de movimento</li>
              <li>Auxiliar na recuperação e preparo físico</li>
              <li>Contribuir para equilíbrio postural</li>
            </ul>
          </div>
          <aside>
            <div className="card-light">
              <h4>Diferenciais clínicos</h4>
              <table className="diff-table">
                <tbody>
                  <tr>
                    <td className="diff-left">Avaliação prévia</td>
                    <td className="diff-right">Triagem funcional individual</td>
                  </tr>
                  <tr>
                    <td className="diff-left">Profissional</td>
                    <td className="diff-right">Fisioterapeutas especializados</td>
                  </tr>
                  <tr>
                    <td className="diff-left">Abordagem</td>
                    <td className="diff-right">Integrada à reabilitação quando indicado</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </aside>
        </section>

        <section id="beneficios" className="card-light">
          <h2>Benefícios esperados</h2>
          <div className="grid-benefits" style={{ marginTop: 12 }}>
            <div className="benefit"> <div className="ico">↔</div>
              <div className="text-benefit"> <strong>Aumento de mobilidade</strong>
                <div className="muted" style={{ fontSize: 14 }}> Mais liberdade de movimento. </div>
              </div>
            </div>
            <div className="benefit">
              <div className="ico">
                <img className="img-benefit" src="/images/sleep.png" alt="ícone sono" />
                </div>
              <div className="text-benefit"> <strong>Redução de tensões</strong>
                <div className="muted" style={{ fontSize: 14 }}> Sensação de relaxamento muscular. </div>
              </div>
            </div>
            <div className="benefit">
              <div className="ico">⚖</div>
              <div className="text-benefit"> <strong>Melhora postural</strong>
                <div className="muted" style={{ fontSize: 14 }}> Equilíbrio e estabilidade funcional. </div>
              </div> </div> <div className="benefit">
              <div className="ico">
                <img className="img-benefit" src="/images/integration.png" alt="ícone sono" /></div>
              <div className="text-benefit"> <strong>Integração terapêutica</strong>
                <div className="muted" style={{ fontSize: 14 }}> Resultados mais duradouros quando combinada
                  com exercícios. </div>
              </div>
            </div>
          </div>
        </section>

        <section id="evidencia" className="card-light">
          <h2>Evidência e responsabilidade clínica</h2>
          <p className="muted">
            A técnica apresenta resultados em dor, flexibilidade e função, mas sua
            eficácia depende da avaliação e integração com o plano terapêutico. Nossa
            conduta prioriza segurança e ciência.
          </p>
        </section>

        <section className="card-light">
          <section className="depoimentos">
            <h2>O que dizem nossos pacientes</h2>

            <div className="carrossel">
              <div className="cards-wrapper">
                <Depoimento
                  texto="Excelente pessoa e profissional. Comecei fazendo liberação miofascial e hoje faço fortalecimento específico para triathlon com ele. Super recomendo"
                  autor="Felipe M."
                />
                <Depoimento
                  texto="Excelente profissional! Competente e confiável. Recomendo fortemente, em especial para atletas amadores de corrida/triatlo."
                  autor="Felipe B."
                />
                <Depoimento
                  texto="Pedrão sempre foi muito atencioso comigo desde o primeiro contato. Fui para tratar uma canelite e, a partir de exercícios, liberação miofascial e outras técnicas, ele conseguiu fazer com que eu voltasse a correr sem dores. Sempre que possível indico para amigos e familiares 🙌"
                  autor="Marcus V."
                />
                <Depoimento
                  texto="Sou paciente do Pedro há um ano. Cheguei até ele devido a um probleminha no joelho, o qual ele curou em dois meses!! Porém continuei fazendo fisioterapia preventiva com ele pois acredito que seja necessário para todos nós. Ele é um excelente profissional, cuida da gente e faz tudo da melhor maneira para seus pacientes!! Esse profissional fez com que eu tivesse constância no meu tratamento e agora nos meus treinos com ele!! Eu super recomendo esse profissional maravilhoso!!"
                  autor="Jaciara R."
                />
                <Depoimento
                  texto="Sou paciente do Pedro realizando reabilitação do joelho após rompimento do LCA e não tenho dúvidas que estou com o profissional e a pessoa certa. Em todos os atendimentos o Pedro sempre foi atencioso e sempre fez questão de explicar detalhadamente cada etapa do tratamento e a importância de cada exercício (algo que me auxilia muito com a motivação). O ambiente da clínica é acolhedor e bem equipado, o que contribui para uma experiência ainda mais positiva."
                  autor="Diego B."
                />
                <Depoimento
                  texto="Excelente profissional, muito atencioso, sempre buscando evolução na teoria e prática para melhor atender seus pacientes. Pedro tem sido o meu fisioterapeuta por mais de 2 anos e ao longo desse tempo trabalhamos fortalecimento, mobilidade e liberação, com foco sempre no feedback dos meus treinos e provas. Com isso, me auxiliou bastante na prática do ciclismo e corrida."
                  autor="Samuel R."
                />
                <Depoimento
                  texto="O Pedro é um profissional de excelência! Eu estava com muita dor na cervical e depois da massagem me senti muito mais leve, relaxada e sem dores.
E além de ótimo profissional o Pedro é um querido!! Super recomendado!!"
                  autor="Ana Paula R."
                />
              </div>
            </div>
          </section>
        </section>

        <section className="card-light">
          <h2>Perguntas frequentes</h2>
          <details>
            <summary>Quantas sessões são necessárias?</summary>
            <div className="muted q">
              Cada pessoa responde de um jeito. Algumas sentem alívio logo nas primeiras sessões,
              enquanto outras precisam de um acompanhamento um pouco mais longo.
              O mais importante é entender o seu caso e ajustar o tratamento conforme a sua evolução.
            </div>
          </details>
          <details>
            <summary>A técnica dói?</summary>
            <div className="muted q">
              Pode causar um leve desconforto em alguns momentos, mas sempre dentro do seu limite.
              A ideia não é gerar dor, e sim promover alívio e bem-estar — tudo é feito de forma controlada e respeitosa com o seu corpo.
            </div>
          </details>
          <details>
            <summary>Contraindicações?</summary>
            <div className="muted q">
              Em alguns casos, a técnica não é indicada — como em situações de inflamações agudas, tromboses, infecções ou fraturas recentes.
              Por isso, antes de iniciar o tratamento, sempre avaliamos com cuidado o seu quadro para garantir total segurança.
            </div>
          </details>
        </section>
        <section className="card-light">
          <h2>Localização</h2>
          <div className="map-container">
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
          <div className="muted">
            Neutralize - Fisioterapia Ortopédica e Esportiva • Atendimento por agendamento
          </div>
        </div>
        <div className="footer-cta">
          <div className="pill">Agende avaliação</div>
          <div style={{ fontSize: 14 }} className="muted">
            Telefone:{" "}
            <strong style={{ color: "var(--accent)" }}>(48) 3197-4163</strong>
          </div>
        </div>
      </footer>
    </div>
  );
}
