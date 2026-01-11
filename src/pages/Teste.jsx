import { useState, useEffect, useRef } from "react";
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { motion, useAnimation, useInView, AnimatePresence } from "framer-motion";

import InstagramFeed from "../../components/InstaFeed";
import styles from "./Teste.module.css";
import Logo from "../images/logoletrapreta.png";
import LogoHero from "../images/logobranca.png";

import { enviarEventoGA } from "../useGA";

export default function ClinicaNeutralize() {
  const [page, setPage] = useState(0);
  const [openIndex, setOpenIndex] = useState(null);
  const perPage = 4;
  const aboutRef = useRef(null);

  // Depoimentos específicos da clínica
  const testimonials = [
    {
      name: "Carla S.",
      text: "Clínica excelente! Ambiente limpo, organizado e profissional. O Pedro é um fisioterapeuta competente e atencioso. Tratei uma tendinite no ombro e em poucas semanas estava sem dor."
    },
    {
      name: "Roberto M.",
      text: "Fui para reabilitação pós-cirúrgica de joelho e o tratamento foi fundamental para minha recuperação. Equipamentos modernos e atendimento humanizado."
    },
    {
      name: "Ana Paula L.",
      text: "Comecei com dores nas costas e hoje faço fortalecimento preventivo. A clínica tem uma estrutura completa e o atendimento é personalizado. Super indico!"
    },
    {
      name: "Marcos A.",
      text: "Atendo na Neutralize há 6 meses para tratamento de lombalgia. Melhora significativa na qualidade de vida. Profissionais qualificados e ambiente acolhedor."
    },
    {
      name: "Juliana F.",
      text: "Excelente clínica! Fiz fisioterapia esportiva para uma lesão no tornozelo. Retomei meus treinos em tempo recorde. O diferencial é a atenção aos detalhes."
    },
    {
      name: "Ricardo P.",
      text: "Ambiente climatizado, equipamentos de ponta e profissionais atualizados. Tratei uma bursite no quadril com ótimos resultados. Recomendo a todos!"
    },
    {
      type: "google"
    }
  ];

  // Dados das perguntas frequentes específicas da clínica
  const faqData = [
    {
      question: "Como funciona a primeira consulta?",
      answer: "Na primeira consulta realizamos uma avaliação completa, incluindo anamnese, exames físicos e, se necessário, testes específicos. Com base nisso, elaboramos um plano de tratamento personalizado."
    },
    {
      question: "A clínica aceita convênios?",
      answer: "Atendemos particulares e alguns convênios. Entre em contato para verificar a cobertura do seu plano. Também oferecemos pacotes com preços especiais."
    },
    {
      question: "Qual a duração média do tratamento?",
      answer: "Varia conforme a condição. Lesões agudas podem necessitar de 8-12 sessões, enquanto condições crônicas podem requerer acompanhamento mais prolongado."
    },
    {
      question: "Há estacionamento no local?",
      answer: "Sim, temos estacionamento gratuito para pacientes na frente da clínica. Também há vagas de rua disponíveis nas proximidades."
    },
    {
      question: "Preciso de encaminhamento médico?",
      answer: "Não é obrigatório para fisioterapia, mas recomendamos trazer exames e laudos médicos para melhor direcionamento do tratamento."
    },
    {
      question: "Trabalham com fisioterapia esportiva?",
      answer: "Sim, somos especializados em fisioterapia esportiva. Atendemos atletas amadores e profissionais de diversas modalidades."
    }
  ];

  // Dados dos serviços da clínica
  const servicos = [
    {
      title: "Fisioterapia Ortopédica",
      description: "Tratamento de lesões musculoesqueléticas, pós-operatórios, dores articulares e problemas de coluna.",
      image: "/images/clinica/ortopedica.jpg"
    },
    {
      title: "Fisioterapia Esportiva",
      description: "Prevenção e tratamento de lesões esportivas, reabilitação de atletas e preparação física especializada.",
      image: "/images/clinica/esportiva.jpg"
    },
    {
      title: "Liberação Miofascial",
      description: "Técnicas manuais para liberar tensões musculares, melhorar mobilidade e reduzir dores.",
      image: "/images/clinica/liberacao.jpg"
    },
    {
      title: "Avaliação Postural",
      description: "Análise completa da postura e movimento para identificar desequilíbrios e prevenir lesões.",
      image: "/images/clinica/postural.jpg"
    }
  ];

  // Dados do processo de atendimento
  const processo = [
    {
      etapa: "1",
      titulo: "Avaliação Inicial",
      descricao: "Consulta detalhada para entender sua condição, histórico e objetivos."
    },
    {
      etapa: "2",
      titulo: "Plano Personalizado",
      descricao: "Elaboração de um tratamento específico para suas necessidades."
    },
    {
      etapa: "3",
      titulo: "Tratamento",
      descricao: "Sessões com técnicas avançadas e acompanhamento constante."
    },
    {
      etapa: "4",
      titulo: "Alta e Manutenção",
      descricao: "Orientação para manutenção dos resultados e prevenção."
    }
  ];

  const start = page * perPage;
  const current = testimonials.slice(start, start + perPage);
  const totalPages = Math.ceil(testimonials.length / perPage);

  // Controles para animações
  const controls = useAnimation();

  // Animação para os serviços
  const servicoVariants = {
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

  // Animação para processo
  const processoVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.6,
        ease: "easeOut"
      }
    })
  };

  // Referências para o mapa do rodapé
  const [currentYear] = useState(new Date().getFullYear());

  // Dados da empresa para o rodapé
  const companyInfo = {
    name: "Neutralize - Fisioterapia Ortopédica e Esportiva",
    tagline: "Movimento e Performance",
    description: "Especializada em liberação miofascial, reabilitação e treinamento personalizado para atletas e pessoas que buscam qualidade de vida através do movimento consciente.",
    logo: Logo,
    logoAlt: "Logo Neutralize"
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

  // Função para alternar FAQ
  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    enviarEventoGA("pageview_clinica", {
      pagina: "home",
      origem: "clinica_neutralize"
    });
  }, []);

  return (
    <>
      {/* HERO SECTION - CLÍNICA */}
      <section className={styles.hero}>
        {/* Background Image */}
        <motion.video
          className={styles.imgHero}
          onLoadedData={(e) => e.target.classList.add(styles.loaded)}
          src="/images/homepage/video1.MOV"
          alt="Clínica Neutralize"
          autoPlay
          muted
          loop
          playsInline
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
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
            {/* Logo da empresa */}
            <motion.div
              className={styles.logoContainer}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <img
                src={LogoHero}
                alt="Logo da empresa"
                className={styles.logo}
              />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Fisioterapia Ortopédica <br />
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                e Esportiva em Florianópolis
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Cuidado especializado para dor, lesões e performance.
              Atendimento individualizado com técnicas modernas e abordagem humanizada.
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
                onClick={() => {
                  enviarEventoGA("click_whatsapp_clinica", {
                    origem: "hero_agendar_agora",
                    pagina: "clinica"
                  });

                  window.open("https://wa.me/554831974163", "_blank");
                }}
              >
                Agendar avaliação
              </motion.button>
              <motion.button
                className={styles.secondary}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  enviarEventoGA("click_conhecer_servicos", {
                    origem: "hero",
                    pagina: "clinica"
                  });

                  aboutRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                  });
                }}
              >
                Conhecer serviços
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Card - Formulário de Agendamento */}
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
                style={{ color: "white" }}
              >
                <h3 style={{ color: "white", margin: "0 0 8px 0" }}>Agende uma avaliação</h3>
                <p style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "14px", margin: 0 }}>
                  Preencha os dados e entraremos em contato.
                </p>
              </motion.div>

              <form
                className={styles.inputs}
                onSubmit={(e) => {
                  e.preventDefault();

                  const nome = e.target.nome.value;
                  const contato = e.target.contato.value;
                  const motivo = e.target.motivo.value || "Não informado";
                  const preferencia = e.target.preferencia.value;

                  const mensagem = `Olá, gostaria de agendar uma avaliação na clínica.\nNome: ${nome}\nTelefone/WhatsApp: ${contato}\nMotivo: ${motivo}\nPreferência de horário: ${preferencia}`;

                  const url = `https://wa.me/554831974163?text=${encodeURIComponent(
                    mensagem
                  )}`;
                  window.open(url, "_blank");
                }}
              >
                <motion.div
                  className={styles.input}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <input
                    id="nome"
                    type="text"
                    required
                    style={{
                      border: 'none',
                      background: 'transparent',
                      width: '100%',
                      outline: 'none',
                      color: 'white'
                    }}
                    placeholder="Nome completo"
                  />
                </motion.div>

                <motion.div
                  className={styles.input}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.75 }}
                >
                  <input
                    id="contato"
                    type="tel"
                    required
                    style={{
                      border: 'none',
                      background: 'transparent',
                      width: '100%',
                      outline: 'none',
                      color: 'white'
                    }}
                    placeholder="Telefone/WhatsApp"
                  />
                </motion.div>

                <motion.div
                  className={styles.input}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <input
                    id="motivo"
                    type="text"
                    style={{
                      border: 'none',
                      background: 'transparent',
                      width: '100%',
                      outline: 'none',
                      color: 'white'
                    }}
                    placeholder="Motivo principal (opcional)"
                  />
                </motion.div>

                <motion.div
                  className={styles.input}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.85 }}
                >
                  <select
                    id="preferencia"
                    style={{
                      border: 'none',
                      background: 'transparent',
                      width: '100%',
                      outline: 'none',
                      color: 'white'
                    }}
                  >
                    <option style={{ color: '#333' }}>Qualquer horário</option>
                    <option style={{ color: '#333' }}>Manhã</option>
                    <option style={{ color: '#333' }}>Tarde</option>
                    <option style={{ color: '#333' }}>Noite</option>
                  </select>
                </motion.div>

                <motion.button
                  className={styles.confirm}
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  style={{ color: 'white' }}
                >
                  Solicitar contato
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SERVIÇOS DA CLÍNICA */}
      <section ref={aboutRef} className={styles.servicos}>
        <div className={styles.servicosContainer}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Nossos Serviços
          </motion.h2>
          <motion.p
            className={styles.servicosSubtitle}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Conheça as especialidades da Neutralize
          </motion.p>

          <div className={styles.servicosGrid}>
            {servicos.map((servico, index) => (
              <motion.div
                key={index}
                className={styles.servicoCard}
                variants={servicoVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                custom={index}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.2 },
                  boxShadow: "0 16px 32px rgba(0, 0, 0, 0.12)"
                }}
              >
                <div className={styles.servicoImage}>
                  <img src={servico.image} alt={servico.title} />
                </div>
                <div className={styles.servicoContent}>
                  <h3>{servico.title}</h3>
                  <p>{servico.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SOBRE A CLÍNICA */}
      <section className={styles.about}>
        <div className={styles.aboutContainer}>
          {/* Left – Images */}
          <div className={styles.images}>
            <div className={styles.imagesTop}>
              <motion.img
                src="/images/clinica/ambiente1.jpg"
                alt="Ambiente da clínica 1"
                variants={imageVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{ scale: 1.03 }}
              />
              <motion.img
                src="/images/clinica/ambiente2.jpg"
                alt="Ambiente da clínica 2"
                variants={imageVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                whileHover={{ scale: 1.03 }}
              />
            </div>

            <motion.div className={styles.imagesBottom}>
              <img
                src="/images/clinica/ambiente3.jpg"
                alt="Sala de tratamento"
                className={styles.imageZoom}
              />
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
            <h2>Sobre a Neutralize</h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              A Neutralize é uma clínica especializada em fisioterapia ortopédica e esportiva,
              localizada no coração de Florianópolis.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              Nossa missão é proporcionar cuidado integral, combinando técnicas avançadas
              com atendimento humanizado para promover saúde, movimento e qualidade de vida.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              Contamos com equipamentos modernos e profissionais atualizados para oferecer
              o melhor tratamento para cada paciente.
            </motion.p>

            <div className={styles.diferenciais}>
              <motion.div
                className={styles.diferencial}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <span>✓</span> Atendimento Individualizado
              </motion.div>
              <motion.div
                className={styles.diferencial}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
              >
                <span>✓</span> Equipamentos Modernos
              </motion.div>
              <motion.div
                className={styles.diferencial}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
              >
                <span>✓</span> Abordagem Integrada
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PROCESSO DE ATENDIMENTO */}
      <section className={styles.processo}>
        <div className={styles.processoContainer}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Como Funciona Nosso Atendimento
          </motion.h2>

          <div className={styles.processoSteps}>
            {processo.map((step, index) => (
              <motion.div
                key={index}
                className={styles.stepCard}
                variants={processoVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={index}
                whileHover={{ y: -5 }}
              >
                <div className={styles.stepNumber}>{step.etapa}</div>
                <h3>{step.titulo}</h3>
                <p>{step.descricao}</p>
              </motion.div>
            ))}
          </div>
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
            Tire suas dúvidas sobre nossos serviços e atendimento
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
          Acompanhe nosso dia a dia e dicas de saúde
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
                  />
                </div>
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
              {socialLinks.map((social, index) => {
                const Icon = social.icon;

                return (
                  <motion.a
                    key={index}
                    href={social.url}
                    className={styles.socialLink}
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      if (social.isWhatsapp) {
                        enviarEventoGA("click_whatsapp_clinica", {
                          origem: "footer",
                          pagina: "clinica"
                        });
                      }
                    }}
                  >
                    <Icon size={20} />
                  </motion.a>
                );
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