
const CanvasMarker = ({ name, slug, location_type,isActive }) => {


    return renderMarker({ name, location_type,isActive });
};

const renderMarker = ({ name, location_type, isActive }) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const lines = name?.split(/[\/]/g) || ["place"] // Split name into lines
    // Common settings
    let fontSize = 16 ;
    let iconPadding = 0;
    let iconWidth = 0;
    let radius = 0;
    let strokeColor = "#FFFFFF";
    let textColor = "#000000";
    let lineWidth = 3;
    let centerX = 0, centerY = 0; // Initialized to 0 for the 'region' case

    const rightAligned = location_type === "city_right";

    switch (location_type) {
        case "region":
            fontSize = 30;
            lineWidth = 7;
            break;
        case "land":
            break;
        case "geo":
            textColor = "#a9cba3";
            strokeColor = "#313e2f";
            fontSize = 15;
            break;       
        case "aqua":
            textColor = "#a3c1cb";
            strokeColor = "#2f323e";
            fontSize = 12;
            break;
        case "city_right":
            iconWidth = fontSize;
            radius = iconWidth / 3;
            iconPadding = 2;
            break;
        case "town":
            fontSize = 10;
            iconWidth = fontSize;
            radius = iconWidth / 3;
            iconPadding = 2;
            break;
        default: // For city and other types
            iconWidth = fontSize; 
            radius = iconWidth / 3;
            iconPadding = 2;
            break;
    }

    const fontString = `${fontSize}px 'Roboto Condensed'`;
    context.font = fontString;
    
    const metrics = lines.map(line => context.measureText(line));
    const ex = context.measureText("x").width;
    const textWidth = Math.max(...metrics.map(m => m.width)) + ex;
    canvas.width = textWidth + iconWidth + iconPadding;
    const fontHeight = (metrics[0].actualBoundingBoxAscent + metrics[0].actualBoundingBoxDescent) + (lineWidth * 2);
    iconWidth = iconWidth ? fontHeight : 0;
    centerX =  (rightAligned ? (textWidth - (ex/2)) : 0) + (iconWidth / 2) 
    centerY = (iconWidth / 2) 

    canvas.height =  fontHeight * lines.length;


    //Fill background for click detection
    context.fillStyle = "#FFFFFF01";
    context.fillRect(0, 0, canvas.width, canvas.height);




    if (centerX) { // Draw the icon if needed
        context.beginPath();
        context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        context.fillStyle = !isActive ? "#6b7d91" : "#FFFFFF";
        context.strokeStyle = "#FFFFFF88";
        context.lineWidth = 5;
        context.stroke();
        context.fill();
    }

    context.font = fontString;
    context.lineWidth = lineWidth;
    context.strokeStyle = strokeColor;
    const longestLineByPixels = Math.max(...lines.map(line => context.measureText(line).width));
    const textStartX = iconWidth && !rightAligned ? iconWidth + iconPadding : lineWidth;
    lines.forEach((line, i) => {
        const gap = longestLineByPixels - context.measureText(line).width;
        const offset = gap / 2;
        const textStartY = (i + 1) * fontSize;
        context.strokeText(line, textStartX + offset, textStartY);
        context.fillStyle = textColor;
        context.fillText(line, textStartX+ offset, textStartY);
    });
    
    // Adjust anchorX and anchorY based on whether or not there's an icon
    const iconXOffsetPerc = centerX / canvas.width;
    const anchorX = !iconWidth ? 0.5 : iconXOffsetPerc;
    const anchorY = 0.5; // centerY is always middle of the canvas height, simplifying the calculation

    return [
        canvas.height,
        canvas.width,
        [anchorX, anchorY],
        canvas.toDataURL()
    ];
};

module.exports = { CanvasMarker };