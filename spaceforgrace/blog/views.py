from django.shortcuts import render

# Create your views here.
import requests
from django.shortcuts import render
import os

NOTION_API_KEY = os.getenv("NOTION_API_KEY")
NOTION_PAGE_ID = os.getenv("NOTION_PAGE_ID")

def get_notion_data():
    url = f"https://api.notion.com/v1/blocks/{NOTION_PAGE_ID}/children"
    headers = {
        "Authorization": f"Bearer {NOTION_API_KEY}",
        "Notion-Version": "2022-06-28",
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json().get('results', [])
    return []

def blog_list(request):
    notion_data = get_notion_data()
    posts = []
    for item in notion_data:
        if item["type"] == "child_page":
            title = item["child_page"]["title"]
            post_id = item["id"]
            posts.append({"title": title, "id": post_id})
    return render(request, 'blog/blog_list.html', {"posts": posts})

def blog_detail(request, post_id):
    url = f"https://api.notion.com/v1/blocks/{post_id}/children"
    headers = {
        "Authorization": f"Bearer {NOTION_API_KEY}",
        "Notion-Version": "2022-06-28",
    }
    response = requests.get(url, headers=headers)
    content = []
    if response.status_code == 200:
        data = response.json().get('results', [])
        for block in data:
            if block['type'] == 'paragraph':
                content.append(block['paragraph']['rich_text'][0]['text']['content'])
    return render(request, 'blog/blog_detail.html', {"content": content})
