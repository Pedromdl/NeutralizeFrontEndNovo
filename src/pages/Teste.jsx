import { useState, useEffect, useRef } from "react";
import { Calendar, Clock, Phone, MapPin, Mail, ExternalLink, MessageCircle, Star } from "lucide-react";
import { motion, useAnimation, useInView, AnimatePresence } from "framer-motion";
import InstagramFeed from "../../components/InstaFeed";
import styles from "./Teste.module.css";

export default function HeroSection() {
  const [page, setPage] = useState(0);
  const [openIndex, setOpenIndex] = useState(null); // Estado para controlar qual FAQ está aberto
  const perPage = 4;

  const testimonials = [
    {
      name: "Felipe M.",
      text: "Excelente pessoa e profissional. Comecei fazendo liberação miofascial e hoje faço fortalecimento específico para triathlon com ele. Super recomendo."
    },
    {
      name: "Felipe B.",
      text: "Excelente profissional! Competente e confiável. Recomendo fortemente, em especial para atletas amadores de corrida/triatlo."
    },
    {
      name: "Marcus V.",
      text: "Pedrão sempre foi muito atencioso comigo desde o primeiro contato. Fui para tratar uma canelite e, com exercícios e liberação, ele fez com que eu voltasse a correr sem dores. Sempre indico para amigos e familiares 🙌."
    },
    {
      name: "Jaciara R.",
      text: "Sou paciente do Pedro há um ano. Cheguei com um probleminha no joelho e ele curou em dois meses! Continuei fazendo fisioterapia preventiva pois confio totalmente no trabalho dele. Melhor profissional, recomendo demais!"
    },
    {
      name: "Diego B.",
      text: "Faço reabilitação do joelho após rompimento do LCA e não tenho dúvidas que estou com o profissional certo. O Pedro explica tudo, tem muita calma e dedicação. A clínica também é super acolhedora."
    },
    {
      name: "Samuel R.",
      text: "Excelente profissional, sempre atencioso e buscando evolução. Trabalho com ele há mais de 2 anos, focando em fortalecimento, mobilidade e liberação. Melhorou muito minha prática de ciclismo e corrida."
    },
    {
      type: "google"
    }
  ];

  // Dados das perguntas frequentes
  const faqData = [
    {
      question: "Quanto tempo dura cada sessão?",
      answer: "Cada sessão tem duração média de 45 a 60 minutos, dependendo da técnica aplicada e das necessidades individuais do paciente."
    },
    {
      question: "O tratamento é doloroso?",
      answer: "Não, nossos métodos são não-invasivos e praticamente indolores. Alguns pacientes podem sentir leve desconforto que desaparece rapidamente."
    },
    {
      question: "Quantas sessões são necessárias?",
      answer: "O número de sessões varia conforme a condição. Em média, recomendamos entre 5 a 10 sessões para resultados significativos."
    },
    {
      question: "Há alguma contraindicação?",
      answer: "Sim, algumas condições como trombose, infecções agudas ou câncer ativo requerem avaliação especial prévia."
    },
    {
      question: "Preciso de encaminhamento médico?",
      answer: "Não é obrigatório, mas recomendamos trazer exames e laudos médicos para melhor direcionamento do tratamento."
    },
    {
      question: "Como agendar uma consulta?",
      answer: "Entre em contato pelo WhatsApp (XX) XXXX-XXXX, pelo nosso site ou através das redes sociais."
    }
  ];

  const start = page * perPage;
  const current = testimonials.slice(start, start + perPage);
  const totalPages = Math.ceil(testimonials.length / perPage);

  // Controles para animações
  const controls = useAnimation();

  // Animação para os benefícios
  const benefitVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: "easeOut"
      }
    })
  };

  // Animação para as imagens
  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: "easeOut"
      }
    }
  };

  // Animação específica para FAQ
  const faqVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  // Animação flutuante para o botão do WhatsApp
  const floatAnimation = {
    y: [-5, 5, -5],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  // Referências para o mapa do rodapé
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [currentYear] = useState(new Date().getFullYear());

  // Dados da empresa para o rodapé
  const companyInfo = {
    name: "Neutralize - Fisioterapia Ortopédica e Esportiva",
    tagline: "Movimento e Performance",
    description: "Especializada em liberação miofascial, reabilitação e treinamento personalizado para atletas e pessoas que buscam qualidade de vida através do movimento consciente.",
    logo: "src/images/logoletrapreta.png", // Caminho para sua imagem
    logoAlt: "Logo Neutralize" // Texto alternativo para acessibilidade
  };

  // Informações de contato para o rodapé
  const contactInfo = [
    {
      icon: 'fas fa-map-marker-alt',
      label: 'Endereço:',
      text: 'Av. Paulista, 1000\nSão Paulo - SP, 01310-100\nBrasil'
    },
    {
      icon: 'fas fa-phone',
      label: 'Telefone:',
      text: '(11) 9999-9999'
    },
    {
      icon: 'fas fa-envelope',
      label: 'E-mail:',
      text: 'contato@clinica.com.br'
    },
    {
      icon: 'fas fa-clock',
      label: 'Horário de Funcionamento:',
      text: 'Segunda a Sexta: 8h às 20h\nSábado: 8h às 13h'
    }
  ];

  // Redes sociais para o rodapé
  const socialLinks = [
    { icon: 'fab fa-facebook-f', label: 'Facebook', url: '#' },
    { icon: 'fab fa-instagram', label: 'Instagram', url: '#' },
    { icon: 'fab fa-whatsapp', label: 'WhatsApp', url: '#' },
    { icon: 'fab fa-youtube', label: 'YouTube', url: '#' }
  ];

  // Função para alternar FAQ
  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      {/* HERO SECTION */}
      <section className={styles.hero}>
        {/* Background Image */}
        <motion.img
          className={styles.imgHero}
          onLoad={(e) => e.target.classList.add(styles.loaded)}
          src="/images/liberacao.png"
          alt="liberacao"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        />

        {/* Overlay */}
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />

        {/* Content */}
        <div className={styles.container}>
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={styles.left}
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Encontre seu <br />
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                equilíbrio interno
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Sessões personalizadas focadas em movimento, consciência corporal e
              performance. Cuide do corpo com ciência e intenção.
            </motion.p>

            <motion.div
              className={styles.actions}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <motion.button
                className={styles.primary}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Agendar agora
              </motion.button>
              <motion.button
                className={styles.secondary}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Conhecer método
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={styles.right}
          >
            <motion.div
              className={styles.glassCard}
              whileHover={{ y: -5 }}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <h3>Agendamento</h3>
                <p>Escolha data e horário</p>
              </motion.div>

              <div className={styles.inputs}>
                <motion.div
                  className={styles.input}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Calendar size={18} />
                  <span>12 Outubro 2025</span>
                </motion.div>

                <motion.div
                  className={styles.input}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <Clock size={18} />
                  <span>09:00 – 10:00</span>
                </motion.div>
              </div>

              <motion.button
                className={styles.confirm}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                Confirmar sessão
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* BENEFÍCIOS COM ANIMAÇÃO */}
      <section className={styles.benefits}>
        <div className={styles.benefitsContainer}>
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className={styles.benefit}
              variants={benefitVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              custom={i}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
            >
              <h3>
                {i === 0 && "Redução imediata da dor"}
                {i === 1 && "Melhora da mobilidade"}
                {i === 2 && "Recuperação acelerada"}
                {i === 3 && "Performance e bem-estar"}
              </h3>
              <p>
                {i === 0 && "Alívio da tensão muscular e desconforto."}
                {i === 1 && "Mais amplitude de movimento com segurança."}
                {i === 2 && "Estimula circulação e regeneração tecidual."}
                {i === 3 && "Movimento mais eficiente e sensação de leveza."}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SOBRE COM ANIMAÇÃO */}
      <section className={styles.about}>
        <div className={styles.aboutContainer}>
          {/* Left – Images */}
          <div className={styles.images}>
            <div className={styles.imagesTop}>
              <motion.img
                src="/images/liberacao2.jpg"
                alt="Liberação miofascial 1"
                variants={imageVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{ scale: 1.03 }}
              />
              <motion.img
                src="/images/liberacao3.jpg"
                alt="Liberação miofascial 2"
                variants={imageVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                whileHover={{ scale: 1.03 }}
              />
            </div>

            <motion.div
              className={styles.imagesBottom}
              variants={imageVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <img src="/images/liberacao4.jpg" alt="Liberação miofascial 3" />
            </motion.div>
          </div>

          {/* Right – Text */}
          <motion.div
            className={styles.text}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2>O que é a Liberação Miofascial?</h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              A liberação miofascial é uma técnica terapêutica que atua sobre a fáscia,
              um tecido conjuntivo que envolve músculos, articulações e órgãos.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              Quando a fáscia perde mobilidade — seja por dor, sobrecarga ou estresse —
              surgem restrições de movimento, desconforto e queda de performance.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              Através de estímulos manuais precisos, buscamos restaurar a mobilidade,
              reduzir tensão e melhorar a eficiência do movimento.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section className={styles.testimonials}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          O que dizem nossos pacientes…
        </motion.h2>

        <div className={styles.testimonialsGrid}>
          {current.map((item, index) => {
            if (item.type === "google") {
              return (
                <motion.a
                  key={index}
                  href="https://maps.app.goo.gl/vyPM27jY1TtpYLqm9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.testimonialCard} ${styles.googleCard}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                >
                  <img
                    src="/images/googlemaps.png"
                    alt="Google Maps"
                    className={styles.googleIcon}
                  />
                  <span>Mais avaliações aqui…</span>
                </motion.a>
              );
            }

            return (
              <motion.div
                key={index}
                className={styles.testimonialCard}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <p>"{item.text}"</p>
                <span>{item.name}</span>
              </motion.div>
            );
          })}
        </div>

        <div className={styles.pagination}>
          <motion.button
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
            disabled={page === 0}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Anterior
          </motion.button>

          <motion.span
            key={page}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            {page + 1} / {totalPages}
          </motion.span>

          <motion.button
            onClick={() =>
              setPage((p) => Math.min(p + 1, totalPages - 1))
            }
            disabled={page === totalPages - 1}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Próximo
          </motion.button>
        </div>
      </section>

      {/* SEÇÃO DE PERGUNTAS FREQUENTES */}
      <section className={styles.faq}>
        <div className={styles.faqContainer}>
          <motion.h2
            className={styles.faqTitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Perguntas Frequentes
          </motion.h2>
          <motion.p
            className={styles.faqSubtitle}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Tire suas dúvidas sobre nossos tratamentos e procedimentos
          </motion.p>

          <div className={styles.faqGrid}>
            {faqData.map((item, index) => (
              <motion.div
                key={index}
                className={`${styles.faqCard} ${openIndex === index ? styles.active : ''}`}
                onClick={() => toggleFaq(index)}
                variants={faqVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                custom={index}
                whileHover={{
                  y: -8,
                  boxShadow: "0 16px 32px rgba(0, 0, 0, 0.12)",
                  transition: { duration: 0.2 }
                }}
              >
                <div className={styles.faqQuestion}>
                  <h3>{item.question}</h3>
                  <motion.div
                    className={styles.faqIcon}
                    animate={{ rotate: openIndex === index ? 45 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span>+</span>
                  </motion.div>
                </div>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      className={styles.faqAnswer}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p>{item.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
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
                {contactInfo.map((item, index) => (
                  <div key={index} className={styles.contactItem}>
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
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  className={styles.socialLink}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <i className={social.icon}></i>
                </motion.a>
              ))}
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