import json

with open(r'D:\Mern Projects\New folder (3)\DSA-Platform\data\problems.js', 'r', encoding='utf-8') as f:
    content = f.read()

marker = 'const PROBLEMS_DATA = '
start = content.index(marker) + len(marker)
depth = 0
in_string = False
escape_next = False
i = start
end = start
while i < len(content):
    c = content[i]
    if escape_next:
        escape_next = False
    elif c == '\\' and in_string:
        escape_next = True
    elif c == '"':
        in_string = not in_string
    elif not in_string:
        if c == '[':
            depth += 1
        elif c == ']':
            depth -= 1
            if depth == 0:
                end = i + 1
                break
    i += 1

raw = content[start:end]
data = json.loads(raw)

# Write ES module
out_lines = ['// DSA Learning Platform - Problems Data (ES Module)']
out_lines.append('// Auto-generated from 435 HTML source files')
out_lines.append('')

# Split into chunks for topics for tree-shaking friendliness
# but keep as single export for simplicity
out_lines.append(f'export const PROBLEMS_DATA = {json.dumps(data, ensure_ascii=False, separators=(",", ":"))};')
out_lines.append('')

# Topic display map
topic_display = {
    "beginners": "Beginner Problems",
    "sorting": "Sorting",
    "arrays": "Arrays",
    "hashing": "Hashing",
    "binary-search": "Binary Search",
    "recursion": "Recursion",
    "linked-list": "Linked List",
    "bit-manipulation": "Bit Manipulation",
    "greedy": "Greedy Algorithms",
    "sliding-window": "Sliding Window & Two Pointers",
    "stack-queues": "Stack & Queues",
    "binary-trees": "Binary Trees",
    "bst": "Binary Search Trees",
    "heaps": "Heaps",
    "graphs": "Graphs",
    "dp": "Dynamic Programming",
    "tries": "Tries",
    "strings": "Strings (Advanced)",
    "maths": "Maths"
}

topic_icons = {
    "beginners": "🌱",
    "sorting": "🔀",
    "arrays": "📦",
    "hashing": "#️⃣",
    "binary-search": "🔍",
    "recursion": "🔄",
    "linked-list": "🔗",
    "bit-manipulation": "🔢",
    "greedy": "💰",
    "sliding-window": "🪟",
    "stack-queues": "📚",
    "binary-trees": "🌳",
    "bst": "🌲",
    "heaps": "🏔️",
    "graphs": "🕸️",
    "dp": "🧮",
    "tries": "🌐",
    "strings": "📝",
    "maths": "📐"
}

topic_order = list(topic_display.keys())

# Count per topic
topic_counts = {}
for p in data:
    t = p['topic']
    topic_counts[t] = topic_counts.get(t, 0) + 1

topics_data = []
for key in topic_order:
    topics_data.append({
        "key": key,
        "slug": key,
        "display": topic_display.get(key, key),
        "icon": topic_icons.get(key, "📂"),
        "count": topic_counts.get(key, 0)
    })

out_lines.append(f'export const TOPICS_DATA = {json.dumps(topics_data, ensure_ascii=False, separators=(",", ":"))};')
out_lines.append('')
out_lines.append(f'export const TOPIC_DISPLAY = {json.dumps(topic_display, ensure_ascii=False, separators=(",", ":"))};')
out_lines.append('')
out_lines.append(f'export const TOPIC_ORDER = {json.dumps(topic_order, ensure_ascii=False, separators=(",", ":"))};')
out_lines.append('')

# Stats
has_py = sum(1 for p in data if p['hasPython'])
has_java = sum(1 for p in data if p['hasJava'])
out_lines.append(f'export const DATA_META = {{ total: {len(data)}, withPython: {has_py}, withJava: {has_java}, topics: {len(topic_order)} }};')
out_lines.append('')

final_content = '\n'.join(out_lines)

with open(r'D:\Mern Projects\New folder (3)\dsa-react\src\data\problems.js', 'w', encoding='utf-8') as f:
    f.write(final_content)

print(f'Written {len(data)} problems to ES module')
print(f'File size: {len(final_content)/1024/1024:.2f} MB')
