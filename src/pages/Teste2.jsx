import { useEffect, useRef, useState, useCallback } from "react";
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { motion, useInView, AnimatePresence } from "framer-motion";
import styles from "./Teste.module.css";

import Logo from "../images/logoletrapreta.png";
import logoNeutralize from "../images/logobranca.png";
import InstagramFeed from "../../components/InstaFeed";
import { enviarEventoGA } from "../useGA";
import {
  Activity,
  Move,
  Dumbbell,
  ShieldCheck,
  Scale,
  Clock,
} from "lucide-react"

const currentYear = new Date().getFullYear();

// Dados da empresa para o rodapé
const companyInfo = {
  name: "Neutralize - Fisioterapia Ortopédica e Esportiva",
  tagline: "Movimento e Performance",
  description: "Especializada em liberação miofascial, reabilitação e treinamento personalizado para atletas e pessoas que buscam qualidade de vida através do movimento consciente.",
  logo: Logo, // Caminho para sua imagem
  logoAlt: "Logo Neutralize" // Texto alternativo para acessibilidade
};

// Informações de contato para o rodapé
const contactInfo = [
  {
    icon: 'fas fa-map-marker-alt',
    label: 'Endereço:',
    text: 'Av. Ângelo Crema, 372\nFlorianópolis - SC, 88037-270\nBrasil'
  },
  {
    icon: 'fas fa-phone',
    label: 'Telefone:',
    text: '(48) 3197-4163'
  },
  {
    icon: 'fas fa-envelope',
    label: 'E-mail:',
    text: 'neutralizeft@gmail.com'
  },
  {
    icon: 'fas fa-clock',
    label: 'Horário de Funcionamento:',
    text: 'Segunda a Quinta: 8h às 20h\nSexta: 8h às 18h'
  }
];

// Redes sociais para o rodapé
const socialLinks = [
  { icon: FaFacebook, label: 'Facebook', url: '#' },
  { icon: FaInstagram, label: 'Instagram', url: 'https://www.instagram.com/neutralize.ft' },
  {
    icon: FaWhatsapp,
    label: 'WhatsApp',
    url: 'https://wa.me/554831974163',
    isWhatsapp: true
  },
];

const iconMap = {
  pain: Activity,
  mobility: Move,
  strength: Dumbbell,
  confidence: ShieldCheck,
  load: Scale,
  clock: Clock,
}

/* ================= ANIMAÇÕES ================= */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

/* ================= CONTEÚDO ================= */

const doresEspelhadas = [
  "Repouso que não resolveu",
  "Exercícios genéricos sem explicação",
  "Tratamentos que aliviaram, mas a dor voltou",
  "Voltar ao treino com medo de se machucar de novo",
];

const fases = [
  {
    tag: "N1",
    title: "Reabilitação Inicial",
    text: "Aliviar a dor e restaurar função básica. Aqui a gente apaga o incêndio.",
    color: "#22c55e",
  },
  {
    tag: "N2",
    title: "Preparação Física",
    text: "Construir um corpo que aguenta carga e reduz o risco de nova lesão. Aqui não é personal trainer — é fisioterapia com critério.",
    color: "#22c55e",
  },
  {
    tag: "N3",
    title: "Monitoramento Preventivo",
    text: "Acompanhamento e ajustes para identificar problemas antes da dor aparecer. Aqui a gente monitora para você não precisar voltar ao N1.",
    color: "#22c55e",
  },
];

const criterios = [
  { label: "Controle de dor", icon: "pain" },
  { label: "Mobilidade funcional", icon: "mobility" },
  { label: "Força mínima necessária", icon: "strength" },
  { label: "Confiança no movimento", icon: "confidence" },
  { label: "Capacidade de carga", icon: "load" },
  { label: "Tempo de cicatrização tecidual atingido", icon: "clock" },

]

const paraQuem = {
  sim: [
    "Quer entender o que está acontecendo com seu corpo",
    "Quer voltar ao treino ou esporte com segurança",
    "Não quer depender de tratamento eterno",
  ],
  nao: [
    "Procura apenas alívio rápido e pontual",
    "Quer apenas “passar um choquinho”",
    "Não pretende seguir um processo",
  ],
};

const faqs = [
  {
    q: "Vou precisar fazer todas as fases?",
    a: "Não. Cada fase é indicada conforme sua condição e seus objetivos. Tudo é explicado antes do início.",
  },
  {
    q: "Vocês prendem o paciente no tratamento?",
    a: "Não. A progressão acontece por critérios clínicos, não por tempo ou pacotes.",
  },
  {
    q: "Atende convênios?",
    a: "Atendimento particular, com emissão de nota para reembolso quando aplicável.",
  },
];

/* ================= COMPONENTE ================= */

export default function Home() {
  const avaliacaoRef = useRef(null);
  const heroRef = useRef(null);
  const [faqAberta, setFaqAberta] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const isHeroInView = useInView(heroRef, { once: true });

  useEffect(() => {
    enviarEventoGA("page_view", "Home - Modelo Clínico");

    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToAvaliacao = useCallback(() => {
    avaliacaoRef.current?.scrollIntoView({ behavior: "smooth" });
    enviarEventoGA("click", "Scroll para Avaliação");
  }, []);

  return (
    <>


      {/* ================= HERO ================= */}
      <section className={styles.hero} ref={heroRef}>
        {/* Background Image */}
        <motion.img
          className={styles.imgHero}
          src="/images/liberacao/5.jpeg"
          alt="liberacao"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        <div className={styles.overlay} />
        <div className={styles.heroContent}>
          <img src={logoNeutralize} alt="Neutralize" className={styles.logo} />

          <motion.h1 variants={fadeUp} initial="hidden" animate={isHeroInView ? "visible" : "hidden"}>
            Fisioterapia para quem não quer apenas sair da dor —
            <br />
            <span className={styles.highlight}>quer voltar a confiar no próprio corpo</span>
          </motion.h1>

          <motion.p variants={fadeUp}>
            Tratamento organizado em fases claras, com avaliação,
            critérios e decisões clínicas.
            <br />
            Sem sessões soltas. Sem achismo. Sem empurrar tratamento.
          </motion.p>

          <div className={styles.heroButtons}>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              className={styles.primaryButton}
              onClick={() => window.open("https://wa.me/554831974163", "_blank")}
            >
              Agendar avaliação
            </motion.button>
            <motion.button 
            whileHover={{ scale: 1.05 }}
            className={styles.secondaryButton} onClick={scrollToAvaliacao}>
              Entenda se esse modelo faz sentido para você
            </motion.button>
          </div>
        </div>
      </section>

      {/* ================= ESPELHAMENTO ================= */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2>Você não está sozinho</h2>
          <p className={styles.lead}>A maioria das pessoas que chegam até aqui já tentou:</p>

          {/* ================= ESPELHAMENTO ================= */}
          <div className={styles.doresGrid}>
            {doresEspelhadas.map((dor) => (
              <div key={dor} className={styles.dorCard}>
                <p>{dor}</p>
              </div>
            ))}
          </div>


          <p className={styles.lead}>
            Se você sente que está sempre apagando incêndios,
            mas nunca resolvendo a causa, essa página é pra você.
          </p>
        </div>
      </section>

      {/* ================= REENQUADRAMENTO ================= */}
      <section className={`${styles.section} ${styles.sectionReframe}`}>
        <div className={styles.container}>
          <h2>Por que a dor volta?</h2>

          <div className={styles.reframeCard}>
            <p className={styles.reframeIntro}>
              A dor raramente volta porque você “não se cuidou”.
            </p>

            <ul className={styles.reframeChecklist}>
              <li>O corpo não foi preparado para carga</li>
              <li>A alta aconteceu cedo demais</li>
              <li>Ninguém mediu se você realmente estava pronto</li>
            </ul>

            <p className={styles.reframeConclusion}>
              Tratar a dor é só o começo.
              O problema é parar aí.
            </p>
          </div>
        </div>
      </section>

      {/* ================= MÉTODO ================= */}
      <section className={`${styles.section} ${styles.methodSection}`}>
        <div className={styles.container}>
          <h2>Nosso cuidado funciona em fases — e cada uma tem um motivo</h2>

          {/* ================= MÉTODO ================= */}
          <div className={styles.cards}>
            {fases.map((fase) => (
              <div
                key={fase.tag}
                className={styles.card}
                style={{ borderTop: `4px solid ${fase.color}` }}
              >
                <span className={styles.cardTag}>{fase.tag}</span>
                <h3>{fase.title}</h3>
                <p>{fase.text}</p>
              </div>
            ))}
          </div>


          <p className={styles.lead}>
            Você não precisa fazer todas as fases.
            Mas precisa saber que elas existem.
          </p>
        </div>
      </section>

      {/* ================= CRITÉRIOS ================= */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2>Aqui ninguém evolui só por tempo</h2>
          <p className={styles.lead}>A evolução acontece quando critérios objetivos são atingidos</p>

          <div className={styles.criteriosGrid}>
            {criterios.map((c) => {
              const Icon = iconMap[c.icon]

              return (
                <div key={c.icon} className={styles.criterioCard}>
                  <Icon className={styles.criterioIcon} />
                  <h3>{c.label}</h3>
                </div>
              )
            })}
          </div>


          <p className={styles.lead}>
            Se não faz sentido avançar, a gente não avança.
            Se faz, a decisão é explicada.
          </p>
        </div>
      </section>

      {/* ================= PARA QUEM ================= */}
      <section className={`${styles.section} ${styles.targetSection}`}>
        <div className={styles.container}>
          <h2>Para quem esse modelo faz sentido</h2>

          <div className={styles.timelineCompare}>

            {/* FAZ SENTIDO */}
            <div className={`${styles.timelineCol} ${styles.ok}`}>
              <div className={styles.timelineHeader}>
                <span className={styles.icon}>✓</span>
                <h3>Faz sentido se você:</h3>
              </div>

              {/* ================= PARA QUEM ================= */}
              <ul className={styles.timeline}>
                {paraQuem.sim.map((item) => (
                  <li key={item} className={styles.timelineItem}>
                    <span className={styles.dot}>✓</span>
                    <p>{item}</p>
                  </li>
                ))}
              </ul>

            </div>

            {/* NÃO FAZ */}
            <div className={`${styles.timelineCol} ${styles.nao}`}>
              <div className={styles.timelineHeader}>
                <span className={styles.icon}>⏸</span>
                <h3>Talvez não faça sentido se:</h3>
              </div>

              <ul className={styles.timeline}>
                {paraQuem.nao.map((item) => (
                  <li key={item} className={styles.timelineItem}>
                    <span className={styles.dot}>⏸</span>
                    <p>{item}</p>
                  </li>
                ))}
              </ul>

            </div>

          </div>
        </div>
      </section>


      {/* ================= AVALIAÇÃO ================= */}
      <section className={styles.about} ref={avaliacaoRef}>
        <div className={styles.container}>
          <h2 className={styles.aboutTitle}>O que acontece na avaliação</h2>

          <div className={styles.stepsGrid}>
            <div className={styles.stepCard}>
              <span className={styles.stepNumber}>01</span>
              <h3>Conversa clínica</h3>
              <p>
                Entendimento profundo da sua história,
                rotina, queixas e objetivos reais.
              </p>
            </div>

            <div className={styles.stepCard}>
              <span className={styles.stepNumber}>02</span>
              <h3>Avaliação de movimento</h3>
              <p>
                Testes de função, controle motor e
                capacidade real de carga.
              </p>
            </div>

            <div className={styles.stepCard}>
              <span className={styles.stepNumber}>03</span>
              <h3>Explicação clara</h3>
              <p>
                Você entende o que está acontecendo,
                sem termos vagos ou promessas.
              </p>
            </div>

            <div className={styles.stepCard}>
              <span className={styles.stepNumber}>04</span>
              <h3>Direcionamento honesto</h3>
              <p>
                Indicamos o melhor caminho — inclusive
                se não for seguir tratamento.
              </p>
            </div>
          </div>

          <div className={styles.aboutFooter}>
            <p className={styles.leadLight}>
              Você sai sabendo exatamente onde está,
              o que precisa ser feito e se faz sentido seguir.
            </p>

            <button
              className={styles.ctaButton}
              onClick={() => window.open("https://wa.me/554831974163", "_blank")}
            >
              Agendar avaliação
            </button>

            <p className={styles.ctaSubtitle}>
              Sem obrigação de continuidade. Só clareza.
            </p>
          </div>
        </div>
      </section>


      {/* INSTAGRAM */}
      <section className={`${styles.cardLight}`}>
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Nosso Instagram
        </motion.h2>
        <motion.p
          className={styles.muted}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Veja mais da nossa rotina e atualizações no Instagram.
        </motion.p>

        <InstagramFeed />
      </section>


      {/* RODAPÉ */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerGrid}>
            {/* Coluna 1: Logo e informações da empresa */}
            <div className={styles.footerColumn}>
              <div className={styles.footerLogoContainer}>
                <div className={styles.logoPlaceholder}>
                  <img
                    src={companyInfo.logo}
                    alt={companyInfo.logoAlt || companyInfo.name}
                    className={styles.logoImage}
                  />                </div>
                <div className={styles.companyInfo}>
                  <h3>{companyInfo.name}</h3>
                  <p>{companyInfo.tagline}</p>
                </div>
              </div>
              <div className={styles.companyDescription}>
                {companyInfo.description}
              </div>
            </div>

            {/* Coluna 2: Informações de contato */}
            <div className={styles.footerColumn}>
              <h4>Entre em Contato</h4>
              <div className={styles.contactInfo}>
                {contactInfo.map((item) => (
                  <div key={item.label} className={styles.contactItem}>
                    <i className={item.icon}></i>
                    <div>
                      <span className={styles.contactLabel}>{item.label}</span>
                      <p className={styles.contactText}>{item.text}</p>
                    </div>
                  </div>
                ))}

              </div>
            </div>

            {/* Coluna 3: Mapa */}
            <div className={styles.footerColumn}>
              <h4>Nossa Localização</h4>
              <div className={styles.mapContainer}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3535.9430535248594!2d-48.50730302473849!3d-27.595295076246952!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xa475ab07f350f3%3A0xeac8fd8584107632!2sNeutralize%20-%20Fisioterapia%20Ortop%C3%A9dica%20e%20Esportiva!5e0!3m2!1spt-BR!2sbr!4v1765881229085!5m2!1spt-BR!2sbr"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mapa da Clínica Neutralize"
                />
              </div>
            </div>
          </div>

          <div className={styles.footerBottom}>
            {/* Redes sociais */}
            <div className={styles.footerSocial}>
              {/* ================= REDES SOCIAIS ================= */}
              {socialLinks.map((social) => {
                const Icon = social.icon

                return (
                  <motion.a
                    key={social.label}
                    href={social.url}
                    className={styles.socialLink}
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      if (social.isWhatsapp) {
                        enviarEventoGA("click_whatsapp_liberacao", {
                          origem: "footer",
                          pagina: "home"
                        })
                      }
                    }}
                  >
                    <Icon size={20} />
                  </motion.a>
                )
              })}

            </div>

            {/* Copyright e links legais */}
            <div className={styles.copyright}>
              &copy; {currentYear} {companyInfo.name}. Todos os direitos reservados.
              <a href="#" className={styles.copyrightLink}>Política de Privacidade</a>
              <a href="#" className={styles.copyrightLink}>Termos de Uso</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
