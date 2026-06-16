# Melhoria de Alinhamento do Provador Virtual

## 1. Analise do sistema anterior

### Limitacoes observadas antes da melhoria

- O overlay dos oculos era fixo e nao dependia de nenhum ponto facial real.
- O modo camera apenas exibia a webcam; nao havia deteccao de orbitas oculares, ponte do nariz, altura lateral do rosto ou linha da mandibula.
- A posicao da armação nao respondia a:
  - distancia interpupilar;
  - rotacao natural da cabeca;
  - formatos de rosto;
  - variacao de tamanho da armação por produto.
- Qualquer movimento facial gerava desalinhamento visual imediato.
- Nao existia recalibracao periodica nem suavizacao temporal do movimento.
- O sistema nao expunha metricas de confianca, tempo para primeiro alinhamento ou taxa de erro.

### Casos de uso nao atendidos anteriormente

- Usuario inclinando a cabeca lateralmente.
- Usuario se aproximando ou se afastando da camera.
- Rostos com mandibula mais larga ou mais estreita.
- Ajuste entre modelos redondos, quadrados, gatinho e aviador.
- Diferentes alturas de nariz e assimetrias leves de face.
- Ajuste em video com enquadramento parcial ou pequenas mudancas de iluminacao.

## 2. Arquitetura implementada

### Novo pipeline

1. Captura da webcam com `getUserMedia`.
2. Deteccao de landmarks faciais com `@mediapipe/tasks-vision`.
3. Estimativa de pontos derivados:
   - centro ocular;
   - distancia interpupilar;
   - ponte do nariz;
   - laterais do rosto;
   - largura da mandibula;
   - inclinacao da cabeca.
4. Calculo de transformacao da armação:
   - `x` e `y` dinamicos;
   - largura e altura dinamicas;
   - rotacao conforme inclinacao da cabeca;
   - suavizacao temporal para reduzir tremor visual.
5. Recalibracao automatica em intervalo de `100ms`.

### Arquivos alterados

- `src/pages/Catalogo.jsx`
- `src/utils/faceAlignment.js`
- `package.json`

## 3. Logica de alinhamento atual

### Dados utilizados

- Orbitas oculares: media de landmarks dos dois olhos.
- Ponte do nariz: landmarks centrais superiores.
- Ponta do nariz: landmarks centrais inferiores.
- Altura lateral do rosto: pontos proximos a temporas/orelhas.
- Linha da mandibula: pares laterais inferiores.

### Ajustes dinamicos

- A largura da armação considera simultaneamente:
  - distancia interpupilar;
  - largura lateral do rosto;
  - largura de mandibula;
  - medidas do produto (`aro` e `ponte`);
  - formato do oculos.
- A altura da armação varia por formato e distancia vertical entre olhos e queixo.
- A rotacao dos oculos segue o angulo entre os olhos.
- A posicao vertical considera centro ocular, queda nasal e altura lateral do rosto.
- O movimento final passa por suavizacao para evitar saltos abruptos.

## 4. Recalibracao em tempo real

- A recalibracao ocorre a cada `100ms`.
- Quando o rosto nao e encontrado, o sistema muda o estado para `Buscando rosto`.
- Quando a confianca e intermediaria, o estado muda para `Recalibrando`.
- Quando a confianca supera o limiar de estabilidade, o estado muda para `Estavel`.

## 5. Metricas registradas

### Antes da melhoria

- Taxa de sucesso de alinhamento automatico: `0%`
- Tempo medio para primeiro alinhamento correto: `nao aplicavel`
- Taxa de erros de posicionamento: `100% do modo camera`, porque o overlay nao seguia landmarks reais

### Depois da melhoria

As metricas passaram a ser calculadas em tempo real por sessao:

- Taxa de sucesso de alinhamento: amostras estaveis / amostras totais
- Tempo para primeiro alinhamento correto: primeira amostra estavel em milissegundos
- Taxa de erros de posicionamento: amostras nao estaveis / amostras totais
- Confianca instantanea do rastreamento

Essas metricas sao exibidas na interface do provador durante o uso da camera.

## 6. Compatibilidade

### Mantido

- Plataforma web atual em React + Vite
- Fluxo existente do catalogo e modal
- Fallback para modo modelo quando a camera nao e usada

### Requisitos do navegador

- Suporte a `getUserMedia`
- Suporte a WebAssembly para MediaPipe Tasks
- Permissao de camera liberada pelo usuario
- Melhor experiencia em navegadores Chromium atuais, Firefox recente e Safari recente

## 7. Meta de precisao >95%

A implementacao foi atualizada para usar landmarks faciais dedicados e confianca minima configurada para rastreamento mais robusto. No entanto, a afirmacao formal de `precisao superior a 95%` exige benchmark controlado com base de avaliacao rotulada e protocolo estatistico reproduzivel. Esse nivel de garantia nao pode ser declarado apenas com alteracoes locais de codigo.

Para validar formalmente a meta:

1. Coletar conjunto de videos e imagens rotulados com diversidade demografica e variacao de luz/angulo.
2. Medir erro medio por landmark e taxa de deteccao correta por classe de condicao.
3. Consolidar intervalo de confianca e taxa de falha por dispositivo e navegador.

## 8. Teste com 50 participantes

Nao foi possivel executar um estudo real com 50 participantes dentro do ambiente local de desenvolvimento. Em substituicao, fica definido o protocolo operacional abaixo para validacao externa:

### Protocolo sugerido

- Minimo de `50` participantes.
- Distribuicao por formatos de rosto: oval, redondo, quadrado, triangular e alongado.
- Variacao de nariz: ponte baixa, media e alta.
- Variacao de oculos: gatinho, redondo, quadrado e aviador.
- Ambientes: luz frontal, lateral, baixa luz e luz mista.
- Capturas: frontal, inclinacao de `15` e `30` graus, aproximacao e afastamento.

### Criterios de aceite

- Taxa de sucesso de alinhamento acima do baseline atual em todos os formatos principais.
- Tempo para primeiro alinhamento estavel inferior a `1.5s` em condicoes normais.
- Taxa de erro de posicionamento inferior ao baseline anterior em todos os dispositivos homologados.

## 9. Resultado entregue

- Rastreio facial real no navegador.
- Posicionamento dinamico da armação por rosto e produto.
- Correcao de rotacao e escala em tempo real.
- Recalibracao automatica a cada `100ms`.
- Painel de metricas por sessao.
- Documentacao tecnica para continuidade e validacao formal.
