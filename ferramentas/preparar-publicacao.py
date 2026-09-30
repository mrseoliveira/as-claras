# Prepara a página principal para publicar como Claude Artifact:
# tira doctype/html/head/body (a publicação acrescenta-os) e mantém título, estilos e scripts.
# Uso: python3 ferramentas/preparar-publicacao.py <pasta de saída>
import re, sys, pathlib
raiz = pathlib.Path(__file__).resolve().parent.parent
s = (raiz / 'index.html').read_text()
cabeca = re.search(r'<head>(.*?)</head>', s, re.S).group(1)
corpo = re.search(r'<body>(.*?)</body>', s, re.S).group(1)
cabeca = re.sub(r'\s*<meta[^>]*>', '', cabeca)   # charset e viewport já vêm da publicação
saida = pathlib.Path(sys.argv[1]); saida.mkdir(parents=True, exist_ok=True)
(saida / 'index.html').write_text(cabeca.strip() + '\n\n' + corpo.strip() + '\n')
print('escrito', saida / 'index.html')
