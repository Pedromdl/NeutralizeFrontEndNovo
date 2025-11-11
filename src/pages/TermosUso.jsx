import React from "react";

export default function TermosUso() {
  return (
    <div className="conteudo">
      <div
        className="card card-xl"
        style={{
          textAlign: "left",
          maxWidth: "900px",
          margin: "0 auto",
          lineHeight: "1.7",
          padding: "3rem",
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            color: "#1e293b",
            marginBottom: "0.5rem",
          }}
        >
          Termos de Uso — Neutralize Hub
        </h1>

        <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "2rem" }}>
          Última atualização: 03 de novembro de 2025
        </p>

        <p>
          Estes Termos regulam o acesso e uso da plataforma{" "}
          <strong>Neutralize Hub</strong> (“Serviço”), sediada em Florianópolis/SC.
        </p>

        <h2 className="title-h3 mt-6" style={{ marginTop: "2rem" }}>
          1. Aceitação dos Termos
        </h2>
        <p>
          Ao acessar ou usar a plataforma, você concorda integralmente com estes Termos
          e com a Política de Privacidade.
        </p>

        <h2 className="title-h3 mt-6" style={{ marginTop: "2rem" }}>
          2. Descrição do Serviço
        </h2>
        <ul style={{ paddingLeft: "1.2rem", listStyle: "disc", color: "#334155" }}>
          <li>Gestão de pacientes, treinos e agendamentos;</li>
          <li>Integração com o Google Ads para visualização de métricas;</li>
          <li>Geração de relatórios e acompanhamento de desempenho físico.</li>
        </ul>

        <h2 className="title-h3 mt-6" style={{ marginTop: "2rem" }}>
          3. Responsabilidade do Usuário
        </h2>
        <ul style={{ paddingLeft: "1.2rem", listStyle: "disc", color: "#334155" }}>
          <li>Fornecer informações corretas e atualizadas;</li>
          <li>Manter confidenciais suas credenciais de acesso;</li>
          <li>Usar o sistema de forma ética e conforme a lei.</li>
        </ul>

        <h2 className="title-h3 mt-6" style={{ marginTop: "2rem" }}>
          4. Integração com o Google Ads
        </h2>
        <p>
          Ao conectar sua conta Google Ads, você autoriza o uso dos dados de campanha
          exclusivamente para análise interna dentro da Neutralize Hub.
        </p>

        <h2 className="title-h3 mt-6" style={{ marginTop: "2rem" }}>
          5. Propriedade Intelectual
        </h2>
        <p>
          Todo o conteúdo, design e código são propriedade da{" "}
          <strong>Neutralize Hub</strong> e protegidos por direitos autorais.
        </p>

        <h2 className="title-h3 mt-6" style={{ marginTop: "2rem" }}>
          6. Limitação de Responsabilidade
        </h2>
        <p>
          A Neutralize Hub não se responsabiliza por falhas de terceiros (como o Google
          Ads) ou uso indevido da plataforma por parte dos usuários.
        </p>

        <h2 className="title-h3 mt-6" style={{ marginTop: "2rem" }}>
          7. Cancelamento
        </h2>
        <p>
          Você pode solicitar exclusão da sua conta via{" "}
          <a
            href="mailto:pedromartinsdl@gmail.com"
            style={{ color: "#2563eb", textDecoration: "underline" }}
          >
            pedromartinsdl@gmail.com
          </a>
          .
        </p>

        <h2 className="title-h3 mt-6" style={{ marginTop: "2rem" }}>
          8. Alterações dos Termos
        </h2>
        <p>
          Alterações serão publicadas em{" "}
          <strong>hub.neutralizeft.com.br/termos-de-uso</strong>.
        </p>

        <div
          style={{
            marginTop: "3rem",
            textAlign: "center",
            color: "#94a3b8",
            fontSize: "0.9rem",
          }}
        >
          © {new Date().getFullYear()} Neutralize Hub — Todos os direitos reservados.
        </div>
      </div>
    </div>
  );
}
