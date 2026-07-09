import React from "react";
import { Link } from "react-router-dom";

const LAST_UPDATE = "Julho de 2026";

export default function PoliticaPrivacidade() {
  return (
    <section className="bg-background text-on-surface">
      <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-16 md:py-24">
        {/* Cabeçalho */}
        <div className="mb-12 border-b border-outline-variant/40 pb-8">
          <p className="font-body text-xs font-bold text-primary uppercase tracking-wider mb-3">
            Legal
          </p>
          <h1 className="font-playfair text-4xl md:text-5xl font-normal text-on-surface mb-4">
            Política de Privacidade
          </h1>
          <p className="font-body text-sm text-on-surface-variant">
            Última atualização: {LAST_UPDATE}
          </p>
        </div>

        {/* Conteúdo */}
        <div className="flex flex-col gap-10">
          <p className="font-body text-base leading-relaxed text-on-surface-variant">
            A <strong className="text-on-surface">Zaryá Ótica</strong> valoriza a
            privacidade e a proteção dos dados pessoais de seus clientes, parceiros e
            visitantes. Esta Política de Privacidade descreve como coletamos, utilizamos,
            armazenamos e protegemos as suas informações, em conformidade com a Lei nº
            13.709/2018 (Lei Geral de Proteção de Dados Pessoais — LGPD).
          </p>

          <Section number="1" title="Quem somos">
            <p>
              A Zaryá Ótica é uma empresa voltada à saúde visual corporativa, oferecendo
              exames de acuidade, ótica móvel, palestras educativas e a comercialização de
              armações e lentes. Para fins desta política, a Zaryá Ótica atua como
              controladora dos dados pessoais coletados por meio deste site e de seus canais
              de atendimento.
            </p>
          </Section>

          <Section number="2" title="Dados que coletamos">
            <p>Podemos coletar as seguintes categorias de dados:</p>
            <ul className="list-disc pl-6 flex flex-col gap-2 mt-3">
              <li>
                <strong className="text-on-surface">Dados de identificação e contato:</strong>{" "}
                nome, e-mail, telefone e empresa, informados voluntariamente ao entrar em
                contato conosco por formulários, e-mail ou WhatsApp.
              </li>
              <li>
                <strong className="text-on-surface">Dados de navegação:</strong> informações
                técnicas como endereço IP, tipo de navegador, páginas acessadas e tempo de
                permanência, coletadas por meio de cookies e tecnologias similares.
              </li>
              <li>
                <strong className="text-on-surface">Dados de interesse comercial:</strong>{" "}
                produtos visualizados no catálogo e preferências manifestadas durante o
                atendimento.
              </li>
            </ul>
          </Section>

          <Section number="3" title="Como utilizamos os seus dados">
            <p>Utilizamos os dados coletados para as seguintes finalidades:</p>
            <ul className="list-disc pl-6 flex flex-col gap-2 mt-3">
              <li>Responder solicitações, dúvidas e pedidos de orçamento;</li>
              <li>Realizar o atendimento e a prestação dos nossos serviços;</li>
              <li>Aprimorar a experiência de navegação e o funcionamento do site;</li>
              <li>
                Enviar comunicações sobre produtos, serviços e novidades, quando autorizado;
              </li>
              <li>Cumprir obrigações legais e regulatórias.</li>
            </ul>
          </Section>

          <Section number="4" title="Base legal para o tratamento">
            <p>
              O tratamento dos seus dados pessoais fundamenta-se nas hipóteses previstas na
              LGPD, especialmente no consentimento do titular, na execução de contrato, no
              cumprimento de obrigação legal e no legítimo interesse da Zaryá Ótica, sempre
              respeitando os seus direitos e liberdades fundamentais.
            </p>
          </Section>

          <Section number="5" title="Compartilhamento de dados">
            <p>
              A Zaryá Ótica não vende os seus dados pessoais. O compartilhamento ocorre
              apenas quando necessário para a prestação dos serviços, com fornecedores e
              parceiros que atuam em nosso nome (como provedores de tecnologia e hospedagem),
              ou quando exigido por lei ou autoridade competente. Nesses casos, exigimos que
              tais parceiros adotem medidas de proteção compatíveis com esta política.
            </p>
          </Section>

          <Section number="6" title="Cookies">
            <p>
              Utilizamos cookies para garantir o funcionamento adequado do site, analisar o
              desempenho e personalizar a sua experiência. Você pode gerenciar ou desativar os
              cookies nas configurações do seu navegador, ciente de que isso pode afetar
              algumas funcionalidades.
            </p>
          </Section>

          <Section number="7" title="Armazenamento e segurança">
            <p>
              Adotamos medidas técnicas e administrativas apropriadas para proteger os seus
              dados contra acessos não autorizados, perda, alteração ou divulgação indevida.
              Os dados são mantidos apenas pelo tempo necessário ao cumprimento das
              finalidades para as quais foram coletados ou de obrigações legais.
            </p>
          </Section>

          <Section number="8" title="Seus direitos como titular">
            <p>Nos termos da LGPD, você pode, a qualquer momento, solicitar:</p>
            <ul className="list-disc pl-6 flex flex-col gap-2 mt-3">
              <li>Confirmação da existência de tratamento e acesso aos seus dados;</li>
              <li>Correção de dados incompletos, inexatos ou desatualizados;</li>
              <li>Anonimização, bloqueio ou eliminação de dados desnecessários;</li>
              <li>Portabilidade dos dados a outro fornecedor;</li>
              <li>Revogação do consentimento e eliminação dos dados tratados com base nele.</li>
            </ul>
          </Section>

          <Section number="9" title="Alterações desta política">
            <p>
              Esta Política de Privacidade poderá ser atualizada periodicamente. Sempre que
              houver alterações relevantes, a data de atualização acima será revisada.
              Recomendamos a consulta regular desta página.
            </p>
          </Section>

          <Section number="10" title="Contato">
            <p>
              Para exercer os seus direitos ou esclarecer dúvidas sobre esta política, entre
              em contato conosco:
            </p>
            <ul className="flex flex-col gap-2 mt-3">
              <li>
                E-mail:{" "}
                <a
                  href="mailto:atendimento@zaryaotica.com.br"
                  className="text-primary font-semibold hover:text-on-primary-container transition-colors"
                >
                  atendimento@zaryaotica.com.br
                </a>
              </li>
              <li>
                Telefone:{" "}
                <a
                  href="tel:+5511931502102"
                  className="text-primary font-semibold hover:text-on-primary-container transition-colors"
                >
                  (11) 93150-2102
                </a>
              </li>
            </ul>
          </Section>
        </div>

        {/* Rodapé de navegação */}
        <div className="mt-16 pt-8 border-t border-outline-variant/40 flex flex-col sm:flex-row gap-4 justify-between">
          <Link
            to="/"
            className="font-body text-sm text-primary font-semibold hover:text-on-primary-container transition-colors focus-visible:ring-2 focus-visible:ring-primary rounded w-fit"
          >
            ← Voltar ao início
          </Link>
          <Link
            to="/termos-de-uso"
            className="font-body text-sm text-on-surface-variant hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary rounded w-fit"
          >
            Termos de Uso →
          </Link>
        </div>
      </div>
    </section>
  );
}

function Section({ number, title, children }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-playfair text-2xl font-normal text-on-surface">
        <span className="text-primary">{number}.</span> {title}
      </h2>
      <div className="font-body text-base leading-relaxed text-on-surface-variant">
        {children}
      </div>
    </div>
  );
}
