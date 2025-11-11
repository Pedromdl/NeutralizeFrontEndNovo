import React from "react";

export default function PoliticaPrivacidade() {
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
          Política de Privacidade — Neutralize Hub
        </h1>

        <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "2rem" }}>
          Última atualização: 03 de novembro de 2025
        </p>

        <p>
          Bem-vindo à <strong>Neutralize Hub</strong> (“Plataforma”, “nós”, “nosso”).
          Esta Política de Privacidade explica como coletamos, usamos e protegemos os
          dados dos nossos usuários e pacientes.
        </p>

        <h2 className="title-h3 mt-6" style={{ marginTop: "2rem" }}>
          1. Informações que Coletamos
        </h2>
        <ul style={{ paddingLeft: "1.2rem", listStyle: "disc", color: "#334155" }}>
          <li>Nome, e-mail, CPF, telefone e endereço;</li>
          <li>Dados de desempenho físico, agendamentos e avaliações;</li>
          <li>Dados obtidos via <strong>Google Ads API</strong>;</li>
          <li>Informações técnicas (IP, navegador, data e hora de acesso).</li>
        </ul>

        <h2 className="title-h3 mt-6" style={{ marginTop: "2rem" }}>
          2. Uso das Informações
        </h2>
        <p>Usamos os dados para:</p>
        <ul style={{ paddingLeft: "1.2rem", listStyle: "disc", color: "#334155" }}>
          <li>Gerenciar o acesso à plataforma;</li>
          <li>Gerar relatórios e métricas de desempenho;</li>
          <li>Exibir informações provenientes da Google Ads API;</li>
          <li>Enviar comunicações relevantes.</li>
        </ul>

        <h2 className="title-h3 mt-6" style={{ marginTop: "2rem" }}>
          3. Compartilhamento de Dados
        </h2>
        <p>
          Não vendemos seus dados. Podemos compartilhá-los apenas com:
        </p>
        <ul style={{ paddingLeft: "1.2rem", listStyle: "disc", color: "#334155" }}>
          <li>Google LLC (integração via Google Ads API);</li>
          <li>Serviços de hospedagem seguros;</li>
          <li>Autoridades legais, quando exigido.</li>
        </ul>

        <h2 className="title-h3 mt-6" style={{ marginTop: "2rem" }}>
          4. Integração com Google Ads API
        </h2>
        <p>
          A Neutralize Hub utiliza a Google Ads API para conectar contas de publicidade
          e acessar métricas de campanhas.
        </p>
        <p>
          Você pode revogar o acesso a qualquer momento em{" "}
          <a
            href="https://myaccount.google.com/permissions"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#2563eb", textDecoration: "underline" }}
          >
            myaccount.google.com/permissions
          </a>
          .
        </p>

        <h2 className="title-h3 mt-6" style={{ marginTop: "2rem" }}>
          5. Armazenamento e Segurança
        </h2>
        <p>
          Adotamos práticas seguras de armazenamento, criptografia e controle de acesso
          para proteger as informações pessoais de todos os usuários.
        </p>

        <h2 className="title-h3 mt-6" style={{ marginTop: "2rem" }}>
          6. Direitos do Usuário (LGPD)
        </h2>
        <ul style={{ paddingLeft: "1.2rem", listStyle: "disc", color: "#334155" }}>
          <li>Acessar, corrigir ou excluir informações pessoais;</li>
          <li>Revogar consentimentos;</li>
          <li>Solicitar confirmação de tratamento de dados.</li>
        </ul>
        <p>
          Contato:{" "}
          <a
            href="mailto:pedromartinsdl@gmail.com"
            style={{ color: "#2563eb", textDecoration: "underline" }}
          >
            pedromartinsdl@gmail.com
          </a>
        </p>

        <h2 className="title-h3 mt-6" style={{ marginTop: "2rem" }}>
          7. Alterações desta Política
        </h2>
        <p>
          Atualizações serão publicadas em{" "}
          <strong>hub.neutralizeft.com.br/politica-de-privacidade</strong>.
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
