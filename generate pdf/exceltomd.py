import pandas as pd

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
                markdown_content += f"Definition: {row[col]}\n\n"
            elif col == 2:
                markdown_content += f"Interpretation: {row[col]}\n\n"
            elif col == 3:
                markdown_content += f"[Source]({row[col]})\n\n"
            else:
                markdown_content += f"{row[col]}\n\n"
    markdown_content += "\n"

# 保存为Markdown文件
output_file_path = "output.md"
with open(output_file_path, "w", encoding="utf-8") as f:
    f.write(markdown_content)
