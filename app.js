function getText()
{
    const style = document.getElementById("iconStyle").value;
    const custom = document.getElementById("customText").value;
    if(style === "custom" && custom.trim() !== ""){
        return custom;
    }
    return style;
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
    ctx.font = "bold " + (size/2.5) + "px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text,size/2,size/2);
    return canvas;
}
function generatePreview()
{
    const preview = document.getElementById("previewCanvas");
    const ctx = preview.getContext("2d");
    const icon = drawIcon(192);
    ctx.clearRect(0,0,192,192);
    ctx.drawImage(icon,0,0);
        speak("Preview generated.");
}
function downloadIcons()
{
    const downloads = document.getElementById("downloads");
    downloads.innerHTML = "";
    [192,512].forEach(size => {
        const canvas = drawIcon(size);
        const link = document.createElement("a");
        link.download = "icon-" + size + ".png";
        link.href = canvas.toDataURL("image/png");
        link.innerText = "Download icon-" + size + ".png";
        downloads.appendChild(link);
        downloads.appendChild(document.createElement("br"));
    });
        speak("Download links created.");

}
