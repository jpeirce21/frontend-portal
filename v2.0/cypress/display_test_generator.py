import selenium
import os
import time
from selenium import webdriver
import sys
from PIL import Image

CONTENT_TAGS = ["p", "h1", "h2", "h3", "h4", "h5", "h6", "nav", "img", "a",
                "iframe", "ul", "ol", "li", "table", "button"]

STYLE_BLACKLIST = ["width", "height",
    "margin-top", "margin-left", "margin-bottom", "margin-right",
    "color", "background-color", "border-color", "margin-color",
    "background-repeat-x", "background-repeat-y" #these ones confuse me...
    ]

def main():
    if len(sys.argv) < 2:
        raise Exception("Usage: python display_test_generator.py <correct_site>")
    elif len(sys.argv) == 2:
        outfile = "display_match_" + sys.argv[1] + ".js"
    else:
        outfile = sys.argv[2]
    if outfile[-3:] != ".js":
        outfile += ".js"
    site = sys.argv[1]
    path_to_here = os.path.abspath(".")
    browser = webdriver.Chrome(os.path.join(path_to_here, "chromedriver"))
    setup_page(browser, site)
    style = get_content_and_style(browser)
    output_styles(style, outfile)

def setup_page(browser, site):
    browser.get(site)
    time.sleep(1)

def get_content_and_style(browser):
    styles = {t : [] for t in CONTENT_TAGS}
    for tag in CONTENT_TAGS:
        for e in browser.find_elements_by_tag_name(tag):
            styles[tag].append({s : e.value_of_css_property(s)
                for s in e.get_property('style')
                if s not in STYLE_BLACKLIST})
    print(styles)
    return styles

def output_styles(styles, outfile):
    try:
        f = open(outfile, "r")
        data = f.read()
        a = int(data[2:data.find("\n")]) + 1
        f.close()
    except FileNotFoundError:
        data = ""
        a = 1
    data    = data.replace(data[2:data.find("\n")], "//" + str(a))
    outstr  = "//Test automatically generated by display_test_generator.py\n"
    outstr += f'let URL{a} = "{sys.argv[1]}"; \n'
    outstr += f'describe("Ensures content matches page at {sys.argv[1]}", () => '
    outstr += '{ \n\tit("Ensures contents and styles match", () => {'
    outstr += "\n\t\tcy.visit(URL" + str(a) + ");"
    outstr += "\n\t\tcy.wait(5000)"
    for tag in CONTENT_TAGS:
        for i in range(len(styles[tag])):
            if i % 10 == 0:
                outstr += ';\n\t}),\n\tit("Testing ' + str(i + 1) + 'st ' + tag + ' tag", () => {'
            elif i % 10 == 1:
                outstr += ';\n\t}),\n\tit("Testing ' + str(i + 1) + 'nd ' + tag + ' tag", () => {'
            elif i % 10 == 2:
                outstr += ';\n\t}),\n\tit("Testing ' + str(i + 1) + 'rd ' + tag + ' tag", () => {'
            else:
                outstr += ';\n\t}),\n\tit("Testing ' + str(i + 1) + 'th ' + tag + ' tag", () => {'
            outstr += "\n\t\tCypress.config('defaultCommandTimeout', 1);"
            outstr += "\n\t\tcy.get('" + tag + "').eq(" + str(i) + ")"
            for s in styles[tag][i]:
                outstr += f"\n\t\t\t.should('have.css', '{s}', '{styles[tag][i][s]}')"
    outstr += ";\n\t})\n})"

    with open(outfile, "w") as f:
        f.write(data + outstr)


if __name__ == "__main__":
    main()
