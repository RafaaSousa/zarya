import React from "react";
import { Link } from "react-router-dom";

const LAST_UPDATE = "Julho de 2026";

export default function TermosDeUso() {
  return (
    <section className="bg-background text-on-surface">
      <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-16 md:py-24">
        {/* Cabeçalho */}
        <div className="mb-12 border-b border-outline-variant/40 pb-8">
          <p className="font-body text-xs font-bold text-primary uppercase tracking-wider mb-3">
            Legal
          </p>
          <h1 className="font-playfair text-4xl md:text-5xl font-normal text-on-surface mb-4">
            Termos de Uso
          </h1>
          <p className="font-body text-sm text-on-surface-variant">
            Última atualização: {LAST_UPDATE}
          </p>
        </div>

        {/* Conteúdo */}
        <div className="flex flex-col gap-10">
          <p className="font-body text-base leading-relaxed text-on-surface-variant">
            Bem-vindo ao site da <strong className="text-on-surface">Zaryá Ótica</strong>. Ao
            acessar e utilizar este site, você concorda com os termos e condições descritos
            abaixo. Recomendamos a leitura atenta deste documento. Caso não concorde com
            qualquer disposição, solicitamos que não utilize o site.
          </p>

          <Section number="1" title="Aceitação dos termos">
            <p>
              O uso deste site implica a aceitação integral e sem reservas destes Termos de
              Uso, bem como da nossa{" "}
              <Link
                to="/politica-de-privacidade"
                className="text-primary font-semibold hover:text-on-primary-container transition-colors"
              >
                Política de Privacidade
              </Link>
              . A Zaryá Ótica reserva-se o direito de alterar estes termos a qualquer momento,
              cabendo ao usuário verificá-los periodicamente.
            </p>
          </Section>

          <Section number="2" title="Objeto do site">
            <p>
              Este site tem por finalidade apresentar os serviços e produtos da Zaryá Ótica,
              incluindo saúde visual corporativa, exames de acuidade, ótica móvel, palestras
              educativas e o catálogo de armações e lentes, além de disponibilizar canais de
              contato para atendimento.
            </p>
          </Section>

          <Section number="3" title="Uso adequado">
            <p>Ao utilizar este site, o usuário compromete-se a:</p>
            <ul className="list-disc pl-6 flex flex-col gap-2 mt-3">
              <li>Fornecer informações verdadeiras, precisas e atualizadas;</li>
              <li>
                Não utilizar o site para fins ilícitos, fraudulentos ou que violem direitos
                de terceiros;
              </li>
              <li>
                Não realizar tentativas de acesso não autorizado, interferência ou danos aos
                sistemas e servidores;
              </li>
              <li>
                Respeitar os direitos de propriedade intelectual da Zaryá Ótica e de
                terceiros.
              </li>
            </ul>
          </Section>

          <Section number="4" title="Catálogo, produtos e informações">
            <p>
              As informações de produtos, imagens, descrições e disponibilidade apresentadas
              no catálogo têm caráter meramente informativo e podem sofrer alterações sem
              aviso prévio. Eventuais valores, condições e disponibilidade devem ser
              confirmados diretamente com a nossa equipe de atendimento. A escolha de armações
              e lentes não substitui a avaliação de um profissional de saúde ocular.
            </p>
          </Section>

          <Section number="5" title="Propriedade intelectual">
            <p>
              Todo o conteúdo deste site — incluindo textos, imagens, logotipos, marcas,
              layout e elementos gráficos — é de propriedade da Zaryá Ótica ou de seus
              licenciadores, sendo protegido pela legislação de propriedade intelectual. É
              vedada a reprodução, distribuição ou utilização, total ou parcial, sem
              autorização prévia e por escrito.
            </p>
          </Section>

          <Section number="6" title="Links para sites de terceiros">
            <p>
              Este site pode conter links para sites e serviços de terceiros, como WhatsApp e
              redes sociais. A Zaryá Ótica não se responsabiliza pelo conteúdo, políticas ou
              práticas desses sites, cujo acesso é de responsabilidade exclusiva do usuário.
            </p>
          </Section>

          <Section number="7" title="Limitação de responsabilidade">
            <p>
              A Zaryá Ótica empenha-se em manter as informações do site corretas e
              atualizadas, mas não garante a ausência de erros, interrupções ou
              indisponibilidades. O uso do site é de responsabilidade do usuário, não se
              responsabilizando a Zaryá Ótica por eventuais danos decorrentes do acesso ou da
              impossibilidade de acesso.
            </p>
          </Section>

          <Section number="8" title="Proteção de dados">
            <p>
              O tratamento de dados pessoais realizado por meio deste site observa a Lei Geral
              de Proteção de Dados (LGPD) e está detalhado em nossa{" "}
              <Link
                to="/politica-de-privacidade"
                className="text-primary font-semibold hover:text-on-primary-container transition-colors"
              >
                Política de Privacidade
              </Link>
              .
            </p>
          </Section>

          <Section number="9" title="Alterações dos termos">
            <p>
              A Zaryá Ótica poderá modificar estes Termos de Uso a qualquer momento, sendo as
              alterações válidas a partir da sua publicação nesta página. A data de última
              atualização acima indicará a versão vigente.
            </p>
          </Section>

          <Section number="10" title="Foro e legislação aplicável">
            <p>
              Estes Termos de Uso são regidos pela legislação brasileira. Fica eleito o foro
              da comarca de São Paulo/SP para dirimir quaisquer questões decorrentes deste
              documento, com renúncia a qualquer outro, por mais privilegiado que seja.
            </p>
          </Section>

          <Section number="11" title="Contato">
            <p>
              Em caso de dúvidas sobre estes Termos de Uso, entre em contato conosco:
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
            to="/politica-de-privacidade"
            className="font-body text-sm text-on-surface-variant hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary rounded w-fit"
          >
            Política de Privacidade →
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
