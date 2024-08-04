import markdown2
import pdfkit

# 读取Markdown文件
input_file_path = 'output.md'  # 请将路径替换为你的Markdown文件路径
with open(input_file_path, 'r', encoding='utf-8') as file:
    markdown_content = file.read()

# 将Markdown内容转换为HTML
html_content = markdown2.markdown(markdown_content)

# 创建一个HTML文件并添加样式
html_template = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {{
            font-family: 'Times New Roman', serif;
            line-height: 1.6;
            margin: 20px;
        }}
        h1 {{
            font-size: 32px;  /* 增大一级标题的字体大小 */
            margin-bottom: 10px;
        }}
        .definition {{
            font-size: 20px;  /* 增大定义部分的字体大小 */
            font-family: 'Arial', sans-serif;
            margin-bottom: 10px;
        }}
        .interpretation {{
            font-size: 20px;  /* 增大解释部分的字体大小 */
            font-family: 'Georgia', serif;
            margin-bottom: 10px;
        }}
        a {{
            font-size: 16px;  /* 增大链接的字体大小 */
            color: blue;
            text-decoration: none;
        }}
        .citation {{
            font-size: 16px;  /* 增大引用的字体大小 */
            font-family: 'Times New Roman', serif;
            margin-bottom: 10px;
        }}
    </style>
    <title>Document</title>
</head>
<body>
    {html_content}
</body>
</html>
"""
html_file_path = 'temp.html'
with open(html_file_path, 'w', encoding='utf-8') as file:
    file.write(html_template)

path_wkhtmltopdf = r'C:\\Program Files\\wkhtmltopdf\\bin\\wkhtmltopdf.exe'  # 请将路径替换为你的wkhtmltopdf路径
config = pdfkit.configuration(wkhtmltopdf=path_wkhtmltopdf)

# 将HTML文件转换为PDF
pdf_file_path = 'output.pdf'
pdfkit.from_file(html_file_path, pdf_file_path, configuration=config)

print(f"PDF文件已生成：{pdf_file_path}")
