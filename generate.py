import argparse
import os
from datetime import datetime
from slugify import slugify
import json

TYPE_CHOICES = ["jupyter", "markdown"]

parser = argparse.ArgumentParser()
parser.add_argument("type", choices=TYPE_CHOICES)
parser.add_argument("title", help="the title of your blog post", type=str)
parser.add_argument("desc", help="the description of your blog post", type=str)
parser.add_argument("--categories", "-c", nargs="+", help="a space delimited list of categories for this post")
parser.add_argument("--hide", default=False, type=bool, help="hide this page from search and display")
args = parser.parse_args()

# usage: python3 generate.py jupyter "COMP6771 Week 1 Notes" "Introduction to C++ and setting up details" -c comp6711 week01

folder = slugify(args.title)

categories = args.categories

if args.type == "markdown":
    root = "./_posts"
    extension = "md"
    categories.append("markdown")
elif args.type == "jupyter":
    root = "./_notebooks"
    extension = "ipynb"
    categories.append("jupyter")
else:
    raise f"makedirs: unidentified argument type: {args.type} is not one of {TYPE_CHOICES}"
    exit(1)

print(f"makedirs: creating {root}/{folder}")
os.makedirs(f"{root}/{folder}", exist_ok=True)
    
filename = f"{datetime.now().date()}-{folder}.{extension}"

contents = ["toc: true","layout: post",f"description: {args.desc}", f"categories: [{','.join(elem for elem in categories)}]", f"title: {args.title}"]

if args.hide:
    contents += ["hide: true", "search_exclude: false"]

with open(f"{root}/{folder}/{filename}", "x") as f:
    if args.type == "markdown":
        print(f"write: contents = {contents}")
        f.writelines(["---\n"] + [f"{c}\n" for c in contents] + ["---\n"])
    elif args.type == "jupyter":
        result = {"cells": [], "metadata": {}}
        # fill out metadata cell
        contents = [f"# {args.title} \n", f"> {args.desc} \n", "\n"] + [f"- {c} \n" for c in contents]
        result["cells"].append({"cell_type":"markdown", "metadata": {}, "source": contents})
        print(f"write: contents = {result}")
        json.dump(result, f)
    else:
        raise f"write: unidentified argument type: {args.type} is not one of {TYPE_CHOICES}"
        exit(1)