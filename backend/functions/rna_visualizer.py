import argparse
import os
import xml.etree.ElementTree as ET
import cairosvg

def create_colored_svg(input_svg, output_svg):
    if not os.path.exists(input_svg):
        print(f"[ERROR] Input file {input_svg} does not exist!")
        return
    
    print(f"[DEBUG] Processing {input_svg} -> {output_svg}")

    tree = ET.parse(input_svg)
    root = tree.getroot()

    for elem in root.iter():
        if "stroke" in elem.attrib:
            elem.attrib["stroke"] = "blue"

        if "fill" in elem.attrib:
            elem.attrib["fill"] = "red"

    text_elem = ET.Element("text", {
        "x": "20",
        "y": "20",
        "font-size": "16",
        "fill": "black"
    })
    text_elem.text = "Enhanced RNA Structure"
    root.append(text_elem)

    tree.write(output_svg)
    print(f"[SUCCESS] Saved enhanced visualization as {output_svg}")

    output_png = output_svg.replace(".svg", ".png")
    cairosvg.svg2png(url=output_svg, write_to=output_png)
    print(f"[SUCCESS] Converted SVG to PNG: {output_png}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Enhance RNA Structure Visualization")
    parser.add_argument("--input", required=True, help="Path to the input SVG file")
    parser.add_argument("--output", required=True, help="Path to save the enhanced SVG")
    args = parser.parse_args()

    create_colored_svg(args.input, args.output)
