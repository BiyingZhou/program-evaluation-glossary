import pandas as pd
import markdown2
from weasyprint import HTML, CSS

# 读取Excel文件
file_path = 'glossary.xlsx'  # 请将路径替换为你的Excel文件路径
df = pd.read_excel(file_path, sheet_name='Sheet2', header=None)

# 转换为Markdown格式
markdown_content = ""

for index, row in df.iterrows():
    # 使用第一列作为一级标题
    markdown_content += f"# {row[0]}\n\n"
    for col in range(1, len(row)):
        # 处理空单元格的情况
        if pd.notna(row[col]):
            if col == 1:
                markdown_content += f"<div class='definition'>Definition: {row[col]}</div>\n\n"
            elif col == 2:
                markdown_content += f"<div class='interpretation'>Interpretation: {row[col]}</div>\n\n"
            elif col == 3:
                markdown_content += f"<a href='{row[col]}'>{row[col]}</a>\n\n"
            else:
                markdown_content += f"<div class='citation'>{row[col]}</div>\n\n"
    markdown_content += "\n"

# 保存为Markdown文件
output_file_path = "output.md"
with open(output_file_path, "w", encoding="utf-8") as f:
    f.write(markdown_content)

# 读取Markdown文件
with open(output_file_path, 'r', encoding='utf-8') as file:
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

# 将HTML文件转换为PDF
pdf_file_path = 'output.pdf'
HTML(string=html_template).write_pdf(pdf_file_path)

print(f"PDF文件已生成：{pdf_file_path}")
