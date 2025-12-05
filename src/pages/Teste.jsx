import React, { useState } from 'react';
import styles from './Teste.module.css';

export default function RehabAppPrototype() {
  const [view, setView] = useState('home');
  const [selectedPatient, setSelectedPatient] = useState(null);

  return (
    <div className={styles.appContainer}>
      <Header onNavigate={setView} view={view} />
      
      <main className={styles.mainContent}>
        {view === 'home' ? 
          <Landing onStart={() => setView('dashboard')} /> : 
          <Dashboard 
            selectedPatient={selectedPatient}
            onSelectPatient={setSelectedPatient}
          />
        }
      </main>

      <Footer />
    </div>
  );
}

// Header Component
function Header({ onNavigate, view }) {
  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <div className={styles.headerLogo}>
          <div className={styles.logoIcon}>
            <svg className={styles.logoSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h1 className={styles.logoTitle}>RehabFlow Pro</h1>
            <p className={styles.logoSubtitle}>Plataforma de Reabilitação Inteligente</p>
          </div>
        </div>

        <nav className={styles.headerNav}>
          <button
            onClick={() => onNavigate('home')}
            className={`${styles.navButton} ${view === 'home' ? styles.navButtonActive : ''}`}>
            <div className={styles.navButtonContent}>
              <svg className={styles.navIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </div>
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className={`${styles.navButton} ${view === 'dashboard' ? styles.navButtonActive : ''}`}>
            <div className={styles.navButtonContent}>
              <svg className={styles.navIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Painel
            </div>
          </button>
          <div className={styles.userAvatar}>
            <div className={styles.avatarStatus}></div>
            <div className={styles.avatarImage}>DR</div>
          </div>
        </nav>
      </div>
    </header>
  );
}

// Landing Component
function Landing({ onStart }) {
  const [activeFeature, setActiveFeature] = useState(0);

  const FEATURES = [
    {
      icon: "📋",
      title: "Avaliações Padronizadas",
      description: "Formulários clínicos validados com histórico automático e exportação profissional em PDF",
      badge: "20+ escalas disponíveis"
    },
    {
      icon: "💪",
      title: "Prescrição Inteligente",
      description: "Biblioteca com 500+ exercícios, vídeos HD e progressão automática baseada em algoritmos",
      badge: "IA Assistida"
    },
    {
      icon: "📊",
      title: "Dashboard Avançado",
      description: "KPIs em tempo real, gráficos interativos e alertas automáticos de progresso",
      badge: "Tempo Real"
    },
    {
      icon: "📱",
      title: "App do Paciente",
      description: "Acompanhamento remoto, lembretes inteligentes e registro de sintomas via smartphone",
      badge: "Mobile First"
    },
    {
      icon: "🔄",
      title: "Integração Completa",
      description: "Conexão com wearables, Strava, Apple Health e principais sistemas de agendamento",
      badge: "+10 integrações"
    },
    {
      icon: "🔒",
      title: "Segurança e Compliance",
      description: "LGPD, HIPAA, criptografia de ponta a ponta e backups automáticos",
      badge: "Certificado"
    }
  ];

  return (
    <div className={styles.landingContainer}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div>
            <span className={styles.badge}>🚀 Plataforma Profissional</span>
            <h1 className={styles.heroTitle}>Transforme sua Prática Clínica</h1>
            <p className={styles.heroDescription}>
              Sistema completo para avaliação, prescrição e monitoramento de pacientes. 
              Tudo que você precisa em uma plataforma integrada e intuitiva.
            </p>
          </div>

          <div className={styles.heroStats}>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={`${styles.statValue} ${styles.statValueBlue}`}>95%</div>
                <div className={styles.statLabel}>Adesão dos Pacientes</div>
              </div>
              <div className={styles.statCard}>
                <div className={`${styles.statValue} ${styles.statValueBlue}`}>40%</div>
                <div className={styles.statLabel}>Redução no Tempo Administrativo</div>
              </div>
            </div>

            <div className={styles.ctaButtons}>
              <button 
                onClick={onStart}
                className={styles.primaryButton}
              >
                <div className={styles.buttonContent}>
                  Começar Agora
                  <svg className={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </button>
              <button className={styles.secondaryButton}>
                Agendar Demonstração
              </button>
            </div>

            <div className={styles.testimonial}>
              <div className={styles.avatarGroup}>
                {['MS', 'CO', 'AP', 'RJ'].map((initial, i) => (
                  <div key={i} className={styles.groupAvatar}>
                    {initial}
                  </div>
                ))}
              </div>
              <span className={styles.testimonialText}>Junto a 500+ profissionais de saúde</span>
            </div>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className={styles.dashboardPreview}>
          <div className={styles.previewBackground}></div>
          <div className={styles.previewCard}>
            <div className={styles.previewHeader}>
              <div className={styles.previewLogo}>
                <div className={styles.previewLogoIcon}></div>
                <span className={styles.previewTitle}>Painel do Terapeuta</span>
              </div>
              <div className={styles.previewDots}>
                <div className={`${styles.dot} ${styles.dotBlue}`}></div>
                <div className={`${styles.dot} ${styles.dotCyan}`}></div>
                <div className={`${styles.dot} ${styles.dotGreen}`}></div>
              </div>
            </div>
            <div className={styles.previewContent}>
              <div className={styles.previewStats}>
                {[82, 45, 12].map((value, i) => (
                  <div key={i} className={styles.previewStat}>
                    <div className={styles.previewStatValue}>{value}%</div>
                    <div className={styles.previewStatLabel}>Adesão média</div>
                  </div>
                ))}
              </div>
              <div className={styles.previewChart}>
                <div className={styles.chartPlaceholder}>
                  <div className={styles.chartIcon}>📊</div>
                  <div className={styles.chartText}>Gráficos de Progresso em Tempo Real</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Funcionalidades Completas</h2>
          <p className={styles.sectionSubtitle}>
            Tudo que você precisa para uma reabilitação eficiente e baseada em evidências
          </p>
        </div>

        <div className={styles.featuresGrid}>
          {FEATURES.map((feature, index) => (
            <div 
              key={index}
              className={`${styles.featureCard} ${activeFeature === index ? styles.featureCardActive : ''}`}
              onMouseEnter={() => setActiveFeature(index)}
            >
              <div className={`${styles.featureIcon} ${activeFeature === index ? styles.featureIconActive : ''}`}>
                <span className={styles.iconEmoji}>{feature.icon}</span>
              </div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
              {feature.badge && (
                <span className={styles.featureBadge}>{feature.badge}</span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContainer}>
          <h2 className={styles.ctaTitle}>Pronto para Transformar sua Clínica?</h2>
          <p className={styles.ctaText}>
            Experimente gratuitamente por 14 dias. Sem compromisso, sem cartão de crédito.
          </p>
          <div className={styles.ctaButtons}>
            <button 
              onClick={onStart}
              className={styles.ctaPrimary}
            >
              Testar Gratuitamente
            </button>
            <button className={styles.ctaSecondary}>
              Falar com Especialista
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

// Dashboard Component
function Dashboard({ selectedPatient, onSelectPatient }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('7d');

  const SAMPLE_PATIENTS = [
    { id: 1, name: 'Mariana Silva', initials: 'MS', diagnosis: 'Lombalgia', sessions: 12, adherence: 82, status: 'active' },
    { id: 2, name: 'Carlos Oliveira', initials: 'CO', diagnosis: 'Lesão Joelho', sessions: 8, adherence: 92, status: 'active' },
    { id: 3, name: 'Ana Pereira', initials: 'AP', diagnosis: 'Tendinite Ombro', sessions: 6, adherence: 65, status: 'active' },
    { id: 4, name: 'Roberto Santos', initials: 'RS', diagnosis: 'Pós-cirúrgico', sessions: 3, adherence: 45, status: 'warning' },
  ];

  const SAMPLE_PROGRAMS = [
    { id: 1, title: 'Reabilitação Lombar', desc: 'Foco em estabilização e fortalecimento', duration: '8 semanas', progress: 75 },
    { id: 2, title: 'Retorno ao Esporte', desc: 'Progressão controlada para corrida', duration: '12 semanas', progress: 40 },
    { id: 3, title: 'Estabilidade de Ombro', desc: 'Controle motor e propriocepção', duration: '6 semanas', progress: 90 },
  ];

  const RECENT_SESSIONS = [
    { id: 1, type: 'Avaliação Inicial', date: '2025-11-28', time: '14:00', completed: true, status: 'completed' },
    { id: 2, type: 'Sessão de Fortalecimento', date: '2025-11-30', time: '10:30', completed: true, status: 'completed' },
    { id: 3, type: 'Avaliação de Progresso', date: '2025-12-05', time: '09:00', completed: false, status: 'agendada' },
  ];

  const patientStats = selectedPatient || {
    name: 'Mariana Silva',
    initials: 'MS',
    adherence: 82,
    painLevel: 2,
    sessionsCompleted: 12,
    lastSession: '2025-11-28',
    nextSession: '2025-12-05',
    progress: 65
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Dashboard Header */}
      <div className={styles.dashboardHeader}>
        <div className={styles.headerTop}>
          <div>
            <h1 className={styles.dashboardTitle}>Painel Clínico</h1>
            <p className={styles.dashboardSubtitle}>Bem-vindo(a) de volta, Dra. Regina</p>
          </div>
          <div className={styles.headerActions}>
            <select className={styles.clinicSelect}>
              <option>Minha Clínica</option>
              <option>Hospital Santa Maria</option>
            </select>
            <button className={styles.newAssessmentButton}>
              + Nova Avaliação
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className={styles.quickStats}>
          <StatCard 
            title="Pacientes Ativos" 
            value="24" 
            change="+12%"
            icon="👥"
            color="blue"
          />
          <StatCard 
            title="Sessões Hoje" 
            value="8" 
            change="+2"
            icon="📅"
            color="cyan"
          />
          <StatCard 
            title="Adesão Média" 
            value="82%" 
            change="+5%"
            icon="📈"
            color="green"
          />
          <StatCard 
            title="Avaliações Pendentes" 
            value="3" 
            change="-1"
            icon="⏰"
            color="orange"
          />
        </div>
      </div>

      <div className={styles.dashboardContent}>
        {/* Patients Sidebar */}
        <div className={styles.sidebar}>
          <div className={styles.patientsCard}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Pacientes Ativos</h3>
              <span className={styles.cardCount}>24</span>
            </div>
            <div className={styles.patientsList}>
              {SAMPLE_PATIENTS.map((patient) => (
                <div 
                  key={patient.id}
                  className={`${styles.patientItem} ${selectedPatient?.id === patient.id ? styles.patientItemActive : ''}`}
                  onClick={() => onSelectPatient(patient)}
                >
                  <div className={styles.patientInfo}>
                    <div className={styles.patientAvatarContainer}>
                      <div className={styles.patientAvatar}>
                        {patient.initials}
                      </div>
                      <div className={`${styles.patientStatus} ${patient.status === 'active' ? styles.statusActive : styles.statusWarning}`}></div>
                    </div>
                    <div className={styles.patientDetails}>
                      <div className={styles.patientName}>{patient.name}</div>
                      <div className={styles.patientMeta}>
                        <span>{patient.diagnosis}</span>
                        <span className={styles.metaSeparator}>•</span>
                        <span>{patient.sessions} sessões</span>
                      </div>
                    </div>
                    <div className={styles.patientAdherence}>
                      {patient.adherence}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className={styles.addPatientButton}>
              + Adicionar Paciente
            </button>
          </div>

          {/* Quick Actions */}
          <div className={styles.quickActionsCard}>
            <h4 className={styles.cardTitle}>Ações Rápidas</h4>
            <div className={styles.actionsList}>
              {[
                { icon: '📋', label: 'Nova Avaliação', color: 'blue' },
                { icon: '💪', label: 'Criar Programa', color: 'cyan' },
                { icon: '📊', label: 'Gerar Relatório', color: 'green' },
                { icon: '📱', label: 'Enviar Lembrete', color: 'purple' }
              ].map((action, i) => (
                <button 
                  key={i}
                  className={styles.actionButton}
                >
                  <div className={`${styles.actionIcon} ${styles[`actionIcon${action.color.charAt(0).toUpperCase() + action.color.slice(1)}`]}`}>
                    {action.icon}
                  </div>
                  <span className={styles.actionLabel}>{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className={styles.mainPanel}>
          {/* Patient Overview */}
          <div className={styles.patientOverview}>
            <div className={styles.overviewHeader}>
              <div>
                <h3 className={styles.overviewTitle}>Visão do Paciente</h3>
                <div className={styles.patientHeader}>
                  <div className={styles.patientHeaderAvatar}>
                    {patientStats.initials}
                  </div>
                  <div>
                    <div className={styles.patientHeaderName}>{patientStats.name}</div>
                    <div className={styles.patientHeaderSubtitle}>Paciente desde Nov 2024</div>
                  </div>
                </div>
              </div>
              <div className={styles.tabNavigation}>
                {['overview', 'sessions', 'exercises', 'reports'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`${styles.tabButton} ${activeTab === tab ? styles.tabButtonActive : ''}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Metrics Grid */}
            <div className={styles.metricsGrid}>
              <div className={`${styles.metricCard} ${styles.metricCardBlue}`}>
                <div className={styles.metricValue}>{patientStats.adherence}%</div>
                <div className={styles.metricLabel}>Adesão</div>
                <div className={styles.metricTrend}>↑ 5% este mês</div>
              </div>
              <div className={`${styles.metricCard} ${styles.metricCardGreen}`}>
                <div className={styles.metricValue}>{patientStats.painLevel}/10</div>
                <div className={styles.metricLabel}>Nível de Dor</div>
                <div className={styles.metricTrend}>↓ 3 pontos</div>
              </div>
              <div className={`${styles.metricCard} ${styles.metricCardCyan}`}>
                <div className={styles.metricValue}>{patientStats.sessionsCompleted}</div>
                <div className={styles.metricLabel}>Sessões</div>
                <div className={styles.metricTrend}>12 de 16 planejadas</div>
              </div>
              <div className={`${styles.metricCard} ${styles.metricCardPurple}`}>
                <div className={styles.metricValue}>{patientStats.progress}%</div>
                <div className={styles.metricLabel}>Progresso Geral</div>
                <div className={styles.metricTrend}>Meta: 80%</div>
              </div>
            </div>

            {/* Chart Placeholder */}
            <div className={styles.progressChart}>
              <div className={styles.chartHeader}>
                <h4 className={styles.chartTitle}>Progresso ao Longo do Tempo</h4>
                <div className={styles.timeRange}>
                  {['7d', '30d', '90d', '1a'].map((range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`${styles.rangeButton} ${timeRange === range ? styles.rangeButtonActive : ''}`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
              <div className={styles.chartContainer}>
                <div className={styles.chartPlaceholderContent}>
                  <div className={styles.chartIconLarge}>📊</div>
                  <div className={styles.chartDescription}>Gráfico interativo de progresso</div>
                  <div className={styles.chartSubtitle}>
                    Mostrando dados dos últimos {timeRange === '7d' ? '7 dias' : timeRange === '30d' ? '30 dias' : timeRange === '90d' ? '90 dias' : '1 ano'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity & Programs */}
          <div className={styles.activityGrid}>
            {/* Recent Sessions */}
            <div className={styles.recentSessions}>
              <h4 className={styles.cardTitle}>Sessões Recentes</h4>
              <div className={styles.sessionsList}>
                {RECENT_SESSIONS.map((session) => (
                  <div key={session.id} className={styles.sessionItem}>
                    <div className={styles.sessionInfo}>
                      <div className={`${styles.sessionIcon} ${session.completed ? styles.sessionCompleted : styles.sessionPending}`}>
                        {session.completed ? '✓' : '→'}
                      </div>
                      <div>
                        <div className={styles.sessionType}>{session.type}</div>
                        <div className={styles.sessionTime}>{session.date} • {session.time}</div>
                      </div>
                    </div>
                    <div className={`${styles.sessionStatus} ${session.status === 'completed' ? styles.statusCompleted : styles.statusScheduled}`}>
                      {session.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Exercise Programs */}
            <div className={styles.exercisePrograms}>
              <div className={styles.programsHeader}>
                <h4 className={styles.cardTitle}>Programas de Exercício</h4>
                <button className={styles.viewAllButton}>
                  Ver Todos →
                </button>
              </div>
              <div className={styles.programsList}>
                {SAMPLE_PROGRAMS.map((program) => (
                  <div key={program.id} className={styles.programCard}>
                    <div className={styles.programContent}>
                      <div>
                        <div className={styles.programTitle}>{program.title}</div>
                        <div className={styles.programDescription}>{program.desc}</div>
                        <div className={styles.programMeta}>
                          <span className={styles.programDuration}>⏱️ {program.duration}</span>
                          <span className={styles.programProgress}>📊 {program.progress}% completo</span>
                        </div>
                      </div>
                      <div className={styles.programActions}>
                        <button className={styles.programViewButton}>
                          Ver
                        </button>
                        <button className={styles.programApplyButton}>
                          Aplicar
                        </button>
                      </div>
                    </div>
                    <div className={styles.progressBar}>
                      <div 
                        className={styles.progressFill}
                        style={{ width: `${program.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// StatCard Component
function StatCard({ title, value, change, icon, color }) {
  const colorClass = {
    blue: styles.statCardBlue,
    cyan: styles.statCardCyan,
    green: styles.statCardGreen,
    orange: styles.statCardOrange
  }[color] || styles.statCardBlue;

  return (
    <div className={`${styles.statCard} ${colorClass}`}>
      <div className={styles.statCardContent}>
        <div>
          <div className={styles.statCardValue}>{value}</div>
          <div className={styles.statCardTitle}>{title}</div>
        </div>
        <div className={styles.statIcon}>
          {icon}
        </div>
      </div>
      <div className={`${styles.statChange} ${change.startsWith('+') ? styles.statChangePositive : styles.statChangeNegative}`}>
        {change} vs. último mês
      </div>
    </div>
  );
}

// Footer Component
function Footer() {
  const FOOTER_LINKS = [
    {
      title: 'Produto',
      links: ['Recursos', 'Planos', 'Atualizações', 'Segurança', 'Integrações']
    },
    {
      title: 'Recursos',
      links: ['Documentação', 'Blog', 'Webinars', 'Tutoriais', 'API']
    },
    {
      title: 'Empresa',
      links: ['Sobre', 'Carreiras', 'Contato', 'Termos', 'Privacidade']
    }
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerGrid}>
          <div className={styles.footerBrand}>
            <div className={styles.footerLogo}>
              <div className={styles.footerLogoIcon}>RF</div>
              <div>
                <div className={styles.footerBrandName}>RehabFlow Pro</div>
                <div className={styles.footerBrandTagline}>Reabilitação Inteligente</div>
              </div>
            </div>
            <p className={styles.footerDescription}>
              Plataforma completa para profissionais de saúde transformarem suas práticas clínicas.
            </p>
          </div>

          {FOOTER_LINKS.map((section) => (
            <div key={section.title} className={styles.footerSection}>
              <h5 className={styles.footerSectionTitle}>{section.title}</h5>
              <ul className={styles.footerLinks}>
                {section.links.map((link) => (
                  <li key={link}>
                    <a href="#" className={styles.footerLink}>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={styles.footerBottom}>
          <div className={styles.copyright}>
            © {new Date().getFullYear()} RehabFlow Pro. Todos os direitos reservados.
          </div>
          <div className={styles.compliance}>
            <span className={styles.complianceText}>LGPD Compliant</span>
            <span className={styles.separator}>•</span>
            <span className={styles.complianceText}>Certificado de Segurança</span>
          </div>
        </div>
      </div>
    </footer>
  );
}