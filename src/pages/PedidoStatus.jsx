import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const STATUS_MAP = {
  sucesso: {
    icon: "check_circle",
    color: "text-primary",
    title: "Pagamento aprovado!",
    message:
      "Recebemos a confirmação do seu pagamento. Em breve você receberá um e-mail com os detalhes do pedido."
  },
  pendente: {
    icon: "schedule",
    color: "text-amber-600",
    title: "Pagamento pendente",
    message:
      "Seu pagamento está em processamento. Assim que for confirmado, avisaremos por e-mail. Boletos e Pix podem levar alguns minutos."
  },
  falha: {
    icon: "cancel",
    color: "text-error",
    title: "Pagamento não concluído",
    message:
      "Não foi possível concluir o pagamento. Nenhum valor foi cobrado. Você pode tentar novamente quando quiser."
  }
};

export default function PedidoStatus() {
  const { status } = useParams();
  const info = STATUS_MAP[status] || STATUS_MAP.pendente;
  const { clear } = useCart();

  // Limpa o carrinho quando o pagamento é aprovado.
  useEffect(() => {
    if (status === "sucesso") clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <div className="bg-background min-h-screen flex flex-col items-center justify-center font-body py-20 px-6 text-center">
      <span className={`material-symbols-outlined text-7xl mb-4 ${info.color}`}>{info.icon}</span>
      <h1 className="font-playfair text-2xl md:text-3xl font-bold text-on-surface mb-3">
        {info.title}
      </h1>
      <p className="text-on-surface-variant max-w-md mb-8 leading-relaxed">{info.message}</p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to="/catalogo"
          className="bg-primary text-on-primary px-8 py-3 rounded-full font-body text-xs font-semibold tracking-widest uppercase hover:bg-primary/90 transition-colors"
        >
          Voltar ao catálogo
        </Link>
        <Link
          to="/"
          className="border border-primary text-primary px-8 py-3 rounded-full font-body text-xs font-semibold tracking-widest uppercase hover:bg-primary-container transition-colors"
        >
          Página inicial
        </Link>
      </div>
    </div>
  );
}
