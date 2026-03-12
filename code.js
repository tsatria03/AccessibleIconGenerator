function toggleCustomText()
{
    const style = document.getElementById("iconStyle").value;
    const section = document.getElementById("customTextSection");

    if(style === "custom")
        section.style.display = "block";
    else
        section.style.display = "none";
}

function getText()
{
    const style = document.getElementById("iconStyle").value;
    const custom = document.getElementById("customText").value;

    if(style === "custom" && custom.trim() !== "")
        return custom.substring(0,3);

    return style;
}

function getSelectedSizes()
{
    const boxes = document.querySelectorAll("#iconSizes input[type=checkbox]");
    const sizes = [];

    boxes.forEach(box=>{
        if(box.checked)
        {
            sizes.push(parseInt(box.value));
        }
    });

    return sizes;
}

function drawIcon(size)
{
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext("2d");

    const bg = document.getElementById("bgColor").value;
    const fg = document.getElementById("textColor").value;
    const text = getText();

    ctx.fillStyle = bg;
    ctx.fillRect(0,0,size,size);

    ctx.fillStyle = fg;
    ctx.font = "bold " + (size * 0.45) + "px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(text,size/2,size/2);

    return canvas;
}

function generatePreview()
{
    document.getElementById("previewSection").style.display = "block";

    const sizes = getSelectedSizes();

    if(sizes.length === 0)
    {
        speak("Please select at least one icon size.");
        return;
    }

    const preview = document.getElementById("previewCanvas");
    const ctx = preview.getContext("2d");

    const icon = drawIcon(sizes[0]);

    preview.width = sizes[0];
    preview.height = sizes[0];

    ctx.clearRect(0,0,preview.width,preview.height);
    ctx.drawImage(icon,0,0);

    speak("Preview generated.");
}

function createManifest(sizes)
{
    const icons = [];

    sizes.forEach(size=>{
        icons.push({
            src: "icon-" + size + ".png",
            sizes: size + "x" + size,
            type: "image/png"
        });
    });

    return {
        name: "Game",
        short_name: "Game",
        display: "standalone",
        start_url: ".",
        icons: icons
    };
}

async function downloadIcons()
{
    document.getElementById("downloadSection").style.display = "block";

    const downloads = document.getElementById("downloads");
    downloads.innerHTML = "Preparing icon pack...";

    const sizes = getSelectedSizes();

    if(sizes.length === 0)
    {
        speak("Please select at least one icon size.");
        return;
    }

    const zip = new JSZip();

    for(const size of sizes)
    {
        const canvas = drawIcon(size);

        const dataURL = canvas.toDataURL("image/png");

        const base64 = dataURL.split(",")[1];

        zip.file("icon-" + size + ".png", base64, {base64:true});
    }

    const manifest = createManifest(sizes);

    zip.file(
        "manifest.json",
        JSON.stringify(manifest,null,2)
    );

    const blob = await zip.generateAsync({type:"blob"});

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "pwa-icon-pack.zip";

    link.innerText = "Download icon pack (ZIP)";

    downloads.innerHTML = "";
    downloads.appendChild(link);

    speak("Icon pack ready for download.");
}
