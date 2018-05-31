# Laboratório de Aplicações com Interface Gráfica  

MIEIC – 2017/2018 

## Trabalho 3 – Interface 3D de um jogo 

O presente documento enuncia os aspetos gerais a desenvolver nas interfaces gráficas para os jogos propostos na disciplina de Programação em Lógica. A interface gráfica para o jogo escolhido por cada grupo será desenvolvida durante as aulas práticas da unidade curricular Laboratório de Aplicações com Interface Gráfica, utilizando a linguagem JavaScript e com recurso à tecnologia WebGL. 

### Criação da Cena de Jogo
A generalidade dos jogos propostos tem por base um tabuleiro de jogo. Desenvolva um tabuleiro adequado ao jogo escolhido. 

Em alguns casos existem peças que podem ser retiradas ou inseridas durante o decorrer do jogo. As peças NÃO devem simplesmente aparecer ou desaparecer. Considere um tabuleiro (estrutura) auxiliar para suporte dessas peças, de/para onde as peças se movem. 

### Modelação e movimento das peças de jogo
Modele as peças necessárias ao jogo, somente com os pormenores julgados necessários. No caso do jogo de xadrez, por hipótese, não seria exigida uma modelação das peças próxima da real, podendo ser reduzida para peças de formato simplificado, com aplicação de texturas adequadas. 

O movimento das peças deve ser feito do seguinte modo (a adaptar em casos de jogos com mecânicas substancialmente diferentes): 
Humano: com um click do rato seleciona a peça a mover; com um novo click numa casa do tabuleiro, designa a posição de destino; a peça deve mover-se segundo uma animação, possivelmente em arco, de forma a não atravessar outras peças.
Computador: deve ser efetuada a trajetória (animação) entre as posições origem e destino.

###  Visualização
#### Iluminação
Adicione as fontes de luz adequadas para iluminar a cena, de forma a dar um aspeto realista à mesma. 
#### Ambientes de jogo
Implemente um conjunto de ambientes pré-definidos, permitindo que o utilizador possa escolher um de entre vários temas. A diferentes ambientes devem corresponder diferentes geometrias, podendo ser usado o parser de LSX e diferentes ficheiros LSX para esse efeito. 

### Funcionalidades genéricas do jogo
Construa uma interface utilizando as opções de GUI da WebCGF, ou criando objetos seleccionáveis, e que contemple (pelo menos) as seguintes opções: 
-Nível de dificuldade.
-Tipo de jogo (Humano/Máquina, H/H, M/M).
-Undo, i.e. possibilidade de anular a última ou últimas jogadas.
-Rodar a câmara entre pontos de vista pré-definidos (no mínimo dois) - NOTA: a transição entre pontos de vista deve ser animada, e não apenas a troca instantânea de ponto de vista.
### Outras funcionalidades
#### Marcador
Acrescente à cena um marcador para registar os resultados do jogo. Mesmo que as regras do jogo original não contemplem uma pontuação, há sempre algo que pode ser contabilizado, como por exemplo número de peças ganhas, ou simplesmente número de jogos ganhos. O marcador também pode incluir o relógio que conta o tempo (ver 5.3). 
#### Filme do jogo
Guarde a sequência de jogadas efetuadas de forma a poder reproduzi-las através de uma animação sem interação (repetição de um conjunto de jogadas). 
#### Medição do tempo de jogo
Acrescente a facilidade de definir e controlar o tempo máximo para efetuar uma jogada. Esse tempo deve ser visível para os jogadores, e quando terminar o jogador deve perder a vez ou perder o jogo (dependendo do tipo de jogo). 

